'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/home-page/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColleges, postAssignment } from '../features/AsyncSlices/CollegeSlice.js'
import { useSession } from 'next-auth/react'
import { fetchCloudinary } from '../features/AsyncSlices/ImagesSlice'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'
import CurrentAssignments from './parts/CurrentAssignments'
import CurrentExams from './parts/CurrentExams'
import CurrentSubjectData from './parts/CurrentSubjectData'

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
    const [showAddAssignment, setShowAddAssignment] = useState(false)
    const [file, setFile] = useState('')
    const [image, setImage] = useState('')

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
            setEmptyQuestion(false);

            await dispatch(setShowSnackbar({
                state: true,
                message: 'تم رفع واجب جديد',
                severity: 'success',
            }));

            // window.location.reload();
        } catch (err) {
            console.error(err);
            await dispatch(setShowSnackbar({
                state: true,
                message: 'فشل رفع الواجب',
                severity: 'error',
            }));

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='lg:px-10 sm:py-5 pb-5 sm:px-7 px-2 pt-0 sm:pt-0'>
            <Header prop={'إعدادات المادة'} />
            <div className='w-full rounded-xl bg-white md:p-10 sm:p-5 p-4 shadow-2xl'>
                {currentCourse ? (
                    <div>
                        <div className='pb-4 mb-6 border-b border-gray-200'>
                            <h1 className='sm:text-3xl text-2xl font-extrabold mb-1 text-[#4D44B5]'>
                                {currentCourse.subject}
                            </h1>
                            <p className='sm:text-md text-sm text-gray-700 font-semibold mb-1'>
                                {currentCourse.college} | {currentCourse.department}
                            </p>
                            <div className='flex sm:text-sm text-xs text-gray-500 gap-4'>
                                <p>التيرم: {currentCourse.term}</p>
                                <p>السنة: {currentCourse.year}</p>
                            </div>
                        </div>

                        <CurrentAssignments showAddAssignment={showAddAssignment} setShowAddAssignment={setShowAddAssignment} />

                        {showAddAssignment && (
                            <div className='mt-5 pt-6 border-b border-gray-200 mb-15'>
                                <h2 className='text-xl font-bold mb-5 text-[#303972]'>إضافة واجب جديد:</h2>

                                <div className='gap-6 flex flex-col'>
                                    {/* حقل اسم الواجب */}
                                    <div>
                                        <input
                                            type="text"
                                            value={assignmentInput}
                                            onChange={e => { setAssignmentInput(e.target.value); setEmpty(false); }}
                                            // 💡 تم تحديث خصائص الـ Focus
                                            className={`w-full flex justify-center items-center px-6 py-3 border border-indigo-600 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${emptyQuestion ? 'border-red-500 border-2' : 'border-[#C1BBEB]'}`}
                                            placeholder='اسم/عنوان الواجب'
                                        />
                                        {empty && (<p className='text-red-500 text-xs mt-1 font-medium'>يرجى إدخال اسم الواجب</p>)}
                                    </div>

                                    {/* حقل السؤال */}
                                    <div>
                                        <textarea
                                            rows={3}
                                            value={assignmentInputQuestion}
                                            onChange={e => { setAssignmentInputQuestion(e.target.value); setEmptyQuestion(false); }}
                                            className={`w-full flex justify-center items-center px-6 py-3 border border-indigo-600  rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${emptyQuestion ? 'border-red-500 border-2' : 'border-[#C1BBEB]'}`}
                                            placeholder='نص السؤال أو وصفه'
                                        />
                                        {emptyQuestion && (<p className='text-red-500 text-xs mt-1 font-medium'>يرجى إدخال نص السؤال</p>)}
                                    </div>

                                    {/* حقل تحميل الصورة */}
                                    <div className='w-full'>
                                        {image ? (
                                            <div className='relative w-full lg:h-[300px] sm:h-[250px] h-[200px] border border-gray-300 rounded-md p-2'>
                                                <img className='w-full h-full object-contain rounded-md' src={image} alt="preview" />
                                                {/* زر إزالة الصورة */}
                                                <button
                                                    onClick={() => { setFile(''); setImage(''); }}
                                                    className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                                                    title="حذف الصورة"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="fileUpload"
                                                className="w-full lg:h-[300px] sm:h-[250px] h-[200px] rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#4D44B5] mb-2 opacity-70">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                                </svg>
                                                <span className="text-gray-600 font-medium">اضغط هنا لاختيار صورة الواجب (اختياري)</span>
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

                                {/* زر الإرسال */}
                                <button
                                    onClick={submit}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg mt-6 transition-all font-bold text-white shadow-lg ${loading ? 'bg-[#9d94ff] cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-[#3c358b] hover:shadow-xl'}`}
                                >
                                    {loading ? 'جاري رفع الواجب...' : 'رفع الواجب'}
                                </button>
                            </div>
                        )}

                        <CurrentExams />

                        <CurrentSubjectData />

                    </div>
                ) : (
                    <p className='p-5 text-center text-xl text-gray-500'>جاري تحميل بيانات المادة أو لا توجد مادة مُحددة.</p>
                )}
            </div>
        </div>
    )
}

export default Page