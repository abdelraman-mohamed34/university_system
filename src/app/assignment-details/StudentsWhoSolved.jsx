'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { useSearchParams } from 'next/navigation'

function StudentsWhoSolved() {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const pathId = searchParams.get('id')
    const students = useSelector(st => st.students.students) || []

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchStudents())
    }, [dispatch])

    // تحسين الأداء: استخدام useMemo لمنع إعادة الحساب عند كل تغيير بسيط
    const solvedList = useMemo(() => {
        return students
            .map(st => {
                const solution = st.solutions?.find(sol => sol.id === Number(pathId))
                return solution ? { student: st, solution } : null
            })
            .filter(Boolean)
    }, [students, pathId])

    const filteredStudents = useMemo(() => {
        return solvedList.filter(({ student }) =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [solvedList, searchTerm])

    if (solvedList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center sm:py-12 py-5 px-4 bg-gray-100/50 rounded-2xl shadow-inner">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-gray-600 font-bold text-lg mb-1">لا يوجد منجزون</h3>
                <p className="text-gray-400 text-sm text-center max-w-[250px]">
                    لم يقم أي طالب بتسليم حل لهذا الواجب حتى الآن.
                </p>
            </div>
        )
    }

    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <div className="p-2 sm:p-4 mx-auto rounded-2xl bg-gray-100/50 shadow-inner">
                <div className="relative mb-6 group">
                    <input
                        type="text"
                        placeholder="ابحث عن اسم الطالب..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-white pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-[#4D44B5]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 left-2 flex items-center px-2 text-gray-300 hover:text-red-400 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        </button>
                    )}
                </div>

                <ul className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(({ student }) => (
                            <li
                                key={student.code}
                                className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:border-[#4D44B5]/30 hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer"
                            >
                                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#4D44B5] to-[#6a5fdf] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white ring-offset-1">
                                    {student.fullName.substring(0, 1)}
                                </div>

                                <div className="flex flex-col min-w-0 flex-1 text-right">
                                    <span className="text-gray-800 font-bold text-sm truncate group-hover:text-[#4D44B5] transition-colors">
                                        {student.fullName}
                                    </span>
                                    <span className="text-gray-400 text-[10px] mt-0.5">
                                        كود: {student.code}
                                    </span>
                                </div>

                                <div className="mr-auto shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                    <span className="text-[10px] text-[#4D44B5] bg-[#4D44B5]/10 px-2 py-1 rounded-full font-bold">
                                        عرض الحل
                                    </span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50/30 rounded-xl">
                            <p className="text-gray-400 text-sm">لا يوجد نتائج لهذا البحث</p>
                        </div>
                    )}
                </ul>
            </div>
        </Suspense>
    )
}

export default StudentsWhoSolved