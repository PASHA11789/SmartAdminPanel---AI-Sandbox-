import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ rollNo: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { rollNo, name, studentClass, section, attendanceStatus, balance } = req.body;

const exists = await Student.findOne({ rollNo });
    if (exists) {
      return res.status(400).json({ message: `Student with Roll No ${rollNo} already exists.` });
    }

    const student = new Student({
      rollNo,
      name,
      studentClass,
      section,
      attendanceStatus: attendanceStatus || 'Absent',
      balance: balance !== undefined ? Number(balance) : 0
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { rollNo, name, studentClass, section, attendanceStatus, balance } = req.body;

if (rollNo) {
      const exists = await Student.findOne({ rollNo, _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(400).json({ message: `Student with Roll No ${rollNo} already exists.` });
      }
    }

    const updateFields = { rollNo, name, studentClass, section, attendanceStatus };
    if (balance !== undefined) {
      updateFields.balance = Number(balance);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const sampleStudents = [
      {
        rollNo: '101',
        name: 'Alice Smith',
        studentClass: 'Class 10',
        section: 'A',
        attendanceStatus: 'Present',
        balance: 150
      },
      {
        rollNo: '102',
        name: 'Bob Johnson',
        studentClass: 'Class 10',
        section: 'A',
        attendanceStatus: 'Absent',
        balance: 80
      },
      {
        rollNo: '103',
        name: 'Charlie Brown',
        studentClass: 'Grade 9',
        section: 'B',
        attendanceStatus: 'Present',
        balance: 200
      },
      {
        rollNo: '104',
        name: 'Diana Prince',
        studentClass: 'Grade 9',
        section: 'B',
        attendanceStatus: 'Absent',
        balance: 50
      },
      {
        rollNo: '105',
        name: 'Evan Wright',
        studentClass: 'Class 10',
        section: 'B',
        attendanceStatus: 'Present',
        balance: 120
      },
      {
        rollNo: '106',
        name: 'Fiona Gallagher',
        studentClass: 'Grade 9',
        section: 'A',
        attendanceStatus: 'Absent',
        balance: 300
      }
    ];

    await Student.deleteMany({});
    await Student.insertMany(sampleStudents);

const allStudents = await Student.find({}).sort({ rollNo: 1 });
    res.json({
      message: 'Sandbox data reset successfully.',
      students: allStudents
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset database: ' + error.message });
  }
});

export default router;
