'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAssignment, EditAssignment, fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import Header from '../components/home-page/Header'
import { fetchStudents, postAssignmentSolution } from '../features/AsyncSlices/StudentSlice'
import { useSession } from 'next-auth/react'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchCloudinary } from '../features/AsyncSlices/ImagesSlice'
import { motion } from 'framer-motion'
import { Skeleton, Box } from '@mui/material'
import EditAssignmentModal from './EditAssignmentModal'

export default function AssignmentDetails() {
    const searchParams = useSearchParams()
    const propId = searchParams.get('id')

    const [assignment, setAssignment] = useState(null)
    const [currentSubCode, setCurrentSubCode] = useState(null)
    const [solutionText, setSolutionText] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [newTitle, setNewTitle] = useState("");
    const [editing, setEditing] = useState(false);
    const [newDeatails, setNewDeatails] = useState(false);

    const colleges = useSelector((c) => c.colleges.colleges) || []
    const students = useSelector((st) => st.students.students) || []
    const dispatch = useDispatch()
    const { data: session } = useSession();
    const user = session?.user
    const router = useRouter()

    useEffect(() => { dispatch(fetchColleges()) }, [dispatch])
    useEffect(() => { dispatch(fetchStudents()) }, [dispatch])

    useEffect(() => {
        if (!propId || colleges.length === 0) return

        let found = null
        outerLoop:
        for (const college of colleges) {
            for (const year of college.years) {
                for (const dept of year.departments) {
                    for (const term of dept.terms) {
                        for (const course of term.courses) {
                            if (!course.assignments) continue
                            const currentAssign = course.assignments.find(a => a.id === Number(propId))
                            if (currentAssign) {
                                found = currentAssign
                                setCurrentSubCode(course?.subCode)
                                break outerLoop
                            }
                        }
                    }
                }
            }
        }

        setAssignment(found)
    }, [propId, colleges])

    const submitSolution = async () => {
        if (!solutionText) {
            alert('يرجى إدخال نص الحل أو اختيار ملف')
            return
        }
        try {
            setLoading(true)
            await dispatch(postAssignmentSolution({
                id: propId,
                title: solutionText,
                subCode: currentSubCode,
                solvedAt: Date.now(),
            })).unwrap()
            setSolutionText('')
            setFile(null)
            setPreview('')
            dispatch(setShowSnackbar({
                state: true,
                message: 'تم ارسال الحل',
                severity: 'success',
            }))
            window.location.reload()
        } catch (err) {
            console.error(err)
            dispatch(setShowSnackbar({
                state: true,
                message: 'فشل إرسال الحل',
                severity: 'error',
            }))
        } finally {
            setLoading(false)
        }
    }

    // Skeleton Loader
    const SkeletonLoader = () => (
        <Box className="p-5 w-full max-w-4xl mx-auto">
            <Skeleton variant="text" height={40} sx={{ mb: 2, backgroundColor: '#F5F5F5' }} />
            <Skeleton variant="text" width="60%" height={25} sx={{ mb: 2, backgroundColor: '#F5F5F5' }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2, backgroundColor: '#F5F5F5' }} />
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="text" height={25} sx={{ mb: 1, backgroundColor: '#F5F5F5' }} />
            ))}
        </Box>
    )

    if (!assignment || !students.length || !user) return <SkeletonLoader />

    const currentStudent = students.find(st => st.code === user.code)
    const currentSol = currentStudent?.solutions?.find(s => s.id === Number(propId))
    const deleteSubject = () => {
        dispatch(deleteAssignment({
            subCode: currentSubCode,
            assignmentId: assignment.id,
        }))
        router.back()
    }

    const updateAssignment = async () => {
        try {
            let uploadedImageUrl = assignment.img
            if (file) {
                const resultImage = await dispatch(fetchCloudinary(file)).unwrap();
                uploadedImageUrl = resultImage?.url;
                console.log(uploadedImageUrl)
            }

            const updates = {
                ...assignment,
                ...(newTitle && newTitle.trim() !== '' && newTitle !== assignment.title
                    ? { title: newTitle }
                    : {}),
                ...(newDeatails && newDeatails.trim() !== '' && newDeatails !== assignment.deatails
                    ? { deatails: newDeatails }
                    : {}),
                ...(uploadedImageUrl !== assignment.img ? { img: uploadedImageUrl } : {}),
            };

            await dispatch(EditAssignment({
                subCode: currentSubCode,
                assignmentId: assignment.id,
                updates,
            })).unwrap();

            dispatch(setShowSnackbar({
                state: true,
                message: "تم تحديث الواجب",
                severity: "success",
            }));

            window.location.reload();

        } catch (error) {
            dispatch(setShowSnackbar({
                state: true,
                message: "فشل تحديث الواجب",
                severity: "error",
            }));
        }
    };

    // Motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };
    return (
        <motion.div
            className="lg:px-10 pb-5 sm:px-4 px-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Header prop='تفاصيل الواجب' />

            <motion.div variants={itemVariants} className="w-full mx-auto sm:px-4 p-3 py-6 bg-white rounded-md shadow-md">
                {/* تفاصيل الواجب */}
                <h1 className="text-2xl lg:text-3xl font-bold text-[#4D44B5] mb-3 truncate">{assignment.title}</h1>
                <p className="text-xs text-gray-500 mb-3">
                    تاريخ الإضافة: {new Date(assignment.id).toLocaleString('ar-EG')}
                </p>


                <div className="mt-4 p-4 bg-[#F3F4FF] rounded shadow-inner mb-6">
                    <h2 className="text-lg lg:text-xl font-semibold mb-2 text-[#4D44B5]">تفاصيل الواجب:</h2>
                    <p className="text-gray-700 text-sm lg:text-base">
                        {assignment.deatails || 'لا توجد تفاصيل إضافية للواجب.'}
                    </p>
                </div>

                {assignment.img && (
                    <div className="my-4">
                        <Link href={`/image-preview?src=${assignment.img}`}>
                            <img
                                src={assignment.img}
                                alt={assignment.title}
                                className="w-full max-h-80 object-contain bg-[#F3F4FF] shadow-inner rounded"
                            />
                        </Link>
                    </div>
                )}

                {user?.role === 'student' && (
                    <div>
                        {currentSol ? (
                            <div className="mt-4">
                                <h2 className="text-lg lg:text-xl font-semibold mb-2 text-[#4D44B5]">الحل :</h2>
                                <p className="bg-gray-100 p-2 rounded text-sm lg:text-base wrap-break-word">{currentSol.title}</p>
                            </div>
                        ) : (
                            <div className="mt-4 p-4 bg-[#F3F4FF] rounded shadow-inner">
                                <h2 className="text-lg lg:text-xl font-semibold mb-3 text-[#4D44B5]">حل الواجب:</h2>
                                <textarea
                                    className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4D44B5] resize-none text-sm lg:text-base"
                                    placeholder="اكتب حلك هنا..."
                                    value={solutionText}
                                    onChange={(e) => setSolutionText(e.target.value)}
                                    rows={4}
                                />
                                <div className="mb-4">
                                    {preview ? (
                                        <img src={preview} className="w-full max-h-40 object-contain mb-2 rounded" alt="preview" />
                                    ) : (
                                        <label
                                            htmlFor="fileUpload"
                                            className="w-full sm:min-h-[250px] min-h-[150px] rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 transition-colors duration-200"
                                        >
                                            <span className="text-gray-500 text-sm lg:text-base">اضغط هنا لاختيار صورة</span>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f = e.target.files[0]
                                                    setFile(f)
                                                    if (f) setPreview(URL.createObjectURL(f))
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <button
                                    onClick={submitSolution}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded w-full text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-[#3c358b]'}`}
                                >
                                    {loading ? 'جاري الإرسال...' : 'إرسال الحل'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {user?.role?.trim() === "teacher" && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => {
                                setNewTitle(assignment.title);
                                setNewDeatails(assignment.deatails);
                                setEditing(true);
                            }}
                            className="flex-1 px-4 py-2 gap-2 flex justify-center items-center rounded border border-[#]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            تعديل الواجب
                        </button>

                        <button
                            onClick={deleteSubject}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                )}

                {editing && (
                    <EditAssignmentModal
                        assignment={assignment}
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                        file={file}
                        newDeatails={newDeatails}
                        setNewDeatails={setNewDeatails}
                        setFile={setFile}
                        preview={preview}
                        setPreview={setPreview}
                        updateAssignment={updateAssignment}
                        onClose={() => setEditing(false)}
                    />
                )}

            </motion.div>
        </motion.div>
    )
}
