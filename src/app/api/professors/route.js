import connectDB from "@/lib/mongodb";
import Teacher from "../../../../models/Professor";

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