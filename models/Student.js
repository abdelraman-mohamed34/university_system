import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
});

const StudentSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    seatNumber: { type: String },
    fullName: { type: String, required: true },
    fatherName: { type: String },
    address: { type: String },
    city: { type: String },
    fatherPhone: { type: String },
    postalCode: { type: String },
    gender: { type: String },
    department: { type: String },
    faculty: { type: String },
    yearsPassed: { type: Number },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    birthDate: { type: Date },
    nationality: { type: String },
    maritalStatus: { type: String },
    gpa: { type: Number },
    student: { type: String },
    role: { type: String, default: 'student' },
    photo: { type: String },
    currentYear: { type: String },
    status: { type: String },
    notes: { type: String },
    loginDate: { type: Date },
    degreeOfLastYear: { type: Number },
    solutions: [solutionSchema]
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
