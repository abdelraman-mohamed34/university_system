'use client';
import Header from '@/app/components/home-page/Header';
import { deleteData, fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AssignmentMenu from '@/app/assignment-details/parts/AssignmentMenu';
import { setShowSnackbar } from '@/app/features/NormalSlices/snackSlice';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const findDataInColleges = (colleges, subCode, dataCode) => {
    if (!colleges?.length || !subCode || !dataCode) return null;
    for (const college of colleges) {
        for (const year of college.years ?? []) {
            for (const dept of year.departments ?? []) {
                for (const term of dept.terms ?? []) {
                    const course = term.courses?.find(c => c.subCode === subCode);
                    if (!course) continue;

                    const data = course.data?.find(d => d.id === dataCode);
                    if (data) return data;
                }
            }
        }
    }
    return null;
};

function Data() {
    const { colleges, status } = useSelector(c => c.colleges);
    const { data: session } = useSession()
    const dispatch = useDispatch();
    const router = useRouter()
    const searchParams = useSearchParams();
    const savedSubjectCode = searchParams.get('s');
    const savedDataCode = searchParams.get('d');

    useEffect(() => {
        dispatch(fetchColleges());
    }, [dispatch]);

    const dataFound = useMemo(() => {
        if (status !== 'succeeded' || !colleges?.length) return null;
        return findDataInColleges(colleges, savedSubjectCode, savedDataCode);
    }, [colleges, savedSubjectCode, savedDataCode, status]);


    if (status === 'loading') {
        return (
            <div className='flex justify-center items-center h-screen'>
                <motion.div
                    className='w-12 h-12 border-4 border-t-4 border-t-indigo-600 border-gray-200 rounded-full'
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className='mr-4 text-lg text-gray-600'>جاري تحميل محتوى المادة...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return <div className='text-red-600 p-5 text-center bg-white rounded-lg shadow-md mt-10'>حدث خطأ أثناء جلب بيانات الكليات. الرجاء المحاولة لاحقاً.</div>;
    }

    if (!dataFound) {
        return (
            <div className='p-10 text-center text-gray-600 bg-white rounded-lg shadow-md mt-10'>
                عفواً، لم يتم العثور على المحتوى المطلوب لهذه المادة.
            </div>
        );
    }

    const formattedDate = dataFound?.createdAt
        ? new Date(dataFound.createdAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'غير متوفر';

    const handleDownload = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name || 'ملف_المادة';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='lg:px-10 sm:px-7 sm:py-5 pb-5 px-2 pt-0 sm:pt-0'>
            <Header prop={'محتوي المادة'} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='rounded-2xl bg-white overflow-hidden shadow-xl'
            >
                {/* Header Section */}
                <section className='bg-[#4D44B5] text-white rounded-t-2xl p-5 py-8'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl font-extrabold mb-1'>
                            {dataFound?.title}
                        </h1>

                        {(session?.user?.role === 'teacher' || session?.user?.role === 'admin') && (
                            <AssignmentMenu showEdit={false} onDelete={() => {
                                dispatch(deleteData({ savedDataCode, savedSubjectCode }))
                                router.back()
                                dispatch(setShowSnackbar({
                                    state: true,
                                    message: 'تم حذف المحتوي',
                                    severity: 'success',
                                }))
                            }} />
                        )}

                    </div>
                    <p className='text-sm text-indigo-200'>
                        تاريخ الإنشاء: {formattedDate}
                    </p>
                </section>

                {/* Content Section */}
                <div className='p-6'>
                    {dataFound?.content ? (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 leading-relaxed text-lg'>
                            <p>{dataFound.content}</p>
                        </div>
                    ) : (
                        <div className='text-center text-gray-500 italic p-4 border border-dashed rounded-lg'>
                            لا يوجد محتوى نصي مفصل حالياً لهذه المادة.
                        </div>
                    )}

                    {dataFound?.images?.length > 0 && (
                        <div className='mt-8 pt-4 border-t border-gray-200'>
                            <h3 className='text-xl font-semibold text-gray-700 mb-4'>📄 المرفقات</h3>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {dataFound.images.map((file, index) => (
                                    <motion.div
                                        key={index}
                                        onClick={() => handleDownload(file.url, file.name)}
                                        className='flex flex-col items-center p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-100 transition duration-200 cursor-pointer'
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span className='text-3xl'>{file.type?.includes('pdf') ? '📄' : '🖼️'}</span>
                                        <span className='text-xs text-center mt-1 truncate w-full'>{file.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default Data;
