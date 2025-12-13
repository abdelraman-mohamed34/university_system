'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import AssignmentMenu from './AssignmentMenu';
import { deleteAssignment } from '@/app/features/AsyncSlices/CollegeSlice';

export default function AssignmentContent({ assignment, setEditing }) {
    const [currentSubCode, setCurrentSubCode] = useState(null);
    const scrollRef = useRef(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();

    const colleges = useSelector((state) => state.colleges.colleges);
    const propId = searchParams.get('id');

    const images = Array.isArray(assignment.img)
        ? assignment.img
        : (assignment.img ? [assignment.img] : []);

    useEffect(() => {
        if (!propId || !colleges || colleges.length === 0) return;

        const assignmentId = Number(propId);

        outerLoop:
        for (const college of colleges) {
            for (const year of college.years || []) {
                for (const dept of year.departments || []) {
                    for (const term of dept.terms || []) {
                        for (const course of term.courses || []) {
                            const hasAssign = course.assignments?.some(a => a.id === assignmentId);
                            if (hasAssign) {
                                setCurrentSubCode(course.subCode);
                                break outerLoop;
                            }
                        }
                    }
                }
            }
        }
    }, [propId, colleges]);

    const handleDelete = () => {
        if (confirm("هل أنت متأكد من حذف هذا الواجب؟")) {
            dispatch(deleteAssignment({
                subCode: currentSubCode,
                assignmentId: assignment.id
            }));
            router.back();
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.offsetWidth * 0.8;
            current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <>
                <div className="bg-gradient-to-r from-[#4D44B5] to-[#6a5fdf] p-4 sm:p-6 text-white text-right flex justify-between items-center rounded-t-xl">
                    <div className="flex-1 ml-2">
                        <h1 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">{assignment.title}</h1>
                        <p className="text-xs sm:text-sm opacity-80">
                            نُشر في: {new Date(assignment.id).toLocaleDateString('ar-EG')}
                        </p>
                    </div>

                    {session?.user?.role === "teacher" && (
                        <div className="flex-shrink-0">
                            <AssignmentMenu
                                onEdit={() => setEditing(true)}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-6">
                    <div className="bg-gray-100/50 rounded-xl p-4 sm:p-5 border-r-4 sm:border-r-8 border-[#FCC43E] text-right shadow-inner mb-6">
                        <h2 className="text-base sm:text-lg font-bold text-[#303972] mb-2">وصف المهمة:</h2>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {assignment.question || 'لا توجد تفاصيل إضافية لهذا الواجب.'}
                        </p>
                    </div>

                    {images.length > 0 && (
                        <div className="mt-6 sm:mt-8 relative group/container">
                            <h3 className="text-right text-[#303972] font-bold mb-4 flex items-center justify-end gap-2 text-sm sm:text-base">
                                المرفقات ({images.length})
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </h3>

                            <div className="relative flex items-center px-0 sm:px-2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="absolute -left-2 z-30 p-2 bg-white/95 rounded-full shadow-md border border-gray-100 hidden sm:flex items-center justify-center hover:bg-[#4D44B5] hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div
                                    ref={scrollRef}
                                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar scroll-smooth items-center w-full min-h-[150px]"
                                >
                                    {images.map((src, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/image-preview?src=${encodeURIComponent(src)}`}
                                            className="shrink-0 snap-center relative group overflow-hidden rounded-2xl border border-gray-100 shadow-md bg-gray-50 max-w-[85%] sm:max-w-none"
                                        >
                                            <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none"></div>

                                            <img
                                                src={src}
                                                className="h-auto sm:max-h-[300px] max-h-[150px]  w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                                alt={`مرفق ${idx + 1}`}
                                            />

                                            <span className="absolute top-2 left-2 z-20 bg-black/40 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-md leading-none">
                                                {idx + 1} / {images.length}
                                            </span>

                                            <div className="absolute inset-0 hidden sm:flex items-center justify-center z-20 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scroll('right')}
                                    className="absolute -right-2 z-30 p-2 bg-white/95 rounded-full shadow-md border border-gray-100 hidden sm:flex items-center justify-center hover:bg-[#4D44B5] hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {images.length > 1 && (
                                <p className="text-center text-[10px] text-gray-400 mt-2 sm:hidden flex items-center justify-center gap-1">
                                    <span>اسحب لليمين أو اليسار للتنقل</span>
                                    <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </>
        </Suspense>

    );
}