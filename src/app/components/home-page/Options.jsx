import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';

function Options({ photo, click, deleteFunc }) {

    const options = [
        {
            title: 'عرض الصورة',
            function: () => null,
            path: `/image-preview?src=${photo}`,
        },
        {
            title: 'تغيير الصورة',
            function: click,
            path: '#',
        },
        {
            title: 'حذف الصورة',
            function: deleteFunc,
            path: '#',
        },
    ]

    return (
        <div>
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: 220 }}
                exit={{ height: 0 }}
                className="fixed left-0 bottom-0 z-1000 w-full rounded-t-lg bg-[#F3F4FF] overflow-hidden sm:p-6 p-3 flex flex-col gap-4 shadow-lg"
            >
                <ul className="flex flex-col gap-3">
                    {options.map((o, i) => (
                        <Link key={i} href={o.path} className="w-full">
                            <li
                                onClick={() => o.function()}
                                className="cursor-pointer px-4 py-3 bg-white shadow-sm rounded-lg text-center font-medium text-gray-700 hover:bg-gray-200 transition-all"
                            >
                                {o.title}
                            </li>
                        </Link>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}

export default Options
