import mongoose from 'mongoose';

const CollegesSchema = new mongoose.Schema({

    college: { type: String },

    years: [
        {
            cate: { type: String },

            departments: [
                {
                    name: { type: String },

                    terms: [
                        {
                            term: { type: Number },

                            courses: [
                                {
                                    subCode: { type: String },
                                    subject: { type: String },
                                    professor: { type: String },
                                    assignments: { type: Array, default: [] },
                                    tests: { type: Array, default: [] }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

}, { timestamps: true });

export default mongoose.models.college || mongoose.model('college', CollegesSchema);
