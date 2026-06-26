import express from 'express';
import { OpenAI } from 'openai';
import Student from '../models/Student.js';

const router = express.Router();

// System prompt detailing schema and demanding structured JSON response
const SYSTEM_PROMPT = `You are the AI Database Interface (NLIDB) for a "Smart Admin Dashboard" student database.
Your job is to translate user natural language queries or instructions into structured database commands.

The database collection name is "students" (mapped to Student model).
The schema fields are:
- rollNo (String, Unique, Required) - e.g., "101", "102"
- name (String, Required) - e.g., "Alice Smith"
- studentClass (String, Required) - e.g., "Class 10", "Grade 9"
- section (String, Required) - e.g., "A", "B"
- attendanceStatus (String, Enum: ['Present', 'Absent'], Default: 'Absent')
- balance (Number, Default: 0) - e.g., 150, 200

You MUST return a JSON object ONLY. No markdown wrapping (like \`\`\`json), no introductory text, no explanations outside of the JSON object.
Use the following strict JSON schema:
{
  "action": "CREATE" | "UPDATE" | "DELETE" | "QUERY",
  "target": "students",
  "filter": {
    // MongoDB filter query to match students (used for UPDATE, DELETE, QUERY). 
    // E.g., { "rollNo": "101" } or { "studentClass": "Grade 9", "section": "B" }
  },
  "updateData": {
    // Data fields to populate for CREATE, or field updates for UPDATE.
    // For CREATE, must include rollNo, name, studentClass, section, and optionally attendanceStatus and balance.
    // For UPDATE, include the fields that are changing. E.g. { "attendanceStatus": "Present" }.
    // IMPORTANT: For numerical operations on "balance" like adding, subtracting, or multiplying:
    // You MUST use MongoDB update operators such as "$inc". E.g., { "$inc": { "balance": 50 } } or { "$inc": { "balance": -25 } }.
  },
  "explanation": "A short, user-friendly description of what you decided to do. Example: 'Added $50 to all student balances.' or 'Marked Roll 102 as Absent.'"
}

Guidelines:
1. "Add a student named Bob, Roll 102, Class 10, Section B, Balance 50" ->
   { "action": "CREATE", "target": "students", "updateData": { "rollNo": "102", "name": "Bob", "studentClass": "Class 10", "section": "B", "attendanceStatus": "Absent", "balance": 50 }, "explanation": "Added student Bob with roll number 102." }

2. "Mark roll 102 as present" ->
   { "action": "UPDATE", "target": "students", "filter": { "rollNo": "102" }, "updateData": { "attendanceStatus": "Present" }, "explanation": "Marked roll number 102 as Present." }

3. "Mark all students in Class 10 Section A as absent" ->
   { "action": "UPDATE", "target": "students", "filter": { "studentClass": "Class 10", "section": "A" }, "updateData": { "attendanceStatus": "Absent" }, "explanation": "Marked Class 10 Section A students as Absent." }

4. "Remove student with roll number 105" ->
   { "action": "DELETE", "target": "students", "filter": { "rollNo": "105" }, "explanation": "Deleted student with roll number 105." }

5. "Who is present in Class 10?" ->
   { "action": "QUERY", "target": "students", "filter": { "studentClass": "Class 10", "attendanceStatus": "Present" }, "explanation": "Queried present students in Class 10." }

6. "Add $50 to everyone's balance" ->
   { "action": "UPDATE", "target": "students", "filter": {}, "updateData": { "$inc": { "balance": 50 } }, "explanation": "Added $50 to all student balances." }

7. "Deduct $25 from Alice Smith's balance" ->
   { "action": "UPDATE", "target": "students", "filter": { "name": "Alice Smith" }, "updateData": { "$inc": { "balance": -25 } }, "explanation": "Deducted $25 from Alice Smith's balance." }

Be precise. If information is missing for a CREATE action, default them to "N/A" or try to infer from context. Roll numbers must always be treated as strings.`;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    return res.status(500).json({
      message: 'Groq API Key is not configured on the backend. Please add GROQ_API_KEY to your backend/.env file.',
      isConfigError: true
    });
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const aiResponseText = completion.choices[0].message.content;
    const command = JSON.parse(aiResponseText);
    
    let dbMessage = '';
    let queryResults = null;
    let mongooseQuery = '';
    let affectedCount = 0;

    // Execute Mongoose operations based on the parsed JSON command
    switch (command.action) {
      case 'CREATE': {
        const { rollNo, name, studentClass, section, attendanceStatus, balance } = command.updateData || {};
        if (!rollNo || !name) {
          throw new Error('Roll No and Name are required to add a student.');
        }

        // Check if student exists
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
          dbMessage = `Student with Roll No ${rollNo} already exists. No changes made.`;
          mongooseQuery = `await Student.findOne({ rollNo: "${rollNo}" }); // Duplicate check found record`;
          affectedCount = 0;
        } else {
          const studentDoc = {
            rollNo,
            name,
            studentClass: studentClass || 'N/A',
            section: section || 'N/A',
            attendanceStatus: attendanceStatus || 'Absent',
            balance: balance !== undefined ? Number(balance) : 0
          };
          const newStudent = new Student(studentDoc);
          await newStudent.save();
          dbMessage = `Successfully created student: ${name} (Roll No: ${rollNo})`;
          mongooseQuery = `await Student.create(${JSON.stringify(studentDoc, null, 2)});`;
          affectedCount = 1;
        }
        break;
      }

      case 'UPDATE': {
        const filter = command.filter || {};
        const updateData = command.updateData || {};

        // Run update on MongoDB
        let updateQuery = {};
        const containsOperators = Object.keys(updateData).some(key => key.startsWith('$'));
        if (containsOperators) {
          updateQuery = updateData;
        } else {
          updateQuery = { $set: updateData };
        }

        const updateResult = await Student.updateMany(filter, updateQuery);
        dbMessage = `Updated ${updateResult.modifiedCount} student record(s).`;
        mongooseQuery = `await Student.updateMany(\n  ${JSON.stringify(filter)},\n  ${JSON.stringify(updateQuery, null, 2)}\n);`;
        affectedCount = updateResult.modifiedCount;
        break;
      }

      case 'DELETE': {
        const filter = command.filter || {};
        const deleteResult = await Student.deleteMany(filter);
        dbMessage = `Deleted ${deleteResult.deletedCount} student record(s).`;
        mongooseQuery = `await Student.deleteMany(${JSON.stringify(filter)});`;
        affectedCount = deleteResult.deletedCount;
        break;
      }

      case 'QUERY': {
        const filter = command.filter || {};
        queryResults = await Student.find(filter).sort({ rollNo: 1 });
        dbMessage = `Query returned ${queryResults.length} student record(s).`;
        mongooseQuery = `await Student.find(${JSON.stringify(filter)}).sort({ rollNo: 1 });`;
        affectedCount = queryResults.length;
        break;
      }

      default:
        throw new Error(`Unsupported database action: ${command.action}`);
    }

    // Fetch the latest list of all students to return to the frontend to keep states synced
    const allStudents = await Student.find({}).sort({ rollNo: 1 });

    res.json({
      success: true,
      command,
      dbMessage,
      explanation: command.explanation || dbMessage,
      mongooseQuery,
      affectedCount,
      students: allStudents,
      queryResults
    });

  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process natural language request.',
      error: error.message
    });
  }
});

export default router;
