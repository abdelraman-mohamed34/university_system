'use client'
import { postSubjectData } from '@/app/features/AsyncSlices/CollegeSlice'
import { setShowSnackbar } from '@/app/features/NormalSlices/snackSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { ImSpinner2 } from 'react-icons/im'
import { MdOutlinePictureAsPdf } from 'react-icons/md'
import { HiOutlinePhotograph } from 'react-icons/hi'

// منطق استخراج بيانات المادة
const getCourseByCode = (colleges, subCode) => {
    if (!colleges?.length || !subCode) return null
    for (const college of colleges) {
        for (const year of college.years) {
            for (const dept of year.departments) {
                for (const term of dept.terms) {
                    const course = term.courses.find(c => c.subCode === subCode)
                    if (course) {
                        return {
                            ...course,
                            data: course.data || [],
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

// دالة الأيقونة
const getFileIcon = (mimeType) => {
    if (mimeType.includes('image/')) {
        return <HiOutlinePhotograph className='w-5 h-5 text-green-500' />;
    }
    if (mimeType.includes('pdf')) {
        return <MdOutlinePictureAsPdf className='w-5 h-5 text-red-500' />;
    }
    return null;
}

const initialUploaded = {
    title: '',
    content: '',
    images: [],
}


function CurrentSubjectData() {
    const colleges = useSelector(state => state.colleges.colleges)
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const inputRef = useRef(null)

    const [showAddNewData, setShowAddNewData] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [saved, setSaved] = useState(null)
    const [uploaded, setUploaded] = useState(initialUploaded)

    useEffect(() => {
        const savedCode = localStorage.getItem('subjectSavedCode')
        setSaved(savedCode)
    }, [])

    const currentCourse = useMemo(() => {
        if (saved && colleges.length > 0) {
            return getCourseByCode(colleges, saved)
        }
        return null
    }, [saved, colleges])

    if (!currentCourse) {
        return <div className='mt-6 text-gray-500 text-center'>جاري تحميل البيانات...</div>
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUploaded(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            // في مشروع حقيقي، ستحتاج لرفع الملف الفعلي هنا أولاً للحصول على URL حقيقي
            url: `/api/upload-placeholder/${file.name}`
        }))
        setUploaded(prev => ({ ...prev, images: files }))
    }

    const handleAddNewData = (e) => {
        e.preventDefault()

        if (!uploaded.title || !uploaded.content) {
            dispatch(setShowSnackbar({
                show: true,
                message: 'الرجاء إدخال عنوان ووصف المحتوى.',
                type: 'error'
            }))
            return
        }

        setIsSubmitting(true)

        // محاكاة لعملية الإرسال
        try {
            // ملاحظة: postSubjectData يجب أن يتم تصميمه ليتعامل مع الـ uploaded object
            dispatch(
                postSubjectData({
                    subCode: saved,
                    uploaded,
                    // إذا كان الخادم يتوقع الـ URL الخاص بالمستخدم
                    userUrl: session?.user?.image,
                    userName: session?.user?.name
                })
            )

            dispatch(setShowSnackbar({
                show: true,
                message: 'تم إضافة المحتوى بنجاح',
                type: 'success',
            }))

            setUploaded(initialUploaded)
            setShowAddNewData(false)

        } catch (err) {
            dispatch(setShowSnackbar({
                show: true,
                message: err?.message || 'فشل في إضافة المحتوى',
                type: 'error',
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='mt-6 text-right' dir="rtl">
            {/* العنوان وزر الإضافة */}
            <div className="flex justify-between items-center mb-6">
                <h2 className='sm:text-2xl font-extrabold text-[#303972]'>
                    محتوي المادة: {currentCourse.name}
                </h2>

                {(session?.user?.role === "teacher" || session?.user?.role === "admin") && (
                    <motion.button
                        onClick={() => {
                            setShowAddNewData(!showAddNewData)
                            if (showAddNewData) setUploaded(initialUploaded)
                        }}
                        className='flex items-center justify-center w-8 h-8 rounded-full bg-[#4D44B5] text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2'
                        whileHover={{ scale: 1.1, rotate: showAddNewData ? 45 : 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <BiPlus className={`w-6 h-6 transition-transform duration-300 ${showAddNewData ? 'rotate-45' : ''}`} />
                    </motion.button>
                )}
            </div>

            {/* عرض المحتوى الحالي */}
            {currentCourse.data.length > 0 ? (
                <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-4 bg-[#F3F4FF] p-4 rounded-lg max-h-[400px] overflow-y-auto custom-scrollbar'>
                    {currentCourse.data.map((d, index) => (
                        <motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link href={`/subjects/data?s=${currentCourse.subCode}&d=${d.id}`}>
                                <div className='relative p-4 pr-10 rounded-xl bg-white shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer border-r-5 border-[#4D44B5]'>
                                    <div className='font-bold text-[#303972] truncate'>{d.title}</div>
                                    <div className='text-xs text-gray-500 mt-1 flex gap-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#FCC43E]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        {new Date(d.createdAt).toLocaleString('ar-EG', { timeZone: 'UTC' })}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 p-4 bg-[#F3F4FF] rounded-lg'>
                    لا يوجد محتوى منشور بعد لهذه المادة.
                </p>
            )}

            <AnimatePresence>
                {showAddNewData && (
                    <motion.form
                        onSubmit={handleAddNewData}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className='mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4 border border-indigo-200'
                    >
                        <h3 className='text-xl font-bold text-[#4D44B5] border-b border-gray-200 pb-3'>إضافة محتوى جديد للمادة</h3>

                        <div>
                            <label className='block text-sm font-medium mb-2 text-gray-700'>عنوان المحتوى *</label>
                            <input
                                name="title"
                                value={uploaded.title}
                                onChange={handleChange}
                                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* حقل الوصف */}
                        <div>
                            <label className='block text-sm font-medium mb-2 text-gray-700'>وصف المحتوى *</label>
                            <textarea
                                name="content"
                                value={uploaded.content}
                                onChange={handleChange}
                                rows={4}
                                className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500'
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className='border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50'>
                            <label className='cursor-pointer flex items-center justify-between'>
                                <span className='text-gray-700 font-medium'>📂 رفع ملفات (صور أو PDF)</span>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*, application/pdf"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </label>

                            {/* عرض الملفات المرفوعة */}
                            {uploaded.images.length > 0 && (
                                <ul className='mt-3 space-y-1 text-sm text-gray-600'>
                                    {uploaded.images.map((file, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className='flex items-center gap-2 border-t border-gray-200 pt-3'
                                        >
                                            {getFileIcon(file.type)}
                                            <span className='truncate max-w-xs'>{file.name}</span>
                                            <span className='text-xs text-gray-400'>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='pt-2 flex gap-3'>
                            <motion.button
                                type="submit"
                                className={`flex-1 py-3 text-white font-bold rounded-lg flex justify-center gap-2 transition duration-200 ${isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-[#392F9E]'
                                    }`}
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            >
                                {isSubmitting && <ImSpinner2 className="animate-spin w-5 h-5" />}
                                {isSubmitting ? 'جاري الإضافة...' : 'إضافة المحتوى'}
                            </motion.button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddNewData(false)
                                    setUploaded(initialUploaded)
                                }}
                                className='px-4 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition duration-200'
                                disabled={isSubmitting}
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

        </div>
    )
}

export default CurrentSubjectData