import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    account: { type: String, required: true, unique: true },
    status: { type: String, default: 'أدمن' },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    photo: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
    gender: { type: String },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);