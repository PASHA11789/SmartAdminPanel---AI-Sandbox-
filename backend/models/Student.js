import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  studentClass: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  },
  attendanceStatus: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent'
  },
  balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema, 'users');

export default Student;
