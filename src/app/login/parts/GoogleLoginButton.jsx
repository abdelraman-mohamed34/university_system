'use client'
import { signIn } from "next-auth/react"

export default function GoogleLoginButton() {
    return (
        <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full py-3 px-4 border
             border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 gap-2"
        >
            تسجيل الدخول عبر جوجل

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.4-9 19.4-20 0-1.3-.1-2.2-.4-3.5z"
                />
                <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.3 13.8 18.8 10 24 10c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                />
                <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 36 26.7 37 24 37c-5.2 0-9.7-3.4-11.3-8l-6.6 5C9.6 39.9 16.3 44 24 44z"
                />
                <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.9 2.3-2.6 4.3-4.7 5.6l6.3 5.2C38 35 40 30 40 24c0-1.3-.1-2.2-.4-3.5z"
                />
            </svg>
        </button>
    )
}