import connectDB from "@/lib/mongodb";
import Admin from "../../../../models/Admin";

export async function GET() {
    await connectDB();

    const admins = await Admin.find({});
    return new Response(JSON.stringify(admins), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

