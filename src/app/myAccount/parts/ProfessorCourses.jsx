'use client'

import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { globals } from '../../../../data/global'
import { motion } from 'framer-motion'
import { BiBookOpen, BiBuilding, BiLayer, BiChevronLeft, BiGroup } from "react-icons/bi";

export default function ProfessorCourses() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const colleges = useSelector((state) => state.colleges?.colleges ?? [])
  const currenTerm = globals.term

  useEffect(() => {
    dispatch(fetchColleges())
  }, [dispatch])

  const professorCourses = useMemo(() => {
    if (!user) return []
    const result = []
    colleges.forEach(college => {
      const collegeName = college.college;
      college.years.forEach(year => {
        const yearName = year.cate;
        year.departments.forEach(dept => {
          const deptName = dept.name;
          const filteredTerms = dept.terms?.filter(t => t.term === currenTerm);

          filteredTerms?.forEach(term => {
            const termName = term.term;
            term.courses.forEach(course => {
              if (course.professor === user.code || (Array.isArray(course.professor) && course.professor.includes(user.code))) {
                result.push({
                  ...course,
                  college: collegeName,
                  year: yearName,
                  department: deptName,
                  term: termName
                })
              }
            })
          })
        })
      })
    })
    return result
  }, [colleges, user, currenTerm])

  const grouped = useMemo(() => {
    return professorCourses.reduce((acc, course) => {
      if (!acc[course.college]) acc[course.college] = {}
      if (!acc[course.college][course.year]) acc[course.college][course.year] = {}
      if (!acc[course.college][course.year][course.department])
        acc[course.college][course.year][course.department] = []
      acc[course.college][course.year][course.department].push(course)
      return acc
    }, {})
  }, [professorCourses])

  const handleClick = (subCode) => {
    localStorage.setItem('subjectSavedCode', subCode)
    router.push('/subject-management')
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="mx-auto">

        {Object.keys(grouped).length === 0 ? (
          <div className='bg-white p-20 rounded-3xl text-center shadow-sm'>
            <p className="text-gray-400 font-bold text-lg">لا توجد مواد مُسندة إليك حاليًا في هذا الفصل.</p>
          </div>
        ) : (
          Object.keys(grouped).map((collegeName) => (
            <motion.div
              key={collegeName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-8'
            >
              {/* College Heading */}
              <div className='flex items-center gap-2 mb-4'>
                <BiBuilding className='text-[#FCC43E] text-2xl' />
                <h2 className='text-xl font-black text-[#303972] uppercase tracking-wide'>{collegeName}</h2>
              </div>

              {Object.keys(grouped[collegeName]).map((yearName) => (
                <div key={yearName} className='bg-white sm:rounded-3xl rounded-xl p-6 shadow-sm border border-gray-50'>
                  <div className='flex items-center gap-3 mb-6 border-b border-gray-50 pb-4'>
                    <div className='w-2 h-6 bg-[#FB7D5B] rounded-full' />
                    <h3 className='text-lg font-bold text-[#303972]'>{yearName}</h3>
                  </div>

                  {Object.keys(grouped[collegeName][yearName]).map((departmentName) => (
                    <div key={departmentName} className="mb-6 last:mb-0">
                      <div className='flex items-center gap-2 text-[#A098AE] text-sm font-bold mb-4 pr-2'>
                        <BiLayer /> <span>القسم: {departmentName}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {grouped[collegeName][yearName][departmentName].map((course) => (
                          <motion.div
                            key={course.subCode}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleClick(course.subCode)}
                            className="group relative bg-gray-50 p-5 rounded-2xl cursor-pointer transition-all hover:bg-white hover:shadow-xl border border-transparent hover:border-[#4D44B5]/20"
                          >
                            <div className='absolute top-4 left-4 text-[#A098AE] group-hover:text-[#4D44B5] transition-colors'>
                              <BiChevronLeft className='text-2xl' />
                            </div>

                            <div className='flex items-center gap-4'>
                              <div className='w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#4D44B5] text-xl transition-colors group-hover:bg-[#4D44B5] group-hover:text-white'>
                                <BiBookOpen />
                              </div>
                              <div className='flex-1'>
                                <h6 className="font-bold text-[#303972] text-md mb-1 group-hover:text-[#4D44B5]">{course.subject}</h6>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}