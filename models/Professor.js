import mongoose from 'mongoose';

const teachingSchema = new mongoose.Schema({
  courseId: { type: String },
  courseName: { type: String },
});

const TeacherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  account: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  degree: { type: String },
  status: { type: String },
  birthDate: { type: Date },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  office: { type: String },
  experienceYears: { type: Number, default: 0 },
  role: { type: String, default: 'teacher' },
  gender: { type: String },
  teaching: [teachingSchema]
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);