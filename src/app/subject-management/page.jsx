'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/home-page/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColleges, postAssignment } from '../features/AsyncSlices/CollegeSlice'
import { useSession } from 'next-auth/react'
import { fetchCloudinary } from '../features/AsyncSlices/ImagesSlice'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'

function Page() {
    const { data: session } = useSession()
    const user = session?.user

    const dispatch = useDispatch()
    const colleges = useSelector(state => state.colleges.colleges)
    const [currentCourse, setCurrentCourse] = useState(null)
    const [saved, setSaved] = useState(null)
    const [assignmentInput, setAssignmentInput] = useState('')
    const [assignmentInputQuestion, setAssignmentInputQuestion] = useState('')
    const [empty, setEmpty] = useState(false)
    const [emptyQuestion, setEmptyQuestion] = useState(false)

    const [file, setFile] = useState('')
    const [image, setImage] = useState('') // link og image

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const savedCode = localStorage.getItem('subjectSavedCode')
        setSaved(savedCode)
        dispatch(fetchColleges())
    }, [dispatch])

    const getCourseByCode = (subCode) => {
        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        const course = term.courses.find(c => c.subCode === subCode)
                        if (course) {
                            return {
                                ...course,
                                assignments: course.assignments || [],
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

    useEffect(() => {
        if (saved && colleges.length > 0) {
            const course = getCourseByCode(saved)
            setCurrentCourse(course)
        }
    }, [colleges, saved])

    const submit = async () => {
        if (assignmentInput.trim() === "") {
            setEmpty(true);
            return;
        }
        if (assignmentInputQuestion.trim() === "") {
            setEmptyQuestion(true);
            return;
        }

        let imageUrl = null;

        try {
            setLoading(true);

            if (file) {
                const result = await dispatch(fetchCloudinary(file)).unwrap();
                imageUrl = result?.url || '';
            }

            await dispatch(postAssignment({
                subCode: saved,
                title: assignmentInput.trim(),
                question: assignmentInputQuestion.trim(),
                img: imageUrl || '',
            }));

            // reset fields
            setAssignmentInput('');
            setFile('');
            setImage('');
            setAssignmentInputQuestion('');
            setEmpty(false);

            await dispatch(setShowSnackbar({
                state: true,
                message: 'تم رفع واجب جديد',
                severity: 'success',
            }));

            window.location.reload();

        } catch (err) {
            console.error(err);
            alert('فشل رفع الصورة');

        } finally {
            setLoading(false); // ✅ المكان الصحيح
        }
    };


    return (
        <div className='lg:px-10 sm:py-5 pb-5 sm:px-7 px-2'>
            <Header prop={'اعدادات المادة'} />
            <div className='w-full rounded-xl bg-white md:p-10 sm:p-5 p-3 shadow-lg'>
                {currentCourse ? (
                    <div>
                        <h1 className='text-2xl font-bold mb-2 text-[#4D44B5]'>
                            اسم المادة: {currentCourse.subject}
                        </h1>
                        <p className='font-bold'>{currentCourse.college} - {currentCourse.department}</p>
                        <p>التيرم: {currentCourse.term}</p>
                        <p>السنة: {currentCourse.year}</p>

                        {/* الواجبات */}
                        <div className='mt-6'>
                            <h2 className='text-xl font-semibold mb-4 text-[#4D44B5]'>الواجبات الحالية:</h2>
                            {currentCourse.assignments.length > 0 ? (
                                <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-5 gap-2 bg-[#F3F4FF] sm:p-5 p-3 sm:max-h-[500px] max-h-[250px] overflow-y-scroll hide-scrollbar shadow-inner'>
                                    {currentCourse.assignments.map((a) => (
                                        <Link
                                            href={`/assignment-details?id=${a.id}`}
                                            key={a.id}
                                        >
                                            <motion.ul
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className='relative p-3 pb-2 pr-9 rounded-md bg-white shadow-md overflow-hidden max-h-[150px]'
                                            >
                                                <span className='absolute w-4 h-full right-0 top-0 bg-[#4D44B5]' />
                                                <li className='text-lg font-semibold truncate'>{a.title}</li>
                                                <li className='text-sm text-gray-500 flex items-center gap-1'>
                                                    {new Date(a.id).toLocaleString('ar-EG')}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#FCC43E]">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </li>
                                            </motion.ul>
                                        </Link>

                                    ))}
                                </div>
                            ) : (
                                <p>لا توجد واجبات</p>
                            )}
                        </div>

                        {/* إضافة واجب */}
                        <div className='mt-8'>
                            <h2 className='text-xl font-semibold mb-3 text-[#4D44B5]'>إضافة واجب جديد:</h2>

                            <div className='gap-5 flex flex-col'>
                                <div>
                                    <input
                                        type="text"
                                        value={assignmentInput}
                                        onChange={e => setAssignmentInput(e.target.value)}
                                        className={`w-full border p-3 rounded-md border-[#C1BBEB] focus:outline-[#C1BBEB] ${empty && 'border-red-500 border-2 focus:outline-red-500'}`}
                                        placeholder='اسم الواجب'
                                    />
                                    {empty && (<p className='text-red-500 text-xs mt-1'>يرجي ادخال اسم الواجب</p>)}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={assignmentInputQuestion}
                                        onChange={e => setAssignmentInputQuestion(e.target.value)}
                                        className={`w-full border p-3 rounded-md border-[#C1BBEB] focus:outline-[#C1BBEB] ${emptyQuestion && 'border-red-500 border-2 focus:outline-red-500'}`}
                                        placeholder='السؤال'
                                    />
                                    {emptyQuestion && (<p className='text-red-500 text-xs mt-1'>يرجي ادخال السؤال</p>)}
                                </div>

                                <div className='w-full lg:h-[300px] sm:h-[250px] h-[200px]'>
                                    {image ? (
                                        <img className='w-full h-full object-contain rounded-md' src={image} alt="preview" /> // preview
                                    ) : (
                                        <label
                                            htmlFor="fileUpload"
                                            className="w-full h-full rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-500 mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <span className="text-gray-500">اضغط هنا لاختيار صورة</span>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const currentFile = e.target.files[0]
                                                    setFile(currentFile)
                                                    if (currentFile) setImage(URL.createObjectURL(currentFile))
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>

                            </div>

                            <button
                                onClick={submit}
                                disabled={loading}
                                className={`w-full py-3 rounded-md mt-3 transition-all font-semibold text-white ${loading ? 'bg-[#9d94ff] cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-[#3c358b]'}`}
                            >
                                {loading ? 'جاري الرفع...' : 'رفع'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>لا توجد مادة</p>
                )}
            </div>
        </div >
    )
}

export default Page
