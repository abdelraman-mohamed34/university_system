'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Save, Send } from 'lucide-react';
import MotionInput from './MotionInput';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColleges } from '@/app/features/AsyncSlices/CollegeSlice';

function Education({ formData, setFormData }) {

    const colleges = useSelector(c => c.colleges.colleges)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchColleges())
    }, [dispatch])

    const selectedCollegeName = formData?.teaching[0]?.collageName;
    const co = colleges.filter(c => c.college === selectedCollegeName);

    const uniqueCoursesMap = new Map();
    for (const col of co) {
        for (const year of col.years || []) {
            for (const deb of year.departments || []) {
                for (const term of deb.terms || []) {
                    for (const course of term.courses || []) {
                        const subjectName = course.subject;

                        if (!uniqueCoursesMap.has(subjectName)) {
                            uniqueCoursesMap.set(subjectName, {
                                value: subjectName,
                                label: subjectName,
                            });
                        }
                    }
                }
            }
        }
    }

    const courses = Array.from(uniqueCoursesMap.values());

    return (
        <div className="p-4 sm:p-8 pt-0 mb-5 mt-5" dir="rtl">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                <MotionInput
                    label="الدرجة العلمية"
                    id="degree"
                    type="input"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="اختر الدرجة العلمية..."
                />

                <MotionInput
                    label="الكلية"
                    id="collageName"
                    type="select"
                    value={formData.teaching[0].collageName}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => {
                            const updatedTeaching = [...prev.teaching];
                            updatedTeaching[0].collageName = value;
                            updatedTeaching[0].year = '';
                            updatedTeaching[0].courses = []
                            return { ...prev, teaching: updatedTeaching };
                        });
                    }}
                    placeholder="اختر الكلية"
                    options={colleges.map(college => ({
                        value: college.college,
                        label: college.college
                    }))}
                />


                <motion.div className="col-span-1 md:col-span-2">
                    <MotionInput
                        label="المواد"
                        id="course"
                        type="select"
                        multiple={true}
                        value={formData.teaching[0].courses.map(c => c.courseName)}
                        onChange={(e) => {
                            const selectedNames = e.target.value;
                            setFormData(prev => {
                                const updatedTeaching = [...prev.teaching];
                                updatedTeaching[0].courses = Array.isArray(selectedNames) ? selectedNames.map(name => ({
                                    courseName: name,
                                })) : [];

                                return { ...prev, teaching: updatedTeaching };
                            });
                        }}
                        placeholder="اختر المواد"
                        options={courses}
                    />
                </motion.div>

            </motion.div>
        </div >
    );
};

export default Education;