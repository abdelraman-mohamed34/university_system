'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import { BiShow, BiRefresh, BiTrash, BiX } from "react-icons/bi";

function Options({ photo, click, deleteFunc, closeOptions }) {

    const options = [
        {
            title: 'عرض الصورة',
            icon: <BiShow />,
            function: () => null,
            path: `/image-preview?src=${photo}`,
            color: 'text-[#4D44B5]',
        },
        {
            title: 'تغيير الصورة',
            icon: <BiRefresh />,
            function: click,
            path: '#',
            color: 'text-[#FCC43E]',
        },
        {
            title: 'حذف الصورة',
            icon: <BiTrash />,
            function: deleteFunc,
            path: '#',
            color: 'text-[#FB7D5B]',
        },
    ]

    return (
        <div onClick={closeOptions} className="fixed inset-0 z-[1100] flex flex-col justify-end" dir="rtl">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl mx-auto rounded-t-[32px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden p-6 pb-10 flex flex-col gap-6"
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />

                <div className="flex justify-between items-center mb-2 px-2">
                    <h3 className="text-xl font-black text-[#303972]">خيارات الصورة</h3>
                    <button className="text-[#A098AE] text-2xl hover:text-gray-700 transition-colors" onClick={closeOptions}>
                        <BiX />
                    </button>
                </div>

                <ul className="flex flex-col gap-4">
                    {options.map((o, i) => (
                        <Link key={i} href={o.path} className="w-full group">
                            <li
                                onClick={(e) => {
                                    if (o.path === '#') e.preventDefault();
                                    o.function();
                                }}
                                className="flex items-center gap-4 cursor-pointer px-5 py-4 bg-gray-50 rounded-2xl transition-all hover:bg-[#F4F2FF] hover:translate-y-[-2px] active:scale-[0.98]"
                            >
                                <div className={`text-2xl p-2 rounded-xl bg-white shadow-sm ${o.color}`}>
                                    {o.icon}
                                </div>
                                <span className="font-bold text-[#303972] group-hover:text-[#4D44B5]">
                                    {o.title}
                                </span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}

export default Options