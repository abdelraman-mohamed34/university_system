import { z } from "zod";

export const teacherZodSchema = z.object({
    code: z.string(),
    account: z.string(),
    fullName: z.string(),
    role: z.string(),
    degree: z.string().optional(),
    status: z.string().optional(),
    birthDate: z.string().optional(),
    email: z.string().email(),
    passwordHash: z.string(),
    phone: z.string().optional(),
    photo: z.string().optional(),
    office: z.string().optional(),
    experienceYears: z.number().optional(),
    gender: z.string().optional(),
    teaching: z.array(
        z.object({
            courseId: z.string(),
            courseName: z.string(),
        })
    ).optional()
});
