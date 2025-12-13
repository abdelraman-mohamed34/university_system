import connectDB from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import Student from "../../../../models/Student";

export async function POST(req) {
    try {
        await connectDB();
        const examId = req.nextUrl.searchParams.get('q');
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        if (token.role !== 'student') return new Response(JSON.stringify({ error: 'غير مسموح لك بالدخول لهذه الصفحة' }), { status: 403 });

        const submittedData = await req.json();

        if (!submittedData.answers || !Array.isArray(submittedData.answers)) {
            return new Response(JSON.stringify({ error: 'الإجابات غير صالحة' }), { status: 400 });
        }

        const user = await Student.findOne({ _id: token._id });
        if (!user) return new Response(JSON.stringify({ error: 'الطالب غير موجود' }), { status: 404 });
        if (!user.solutions) {
            user.solutions = [];
        }

        if (!user.solutions) {
            user.solutions = [];
        }

        user.solutions.push({
            type: 'exam',
            examId: examId,
            submittedData,
            solvedAt: new Date(),
        });

        await user.save();
        return new Response(JSON.stringify({ message: 'تم إرسال الامتحان بنجاح' }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'فشل الاتصال بقاعدة البيانات', details: error.message }), { status: 500 });
    }
}