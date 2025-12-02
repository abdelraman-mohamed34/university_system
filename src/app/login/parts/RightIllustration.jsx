'use client'
import { motion } from "framer-motion"

export default function RightIllustration() {
    return (
        <motion.div
            className="hidden lg:flex bg-[#F8F9FB] flex-col justify-center items-center relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute top-5 right-5">
                <h2 className="text-4xl font-bold mb-4 text-start text-[#303972]">أهلاً بك في الجامعة</h2>
                <p className="text-gray-600 text-start mb-6 max-w-sm text-lg">
                    احصل على أفضل النصائح والأدوات لتطوير مهاراتك التعليمية والتدريبية.
                </p>
            </div>
            <img
                src="/study_beta.jpg"
                alt="Illustration"
                className="w-full h-screen object-cover shadow"
            />
        </motion.div>
    )
}