import College from "../../../../../../models/Colleges.js";
import { getToken } from "next-auth/jwt";

// post assignment
export async function POST(req, { params }) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { title, img, question } = await req.json();
    const { subCode } = await params;

    const colleges = await College.find()
    if (!token)
        return new Response(
            JSON.stringify({ success: false, message: "no user found" }),
            { status: 401 }
        );

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);

                    if (course) {
                        if (!course?.professor.includes(token?.code)) {
                            return new Response(
                                JSON.stringify({ error: "غير مسموح — هذا ليس دكتور المادة" }),
                                { status: 403 }
                            );
                        }
                        const newAssignment = {
                            id: Date.now(),
                            title,
                            question,
                            img,
                        };
                        course?.assignments?.push(newAssignment);
                        await college.save();
                        console.log('uploaded');
                        const onesignalRes = await fetch('https://onesignal.com/api/v1/notifications', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Basic ${process.env.process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}`,
                            },
                            body: JSON.stringify({
                                app_id: process.env.process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                                included_segments: ['All'],
                                headings: { en: 'واجب جديد 📚' },
                                contents: { en: title },
                            }),
                        });

                        const data = await onesignalRes.json();
                        console.log("OneSignal Response:", data);

                        return new Response(
                            JSON.stringify({ message: "تم إضافة الواجب", assignment: newAssignment }),
                            { status: 201 }
                        );
                    }
                }
            }
        }
    }

    return new Response(JSON.stringify({ error: "المادة غير موجودة" }), { status: 404 });
}

export async function PUT(req, { params }) {
    const { subCode } = await params;
    const { assignmentId, updates } = await req.json();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const colleges = await College.find();
    let updated = false;


    if (!token || token.role !== 'teacher') {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);
                    if (!course || !course.assignments) continue;
                    if (course.professor.includes(token?.code)) {
                        const assignment = course.assignments.find(a => a.id === Number(assignmentId));
                        if (!assignment) continue;

                        Object.keys(updates).forEach(key => {
                            assignment[key] = updates[key] ?? assignment[key];
                        });

                        updated = true;
                        college.markModified('years');
                        await college.save();
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
        return new Response(JSON.stringify({ error: "الواجب غير موجود" }), { status: 404 });
    }

    return new Response(
        JSON.stringify({ message: "Assignment updated", subCode, assignmentId, updates }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}

// delete assignment
export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const subCode = resolvedParams.subCode;

    let assignmentId = null;
    try {
        const body = await req.json();
        assignmentId = body.assignmentId;
    } catch (error) {
        console.error("خطأ في قراءة JSON:", error);
    }
    const colleges = await College.find();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 404 })
    if (token?.role !== 'teacher') {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);
                    if (!course || !course.assignments) continue;
                    if (course.professor.includes(token?.code)) {
                        course.assignments = course.assignments.filter(
                            a => a.id !== Number(assignmentId)
                        );
                    }
                }
            }
        }
        await college.save();
    }
    return new Response(
        JSON.stringify({ message: "Assignment deleted", subCode, assignmentId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}