import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { withAuth } from 'next-auth/middleware'

export default withAuth(
    async function proxy(req) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        const path = req.nextUrl.pathname

        // global logic on all matchers
        if (!token) return NextResponse.redirect(new URL('/login', req.url))

        // protected teachers pages
        const isTeacherRoute =
            path.startsWith('/subject-management')
            || path.startsWith('/assignment-details')

        const isAdminRoute = path.startsWith('/addNewTeacher') || path.startsWith('/addNewTeacher/:path*/')
        if (token && isAdminRoute && token.role !== 'admin')
            return NextResponse.redirect(new URL('/', req.url))

        if (isTeacherRoute && token.role !== 'teacher') {
            return NextResponse.redirect(new URL('/', req.url))
        }

        return NextResponse.next()
    }
)

export const config = {
    matcher: [
        '/subject-management/:path*/',
        '/assignment-details/:path*/',
        '/myAccount',
        '/addNewTeacher',
    ],
}
