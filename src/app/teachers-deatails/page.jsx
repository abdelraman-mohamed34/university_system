'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/home-page/Header'
import { motion } from 'framer-motion'
import { fetchProfessors } from '../features/AsyncSlices/ProfSlice'
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import { globals } from '../../../data/global'
import { Skeleton } from '@mui/material'

function Page() {
    const dispatch = useDispatch()
    const professors = useSelector((prof) => prof.professors.professors) || []
    const colleges = useSelector((c) => c.colleges.colleges) || []

    const [savedTeacher, setSavedTeacher] = useState(null)
    const [professorCourses, setProfessorCourses] = useState([])

    useEffect(() => {
        dispatch(fetchProfessors())
        dispatch(fetchColleges())
        if (typeof window !== 'undefined') {
            const code = localStorage.getItem('selectedTeacher')
            setSavedTeacher(code)
        }
    }, [dispatch])

    useEffect(() => {
        if (savedTeacher && colleges.length > 0) {
            const tempCourses = []
            colleges.forEach(college => {
                // التأكد من أن جميع السنوات يتم تضمينها (لحل مشكلة "السنة الخامسة")
                const collegeName = college.college;
                college.years.forEach(year => {
                    const yearName = year.cate; // افتراض أن 'cate' هو اسم السنة
                    year.departments.forEach(dept => {
                        const deptName = dept.name;
                        dept.terms.forEach(term => {
                            // تم إزالة تصفية globalTerm
                            term.courses.forEach(course => {
                                if (Array.isArray(course.professor) && course.professor.includes(savedTeacher)) {
                                    tempCourses.push({
                                        ...course,
                                        college: collegeName,
                                        year: yearName,
                                        department: deptName,
                                        term: term.term
                                    })
                                }
                            });
                        })
                    })
                })
            })
            setProfessorCourses(tempCourses)
        }
    }, [savedTeacher, colleges])

    const grouped = professorCourses.reduce((acc, course) => {
        if (!acc[course.college]) acc[course.college] = {}
        if (!acc[course.college][course.year]) acc[course.college][course.year] = {}
        if (!acc[course.college][course.year][course.department]) acc[course.college][course.year][course.department] = []
        acc[course.college][course.year][course.department].push(course)
        return acc
    }, {})

    // ... منطق التحميل وال Skeleton ...

    const profs = professors.filter(prof => prof.code === savedTeacher)
    if (!savedTeacher || profs.length === 0) {
        // ... (كود ال Skeleton) ...
        if (!savedTeacher) return <div className='lg:px-10 pb-5 sm:px-4 px-2'>لا يوجد معلم محدد</div>
        if (profs.length === 0) {
            // Skeleton Loader
            return (
                <div className='lg:px-10 pb-5 sm:px-4 px-2'>
                    <Header prop='بيانات المعلم' />
                    <div className='w-full rounded-xl pb-10 overflow-hidden'>
                        <Skeleton variant="rectangular" height={200} sx={{ backgroundColor: '#F5F5F5', mb: 3 }} />
                        <div className='px-4'>
                            <Skeleton variant="text" width="40%" height={30} sx={{ backgroundColor: '#F5F5F5', mb: 1 }} />
                            <Skeleton variant="text" width="60%" height={20} sx={{ backgroundColor: '#F5F5F5', mb: 1 }} />
                            <Skeleton variant="text" width="30%" height={20} sx={{ backgroundColor: '#F5F5F5', mb: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={150} sx={{ backgroundColor: '#F5F5F5', mb: 2 }} />
                        </div>
                    </div>
                </div>
            )
        }
    }

    const filteredProfessor = profs[0]

    return (
        <div className='lg:px-10 pb-5 sm:px-4 px-2'>
            <Header prop='بيانات المعلم' />

            <div className='w-full rounded-xl pb-10 overflow-hidden'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white w-full rounded-xl sm:mb-5 mb-2 pb-3 overflow-hidden'
                >
                    {/* ... قسم رأس المعلم (Header Section) ... */}
                    <div className='relative w-full h-44 lg:h-56 bg-[#4D44B5] mb-10'>
                        {/* ... الأشكال الزخرفية ... */}
                        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                            <span className="absolute top-15 lg:right-20 right-2 bg-[#FCC43E] rounded aspect-square lg:w-70 w-40 lg:border-35 lg:border-[#FCC43E] lg:rounded-full z-10" />
                            <span className="absolute top-25 lg:right-70 right-30 bg-[#FB7D5B] rounded aspect-square lg:w-48 w-35 lg:border-35 lg:border-[#FB7D5B] lg:rounded-full" />
                        </div>
                        <span className='aspect-square rounded-full w-28 h-28 lg:w-40 lg:h-40 overflow-hidden border-4 border-white absolute top-28 lg:top-32 left-6 lg:left-10 shadow z-20'>
                            <img
                                className='w-full h-full object-cover bg-[#C1BBEB]'
                                src={filteredProfessor?.photo?.trim() !== "" ? filteredProfessor.photo : globals?.avatarUserLink}
                                alt={filteredProfessor?.fullName}
                            />
                        </span>
                    </div>
                    <div className='px-4 lg:px-10 mb-6'>
                        <h2 className='text-xl lg:text-2xl font-bold truncate text-[#303972]'>{filteredProfessor.fullName}</h2>
                        <p className='text-sm lg:text-base'>البريد الإلكتروني: {filteredProfessor.email}</p>
                        <p className='text-sm lg:text-base'>الحالة: {filteredProfessor.status}</p>
                        {/* تم حذف تكرار الكلية هنا - ستظهر في قسم المواد */}
                        <p className='text-sm lg:text-base'>رقم الهاتف: {filteredProfessor.phone}</p>
                        <p className='text-sm lg:text-base'>سنين الخبرة : {filteredProfessor.experienceYears}</p>
                    </div>
                </motion.div>

                {/* 🌟 قسم المواد المُحسن 🌟 */}
                {grouped && Object.keys(grouped).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='p-4 rounded-xl bg-white overflow-hidden' // ⬅️ إزالة الهوامش الزائدة
                    >
                        <h1 className='mb-4 text-xl lg:text-2xl font-bold text-[#303972] border-b border-gray-200 pb-2'>
                            المواد المُدرسة:
                        </h1>

                        {Object.keys(grouped).map((collegeName) => (
                            <div key={collegeName} className="mb-6 pt-3">

                                <h2 className="text-xl font-bold text-[#4D44B5] mb-3 border-r-5 border-[#FCC43E] pr-2">
                                    الكلية: {collegeName}
                                </h2>

                                {Object.keys(grouped[collegeName]).map((yearName) => (
                                    <div key={yearName} className="mb-4 pl-4">

                                        <h3 className="text-lg font-semibold text-[#303972] mb-2">
                                            السنة: {yearName}
                                        </h3>

                                        {Object.keys(grouped[collegeName][yearName]).map((departmentName) => (
                                            <div key={departmentName} className="mb-3 pl-4">

                                                <p className="font-medium mb-2 text-[#555]">القسم: {departmentName}</p>

                                                <ul className="flex flex-wrap gap-2"> {/* زيادة الفراغ بين العناصر */}
                                                    {grouped[collegeName][yearName][departmentName].map((course) => (
                                                        <li
                                                            key={course.subCode}
                                                            className="bg-[#4D44B5] p-2 px-3 text-white rounded-lg text-sm shadow-md transition duration-300 hover:bg-[#5C55C7]" // تحسين شكل الـ Chip
                                                        >
                                                            {course.subject} ({course.term}) {/* إضافة الفصل الدراسي بجانب المادة */}
                                                        </li>
                                                    ))}
                                                </ul>

                                            </div>
                                        ))}

                                    </div>
                                ))}

                            </div>
                        ))}
                    </motion.div>
                )}

            </div>
        </div>
    )
}

export default Page