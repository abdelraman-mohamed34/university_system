'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react';

function PhotoUpload({ fileName, onFileChange }) {
    return (
        <motion.div
            className="flex flex-col space-y-2 col-span-1"
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <label htmlFor="photo" className="text-sm font-semibold text-gray-700">
                رفع صورة شخصية <span className="text-red-500">*</span>
            </label>
            <label
                htmlFor="photo"
                className="flex max-w-50 items-center justify-center h-full min-h-[150px] p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-500 transition duration-300"
            >
                <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="hidden"
                    accept="image/*"
                    required
                    onChange={onFileChange}
                />
                <div className="text-center text-gray-500">
                    <Upload className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
                    <p className="text-sm">
                        {fileName ? (
                            <span className="font-medium text-indigo-600 truncate block max-w-full">{fileName} selected.</span>
                        ) : (
                            'اسحب وأفلِت أو انقر هنا لتحديد الملف'
                        )}
                    </p>
                </div>
            </label>
        </motion.div>
    );
}

export default PhotoUpload
