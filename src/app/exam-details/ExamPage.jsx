'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Header from '../components/home-page/Header'
import ExamQuestionSelect from './parts/ExamQuestionSelect'
import { deleteExam, fetchColleges } from '../features/AsyncSlices/CollegeSlice'
import AssignmentMenu from '../assignment-details/parts/AssignmentMenu'
import { useRouter } from 'next/navigation'
import { fetchStudents, solveTheExam } from '../features/AsyncSlices/StudentSlice'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

function ExamPage() {
    const colleges = useSelector(state => state.colleges.colleges)
    const students = useSelector(state => state.students.students)
    const searchParams = useSearchParams()
    const examId = searchParams.get('ei')
    const dispatch = useDispatch()
    const router = useRouter()

    const { data: session } = useSession()

    const [answers, setAnswers] = useState({})
    const [currentExam, setCurrentExam] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [currentStudent, setCurrentStudent] = useState(null)
    const [userExamSolved, setUserExamSolved] = useState(null)

    useEffect(() => {
        dispatch(fetchColleges())
        dispatch(fetchStudents())
    }, [dispatch])

    useEffect(() => {
        const findExam = (collegesData, examId) => {
            for (const college of collegesData) {
                for (const year of college.years || []) {
                    for (const dept of year.departments || []) {
                        for (const term of dept.terms || []) {
                            for (const course of term.courses || []) {
                                const exam = course.tests?.find(t => String(t.id) === String(examId))
                                if (exam) {
                                    return { exam: { ...exam, courseName: course.subject }, subjectId: course._id }
                                }
                            }
                        }
                    }
                }
            }
            return { exam: null, subjectId: null }
        }

        if (colleges.length > 0 && examId) {
            const { exam, subjectId } = findExam(colleges, examId)
            setCurrentExam(exam)
            setSubjectId(subjectId)

            if (exam?.questions) {
                const initialAnswers = exam.questions.reduce((acc, q, i) => {
                    const questionId = q.id || `q-${i + 1}`;
                    acc[questionId] = null;
                    return acc;
                }, {});
                setAnswers(initialAnswers);
            }
        }
    }, [colleges, examId])


    useEffect(() => {
        if (session?.user?.email && students.length > 0) {
            const student = students.find(s => s.email === session.user.email)
            setCurrentStudent(student)
        }
    }, [session, students])

    useEffect(() => {
        if (currentStudent && currentExam?.id) {
            const solvedExam = currentStudent.solutions?.find(solution => String(solution.examId) === String(currentExam.id));
            if (solvedExam) {
                setIsSubmitted(true);
                setUserExamSolved(solvedExam);
            } else {
                setIsSubmitted(false);
                setUserExamSolved(null);
            }
        }
    }, [currentStudent, currentExam]);


    const handleAnswerChange = (questionId, indexString) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: indexString,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!currentExam || !currentExam.questions) return

        const correctCount = currentExam.questions.reduce((acc, q, i) => {
            const questionId = q.id || `q-${i + 1}`
            const selectedIndexString = answers[questionId]
            return String(q.correctAnswerIndex) === selectedIndexString ? acc + 1 : acc
        }, 0)

        const finalScore = currentExam.maxMarks
            ? (currentExam.maxMarks / currentExam.questions.length) * correctCount
            : correctCount

        const answersArray = Object.entries(answers)
            .filter(([questionId, answerIndex]) => questionId && answerIndex !== null)
            .map(([questionId, answerIndex]) => ({
                questionId,
                answerIndex
            }));

        const req = {
            answers: answersArray,
            score: finalScore,
        }

        dispatch(solveTheExam({ data: req, examId }))
            .then(() => {
                dispatch(fetchStudents());
            })

        setIsSubmitted(true)
        setUserExamSolved({ submittedData: req });
    }

    if (!currentExam) {
        return <div className='text-center mt-6 text-gray-500'>جاري تحميل بيانات الاختبار...</div>
    }

    const dateToDisplay = currentExam.id ? new Date(currentExam.id) : null
    const formattedDate = dateToDisplay && !isNaN(dateToDisplay)
        ? dateToDisplay.toLocaleDateString('ar-EG')
        : 'التاريخ غير متوفر'

    const displayedScore = isSubmitted && userExamSolved?.submittedData?.score !== undefined ? userExamSolved.submittedData.score : 0;


    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='lg:px-10 sm:py-5 pb-5 pt-0 sm:pt-0 sm:px-7 px-2'
            >
                <Header prop={'حل الإختبار'} />
                <div className="bg-white rounded-2xl shadow-xl">

                    {!isSubmitted ? (
                        <>
                            <div className="bg-gradient-to-r from-[#4D44B5] to-[#6a5fdf] p-4 sm:p-6 text-white text-right flex justify-between items-center rounded-t-xl">
                                <div className="flex-1 ml-2">
                                    <div className='flex justify-between items-center'>
                                        <h1 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">
                                            {currentExam.header} - {currentExam.courseName}
                                        </h1>
                                        <AssignmentMenu onDelete={() => {
                                            dispatch(deleteExam({ examId, subjectId }))
                                            router.back()
                                        }} showEdit={false} />
                                    </div>
                                    <p className="text-xs sm:text-sm opacity-80">
                                        نُشر في: {formattedDate}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className='p-6'>
                                    {currentExam?.questions?.map((q, i) => {
                                        const questionId = q.id || `q-${i + 1}`
                                        const questionWithId = { ...q, id: questionId }
                                        return (
                                            <motion.div
                                                key={questionId}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                            >
                                                <ExamQuestionSelect
                                                    question={questionWithId}
                                                    onAnswerChange={handleAnswerChange}
                                                    initialAnswer={answers[questionId]}
                                                />
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                {
                                    session?.user.role === 'student' && (
                                        <div className="p-6 pt-0 flex justify-end border-t border-gray-100">
                                            <button
                                                type="submit"
                                                className="px-8 py-3 bg-[#4D44B5] text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-300 shadow-lg shadow-indigo-300/50"
                                            >
                                                إنهاء وتقديم الاختبار
                                            </button>
                                        </div>
                                    )
                                }
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                            className="p-8 bg-gray-50 text-right rounded-2xl"
                        >

                            <div className="text-center mb-6 p-4 bg-white border-4 border-indigo-500 rounded-xl shadow-md">
                                <p className="text-lg font-medium text-gray-700">النتيجة النهائية:</p>
                                <div className="text-4xl font-extrabold text-indigo-700 flex items-end justify-center">
                                    {displayedScore}/ <span className='text-3xl text-gray-600'>{currentExam.maxMarks}</span>
                                </div>
                            </div>

                            <p className="text-lg font-bold text-gray-800 mb-3">ملخص إجاباتك:</p>
                            <ul className="space-y-4 pr-0">
                                {currentExam.questions.map((q, idx) => {
                                    const questionId = q.id || `q-${idx + 1}`
                                    const displayId = questionId.toString().startsWith('q-') ? questionId.substring(2) : questionId

                                    // استخدام الإجابة المرسلة إذا كانت متوفرة، وإلا استخدام الـ answers الحالية
                                    const studentSolution = userExamSolved?.submittedData?.answers?.find(a => a.questionId === questionId);
                                    const selectedIndexString = studentSolution?.answerIndex || answers[questionId];

                                    let answerText = 'لم يتم الإجابة'
                                    let statusIcon = '❓'
                                    let statusClass = 'text-gray-500'

                                    const selectedIndex = parseInt(selectedIndexString)

                                    if (!isNaN(selectedIndex) && q.options && q.options[selectedIndex] !== undefined) {
                                        answerText = q.options[selectedIndex]

                                        if (String(q.correctAnswerIndex) === selectedIndexString) {
                                            statusIcon = '✅'
                                            statusClass = 'text-green-700'
                                        } else {
                                            statusIcon = '❌'
                                            statusClass = 'text-red-700'
                                        }
                                    }

                                    return (
                                        <motion.li
                                            key={questionId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                            className={`p-3 border-b border-gray-100 flex justify-between items-start ${statusClass} rounded-lg bg-white shadow-sm`}
                                        >
                                            <div className="flex-1 mr-3 text-right">
                                                <div className="text-base font-semibold text-gray-900 mb-1">
                                                    سؤال {displayId}:
                                                </div>
                                                <p className={`text-sm ${statusClass} font-bold`}>
                                                    إجابتك: {answerText}
                                                </p>

                                                {statusIcon === '❌' && q.options && q.options[q.correctAnswerIndex] !== undefined && (
                                                    <p className="text-xs text-green-500 mt-1 italic font-medium">
                                                        (الإجابة الصحيحة: {q.options[q.correctAnswerIndex]})
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-xl font-extrabold">{statusIcon}</div>
                                        </motion.li>
                                    )
                                })}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </Suspense>

    )
}

export default ExamPage