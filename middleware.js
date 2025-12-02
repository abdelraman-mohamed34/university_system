import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
    console.log("Middleware hit:", req.nextUrl.pathname)

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, debug: true })
    console.log("Token in Middleware:", token)

    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    if (token.role !== "student") return NextResponse.redirect(new URL('/', req.url))

    return NextResponse.next()
}
export const config = {
    matcher: ['/students', '/students/:path*'],
}
