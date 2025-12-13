'use client'
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react"
import React from "react"

export default function EmailPasswordForm({
    email, setEmail,
    password, setPassword,
    loading, setLoading,
    fieldErrors, setFieldErrors,
    error, setError,
    router, dispatch
}) {
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setFieldErrors({ email: '', password: '' })

        const errors = {}
        if (!email.trim()) errors.email = 'البريد الإلكتروني مطلوب'
        if (!password) errors.password = 'كلمة المرور مطلوبة'
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            setLoading(false)
            return
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false)

        if (result?.ok) {
            dispatch({ type: 'snackbar/setShowSnackbar', payload: { state: true, message: 'تم تسجيل الدخول بنجاح', severity: 'success' } })
            setTimeout(() => router.push('/'), 1000)
        } else {
            setError(result?.error || 'حدث خطأ، يرجى المحاولة مرة أخرى')
            dispatch({ type: 'snackbar/setShowSnackbar', payload: { state: true, message: result?.error || 'فشل تسجيل الدخول', severity: 'error' } })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* البريد الإلكتروني */}
            <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input
                    id="email"
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                <AnimatePresence>
                    {fieldErrors.email && (
                        <motion.span
                            className="text-red-600 text-sm mt-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            {fieldErrors.email}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* كلمة المرور */}
            <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium mb-1">كلمة المرور</label>
                <input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <AnimatePresence>
                    {fieldErrors.password && (
                        <motion.span
                            className="text-red-600 text-sm mt-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            {fieldErrors.password}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* زر تسجيل الدخول */}
            <motion.button
                type="submit"
                className="bg-[#4D44B5] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#373085] transition-colors duration-300"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
            >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </motion.button>

            {/* رسالة الخطأ */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        className="text-red-600 text-center text-sm mt-2"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            <p className="text-center text-gray-600 mt-4">
                ليس لديك حساب؟ <a href="#" className="text-[#4D44B5] hover:underline font-medium">سجل الآن</a>
            </p>
        </form>
    )
}
