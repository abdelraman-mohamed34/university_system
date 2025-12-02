'use client'
import { motion } from 'framer-motion'
import React, { lazy, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/home-page/Header'
import { signOut, useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { Skeleton } from '@mui/material'
import { useRouter } from 'next/navigation'

// Lazy components (Code Splitting)
const UserCard = lazy(() => import('./parts/UserCard'))
const StudentSubjects = dynamic(() => import('./parts/StudentSubjects'))
const ProfessorCourses = dynamic(() => import('./parts/ProfessorCourses'))
const NotesCard = dynamic(() => import('./parts/NotesCard'))

function Page() {
    const { data: session } = useSession()
    const user = session?.user
    const colleges = useSelector((c) => c.colleges.colleges) || []
    const router = useRouter()
    const dispatch = useDispatch()
    const handleSignout = () => {
        signOut({ callbackUrl: '/' })
        dispatch(setShowSnackbar({
            state: true,
            message: 'تم تسجيل الخروج بنجاح',
            severity: 'success',
        }))
    }
    useEffect(() => {
        dispatch(fetchColleges())
    }, [dispatch])

    if (!user) return (
        <div className="lg:px-10 sm:py-5 pb-5 sm:px-7 px-2 flex justify-center items-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center"
            >
                <h2 className="text-2xl font-bold text-[#4D44B5] mb-3">
                    تحتاج إلى تسجيل الدخول
                </h2>

                <p className="text-gray-600 mb-6">
                    يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة.
                </p>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/login")}
                    className="px-6 py-3 bg-[#4D44B5] text-white rounded w-full font-semibold hover:bg-[#3B3590] transition-all duration-300"
                >
                    الانتقال إلى تسجيل الدخول
                </motion.button>
            </motion.div>
        </div>
    )

    return (
        <div className="lg:px-10 py-5 sm:px-4 px-2 pt-0">
            <Header prop="حسابي" showSearch={false} />

            <Suspense fallback={<Skeleton height={400} width="100%" />}>
                <UserCard />
            </Suspense>

            {user.role === 'student' ? (
                <StudentSubjects />
            ) : (
                <ProfessorCourses />
            )}

            <NotesCard />

            <button
                onClick={handleSignout}
                className="px-4 py-2 w-full sm:w-auto bg-red-500 text-white rounded-md mt-5 hover:bg-red-700 transition-all duration-300"
            >
                تسجيل الخروج
            </button>
        </div>

    )
}

export default Page
