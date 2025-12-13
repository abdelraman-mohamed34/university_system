'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAssignment, fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { useSession } from 'next-auth/react'
import Header from '../components/home-page/Header'
import { motion } from 'framer-motion'
import { Skeleton, Box } from '@mui/material'
import AssignmentContent from './parts/AssignmentContent'
import SolutionSection from './parts/StudentSolutionSection'
import TeacherActions from './parts/TeacherActions'
import EditAssignmentModal from './parts/EditAssignmentModal'

export default function AssignmentDetails() {
    const searchParams = useSearchParams()
    const propId = searchParams.get('id')
    const router = useRouter()
    const dispatch = useDispatch()
    const { data: session } = useSession()

    const colleges = useSelector((c) => c.colleges.colleges) || []
    const students = useSelector((st) => st.students.students) || []

    const [assignment, setAssignment] = useState(null)
    const [currentSubCode, setCurrentSubCode] = useState(null)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        dispatch(fetchColleges());
        dispatch(fetchStudents());
    }, [dispatch])

    useEffect(() => {
        if (!propId || colleges.length === 0) return
        let found = null
        outerLoop:
        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        for (const course of term.courses) {
                            const assign = course.assignments?.find(a => a.id === Number(propId))
                            if (assign) {
                                found = assign;
                                setCurrentSubCode(course?.subCode);
                                break outerLoop;
                            }
                        }
                    }
                }
            }
        }
        setAssignment(found)
    }, [propId, colleges])

    if (!assignment || !session?.user) return <Box className="p-4 sm:p-10"><Skeleton variant="rectangular" height={400} /></Box>
    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <motion.div
                className="w-full mx-auto pb-10 px-2 sm:px-4 lg:px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                dir="rtl"
            >
                <Header prop='تفاصيل الواجب' />

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden mt-4">
                    <AssignmentContent setEditing={setEditing} assignment={assignment} />

                    <div className="p-4 sm:p-6 border-t border-gray-100">
                        {session.user.role === 'student' && (
                            <div className="mt-2">
                                <SolutionSection
                                    assignment={assignment}
                                    subCode={currentSubCode}
                                    students={students}
                                    user={session.user}
                                />
                            </div>
                        )}

                        {session.user.role === "teacher" && (
                            <div className="mt-2">
                                <TeacherActions />
                            </div>
                        )}
                    </div>
                </div>

                {editing && (
                    <EditAssignmentModal
                        assignment={assignment}
                        currentSubCode={currentSubCode}
                        onClose={() => setEditing(false)}
                    />
                )}
            </motion.div>
        </Suspense>

    )
}