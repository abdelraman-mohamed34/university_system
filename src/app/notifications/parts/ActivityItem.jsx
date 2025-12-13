'use client'

import React from 'react';
import { motion } from 'framer-motion';

// متغيرات الحركة الخاصة بعناصر النشاط الفردية
const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 },
    },
};

/**
 * @param {Object} props
 * @param {Object} props.activity 
 * @param {string} props.index
 */

const ActivityItem = ({ activity, index }) => {
    return (
        <motion.div
            key={index}
            className="flex items-start mb-6"
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-4 flex-shrink-0"></div>

            <div dir="rtl">
                <p className="text-xs text-gray-400 mb-1">{activity.time}</p>
                <p className={`text-sm ${activity.color}`}>{activity.content}</p>
            </div>
        </motion.div>
    );
};

export default ActivityItem;