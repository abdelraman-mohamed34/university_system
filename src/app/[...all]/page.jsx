'use client'
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function Page() {
    return (
        <motion.div
            className="flex flex-col md:flex-row min-h-screen max-h-screen h-full text-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex flex-col items-center justify-center p-8 sm:p-16 w-full md:w-1/2 pt-30"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <motion.div
                    className="text-8xl font-extrabold text-[#4D44B5] mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    🚧
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#303972] mb-3">
                    عفواً، هذه الصفحة قيد العمل!
                </h1>

                <p className="text-gray-500 mb-10 text-lg max-w-sm">
                    المحتوى الذي تبحث عنه لم يكتمل بعد أو أنه غير متاح حالياً.
                </p>

                <Link href="/" passHref>
                    <motion.button
                        className="py-3 px-8 bg-[#FCC43E] text-[#303972] font-bold rounded-xl shadow-lg transition duration-300 hover:bg-[#ffdb7a] focus:ring-4 focus:ring-[#FCC43E]/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        العودة إلى الصفحة الرئيسية
                    </motion.button>
                </Link>
            </motion.div>

            {/* جزء الصورة (يظهر فقط على الشاشات المتوسطة والكبيرة) */}
            <div className='hidden md:flex md:w-1/2 bg-white'>
                <img
                    className='h-full w-full object-cover'
                    src="https://plus.unsplash.com/premium_photo-1745616638280-305b6a90a25d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8NDA0JTIwZXJyb3J8ZW58MHx8MHx8fDA%3D"
                    alt="Work in Progress Illustration"
                />
            </div>
        </motion.div>
    );
}

export default Page;