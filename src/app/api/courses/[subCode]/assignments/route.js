import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import { getServerSession } from "next-auth";
import College from "../../../../../../models/Colleges.js";
import { globals } from "../../../../../../data/global.js";

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    const { title, img, question } = await req.json();
    const { subCode } = await params;

    console.log("Logged in :", session?.user?.code);
    const colleges = await College.find()

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);

                    if (course) {
                        if (course?.professor !== session?.user?.code) {
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
                        console.log('uploaded')
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

export async function DELETE(req, { params }) {
    const resolvedParams = await params; // فك الـ Promise
    const subCode = resolvedParams.subCode;

    let assignmentId = null;
    try {
        const body = await req.json();
        assignmentId = body.assignmentId;
    } catch (error) {
        console.error("خطأ في قراءة JSON:", error);
    }

    console.log("subCode:", subCode, "assignmentId:", assignmentId);

    const colleges = await College.find();

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);
                    if (!course || !course.assignments) continue;

                    course.assignments = course.assignments.filter(
                        a => a.id !== Number(assignmentId)
                    );
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

export async function PUT(req, { params }) {

    const { subCode } = await params;
    const { assignmentId, updates } = await req.json();

    const colleges = await College.find();
    let updated = false;

    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode);
                    if (!course || !course.assignments) continue;

                    const assignment = course.assignments.find(a => a.id === Number(assignmentId));
                    if (!assignment) continue;

                    Object.keys(updates).forEach(key => {
                        assignment[key] = updates[key] ?? assignment[key];
                    });

                    console.log(assignment)

                    updated = true;
                    college.markModified('years');
                    await college.save();
                    break;
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