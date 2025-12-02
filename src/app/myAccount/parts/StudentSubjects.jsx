'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { globals } from '../../../../data/global'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice'
import { fetchStudents } from '@/app/features/AsyncSlices/StudentSlice'

export default function StudentSubjects() {
    const [openCourses, setOpenCourses] = useState({})
    const [subjects, setSubjects] = useState({ courses: [] })
    const [currentDepartment, setCurrentDepartment] = useState(null)
    const [currYear, setCurrYear] = useState(null)

    const { data: session } = useSession()
    const dispatch = useDispatch()
    const colleges = useSelector((c) => c.colleges.colleges) || []
    const students = useSelector((st) => st.students.students) || []

    useEffect(() => {
        dispatch(fetchStudents())
        dispatch(fetchColleges())
    }, [dispatch])

    const user = students.find(st => st.id === session?.user?.id)

    useEffect(() => {
        if (!user) return
        const currentCollege = colleges.find(col => col.college === user.faculty)
        if (!currentCollege) return
        const year = currentCollege.years?.find(y => y.cate === user.currentYear)
        setCurrYear(year || null)
    }, [user, colleges])

    useEffect(() => {
        if (!currYear || !user) return
        const dept = currYear.departments.find(d => d.name === user.department)
        setCurrentDepartment(dept || null)
    }, [currYear, user])

    useEffect(() => {
        if (!currentDepartment) return
        const termData = currentDepartment.terms.find(t => t.term === globals.term)
        setSubjects(termData || { courses: [] })
    }, [currentDepartment])

    return (
        <ul className="space-y-4">
            <h1 className="mb-3 text-xl font-bold text-[#363B64]">المواد :</h1>

            {subjects.courses.length > 0 ? (
                subjects.courses.map((course, idx) => {
                    const assignments = course.assignments || []

                    // واجبات لم تُحل
                    const notSolved = assignments.filter(a =>
                        !(user?.solutions || []).some(s => s.id === a.id)
                    )

                    // جميع الواجبات محلولة؟
                    const allSolved = notSolved.length === 0

                    return (
                        <motion.li key={idx} className="relative p-3 rounded-md bg-white overflow-hidden pr-6 shadow-md">
                            {/* الشريط الجانبي */}
                            <span className={`absolute h-full w-2 right-0 top-0 ${allSolved ? 'bg-[#4D44B5]' : 'bg-[#FB7D5B]'}`} />

                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                    setOpenCourses(prev => ({ ...prev, [idx]: !prev[idx] }))
                                }
                            >
                                <h6 className="font-semibold">{course.subject}</h6>
                                <div className='flex justify-center items-center gap-5'>
                                    {notSolved.length > 0 && (
                                        <span className='w-5 h-5 flex justify-center items-center rounded-full text-white bg-[#FB7D5B]'>
                                            {notSolved.length}
                                        </span>
                                    )}
                                    <span className="text-[#4D44B5] font-bold">
                                        {openCourses[idx] ? '-' : '+'}
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {openCourses[idx] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='mt-4 space-y-4'
                                    >
                                        {assignments.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F3F4FF] p-5">
                                                {assignments.map(a => {
                                                    const solved = (user?.solutions || []).some(s => s.id === a.id)
                                                    return (
                                                        <Link href={`/assignment-details?id=${a.id}`} key={a.id}>
                                                            <div className="relative p-3 pb-2 pr-9 rounded-md bg-white shadow-md overflow-hidden max-h-[150px]">
                                                                <span className={`absolute h-full w-2 right-0 top-0 ${solved ? 'bg-[#4D44B5]' : 'bg-[#FB7D5B]'}`} />
                                                                <p className="text-lg font-semibold truncate">{a.title}</p>
                                                                {a.description && <p className='text-sm text-gray-600'>{a.description}</p>}
                                                                {a.file && a.file.endsWith('.pdf') && (
                                                                    <a href={a.file} target='_blank' className='text-blue-600 underline text-sm'>
                                                                        تحميل PDF
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        ) : <p className='text-gray-400'>لا توجد واجبات</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    )
                })
            ) : (
                <p>لا توجد مواد</p>
            )}
        </ul>
    )
}
