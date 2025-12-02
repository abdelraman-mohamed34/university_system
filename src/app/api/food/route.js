import connectDB from "@/lib/mongodb.js";
import Food from "../../../../models/Food.js";

export async function GET() {
    await connectDB();
    try {
        const foods = await Food.find();
        return new Response(JSON.stringify(foods), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(req) {
    await connectDB();
    try {
        const { id, stock, sales } = await req.json();

        const updatedFood = await Food.findOneAndUpdate(
            { id },
            { stock, sales },
            { new: true }
        );

        if (!updatedFood) {
            return new Response(JSON.stringify({ error: "Food not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(updatedFood), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
