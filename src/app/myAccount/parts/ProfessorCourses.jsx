'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { globals } from '../../../../data/global'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice'
import { useSession } from 'next-auth/react'

export default function ProfessorCourses() {
  const colleges = useSelector((c) => c.colleges.colleges) || []
  const professorCourses = []
  const { data: session } = useSession();
  const user = session?.user
  const dispatch = useDispatch()
  colleges?.forEach((college) => {
    college.years.forEach((year) => {
      year.departments.forEach((dept) => {
        const currTerm = dept?.terms?.filter(d => d.term === globals?.term)
        currTerm.forEach((term) => {
          term.courses.forEach((course) => {
            if (course.professor === user.code) {
              professorCourses.push({
                ...course,
                college: college.college,
                year: year.cate,
                department: dept.name,
                term: term.term
              })
            }
          })
        })
      })
    })
  })

  const grouped = professorCourses.reduce((acc, course) => {
    if (!acc[course.college]) acc[course.college] = {}
    if (!acc[course.college][course.year]) acc[course.college][course.year] = {}
    if (!acc[course.college][course.year][course.department])
      acc[course.college][course.year][course.department] = []

    acc[course.college][course.year][course.department].push(course)
    return acc
  }, {})

  useEffect(() => {
    dispatch(fetchColleges())
  }, [dispatch])


  return (
    <div className="relative p-3 rounded-xl bg-white overflow-hidden pr-6">
      {Object.keys(grouped).map((collegeName) => (
        <div key={collegeName}>
          {Object.keys(grouped[collegeName]).map((yearName) => (
            <div key={yearName}>
              {Object.keys(grouped[collegeName][yearName]).map((dept) => (
                <div key={dept} className="mb-5">
                  <p className="font-bold text-lg mb-3">
                    السنة: {yearName} - {dept}
                  </p>

                  <ul className="gap-1 flex">
                    {grouped[collegeName][yearName][dept].map((course) => (
                      <Link
                        key={course.subCode}
                        href="/subject-management"
                        onClick={() =>
                          localStorage.setItem('subjectSavedCode', course.subCode)
                        }
                      >
                        <li className="bg-gray-400 hover:bg-gray-500 p-1 px-2 text-white rounded">
                          {course.subject}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
