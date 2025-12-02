import { getServerSession } from "next-auth";
import Student from "../../../../models/Student";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { title, id, solvedAt, subCode } = await req.json();

    if (!session) {
        return new Response(JSON.stringify({ success: false, message: 'You need to sign in' }), { status: 403 });
    }

    const currentStudent = await Student.findOne({ code: session.user.code });
    if (!currentStudent) {
        return new Response(JSON.stringify({ success: false, message: 'Student not found' }), { status: 404 });
    }

    if (!id || !title) {
        return new Response(JSON.stringify({ success: false, message: 'Missing id or title' }), { status: 400 });
    }

    currentStudent.solutions.push({ id: Number(id), title, solvedAt, subCode });
    await currentStudent.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
