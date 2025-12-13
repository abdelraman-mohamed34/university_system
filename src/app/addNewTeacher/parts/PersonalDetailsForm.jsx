'use client'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import MotionInput from './MotionInput';
import AddressTextarea from './AddressTextarea';
import PhotoUpload from './PhotoUpload';

function PersonalDetailsForm({ formData, setFormData }) {

    // 2. Generic input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. File specific change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file,
                photoFileName: file.name
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                photo: null,
                photoFileName: null
            }));
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="px-4 sm:px-8">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* Row 1: First Name / Last Name */}
                <motion.div variants={itemVariants} className='col-span-2'>
                    <MotionInput
                        label="الإسم الأول"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="اكتب اسمك هنا..."
                    />
                </motion.div>

                {/* Row 2: Email / Phone */}
                <motion.div variants={itemVariants}>
                    <MotionInput
                        label="الإيميل"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Historia@mail.com"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MotionInput
                        label="رقم الهاتف"
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1234567890"
                    />
                </motion.div>

                {/* Row 3: Address / Photo */}
                <motion.div variants={itemVariants} className="md:col-span-1">
                    <AddressTextarea
                        value={formData.address}
                        onChange={e => handleChange({ target: { name: 'address', value: e.target.value } })}
                    />
                </motion.div>
                <motion.div variants={itemVariants} className="md:col-span-1">
                    <PhotoUpload
                        fileName={formData.photoFileName}
                        onFileChange={handleFileChange}
                    />
                </motion.div>

                {/* Row 4: Date of Birth / Place of Birth */}
                <motion.div variants={itemVariants}>
                    <MotionInput
                        label="تاريخ الميلاد"
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MotionInput
                        label="محل الميلاد"
                        id="birthPlace"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        placeholder="Jakarta, Indonesia"
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MotionInput
                        label="النوع"
                        id="gender"
                        name="gender"
                        type='select'
                        value={formData.gender}
                        onChange={handleChange}
                        placeholder="ذكر"
                        options={['انثي'].map(g => ({
                            value: g,
                            label: g
                        }))}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>

                    <MotionInput
                        label="المكتب"
                        id="office"
                        name="office"
                        value={formData.office}
                        onChange={handleChange}
                        placeholder="عنوان المكتب..."
                    />
                </motion.div>
            </motion.div>
        </div >
    );
}

export default PersonalDetailsForm
