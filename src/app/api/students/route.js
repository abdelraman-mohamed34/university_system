import connectDB from "@/lib/mongodb";
import Student from "../../../../models/Student";

export async function GET() {
    await connectDB();
    try {
        const students = await Student.find();
        return new Response(JSON.stringify(students), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Failed to fetch students" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}