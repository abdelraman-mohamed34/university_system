'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import Header from '../components/home-page/Header'
import { motion, AnimatePresence } from 'framer-motion'
import { globals } from '../../../data/global'

function Page() {
    const dispatch = useDispatch()
    const students = useSelector(st => st.students.students) || []
    const colleges = useSelector(st => st.colleges.colleges) || []

    const [savedStudentCode, setSavedStudentCode] = useState(null)
    const [openCourses, setOpenCourses] = useState({})
    const [currYear, setCurrYear] = useState(null)
    const [currentDepartment, setCurrentDepartment] = useState(null)
    const [subjects, setSubjects] = useState(null)
    const [previewImage, setPreviewImage] = useState(null) // For modal preview
    const term = globals.term

    // Fetch Data
    useEffect(() => {
        dispatch(fetchStudents())
        dispatch(fetchColleges())

        if (typeof window !== 'undefined') {
            const code = localStorage.getItem('selectedStudentCode')
            setSavedStudentCode(code)
        }
    }, [dispatch])

    const student = students.find(s => s.code === savedStudentCode)

    // College > Year
    useEffect(() => {
        if (student && colleges.length > 0) {
            const currentCollege = colleges.find(col => col.college === student.faculty)
            if (currentCollege) {
                const year = currentCollege.years.find(y => y.cate === student.currentYear)
                setCurrYear(year)
            }
        }
    }, [student, colleges])

    // Department
    useEffect(() => {
        if (currYear) {
            const currDepartment = currYear.departments.find(d => d.name === student.department)
            setCurrentDepartment(currDepartment)
        }
    }, [currYear])

    // Subjects
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
        <div className='lg:px-10 sm:py-5 pb-5 sm:px-7 px-2'>
            {!savedStudentCode ? (
                <div>لا يوجد طالب محدد</div>
            ) : !student ? (
                <div>لا توجد بيانات للطالب</div>
            ) : (
                <>
                    <Header prop='بيانات الطالب' />

                    <div className='w-full rounded-xl pb-10 overflow-hidden'>
                        {/* HEADER CARD */}
                        <div className='bg-white w-full rounded-xl sm:mb-5 mb-2 pb-3 overflow-hidden'>
                            <div className='relative w-full h-50 bg-[#4D44B5] mb-10'>
                                <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                                    <span className="absolute top-15 lg:right-20 right-2 lg:bg-transparent bg-[#FCC43E] rounded aspect-square lg:w-70 w-40 lg:border-35 lg:border-[#FCC43E] lg:rounded-full z-10" />
                                    <span className="absolute top-25 lg:right-70 right-30  lg:bg-transparent bg-[#FB7D5B] rounded aspect-square lg:w-48 w-35 lg:border-35 lg:border-[#FB7D5B] lg:rounded-full" />
                                </div>
                                <span className='aspect-square rounded-full w-40 overflow-hidden border-4 border-white absolute top-32 sm:left-10 sm:right-auto right-2 shadow z-20'>
                                    <img
                                        className='w-full h-full object-cover'
                                        src={student?.photo?.trim() !== "" ? student?.photo : globals?.avatarUserLink}
                                        alt={student.fullName}
                                    />
                                </span>
                            </div>

                            <div className='px-10 mb-6 sm:pt-0 pt-15'>
                                <h2 className='text-2xl font-bold'>{student.fullName}</h2>
                                <p>{student.email}</p>
                                <p>الكلية: {student.faculty}</p>
                                <p>الفرقة: {student.currentYear}</p>
                                <p>الحالة: {student.status}</p>
                                <p>المدينة: {student.city} - العنوان: {student.address}</p>
                                <p>رقم تلفون الطالب: {student.phone}</p>
                                <p>رقم تلفون ولي الأمر: {student.fatherPhone}</p>
                            </div>
                        </div>

                        {/* SUBJECTS + ASSIGNMENTS */}
                        <ul className='space-y-4'>
                            <h1 className='mb-3 text-xl font-bold text-[#363B64]'>المواد :</h1>
                            {subjects?.courses.length > 0 ? subjects.courses.map((course, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    className='relative p-4 rounded-md bg-white overflow-hidden pr-6 shadow-md'
                                >
                                    <span className='absolute h-full w-2 right-0 top-0 bg-[#4D44B5]' />

                                    {/* Course Header */}
                                    <div
                                        className='flex justify-between items-center cursor-pointer'
                                        onClick={() => toggleCourse(idx)}
                                    >
                                        <h6 className='font-semibold text-lg'>{course.subject}</h6>
                                        <span className='text-[#4D44B5] font-bold text-xl'>
                                            {openCourses[idx] ? '-' : '+'}
                                        </span>
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
                                                {/* Assignments */}
                                                <div>
                                                    <h4 className='font-semibold text-[#4D44B5] mb-2'>الواجبات:</h4>

                                                    <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 p-5 bg-[#F3F4FF] gap-3'>
                                                        {course.assignments.length > 0 ? (
                                                            course.assignments.map((a, i) => (
                                                                <div key={i}>
                                                                    <div className="relative p-3 pb-2 pr-9 rounded-lg bg-white shadow-md overflow-hidden max-h-[150px]">
                                                                        <span className="absolute w-4 h-full right-0 top-0 bg-[#4D44B5]" />
                                                                        <p className="text-lg font-semibold truncate">{a.title}</p>
                                                                    </div>
                                                                    {a.description && <p className='text-sm text-gray-600'>{a.description}</p>}

                                                                    {a.file && (
                                                                        <>
                                                                            {a.file.endsWith('.pdf') ? (
                                                                                <a href={a.file} target='_blank' className='text-blue-600 underline text-sm'>
                                                                                    تحميل PDF
                                                                                </a>
                                                                            ) : (
                                                                                <img
                                                                                    src={a.file}
                                                                                    className='w-40 h-40 object-cover cursor-pointer mt-2 rounded-md shadow'
                                                                                    alt={a.title}
                                                                                    onClick={() => setPreviewImage(a.file)}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className='text-gray-400'>لا توجد واجبات</p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Tests */}
                                                <div>
                                                    <h4 className='font-semibold text-[#4D44B5] mb-2'>الاختبارات:</h4>
                                                    {course.tests.length > 0 ? (
                                                        course.tests.map((t, i) => (
                                                            <div key={i} className='p-3 bg-gray-100 rounded-lg my-1'>
                                                                <p className='font-semibold'>{t.title || `اختبار ${i + 1}`}</p>
                                                                {t.description && <p className='text-sm text-gray-600'>{t.description}</p>}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className='text-gray-400'>لا توجد اختبارات</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            )) : (
                                <li className='p-4 bg-white rounded-xl shadow-md'>لا توجد مواد</li>
                            )}
                        </ul>

                        {/* IMAGE MODAL */}
                        {previewImage && (
                            <div
                                className='fixed inset-0 bg-black backdrop-blur bg-opacity-70 flex justify-center items-center z-50'
                                onClick={() => setPreviewImage(null)}
                            >
                                <img src={previewImage} className='max-h-[80%] max-w-[80%] rounded shadow-lg' alt='Preview' />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Page
