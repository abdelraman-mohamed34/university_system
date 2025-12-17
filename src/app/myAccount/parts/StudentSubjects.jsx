'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { globals } from '../../../../data/global'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { fetchStudents } from '@/app/features/AsyncSlices/StudentSlice'
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice'
import { BiBookOpen, BiChevronDown, BiChevronUp } from 'react-icons/bi'

export default function StudentSubjects() {
    const [openCourses, setOpenCourses] = useState({})
    const [subjects, setSubjects] = useState({ courses: [] })
    const [currentDepartment, setCurrentDepartment] = useState(null)
    const [currYear, setCurrYear] = useState(null)
    const [currentStudent, setCurrentStudent] = useState(null)

    const { data: session } = useSession()
    const dispatch = useDispatch()
    const colleges = useSelector((c) => c.colleges.colleges) || []
    const students = useSelector((st) => st.students.students) || []
    const user = students.find(st => st.code === session?.user?.code)

    function normalizeArabic(str) {
        if (!str) return ""
        return str
            .trim()
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/\s+/g, " ");
    }

    useEffect(() => {
        dispatch(fetchStudents())
        dispatch(fetchColleges())
    }, [dispatch])

    useEffect(() => {
        if (!user || colleges.length === 0) return

        const currentCollege = colleges?.find(col => col.college === user?.faculty);

        if (!currentCollege) {
            setCurrYear(null);
            return;
        }

        const normalize = normalizeArabic;
        const userNorm = normalize(user.currentYear);
        const year = currentCollege?.years?.find(y => {
            const collegeNorm = normalize(y.cate);
            return collegeNorm.slice(0, 4) === userNorm.slice(0, 4);
        });
        setCurrYear(year || null);
    }, [user, colleges])

    useEffect(() => {
        if (!currYear || !user) return

        const dept = currYear?.departments?.find(d => d.name === user?.department)
        setCurrentDepartment(dept || null)
    }, [currYear, user])

    useEffect(() => {
        if (!currentDepartment) return
        const termData = currentDepartment?.terms?.find(t => t.term === globals?.term)
        setSubjects(termData || { courses: [] })
    }, [currentDepartment])

    useEffect(() => {
        if (session?.user && students.length > 0) {
            const student = students.find(s => s._id === session.user._id)
            setCurrentStudent(student)
        }
    }, [session, students])

    console.log(subjects)

    return (
        <ul className="space-y-4">
            <h1 className="mb-3 text-xl font-bold text-[#363B64]">المواد :</h1>
            {subjects.courses.length > 0 ? (
                subjects.courses.map((course, idx) => {
                    const assignments = course.assignments || []
                    const currentCourse = course || []
                    const tests = course.tests || []
                    const subjectData = course.subjectData || []

                    const notSolvedAssignments = assignments.filter(a =>
                        !(user?.solutions || []).some(s => s.id === a.id)
                    )

                    const notSolvedTests = tests.filter(t =>
                        !(user?.solutions || []).some(s => s.id === t.id)
                    )

                    const allSolved = notSolvedAssignments.length === 0 && notSolvedTests.length === 0
                    const pendingCount = notSolvedAssignments.length + notSolvedTests.length

                    return (
                        <motion.li
                            key={idx}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                            <span className={`absolute h-full w-2 right-0 top-0 ${allSolved ? 'bg-[#4D44B5]' : 'bg-[#FB7D5B]'}`} />

                            <div
                                className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${openCourses[idx] ? 'bg-[#F4F2FF]/50' : 'hover:bg-gray-50'}`}
                                onClick={() =>
                                    setOpenCourses(prev => ({ ...prev, [idx]: !prev[idx] }))
                                }
                            >
                                <div className='flex items-center gap-4'>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${openCourses[idx] ? 'bg-[#4D44B5] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <BiBookOpen />
                                    </div>
                                    <div>
                                        <h6 className='font-bold text-[#303972] text-lg'>{course.subject}</h6>
                                        <p className='text-xs text-[#A098AE]'>{course.assignments.length} واجبات | {course.tests.length} اختبارات</p>
                                    </div>
                                </div>
                                <div className='text-2xl text-[#4D44B5]'>
                                    {openCourses[idx] ? <BiChevronUp /> : <BiChevronDown />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {openCourses[idx] && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className='overflow-hidden border-t border-gray-50'
                                    >
                                        {/* assignments */}
                                        <div className='p-6 bg-white space-y-6 text-start'>
                                            <h5 className="text-lg font-bold text-[#4D44B5] mb-3 border-b border-[#4D44B5]/20 pb-1">الواجبات ({assignments.length})</h5>
                                            {assignments.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F3F4FF] p-4 rounded-lg">
                                                    {assignments.map(a => {
                                                        const solved = (currentStudent?.solutions || []).some(s => s.id === a.id)
                                                        return (
                                                            <Link href={`/assignment-details?id=${a.id}`} key={a.id}>
                                                                <motion.div
                                                                    whileHover={{ y: -2 }}
                                                                    className="relative p-3 pb-2 pr-9 rounded-md bg-white shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#4D44B5] cursor-pointer"
                                                                >
                                                                    <span className={`absolute h-full w-2 right-0 top-0 rounded-tl-md rounded-bl-md ${solved ? 'bg-[#4D44B5]' : 'bg-[#FB7D5B]'}`} />
                                                                    <p className="text-base font-semibold truncate text-[#303972]">{a.title}</p>
                                                                    {a.description && <p className='text-xs text-gray-500 line-clamp-2'>{a.description}</p>}
                                                                    <div className='mt-2'>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${solved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {solved ? 'تم الحل' : 'مطلوب حل'}
                                                                        </span>
                                                                    </div>
                                                                </motion.div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            ) : <p className='text-gray-400 p-4 bg-[#F3F4FF] rounded-lg text-center'>لا توجد واجبات مُسجلة لهذا المقرر</p>}
                                        </div>

                                        {/* exams */}
                                        <div className='p-6 bg-white space-y-6'>
                                            <h5 className="text-lg font-bold text-[#4D44B5] mb-3 border-b border-[#4D44B5]/20 pb-1">الاختبارات ({tests.length})</h5>
                                            {tests.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F3F4FF] p-4 rounded-lg">
                                                    {tests.map(t => {
                                                        const solved = (currentStudent?.solutions || []).some(s => s.examId === t.id)
                                                        return (
                                                            <Link href={`/exam-details?ei=${t.id}`} key={t.id}>
                                                                <motion.div
                                                                    whileHover={{ y: -2 }}
                                                                    className="relative p-3 pb-2 pr-9 rounded-md bg-white shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#4D44B5] cursor-pointer"
                                                                >
                                                                    <span className={`absolute h-full w-2 right-0 top-0 rounded-tl-md rounded-bl-md ${solved ? 'bg-[#4D44B5]' : 'bg-[#FB7D5B]'}`} />
                                                                    <p className="text-base font-semibold truncate text-[#303972]">{t.header}</p>
                                                                    {t.description && <p className='text-xs text-gray-500 line-clamp-2'>{t.description}</p>}
                                                                    <div className='mt-2'>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${solved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {solved ? 'تم الاختبار' : 'مطلوب إنجاز'}
                                                                        </span>
                                                                    </div>
                                                                </motion.div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            ) : <p className='text-gray-400 p-4 bg-[#F3F4FF] rounded-lg text-center'>لا توجد اختبارات مُسجلة لهذا المقرر</p>}
                                        </div>

                                        {/* data */}
                                        <div className='p-6 bg-white space-y-6'>
                                            <h5 className="text-lg font-bold text-[#4D44B5] mb-3 border-b border-[#4D44B5]/20 pb-1">محتوي المادة ({subjectData.length})</h5>
                                            {currentCourse.data.length > 0 ? (
                                                <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-4 bg-[#F3F4FF] p-4 rounded-lg max-h-[400px] overflow-y-auto custom-scrollbar'>
                                                    {currentCourse.data.map((d, index) => (
                                                        <motion.div
                                                            key={d.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        >
                                                            <Link href={`/subjects/data?s=${currentCourse.subCode}&d=${d.id}`}>
                                                                <div
                                                                    className="relative p-3 pb-2 pr-9 rounded-md bg-white shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#4D44B5] cursor-pointer">
                                                                    <span className={`absolute h-full w-2 right-0 top-0 rounded-tl-md rounded-bl-md bg-[#4D44B5]`} />
                                                                    <div className='font-bold text-[#303972] truncate'>{d.title}</div>
                                                                    <div className='text-xs text-gray-500 mt-1 flex gap-1'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#FCC43E]">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                        </svg>
                                                                        {new Date(d.createdAt).toLocaleString('ar-EG', { timeZone: 'UTC' })}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className='text-gray-500 p-4 bg-[#F3F4FF] rounded-lg'>
                                                    لا يوجد محتوى منشور بعد لهذه المادة.
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    )
                })
            ) : (
                <p className='p-4 text-center text-gray-500 bg-white rounded-lg shadow-md'>
                    لا توجد مواد مُسجلة لك في الفصل الحالي، أو جاري تحميل البيانات...
                </p>
            )}
        </ul >
    )
}