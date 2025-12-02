import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    description: { type: String }
});

const FoodSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    purchaseRate: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    supplier: { type: String },
    imageUrl: { type: String },
    dietaryInfo: [{ type: String }],
    expiryDate: { type: Date },
    unit: { type: String, default: "قطعة" },
    notes: { type: String },
    available: { type: Boolean, default: true },
    solutions: [solutionSchema],
}, { timestamps: true });

export default mongoose.models.Food || mongoose.model('Food', FoodSchema);
