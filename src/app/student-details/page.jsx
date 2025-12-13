'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import Header from '../components/home-page/Header'
import { motion, AnimatePresence } from 'framer-motion'
import { globals } from '../../../data/global'
import { BiBookOpen, BiIdCard, BiMap, BiPhone, BiUser, BiChevronDown, BiChevronUp, BiFile } from "react-icons/bi";

function Page() {
    const dispatch = useDispatch()
    const students = useSelector(st => st.students.students) || []
    const colleges = useSelector(st => st.colleges.colleges) || []

    const [savedStudentCode, setSavedStudentCode] = useState(null)
    const [openCourses, setOpenCourses] = useState({})
    const [currYear, setCurrYear] = useState(null)
    const [currentDepartment, setCurrentDepartment] = useState(null)
    const [subjects, setSubjects] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const term = globals.term

    useEffect(() => {
        dispatch(fetchStudents())
        dispatch(fetchColleges())
        if (typeof window !== 'undefined') {
            const code = localStorage.getItem('selectedStudentCode')
            setSavedStudentCode(code)
        }
    }, [dispatch])

    const student = students.find(s => s.code === savedStudentCode)

    useEffect(() => {
        if (student && colleges.length > 0) {
            const currentCollege = colleges.find(col => col.college === student.faculty)
            if (currentCollege) {
                const year = currentCollege.years.find(y => y.cate === student.currentYear)
                setCurrYear(year)
            }
        }
    }, [student, colleges])

    useEffect(() => {
        if (currYear) {
            const currDepartment = currYear.departments.find(d => d.name === student.department)
            setCurrentDepartment(currDepartment)
        }
    }, [currYear])

    useEffect(() => {
        if (currentDepartment) {
            const subjects = currentDepartment.terms.find(t => t.term === term)
            setSubjects(subjects)
        }
    }, [currentDepartment])

    const toggleCourse = (idx) => {
        setOpenCourses(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    return (
        <div className='lg:px-10 sm:px-7sm:py-5 pb-5 px-2 pt-0 sm:pt-0' dir="rtl">
            {!savedStudentCode ? (
                <div className='flex justify-center items-center h-64 text-gray-500 font-bold'> لا يوجد طالب محدد</div>
            ) : !student ? (
                <div className='flex justify-center items-center h-64 text-gray-500 font-bold'> جاري تحميل بيانات الطالب...</div>
            ) : (
                <>
                    <Header prop='بيانات الطالب' />
                    <div className='w-full mx-auto'>
                        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8'>
                            <div className='relative h-48 bg-gradient-to-r from-[#4D44B5] to-[#827AF3]'>

                                <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
                                    <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white" />
                                </div>

                                <div className='absolute -bottom-16 right-10'>
                                    <div className='p-1 bg-white rounded-full shadow-lg'>
                                        <img
                                            className='w-32 h-32 rounded-full object-cover'
                                            src={student?.photo?.trim() !== "" ? student?.photo : globals?.avatarUserLink}
                                            alt={student.fullName}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='pt-20 sm:px-10 px-5 pb-10 flex flex-col md:flex-row justify-between items-start gap-6'>
                                <div className='flex-1'>
                                    <h2 className='text-3xl font-black text-[#303972] mb-2'>{student.fullName}</h2>
                                    <div className='flex flex-wrap gap-4 text-[#A098AE] font-medium'>
                                        <span className='flex items-center gap-1'><BiBookOpen /> {student.faculty} - {student.department}</span>
                                        <span className='flex items-center gap-1 text-[#4D44B5] bg-[#F4F2FF] px-3 py-0.5 rounded-full text-sm'>{student.status}</span>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto'>
                                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-2xl'>
                                        <div className='bg-white p-2 rounded-xl text-[#FCC43E] shadow-sm'><BiPhone className='text-xl' /></div>
                                        <div>
                                            <p className='text-[10px] text-[#A098AE]'>رقم الطالب</p>
                                            <p className='text-sm font-bold text-[#303972]'>{student.phone}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-2xl'>
                                        <div className='bg-white p-2 rounded-xl text-[#FB7D5B] shadow-sm'><BiMap className='text-xl' /></div>
                                        <div>
                                            <p className='text-[10px] text-[#A098AE]'>السكن</p>
                                            <p className='text-sm font-bold text-[#303972]'>{student.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mb-6'>
                            <h3 className='text-xl font-black text-[#303972] mb-6 flex items-center gap-2'>
                                <span className='w-2 h-8 bg-[#4D44B5] rounded-full' />
                                المقررات الدراسية
                            </h3>

                            <div className='space-y-4'>
                                {subjects?.courses.length > 0 ? subjects.courses.map((course, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'
                                    >
                                        <div
                                            className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${openCourses[idx] ? 'bg-[#F4F2FF]/50' : 'hover:bg-gray-50'}`}
                                            onClick={() => toggleCourse(idx)}
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
                                                    <div className='p-6 bg-white space-y-6'>
                                                        <div>
                                                            <h5 className='text-[#4D44B5] font-bold text-sm mb-4 flex items-center gap-2'>
                                                                <BiFile /> الواجبات
                                                            </h5>
                                                            <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-4 font-bold'>
                                                                {course.assignments.map((a, i) => (
                                                                    <div key={i} className='group bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-[#4D44B5] hover:bg-white transition-all shadow-sm'>
                                                                        <h6 className='text-[#303972] mb-1 truncate'>{a.title}</h6>
                                                                        <p className='text-xs text-[#A098AE] font-normal mb-3 line-clamp-2'>{a.description || 'لا يوجد وصف متاح'}</p>
                                                                        {a.file && (
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); a.file.endsWith('.pdf') ? window.open(a.file) : setPreviewImage(a.file) }}
                                                                                className='w-full py-2 bg-white rounded-xl text-[#4D44B5] text-xs border border-gray-100 group-hover:bg-[#4D44B5] group-hover:text-white transition-colors'
                                                                            >
                                                                                عرض المرفق
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )) : (
                                    <div className='p-10 bg-white rounded-3xl text-center text-gray-400 font-bold'> لا توجد مواد دراسية مسجلة حالياً</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {previewImage && (
                        <div className='fixed inset-0 bg-[#303972]/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4' onClick={() => setPreviewImage(null)}>
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={previewImage}
                                className='max-h-[90vh] max-w-full rounded-3xl shadow-2xl border-4 border-white'
                                alt='Preview'
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Page