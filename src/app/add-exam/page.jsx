'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BiTime, BiBookOpen, BiCheckCircle, BiHash } from 'react-icons/bi';
import Header from '../components/home-page/Header';
import MultipleChoiceForm from './parts/MultipleChoiceForm';
import { addExam } from '../features/AsyncSlices/CollegeSlice';
import { setShowSnackbar } from '../features/NormalSlices/snackSlice';
import { useRouter } from 'next/navigation';

const InputGroup = ({ label, id, type, value, onChange, required, placeholder, icon }) => (
    <div className='flex flex-col space-y-1'>
        <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {React.cloneElement(icon, { className: 'w-4 h-4 text-[#FCC43E]' })}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4D44B5] focus:border-[#4D44B5] transition duration-150 text-right"
            min={type === 'number' ? '0' : undefined}
        />
    </div>
);

const initialQuestion = {
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
};

function AddExamPage() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const subjectId = searchParams.get('si');
    const router = useRouter();
    const [mcqQuestions, setMcqQuestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState([initialQuestion]);

    const [formData, setFormData] = useState({
        header: '',
        type: 'multiple-choice',
        duration: '',
        maxMarks: '',
        notes: '',
        createdAt: Date().now,
        questions, // true

        mcqQuestions, // as a test
    });

    const addQuestion = () => {
        setQuestions(prev => [...prev, { ...initialQuestion }]);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleQuestionsUpdate = (questions) => {
        setMcqQuestions(questions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newExamData = {
            ...formData,
            questions: questions,
            createdAt: new Date().toISOString(),
            duration: parseInt(formData.duration),
            maxMarks: parseInt(formData.maxMarks),
        };

        dispatch(addExam({ req: newExamData, si: subjectId }));
        dispatch(setShowSnackbar({ state: true, message: 'تم إضافة الاختبار بنجاح!', severity: 'success' }));

        setTimeout(() => setIsSubmitting(false), 1500);
        router.back();
    };


    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <div dir='rtl' className='lg:px-10 sm:px-7 sm:py-5 pb-5 px-2 bg-gray-50 min-h-screen'>
                <Header prop={'إضافة إختبار جديد'} />
                <motion.div
                    className="flex flex-col bg-white w-full p-4 sm:p-8 rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className='text-gray-600 mb-6 border-b pb-4'>
                        يرجى ملء جميع الحقول المطلوبة لإعداد الاختبار الجديد.
                    </p>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

                        <InputGroup label="عنوان الاختبار" id="header" type="text" value={formData.header} onChange={handleChange} required placeholder="مثال: اختبار منتصف الفصل" icon={<BiBookOpen />} />

                        <div className='flex flex-col space-y-1'>
                            <label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <BiCheckCircle className="w-4 h-4 text-[#FCC43E]" />
                                نوع الأسئلة الأساسي
                            </label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4D44B5] focus:border-[#4D44B5] transition duration-150 bg-white"
                            >
                                <option value="multiple-choice">اختيار من متعدد</option>
                                <option value="essay">مقالي</option>
                                <option value="mixed">مختلط (مقالي واختيار)</option>
                            </select>
                        </div>

                        <InputGroup label="مدة الاختبار (بالدقائق)" id="duration" type="number" value={formData.duration} onChange={handleChange} required placeholder="مثال: 120" min="10" icon={<BiTime />} />

                        <InputGroup label="الدرجة القصوى للاختبار" id="maxMarks" type="number" value={formData.maxMarks} onChange={handleChange} required placeholder="مثال: 50" min="1" icon={<BiHash />} />


                        <div className="md:col-span-2 flex flex-col space-y-1">
                            <label htmlFor="notes" className="text-sm font-medium text-gray-700">ملاحظات للمنظمين (اختياري)</label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4D44B5] focus:border-[#4D44B5] transition duration-150 resize-none"
                                placeholder="مثال: يجب التنسيق مع قسم الصيانة لتجهيز القاعات."
                            ></textarea>
                        </div>

                        {(formData.type === 'multiple-choice' || formData.type === 'mixed') && (
                            <div className="md:col-span-2">
                                <MultipleChoiceForm onQuestionsChange={handleQuestionsUpdate} setQuestions={setQuestions} questions={questions} addQuestion={addQuestion} />
                            </div>
                        )}


                        <div className="md:col-span-2 flex justify-end pt-4 border-t mt-4">
                            <motion.button
                                type="submit"
                                className={`flex items-center gap-2 px-8 py-3 font-bold text-white rounded-lg shadow-lg transition duration-300 ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-indigo-700'}`}
                                whileHover={isSubmitting ? {} : { scale: 1.05 }}
                                whileTap={isSubmitting ? {} : { scale: 0.95 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري الإضافة...' : 'حفظ وإضافة الاختبار'}
                            </motion.button>
                        </div>
                    </form>

                </motion.div>
            </div>
        </Suspense>

    );
}

export default AddExamPage;