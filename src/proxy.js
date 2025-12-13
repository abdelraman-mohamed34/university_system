import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { withAuth } from 'next-auth/middleware';

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default withAuth(
    async function middleware(req) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const path = req.nextUrl.pathname;

        if (!token) return NextResponse.redirect(`${BASE_URL}/login`);

        const isTeacherRoute =
            path.startsWith('/subject-management') ||
            path.startsWith('/assignment-details');

        const isAdminRoute = path.startsWith('/addNewTeacher');

        if (isTeacherRoute && token.role !== 'teacher') {
            return NextResponse.redirect(`${BASE_URL}/`);
        }
        if (isAdminRoute && token.role !== 'admin') {
            return NextResponse.redirect(`${BASE_URL}/`);
        }
        return NextResponse.next();
    }
);

export const config = {
    matcher: [
        '/subject-management/:path*',
        '/assignment-details/:path*',
        '/myAccount',
        '/addNewTeacher',
    ],
};
