import connectDB from "../../../lib/mongodb.js";
import Student from "../../../../models/Student.js";
import Professor from "../../../../models/Professor.js";
import Admin from "../../../../models/Admin.js";
import { getToken } from "next-auth/jwt";

// fetch
export async function GET() {
    try {
        await connectDB();
        const students = await Student.find();
        const professors = await Professor.find();
        const admins = await Admin.find();
        const users = [...students, ...professors, ...admins];

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
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const { img } = await req.json();
        if (!token) return Response.json(
            { success: false, message: "you need ti signIn" },
            { status: 404 }
        );
        if (!img) {
            return Response.json(
                { success: false, message: "not found" },
                { status: 401 }
            );
        }

        let currentUser = await Student.findOne({ code: token?.code });
        if (!currentUser) {
            currentUser = await Professor.findOne({ code: token?.code });
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
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { success: false, message: "لم يتم إرسال id" },
                { status: 400 }
            );
        }

        let currentUser = await Student.findOne({ code: token?.code });
        if (!currentUser) {
            currentUser = await Professor.findOne({ code: token?.code });
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