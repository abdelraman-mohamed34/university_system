import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Student from "../../../../../models/Student";
import Teacher from "../../../../../models/Professor";

export const authOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "البريد الإلكتروني", type: "email" },
                password: { label: "كلمة السر", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                let user = await Student.findOne({ email: credentials.email.toLowerCase() });
                if (!user) user = await Teacher.findOne({ email: credentials.email.toLowerCase() });
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return user
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const plainUser = user.toObject ? user.toObject() : user;
                Object.assign(token, plainUser);
            }

            return token;
        },

        async session({ session, token }) {
            session.user = { ...token };
            return session;
        }
    },

    pages: { signIn: "/login" }
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
