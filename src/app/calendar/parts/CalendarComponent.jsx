'use client'
import React, { useState, useMemo, useCallback } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { motion } from 'framer-motion';

const eventsData = {
    '2025-12-03': [{ color: 'bg-amber-500' }],
    '2025-12-04': [{ color: 'bg-blue-500' }, { color: 'bg-amber-500' }],
    '2025-12-10': [{ name: 'اختبار ساعتين', isPrimary: true }],
    '2025-12-15': [{ color: 'bg-blue-500' }],
    '2025-12-17': [{ name: 'يانغ ساعتين' }],
    '2025-12-27': [{ color: 'bg-amber-500' }],
};

const daysOfWeek = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

function DynamicCalendarComponent({ setCurrentDay }) {
    const today = useMemo(() => new Date(), []);
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDayOfMonth = today.getDate();
    const currentMonthInView = today.getMonth() === currentMonth && today.getFullYear() === currentYear;


    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const startDayIndex = firstDayOfMonth.getDay();

        const days = [];

        for (let i = startDayIndex - 1; i >= 0; i--) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, lastDayOfPreviousMonth - i),
                dayNumber: lastDayOfPreviousMonth - i,
                isCurrentMonth: false
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                dayNumber: i,
                isCurrentMonth: true
            });
        }

        const remainingCells = 42 - days.length;
        if (remainingCells > 0) {
            for (let i = 1; i <= remainingCells; i++) {
                days.push({
                    date: new Date(currentYear, currentMonth + 1, i),
                    dayNumber: i,
                    isCurrentMonth: false
                });
            }
        }

        return days.slice(0, 42);

    }, [currentMonth, currentYear]);

    const handleMonthChange = useCallback((amount) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + amount, 1);
            setSelectedDay(newDate.getDate());
            return newDate;
        });
    }, []);

    const handleDayClick = (dayNumber, date, isCurrentMonth) => {
        if (!isCurrentMonth) {
            const monthDiff = date.getMonth() - currentMonth;
            if (monthDiff !== 0) {
                handleMonthChange(monthDiff);
            }
        }
        setSelectedDay(dayNumber);
        setCurrentDay(date.getMonth() + 1 + '-' + dayNumber + '-' + date.getFullYear());
    };

    return (
        <div dir='rtl' className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-100 w-full max-w-4xl mx-auto">

            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={() => handleMonthChange(-1)}
                    className="p-2 text-[#4D44B5] hover:bg-gray-100 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                >
                    <BiChevronRight className="w-6 h-6" />
                </motion.button>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#303972]">
                    {monthNames[currentMonth]} {currentYear}
                </h2>

                <motion.button
                    onClick={() => handleMonthChange(1)}
                    className="p-2 text-[#4D44B5] hover:bg-gray-100 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                >
                    <BiChevronLeft className="w-6 h-6" />
                </motion.button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-bold text-gray-500 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-2 text-center">{day}</div>
                ))}
            </div>

            <motion.div
                className="grid grid-cols-7 gap-1 text-center"
                key={currentMonth}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {calendarDays.map((day, index) => {
                    const { dayNumber, isCurrentMonth, date } = day;
                    const formattedDate = formatDate(date);
                    const dayEvents = eventsData[formattedDate];

                    const isToday = currentMonthInView && dayNumber === currentDayOfMonth && isCurrentMonth;
                    const isSelected = dayNumber === selectedDay && isCurrentMonth;

                    let dayClasses = `h-20 sm:h-24 p-1 rounded-xl text-md sm:text-lg font-medium relative transition duration-150 flex flex-col justify-start items-center cursor-pointer`;

                    if (!isCurrentMonth) {
                        dayClasses += ' bg-gray-50 text-gray-400 opacity-70 hover:bg-gray-100';
                    } else {
                        if (isToday) {
                            dayClasses += ' bg-amber-100 text-[#303972] border-2 border-amber-500 shadow-md';
                        }
                        if (isSelected && !isToday) {
                            dayClasses += ' bg-[#4D44B5] text-white shadow-xl';
                        }
                        else if (!isToday) {
                            dayClasses += ' bg-white text-gray-800 hover:bg-gray-100 border border-gray-100';
                        }
                        if (isToday && isSelected) {
                            dayClasses = dayClasses.replace('bg-amber-100', 'bg-amber-500 text-white border-amber-500');
                        }
                    }

                    return (
                        <motion.div
                            key={index}
                            className={dayClasses}
                            onClick={() => handleDayClick(dayNumber, date, isCurrentMonth)}
                            whileHover={isCurrentMonth ? { scale: 1.02, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' } : {}}
                            whileTap={isCurrentMonth ? { scale: 0.98 } : {}}
                        >
                            <span className={`text-base sm:text-lg font-bold ${!isCurrentMonth ? 'opacity-70' : ''}`}>
                                {dayNumber}
                            </span>

                            <div className="flex space-x-1 space-x-reverse mt-1 justify-center">
                                {dayEvents && dayEvents.filter(e => !e.name).slice(0, 3).map((event, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSelected && isCurrentMonth ? 'bg-white' : event.color}`}></div>
                                ))}
                            </div>

                            {dayEvents && dayEvents.filter(e => e.name).slice(0, 1).map((event, i) => (
                                <div
                                    key={i}
                                    className={`text-[8px] sm:text-xs mt-1 px-1 rounded-md max-w-[90%] truncate font-medium
                                        ${isSelected && isCurrentMonth
                                            ? 'bg-blue-900 text-white'
                                            : event.isPrimary
                                                ? 'bg-[#4D44B5] text-white shadow-md'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {event.name}
                                </div>
                            ))}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default DynamicCalendarComponent;