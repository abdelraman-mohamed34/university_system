import connectDB from '../../../lib/mongodb';
import College from '../../../../models/Colleges';
import { getToken } from 'next-auth/jwt';

export async function GET(req) {
    try {
        await connectDB();

        const subjectId = req.nextUrl.searchParams.get('si');
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log('subjectId:', subjectId);

        const colleges = await College.find();

        let currentCourse = null;

        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c._id.toString() === String(subjectId));
                        if (!course || !course.assignments) continue;

                        if (course.professor.includes(token?.code)) {
                            currentCourse = course;
                            console.log(course.tests);
                            break;
                        }
                    }
                    if (currentCourse) break;
                }
                if (currentCourse) break;
            }
            if (currentCourse) break;
        }

        return new Response(
            JSON.stringify({
                message: 'GET request received',
                subjectId,
                currentSubject: currentCourse || null
            }),
            { status: 200 }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                message: 'Error',
                error: err.message,
                subjectId
            }),
            { status: 500 }
        );
    }
}

function generateRandomId(length = 20) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateUniqueId(existingTests) {
    let newId;
    do {
        newId = generateRandomId(20);
    } while (existingTests.some(t => t.id === newId));
    return newId;
}

export async function POST(req) {
    try {
        await connectDB();

        const subjectId = req.nextUrl.searchParams.get('si');
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        if (token.role !== 'teacher') return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        if (!subjectId) return new Response(JSON.stringify({ error: 'subjectId is required' }), { status: 400 });

        const uploadedData = await req.json();
        const colleges = await College.find();
        let currentCourse = null;

        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c._id.toString() === String(subjectId));
                        if (!course) continue;

                        if (course.professor.includes(token.code)) {
                            currentCourse = course;

                            if (!course.tests) course.tests = [];

                            const uniqueId = generateUniqueId(course.tests);
                            uploadedData.id = uniqueId;

                            course.tests.push(uploadedData);
                            await college.save();
                            break;
                        }
                    }
                    if (currentCourse) break;
                }
                if (currentCourse) break;
            }
            if (currentCourse) break;
        }

        return new Response(
            JSON.stringify({
                message: 'Test added successfully',
                currentSubject: currentCourse || null
            }),
            { status: 200 }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                message: 'Error',
                error: err.message
            }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const subjectId = req.nextUrl.searchParams.get('si');
        const examId = req.nextUrl.searchParams.get('ei');
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        if (token.role !== 'teacher') return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        if (!subjectId || !examId) return new Response(JSON.stringify({ error: 'subjectId and examId required' }), { status: 400 });

        const colleges = await College.find();
        let courseFound = null;

        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c._id.toString() === String(subjectId));
                        if (!course) continue;
                        if (!course.professor.includes(token.code)) {
                            continue;
                        }
                        course.tests = course.tests.filter(
                            t => String(t.id) !== String(examId)
                        );
                        courseFound = course;
                        await college.save();
                        break;
                    }
                    if (courseFound) break;
                }
                if (courseFound) break;
            }
            if (courseFound) break;
        }

        if (!courseFound)
            return new Response(JSON.stringify({ error: "Course or exam not found" }), { status: 404 });

        return new Response(
            JSON.stringify({
                message: "Exam deleted successfully",
                course: courseFound
            }),
            { status: 200 }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                message: "Error",
                error: err.message
            }),
            { status: 500 }
        );
    }
}
