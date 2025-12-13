'use client'

import React, { useState, useEffect } from 'react';

const ExamQuestionSelect = ({ question, onAnswerChange, initialAnswer }) => {
    const options = question.options || [];
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(initialAnswer || null);

    useEffect(() => {
        setSelectedOptionIndex(initialAnswer || null);
    }, [initialAnswer]);

    const handleOptionChange = (e, index) => {
        const indexString = String(index);
        setSelectedOptionIndex(indexString);
        if (onAnswerChange) {
            onAnswerChange(question.id, indexString);
        }
    };

    return (
        <div className="mb-8 p-4rounded-xl">
            <h3
                className="text-lg font-extrabold text-[#4D44B5] mb-4 text-right leading-relaxed"
            >
                {(typeof question.id === 'string' && question.id.startsWith('q-') ? question.id.substring(2) : question.id)}. {question.questionText}
            </h3>

            <div className="space-y-3">
                {Array.isArray(options) && options.map((option, index) => (
                    <label
                        key={index}
                        htmlFor={`q-${question.id}-option-${index}`}
                        // المقارنة تتم مع الفهرس المخزن
                        className={`flex items-start p-4 rounded-xl cursor-pointer transition duration-300 border shadow-sm ${selectedOptionIndex === String(index) // ⬅️ المقارنة مع الفهرس
                            ? 'bg-indigo-50 border-indigo-600 shadow-indigo-200/50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                    >
                        <input
                            type="radio"
                            id={`q-${question.id}-option-${index}`}
                            name={`question-${question.id}`}
                            value={String(index)} // ⬅️ القيمة المُخزنة في الـ input هي الفهرس
                            checked={selectedOptionIndex === String(index)}
                            onChange={(e) => handleOptionChange(e, index)} // ⬅️ تمرير الفهرس إلى الدالة
                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 mt-0.5 ml-3 cursor-pointer"
                        />

                        <span className="text-base text-gray-800 flex-1 text-right font-medium">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ExamQuestionSelect;