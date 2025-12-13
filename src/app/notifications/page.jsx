// components/activity-log/ActivityLog.jsx (أو page.jsx)
'use client'
import React from 'react'
import Header from '../components/home-page/Header'
import { motion } from 'framer-motion'
// تأكد من تحديث المسار الصحيح لهذا الملف بناءً على هيكلة مشروعك
import ActivityItem from './parts/ActivityItem';

// متغيرات الحركة
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // تأخير بسيط بين ظهور كل عنصر
        },
    },
};

const fileItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 150 },
    },
};

// --- بيانات الأنشطة (كما أرسلتها مع ترجمة عربية خفيفة للتصنيفات) ---

const activities = [
    {
        time: 'الاثنين، 30 يونيو 2020',
        content: (
            <>
                <span className="font-semibold text-indigo-700">كارين هوب</span> أنشأت مهمة جديدة في{' '}
                <span className="text-gray-900 font-medium">درس التاريخ</span>
            </>
        ),
        type: 'task',
        color: 'text-gray-600',
    },
    {
        time: 'الاثنين، 30 يونيو 2020',
        content: (
            <>
                <span className="text-red-600 font-semibold">[تذكير]</span> موعد استحقاق مهمة{' '}
                <span className="text-gray-900 font-medium">الواجب المنزلي للعلوم</span> سيأتي قريباً
            </>
        ),
        type: 'reminder',
        color: 'text-red-600',
    },
    {
        time: 'الاثنين، 30 يونيو 2020',
        content: (
            <>
                <span className="font-semibold text-indigo-700">توني سوب</span> علق على{' '}
                <span className="text-gray-900 font-medium">الواجب المنزلي للعلوم</span>
            </>
        ),
        type: 'comment',
        color: 'text-gray-600',
    },
];

const fileUploadActivity = {
    time: 'الاثنين، 30 يونيو 2020',
    content: (
        <>
            <span className="font-semibold text-indigo-700">سامانثا ويليام</span> أضافت 4 ملفات إلى{' '}
            <span className="text-gray-900 font-medium">صف الفن</span>
        </>
    ),
    files: 4,
    type: 'file',
    color: 'text-gray-600',
};

const doneActivity = {
    time: 'الاثنين، 30 يونيو 2020',
    content: (
        <>
            لقد نقلت مهمة <span className="text-green-600 font-medium">"الواجب المنزلي للأحياء"</span> إلى{' '}
            <span className="text-green-600 font-bold">تم الإنجاز</span>
        </>
    ),
    type: 'done',
    color: 'text-gray-600',
};

const yesterdayActivities = [
    {
        time: 'الأحد، 30 يونيو 2020',
        content: (
            <>
                <span className="font-semibold text-indigo-700">جوني أحمد</span> أشار إليك في{' '}
                <span className="text-gray-900 font-medium">الواجب المنزلي لصف الفن</span>
            </>
        ),
        type: 'mention',
        color: 'text-gray-600',
    },
    {
        time: 'الأحد، 30 يونيو 2020',
        content: (
            <>
                <span className="font-semibold text-indigo-700">نادلة أجا</span> أشار إليك في{' '}
                <span className="text-gray-900 font-medium">الواجب المنزلي للبرمجة</span>
            </>
        ),
        type: 'mention',
        color: 'text-gray-600',
    },
];

function ActivityLog() {
    return (
        // تم إضافة dir="rtl" إلى الحاوية الرئيسية لدعم اللغة العربية
        <div className="lg:px-10 sm:px-7 sm:py-5 pb-5 px-2" dir="rtl">
            {/* يُفترض أن مكون Header موجود ولديه دعم لـ RTL */}
            <Header prop="الإشعارات" />

            <div className="p-8 bg-white mx-auto rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">اليوم</h2>

                {/* قسم اليوم (Today) */}
                <motion.div
                    className="border-r-2 border-indigo-200 pr-4" // تم تغيير border-l-2 إلى border-r-2 و pl-4 إلى pr-4 لدعم RTL
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {activities.map((activity, index) => (
                        <ActivityItem key={`today-${index}`} activity={activity} index={`today-${index}`} />
                    ))}

                    <ActivityItem activity={fileUploadActivity} index="today-files-info" />

                    <ActivityItem activity={doneActivity} index="today-done" />
                </motion.div>

                <hr className="my-8 border-gray-200" />

                <h2 className="text-xl font-bold text-gray-800 mb-6">الأمس</h2>

                {/* قسم الأمس (Yesterday) */}
                <motion.div
                    className="border-r-2 border-indigo-200 pr-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {yesterdayActivities.map((activity, index) => (
                        <ActivityItem key={`yesterday-${index}`} activity={activity} index={`yesterday-${index}`} />
                    ))}
                </motion.div>

            </div>
        </div>
    );
}

export default ActivityLog;