'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import EmailPasswordForm from "./parts/EmailPasswordForm"
import GoogleLoginButton from "./parts/GoogleLoginButton"
import RightIllustration from "./parts/RightIllustration"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()

    return (
        <div className="grid lg:grid-cols-[40rem_1fr] h-screen w-full ">
            <button className="absolute top-3 right-3" onClick={
                () => router.back()
            }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>

            <motion.div
                className="w-full p-8 md:p-12 flex flex-col justify-center bg-white"
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">مرحبًا بعودتك</h1>
                    <p className="text-gray-600">تسجيل الدخول لحسابك</p>
                </div>

                <EmailPasswordForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    loading={loading}
                    setLoading={setLoading}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                    error={error}
                    setError={setError}
                    router={router}
                    dispatch={dispatch}
                />

                <div className="flex items-center my-4 mt-10">
                    <span className="flex-grow border-t border-gray-300"></span>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">أو</span>
                    <span className="flex-grow border-t border-gray-300"></span>
                </div>

                <GoogleLoginButton />
            </motion.div>

            <RightIllustration />
        </div>
    )
}
