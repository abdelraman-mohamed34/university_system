'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const SkeletonCard = () => (

    <div className="p-3 rounded-xl bg-gray-100 shadow-sm transition duration-150 animate-pulse flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-blue-200 rounded w-2/5 mt-1"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3 mt-1"></div>
        </div>

        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-300 mt-2"></div>
    </div>
);

function ScheduleDetails({ currentDay }) {
    const [isLoading, setIsLoading] = useState(false);

    // static
    const scheduleItems = [
        { title: 'خوارزمية أساسية', type: 'الخوارزميات', date: '20 مارس، 2023', time: '09:00 - 10:00 صباحاً' },
        { title: 'الفن الأساسي', type: 'الفنون', date: '20 مارس، 2023', time: '09:00 - 10:00 صباحاً' },
        { title: 'صف HTML و CSS', type: 'البرمجة', date: '20 مارس، 2023', time: '09:00 - 10:00 صباحاً' },
        { title: 'الماضي البسيط', type: 'الإنجليزية', date: '20 مارس، 2023', time: '09:00 - 10:00 صباحاً' },
    ];

    const itemsToDisplay = isLoading ? Array(4).fill(null) : scheduleItems;

    return (
        <div dir='rtl' className="w-full">

            <motion.div
                className='mb-3 p-6 rounded-2xl bg-white flex flex-col justify-center md:shadow-lg'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {isLoading ? (
                    <>
                        <div className="h-6 bg-gray-300 rounded w-2/5 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">تفاصيل الجدول</h3>
                        <p className="text-sm text-gray-500">
                            {currentDay}
                        </p>
                    </>
                )}
            </motion.div>

            <div className="gap-2 grid grid-cols-1 xl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
                {itemsToDisplay.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={isLoading ? false : { opacity: 0, y: 10 }}
                        animate={isLoading ? false : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                        {isLoading ? (
                            <SkeletonCard />
                        ) : (
                            <div className="flex justify-between items-start p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-150">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.type}</p>
                                    <p className="text-xs text-blue-600 mt-1">{item.date}</p>
                                    <p className="text-xs text-gray-600">{item.time}</p>
                                </div>
                                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-200 mt-2"></div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleDetails;