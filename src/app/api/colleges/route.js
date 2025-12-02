import connectDB from "@/lib/mongodb.js";
import College from '../../../../models/Colleges.js';

export async function GET() {
    await connectDB();

    try {
        const colleges = await College.find();

        return new Response(JSON.stringify(colleges), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch colleges" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}