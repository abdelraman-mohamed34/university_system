'use client'
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiPlus, BiTrash, BiQuestionMark, BiPencil, BiCheckCircle } from 'react-icons/bi';


function MultipleChoiceForm({ onQuestionsChange, questions, setQuestions, addQuestion }) {

    const removeQuestion = (indexToRemove) => {
        setQuestions(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = questions.map((q, i) => {
            if (i === index) {
                return { ...q, [field]: value };
            }
            return q;
        });
        setQuestions(newQuestions);
        onQuestionsChange(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = questions.map((q, i) => {
            if (i === qIndex) {
                const newOptions = [...q.options];
                newOptions[oIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        });
        setQuestions(newQuestions);
        onQuestionsChange(newQuestions);
    };

    return (
        <div className="mt-8 space-y-8">
            <h3 className="text-xl font-bold text-[#303972] border-b pb-2 flex items-center gap-2">
                <BiPencil className="w-5 h-5 text-[#4D44B5]" />
                إنشاء أسئلة الاختيار من متعدد
            </h3>

            <AnimatePresence initial={false}>
                {questions.map((q, qIndex) => (
                    <motion.div
                        key={qIndex}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 bg-[#F9FAFF] rounded-xl shadow-inner space-y-4"
                        dir="rtl"
                    >
                        <div className="flex justify-between items-center pb-3 border-b border-indigo-200">
                            <h4 className="text-lg font-semibold text-[#4D44B5]">السؤال رقم {qIndex + 1}</h4>
                            {questions.length > 0 && (
                                <motion.button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <BiTrash className="w-5 h-5" />
                                </motion.button>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <BiQuestionMark className="w-4 h-4 text-gray-500" />
                                نص السؤال
                            </label>
                            <textarea
                                rows="2"
                                value={q.questionText}
                                onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4D44B5] focus:border-[#4D44B5] transition"
                                placeholder="اكتب نص السؤال هنا..."
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 w-full block pb-1">الاختيارات والإجابة الصحيحة</label>

                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={q.correctAnswerIndex === oIndex}
                                        onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', oIndex)}
                                        className="w-5 h-5 text-green-500 focus:ring-green-400"
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-indigo-400 focus:border-indigo-400"
                                        placeholder={`الخيار ${oIndex + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                            <p className='text-xs text-green-600 flex items-center gap-1'>
                                <BiCheckCircle />
                                الإجابة الصحيحة هي الخيار رقم: {q.correctAnswerIndex + 1}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* add a new question */}
            <div className="flex justify-start pt-4">
                <motion.button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <BiPlus className="w-5 h-5" />
                    إضافة سؤال جديد
                </motion.button>
            </div>
        </div>
    );
}

export default MultipleChoiceForm;