'use client'
import React, { useEffect, useState } from 'react'
import PersonalDetailsForm from './PersonalDetailsForm';
import { motion } from 'framer-motion'
import Education from './Education';
import { AlertTriangle, Save, Upload, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins } from '@/app/features/AsyncSlices/AdminsSlice';
import { createTeacher } from '@/app/features/AsyncSlices/ProfSlice';
import { fetchCloudinary } from '@/app/features/AsyncSlices/ImagesSlice';
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice';

function PerformancesDeatails({ }) {
    const dispatch = useDispatch()
    const [submitMessage, setSubmitMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        code: "",
        role: "teacher",
        fullName: "",
        degree: "",
        status: "معلم",
        birthDate: "",
        birthPlace: "",
        email: "",
        passwordHash: "$2b$12$.ZAnfGR5M/ao5LEV7708r.ghb.uy630n7WE.g.hr1L0gxm.T5SGgi",
        address: "",
        phone: "",
        photo: "",
        photoFileName: "",
        gender: "",
        office: "",
        experienceYears: 0,
        teaching: [
            {
                universityName: 'Al-Azhar University Cairo',
                collageName: '',
                year: '',
                departMent: '',
                term: '',
                courses: [
                    {
                        courseId: '',
                        courseName: '',
                        professor: [],
                    }
                ],
            }
        ]
    });
    const colleges = useSelector(c => c.colleges.colleges)
    useEffect(() => {
        dispatch(fetchColleges())
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchAdmins())
    }, [dispatch])


    // formData.code, colleges,

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            }
        },
    };

    const handleAction = (type) => (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (type === 'draft') {
            setIsSuccess(false);
            setValidationErrors({});
            setSubmitMessage('تم حفظ بيانات التعليم كمسودة !');
        }
    };

    const handleSubmitAddNewTeacher = async () => {
        setValidationErrors({});
        setSubmitMessage(null);
        setIsSubmitting(true);

        const requiredFields = {
            fullName: 'الاسم الكامل مطلوب.',
            email: 'البريد الإلكتروني مطلوب.',
            degree: 'الدرجة العلمية مطلوبة.',
        };

        let errors = {};
        let isFormValid = true;

        Object.keys(requiredFields).forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                errors[field] = requiredFields[field];
                isFormValid = false;
            }
        });

        const collegeName = formData.teaching[0].collageName;
        if (!collegeName || collegeName.trim() === '') {
            errors['collageName'] = 'الكلية المطلوبة مطلوبة.';
            isFormValid = false;
        }

        if (!isFormValid) {
            setValidationErrors(errors);
            setIsSuccess(false);
            setSubmitMessage('الرجاء تصحيح الأخطاء في الحقول المحددة لإكمال عملية الرفع.');
            setIsSubmitting(false);

            return;
        }

        let photoURL = null;

        if (formData.photo && formData.photo instanceof File) {
            try {
                const img = await dispatch(fetchCloudinary(formData.photo)).unwrap();
                photoURL = img.secure_url;
                setIsSuccess(true);
                setSubmitMessage('تم رفع الصورة بنجاح. جاري إنشاء المعلم...');
            } catch (error) {
                setIsSuccess(false);
                setSubmitMessage('حدث خطأ أثناء رفع الصورة. لن يتم حفظ المعلم.');
                setIsSubmitting(false);
                return;
            }
        } else if (typeof formData.photo === 'string') {
            photoURL = formData.photo;
        }

        const cleanedFormData = {
            ...formData,
            birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
            photo: photoURL,
            role: 'teacher',
        };

        Object.keys(cleanedFormData).forEach(key => {
            if (cleanedFormData[key] === '' || cleanedFormData[key] === undefined) {
                if (key !== 'teaching' && !(Array.isArray(cleanedFormData[key]) && cleanedFormData[key].length === 0)) {
                    delete cleanedFormData[key];
                }
            }
        });
        try {
            const data = await dispatch(createTeacher(cleanedFormData)).unwrap();
            setFormData(prev => ({
                ...prev,
                code: data.teacher.code,
                teaching: data.teacher.teaching
            }));
            setIsSuccess(true);
            setSubmitMessage('تم إنشاء المعلم بنجاح وإرسال البيانات إلى الخادم!');
        } catch (error) {
            console.error("Error creating teacher:", error);
            setIsSuccess(false);
            const serverErrorMessage = error.message || (error.payload && error.payload.message) || 'حدث خطأ أثناء إنشاء المعلم.';
            setSubmitMessage(` خطأ في الإرسال: ${serverErrorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-4 sm:pb-8 flex justify-center relative">
            <motion.div
                className={`w-full bg-white shadow-xl rounded-2xl overflow-hidden transition-opacity duration-300 ${isSubmitting ? 'opacity-50 pointer-events-none' : 'opacity-100'}`} // 💡 تطبيق التعتيم ومنع التفاعل
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <div className="bg-[#4D44B5] p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">المعلومات الشخصية</h2>
                </div>

                <div className="mt-8 px-4 space-x-4 sm:px-8">
                    {submitMessage && (
                        <motion.div
                            className={`border rounded px-4 py-3 relative flex items-center mb-5 ${isSuccess ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertTriangle className="w-5 h-5 ml-3" />
                            <span className="block sm:inline">{submitMessage}</span>
                        </motion.div>
                    )}
                </div>
                <PersonalDetailsForm
                    setFormData={setFormData}
                    formData={formData}
                    validationErrors={validationErrors}
                />
                <Education
                    setFormData={setFormData}
                    formData={formData}
                    validationErrors={validationErrors}
                />

                <div className="mt-0 pt-4 bg-gray-100/80 flex flex-col sm:flex-row justify-end gap-2 p-4 sm:p-8">
                    {/* 💡 تعطيل زر حفظ كمسودة وتغيير مظهره */}
                    <motion.button
                        type="button"
                        onClick={handleAction('draft')}
                        disabled={isSubmitting}
                        className={`flex justify-center items-center px-6 py-3 border border-indigo-600 font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-[#4D44B5] hover:bg-indigo-50'}`} // 💡 تغيير التنسيق عند التعطيل
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                        <Save className="w-5 h-5 ml-2" />
                        حفظ كمسودة
                    </motion.button>

                    <motion.button
                        type="submit"
                        onClick={handleSubmitAddNewTeacher}
                        disabled={isSubmitting}
                        className={`flex justify-center items-center px-6 py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-[#4D44B5] hover:bg-[#342a99]'}`} // 💡 تغيير التنسيق عند التعطيل
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        ) : (
                            <Upload className="w-5 h-5 ml-2" />
                        )}
                        {isSubmitting ? 'جاري الرفع...' : 'رفع'}
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}

export default PerformancesDeatails;