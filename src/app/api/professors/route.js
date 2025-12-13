import connectDB from "@/lib/mongodb";
import Teacher from "../../../../models/Professor";
import Student from "../../../../models/Student";
import Admin from "../../../../models/Admin";
import College from "../../../../models/Colleges";

import { getToken } from "next-auth/jwt";

function generateRandomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let code = '';

    for (let i = 0; i < 3; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
        code += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return code;
}

async function checkCodeExists(code) {
    const existingTeacher = await Teacher.findOne({ code: code });
    if (existingTeacher) return true;
    const existingAdmin = await Admin.findOne({ code: code });
    if (existingAdmin) return true;
    const existingStudent = await Student.findOne({ code: code });
    if (existingStudent) return true;
    return false;
}

async function generateUniqueCode() {
    let code;
    let exists = true;

    while (exists) {
        code = generateRandomCode();
        exists = await checkCodeExists(code);
    }

    return code;
}


export async function GET() {
    await connectDB();

    const teachers = await Teacher.find({});
    return new Response(JSON.stringify(teachers), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(req) {
    await connectDB();
    try {
        const uploaded = await req.json();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) return new Response(JSON.stringify({ message: 'لم يتم العثور على مستخدم' }), { status: 401 });
        if (token.role !== 'admin') return new Response(JSON.stringify({ message: 'غير مسموح لك بالوصول إلى هذه الصفحة' }), { status: 403 });

        if (!uploaded.fullName || !uploaded.email || !uploaded.role || !uploaded.degree)
            return new Response(JSON.stringify({ message: 'الاسم والبريد الإلكتروني والدرجة العلمية والدور (Role) مطلوبون' }), { status: 400 });

        if (!uploaded.code || uploaded.code.trim() === '') {
            uploaded.code = await generateUniqueCode();
        }

        const teacher = new Teacher(uploaded);
        await teacher.save();

        const colleges = await College.find();
        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        for (const course of term.courses) {
                            const matchingCourse = uploaded.teaching[0].courses.find(
                                c => c.courseName === course.subject
                            );
                            if (matchingCourse) {
                                if (!Array.isArray(course.professor)) course.professor = [];
                                if (!course.professor.includes(teacher.code)) {
                                    course.professor.push(teacher.code);
                                }
                            }
                        }
                    }
                }
            }
            await college.save();
        }
        console.log(colleges)
        return new Response(JSON.stringify({ message: 'تم إنشاء المعلم بنجاح', teacher }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'حدث خطأ في الخادم', error: err.message }), { status: 500 });
    }
}