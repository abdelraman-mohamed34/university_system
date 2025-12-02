'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserGraduate, FaChalkboardTeacher, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
import { motion, animate } from 'framer-motion';

import { fetchStudents } from '@/app/features/AsyncSlices/StudentSlice'
import { fetchEvents } from '@/app/features/AsyncSlices/EventSlice';
import { fetchFood } from '@/app/features/AsyncSlices/FoodSlice';
import { fetchProfessors } from '@/app/features/AsyncSlices/ProfSlice';
import { universityData } from '../../../../data/uniData';

function OverAll() {
    const dispatch = useDispatch()
    const students = useSelector((st) => st.students.students)
    const professors = useSelector((prof) => prof.professors.professors)
    const foods = useSelector((eat) => eat.food.foods)
    const events = useSelector((ev) => ev.events.events)
    const iconsSize = 20;

    const [counts, setCounts] = useState({ students: 0, professors: 0, events: 0, foods: 0 });
    const duration = 1;

    useEffect(() => { dispatch(fetchStudents()) }, [dispatch])
    useEffect(() => { dispatch(fetchEvents()) }, [dispatch])
    useEffect(() => { dispatch(fetchFood()) }, [dispatch])
    useEffect(() => { dispatch(fetchProfessors()) }, [dispatch])

    // Animate the numbers whenever data changes
    useEffect(() => {
        animate(0, universityData?.[0].totalStudents, {
            duration: duration,
            onUpdate(value) {
                setCounts(prev => ({ ...prev, students: Math.floor(value) }))
            }
        })
    }, [universityData?.[0].totalStudents])

    useEffect(() => {
        animate(0, universityData?.[0].totalProfessors, {
            duration: duration,
            onUpdate(value) {
                setCounts(prev => ({ ...prev, professors: Math.floor(value) }))
            }
        })
    }, [universityData?.[0].totalProfessors])

    useEffect(() => {
        animate(0, universityData?.[0].totalEvents, {
            duration: duration,
            onUpdate(value) {
                setCounts(prev => ({ ...prev, events: Math.floor(value) }))
            }
        })
    }, [universityData?.[0].totalEvents])

    useEffect(() => {
        animate(0, universityData?.[0].totalFoods, {
            duration: duration,
            onUpdate(value) {
                setCounts(prev => ({ ...prev, foods: Math.floor(value) }))
            }
        })
    }, [universityData?.[0].totalFoods])

    const cards = [
        { name: 'الطلاب', count: counts.students / 1000 + "K", icon: <FaUserGraduate size={iconsSize} color="white" />, bgColor: 'bg-[#4D44B5]' },
        { name: 'المدرسين', count: counts?.professors / 1000 + "K", icon: <FaChalkboardTeacher size={iconsSize} color="white" />, bgColor: 'bg-[#FB7D5B]' },
        { name: 'الأحداث', count: counts.events, icon: <FaCalendarAlt size={iconsSize} color="white" />, bgColor: 'bg-[#FCC43E]' },
        { name: 'الأكل', count: counts.foods / 1000 + "K", icon: <FaUtensils size={iconsSize} color="white" />, bgColor: 'bg-[#303972]' }
    ];

    return (
        <div className='w-full h-[150px] grid grid-cols-4 bg-white rounded-xl p-5 gap-4'>
            {cards.map((card) => (
                <motion.div
                    key={card.name}
                    className='flex sm:flex-row flex-col self-center justify-center items-center sm:gap-2 sm:text-auto text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className={`rounded-full aspect-square ${card.bgColor} lg:w-[65px] sm:h-[55px] h-[45px] lg:h-[65px] sm:w-[55px] w-[45px] flex items-center justify-center text-white font-bold text-lg mt-2`}>
                        {card.icon}
                    </span>
                    <div>
                        <h1 className='text-gray-400 sm:text-auto text-sm text-center'>{card.name}</h1>
                        <h6 className='text-[#303972] font-bold sm:text-2xl text-lg'>{card.count}</h6>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default OverAll
