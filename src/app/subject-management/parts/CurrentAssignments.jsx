'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'

function CurrentAssignments({ setShowAddAssignment, showAddAssignment }) {
    const colleges = useSelector(state => state.colleges.colleges)
    const dispatch = useDispatch()

    const [currentCourse, setCurrentCourse] = useState(null)
    const [saved, setSaved] = useState(null)
    const { data: session } = useSession();

    useEffect(() => {
        const savedCode = localStorage.getItem('subjectSavedCode')
        setSaved(savedCode)
    }, [dispatch])

    const getCourseByCode = (subCode) => {
        if (!colleges) return null;
        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c.subCode === subCode)
                        if (course) {
                            return {
                                ...course,
                                assignments: course.assignments || [],
                                college: college.college,
                                year: year.cate,
                                department: dept.name,
                                term: term.term
                            }
                        }
                    }
                }
            }
        }
        return null
    }

    useEffect(() => {
        if (saved && colleges.length > 0) {
            const course = getCourseByCode(saved)
            setCurrentCourse(course)
        }
    }, [colleges, saved])

    if (!currentCourse) {
        return <div className='mt-6 text-gray-500 text-center'>جاري تحميل البيانات...</div>
    }

    return (
        <div className='mt-6 text-right' dir="rtl">

            <div className="flex justify-between items-center mb-6" dir="rtl">
                <h2 className='text-xl sm:text-2xl font-extrabold text-[#303972]'>الواجبات الحالية</h2>
                {(session?.user?.role === "teacher" || session?.user?.role === "admin") && (
                    <motion.button
                        onClick={() => setShowAddAssignment(!showAddAssignment)}
                        className='flex items-center justify-center w-8 h-8 rounded-full bg-[#4D44B5] text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2'
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        title="إضافة واجب جديد"
                    >
                        <BiPlus className="w-6 h-6" />
                    </motion.button>
                )}
            </div>

            {
                currentCourse.assignments && currentCourse.assignments.length > 0 ? (
                    <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-5 gap-2 bg-[#F3F4FF] p-4 rounded-lg shadow-inner max-h-[400px] overflow-y-auto'>
                        {currentCourse?.assignments.map((a) => (
                            <Link
                                href={`/assignment-details?id=${a.id}`}
                                key={a.id}
                                className='block'
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className='relative p-4 pr-10 rounded-xl bg-white shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer border-r-5 border-[#4D44B5]'
                                >
                                    <div className='text-lg font-bold text-[#303972] truncate mb-1'>{a.title}</div>
                                    <div className='text-xs text-gray-500 flex items-center gap-1 justify-start'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#FCC43E]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        {new Date(a.id).toLocaleString('ar-EG')}
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className='text-gray-500 p-3 bg-[#F3F4FF] shadow-inner rounded-md'>لا توجد واجبات مُضافة لهذه المادة بعد.</p>
                )
            }

        </div >
    )
}

export default CurrentAssignments