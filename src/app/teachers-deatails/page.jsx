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
    const [openCourses, setOpenCourses] = useState({})

    const professorCourses = []
    const globalTerm = globals.term

    colleges.forEach(college => {
        college.years.forEach(year => {
            year.departments.forEach(dept => {
                dept.terms.forEach(term => {
                    if (term.term !== globalTerm) return
                    term.courses.forEach(course => {
                        if (course.professor === savedTeacher) {
                            professorCourses.push({ ...course, college: college.college, year: year.cate, department: dept.name, term: term.term });
                        }
                    });
                });
            });
        });
    });

    const grouped = professorCourses.reduce((acc, course) => {
        if (!acc[course.college]) acc[course.college] = {}
        if (!acc[course.college][course.year]) acc[course.college][course.year] = {}
        if (!acc[course.college][course.year][course.department]) acc[course.college][course.year][course.department] = []
        acc[course.college][course.year][course.department].push(course)
        return acc
    }, {})

    useEffect(() => {
        dispatch(fetchProfessors())
        dispatch(fetchColleges())
        if (typeof window !== 'undefined') {
            const code = localStorage.getItem('selectedTeacher')
            setSavedTeacher(code)
        }
    }, [dispatch])

    if (!savedTeacher) return <div className='lg:px-10 pb-5 px-4'>لا يوجد معلم محدد</div>
    const profs = professors.filter(prof => prof.code === savedTeacher)
    if (profs.length === 0) {
        // Skeleton Loader
        return (
            <div className='lg:px-10 pb-5 px-4'>
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

    const filteredProfessor = profs[0]

    return (
        <div className='lg:px-10 pb-5 px-4'>
            <Header prop='بيانات المعلم' />

            <div className='w-full rounded-xl pb-10 overflow-hidden'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white w-full rounded-xl sm:mb-5 mb-2 pb-3 overflow-hidden'
                >
                    {/* Header Section */}
                    <div className='relative w-full h-44 lg:h-56 bg-[#4D44B5] mb-10'>
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
                        <p className='text-sm lg:text-base'>{filteredProfessor.email}</p>
                        <p className='text-sm lg:text-base'>الحالة: {filteredProfessor.status}</p>
                        {Object.keys(grouped).map((collegeName, index) => (
                            <div key={index}>
                                <p className='text-sm lg:text-base'>الكلية: {collegeName}</p>
                            </div>
                        ))}
                        <p className='text-sm lg:text-base'>رقم الهاتف: {filteredProfessor.phone}</p>
                        <p className='text-sm lg:text-base'>سنين الخبرة : {filteredProfessor.experienceYears}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='relative p-3 rounded-xl bg-white overflow-hidden pr-6'
                >
                    <h1 className='mb-2 text-lg lg:text-xl font-bold text-[#303972]'>المواد :</h1>
                    {Object.keys(grouped).map((collegeName, index) => (
                        <div key={index}>
                            {Object.keys(grouped[collegeName]).map((yearName, yIndex) => (
                                <div key={yIndex}>
                                    {Object.keys(grouped[collegeName][yearName]).map((part, pIndex) => (
                                        <div key={pIndex} className='mb-3 lg:mb-5'>
                                            <span className='flex'>
                                                <p className="font-bold text-sm lg:text-lg mb-2">{yearName} - {part}</p>
                                            </span>
                                            <ul className="flex flex-wrap gap-1">
                                                {grouped[collegeName][yearName][part].map((course, courseIndex) => (
                                                    <li key={courseIndex} className="bg-gray-400 p-1 px-2 text-white rounded text-xs lg:text-sm">
                                                        {course.subject}
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
            </div>
        </div>
    )
}

export default Page
