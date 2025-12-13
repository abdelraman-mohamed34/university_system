import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseId: { type: String },
  courseName: { type: String },
  professor: [{ type: String }],
})

const teachingSchema = new mongoose.Schema({
  universityName: { type: String },
  collageName: { type: String },
  departMent: { type: String },
  term: { type: String },
  courses: [courseSchema],
});

const TeacherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: { type: String, required: true, default: 'teacher' },
  fullName: { type: String, required: true },
  degree: { type: String, required: true },
  status: { type: String, required: true },
  birthDate: { type: String },
  birthPlace: { type: String },
  email: { type: String, unique: true },
  address: { type: String },
  passwordHash: { type: String },
  phone: { type: String },
  photo: { type: String },
  photoFileName: { type: String },
  gender: { type: String },
  office: { type: String },
  experienceYears: { type: Number, default: 0 },
  teaching: [teachingSchema]
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);