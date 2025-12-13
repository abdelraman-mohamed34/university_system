import connectDB from "@/lib/mongodb";
import Colleges from "../../../../models/Colleges";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
    let uploaded;
    try {
        const body = await req.json();
        uploaded = body.uploaded || body;
    } catch {
        return NextResponse.json({ message: 'تنسيق الطلب غير صحيح (يجب أن يكون JSON).' }, { status: 400 });
    }

    const subCode = req.nextUrl.searchParams.get('sc');
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token.role !== 'teacher' && token.role !== 'admin')) {
        return NextResponse.json({ message: 'غير مصرح: يجب أن تكون معلمًا أو مسؤولًا.' }, { status: 401 });
    }

    if (!subCode) {
        return NextResponse.json({ message: 'رمز المادة مطلوب.' }, { status: 400 });
    }

    if (!uploaded || !uploaded.title || !uploaded.content) {
        return NextResponse.json({ message: 'العنوان والمحتوى مطلوبان لإضافة المحتوى.' }, { status: 400 });
    }

    try {
        await connectDB();

        const newDataItem = {
            id: Date.now().toString(),
            title: uploaded.title,
            content: uploaded.content,
            images: uploaded.images || [],
            createdAt: new Date(),
        };

        const colleges = await Colleges.find();
        let updated = false;

        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c.subCode === subCode);

                        if (course && course.professor?.includes(token?.code)) {
                            course.data ||= [];
                            course.data.push(newDataItem);
                            college.markModified('years');
                            await college.save();

                            updated = true;
                            break;
                        }
                    }
                    if (updated) break;
                }
                if (updated) break;
            }
            if (updated) break;
        }

        if (!updated) {
            return NextResponse.json({ message: 'المادة غير موجودة أو غير مصرح لك بتعديلها.' }, { status: 403 });
        }

        return NextResponse.json({
            message: 'تم إضافة المحتوى بنجاح',
            data: newDataItem
        }, { status: 200 });

    } catch (err) {
        console.error("API Error:", err);
        return NextResponse.json({
            message: 'خطأ في السيرفر',
            error: err.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ message: 'تنسيق الطلب غير صحيح (يجب أن يكون JSON).' }, { status: 400 });
    }

    const subCode = req.nextUrl.searchParams.get('sc');
    const dataCode = body?.id;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token.role !== 'teacher' && token.role !== 'admin')) {
        return NextResponse.json({ message: 'غير مصرح: يجب أن تكون معلمًا أو مسؤولًا.' }, { status: 401 });
    }

    if (!subCode || !dataCode) {
        return NextResponse.json({ message: 'رمز المادة وبيانات المحتوى المطلوبة.' }, { status: 400 });
    }

    try {
        await connectDB();
        const colleges = await Colleges.find();
        let deletedData = null;
        let updated = false;

        for (const college of colleges) {
            for (const year of college.years ?? []) {
                for (const dept of year.departments ?? []) {
                    for (const term of dept.terms ?? []) {
                        const course = term.courses?.find(c => c.subCode === subCode);
                        if (!course || !course.professor?.includes(token.code)) continue;

                        const index = course.data?.findIndex(d => d.id === dataCode);
                        if (index !== undefined && index >= 0) {
                            deletedData = course.data.splice(index, 1)[0];
                            college.markModified('years');
                            await college.save();
                            updated = true;
                            break;
                        }
                    }
                    if (updated) break;
                }
                if (updated) break;
            }
            if (updated) break;
        }

        if (!updated) {
            return NextResponse.json({ message: 'المادة غير موجودة أو غير مصرح لك بتعديلها.' }, { status: 403 });
        }

        return NextResponse.json({
            message: 'تم حذف المحتوى بنجاح',
            data: deletedData
        }, { status: 200 });

    } catch (err) {
        console.error("API Error:", err);
        return NextResponse.json({
            message: 'خطأ في السيرفر',
            error: err.message
        }, { status: 500 });
    }
}