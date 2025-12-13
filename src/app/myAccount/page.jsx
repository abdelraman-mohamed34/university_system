'use client'
import React, { lazy, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/home-page/Header'
import { signOut, useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'
import { Skeleton, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BiLogOutCircle } from "react-icons/bi";

const UserCard = lazy(() => import('./parts/UserCard'))
const StudentSubjects = dynamic(() => import('./parts/StudentSubjects'))
const ProfessorCourses = dynamic(() => import('./parts/ProfessorCourses'))
const NotesCard = dynamic(() => import('./parts/NotesCard'))

function Page() {
    const { data: session, status } = useSession()
    const user = session?.user
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchColleges())
    }, [dispatch])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    // تقليل المسافات داخل الـ Skeleton
    const CardSkeleton = () => (
        <Box className="bg-white rounded-[32px] p-6 mb-4 shadow-sm">
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={150} sx={{ borderRadius: '20px' }} />
        </Box>
    )

    if (status === "loading") {
        return (
            <div className="lg:px-10 py-6 px-4 bg-[#F8F9FD] min-h-screen" dir="rtl">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        )
    }

    if (status === "unauthenticated") return null

    const handleSignout = () => {
        signOut({ callbackUrl: '/' })
        dispatch(setShowSnackbar({
            state: true,
            message: 'تم تسجيل الخروج بنجاح',
            severity: 'success',
        }))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:px-10 py-4 sm:px-4 px-2 bg-[#F8F9FD] min-h-screen flex flex-col gap-4 pt-0"
            dir="rtl"
        >
            <Header prop="حسابي" showSearch={false} />

            <Suspense fallback={<CardSkeleton />}>
                <UserCard />
            </Suspense>

            <div className="flex flex-col gap-5">
                {user.role === 'student' && (
                    <Suspense fallback={<CardSkeleton />}>
                        <StudentSubjects />
                    </Suspense>
                )}

                {user.role === 'teacher' && (
                    <Suspense fallback={<CardSkeleton />}>
                        <ProfessorCourses />
                    </Suspense>
                )}

                <Suspense fallback={<CardSkeleton />}>
                    <NotesCard />
                </Suspense>
            </div>

            {/* زر الخروج بمسافة علوية أقل */}
            <div className="flex justify-center sm:justify-start mt-2">
                <button
                    onClick={handleSignout}
                    className="group flex items-center gap-3 px-8 py-3.5 sm:w-auto w-full bg-white border border-red-100 text-red-500 rounded-2xl font-bold shadow-sm hover:bg-red-50 transition-all active:scale-95"
                >
                    <BiLogOutCircle className="text-xl" />
                    <span className="text-sm">تسجيل الخروج</span>
                </button>
            </div>
        </motion.div>
    )
}

export default Page