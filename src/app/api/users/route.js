import connectDB from "../../../lib/mongodb.js";
import Student from "../../../../models/Student.js";
import Professor from "../../../../models/Professor.js";

// fetch
export async function GET() {
    try {
        await connectDB();

        const students = await Student.find();
        const professors = await Professor.find();
        const users = [...students, ...professors];

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {

        return new Response(JSON.stringify({ success: false, message: "Failed to fetch students" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

// upload image
export async function POST(req) {
    try {
        await connectDB();
        const { id, img } = await req.json();

        if (!id || !img) {
            return Response.json(
                { success: false, message: "not found" },
                { status: 401 }
            );
        }

        let currentUser = await Student.findOne({ code: id });
        if (!currentUser) {
            currentUser = await Professor.findOne({ code: id });
        }
        if (!currentUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        currentUser.photo = img;
        await currentUser.save();

        return Response.json(
            { success: true, message: "fetched" },
            { status: 200 }
        );

    } catch (error) {
        return Response.json(
            { success: false, message: `Error: ${error.message}` },
            { status: 500 }
        );
    }
}

// delete image
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return Response.json(
                { success: false, message: "لم يتم إرسال id" },
                { status: 400 }
            );
        }

        let currentUser = await Student.findOne({ code: id });
        if (!currentUser) {
            currentUser = await Professor.findOne({ code: id });
        }

        if (!currentUser) {
            return Response.json(
                { success: false, message: "المستخدم غير موجود" },
                { status: 404 }
            );
        }

        currentUser.photo = "";
        await currentUser.save();


        return Response.json(
            { success: true, message: "تم حذف الصورة" },
            { status: 200 }
        );

    } catch (error) {
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}