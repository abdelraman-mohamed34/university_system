'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/home-page/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { BiSolidLeftArrow, BiSolidRightArrow, BiDotsHorizontalRounded } from "react-icons/bi";

const AntTabs = styled(Tabs)({
    '& .MuiTabs-indicator': { backgroundColor: 'transparent', height: 0 },
    '& .MuiTabs-flexContainer': { display: 'flex', gap: '10px' }
})

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    fontWeight: theme.typography.fontWeightRegular,
    border: '#A098AE solid 1px',
    borderRadius: '50%',
    color: '#A098AE',
    width: '50px',
    height: '50px',
    '&.Mui-selected': {
        backgroundColor: '#4D44B5',
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeightMedium,
        border: '#4D44B5 solid 1px',
        transition: '0.5s ease',
    },
}))

function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const students = useSelector((st) => st.students.students) || []
    const searched = useSelector((s) => s.searches.search) || ''

    const [value, setValue] = useState(0);
    const itemsPerPage = 7;

    useEffect(() => {
        dispatch(fetchStudents())
    }, [dispatch])

    const goToDetails = (code) => {
        localStorage.setItem('selectedStudentCode', code)
        router.push('/student-details')
    }

    const filteredStudents = students.filter(st =>
        st.fullName.trim().toLowerCase().includes(searched.toLowerCase().trim())
    )

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage))

    const handleChangeValue = (addValue) => {
        const newValue = value + addValue
        if (newValue >= 0 && newValue < totalPages) setValue(newValue)
    }

    return (
        <div className='lg:px-10 py-8 px-4 pt-0' dir="rtl">
            <Header prop='الطلاب' showSearch={true} />

            <div className='w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto custom-scrollbar'>
                    <div className='min-w-[1000px]'>
                        <div className='grid grid-cols-7 gap-4 px-8 py-5 bg-[#FDFDFF] border-b border-gray-100'>
                            {header.map((item) => (
                                <h6 key={item} className='text-[#A098AE] font-bold text-xs uppercase tracking-wider'>{item}</h6>
                            ))}
                        </div>

                        <div className='divide-y divide-gray-50'>
                            <AnimatePresence mode='wait'>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents
                                        .slice(value * itemsPerPage, (value + 1) * itemsPerPage)
                                        .map((student, index) => (
                                            <motion.div
                                                key={student.code}
                                                onClick={() => goToDetails(student.code)}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                className="grid grid-cols-7 gap-4 px-8 py-4 items-center cursor-pointer hover:bg-[#F4F2FF]/30 transition-all group"
                                            >
                                                <div className='flex items-center gap-4'>
                                                    <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-[#4D44B5] to-[#827AF3] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md'>
                                                        {student.fullName.charAt(0)}
                                                    </div>
                                                    <h6 className='truncate text-[#303972] font-bold text-sm group-hover:text-[#4D44B5] transition-colors'>{student.fullName}</h6>
                                                </div>

                                                <div>
                                                    <span className='bg-[#EBF9FF] text-[#2D9CDB] px-3 py-1 rounded-full text-xs font-bold'>
                                                        #{student.seatNumber}
                                                    </span>
                                                </div>

                                                <h6 className='text-[#A098AE] text-sm'>{new Date(student.loginDate).toLocaleDateString('ar-EG')}</h6>
                                                <h6 className='text-[#303972] text-sm truncate'>{student.fatherName}</h6>
                                                <h6 className='text-[#303972] text-sm'>{student.city}</h6>
                                                <h6 className='text-[#303972] text-sm font-medium'>{student.phone}</h6>

                                                <div className='flex justify-start'>
                                                    <button className='p-2 text-gray-400 hover:text-[#4D44B5] hover:bg-[#F4F2FF] rounded-lg transition-all'>
                                                        <BiDotsHorizontalRounded className="text-2xl" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                ) : (
                                    <div className='py-32 text-center'>
                                        <p className='text-[#A098AE] font-medium'>لا توجد نتائج تطابق بحثك</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-between items-center bg-white p-6 border-t border-gray-50 gap-4'>
                    <p className='text-[#A098AE] text-sm'>
                        عرض <span className='text-[#303972] font-bold'>{(value * itemsPerPage) + 1} - {Math.min((value + 1) * itemsPerPage, filteredStudents.length)}</span> من <span className='text-[#303972] font-bold'>{filteredStudents.length}</span> طالب
                    </p>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => handleChangeValue(-1)}
                            disabled={value === 0}
                            className={`p-2 rounded-xl transition-all ${value === 0 ? 'text-gray-200' : 'text-[#4D44B5] hover:bg-[#F4F2FF]'}`}
                        >
                            <BiSolidRightArrow className='text-xl' />
                        </button>

                        <AntTabs value={value} onChange={(e, v) => setValue(v)} variant="scrollable" scrollButtons={false}>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <AntTab key={i} label={i + 1} />
                            ))}
                        </AntTabs>

                        <button
                            onClick={() => handleChangeValue(1)}
                            disabled={value === totalPages - 1}
                            className={`p-2 rounded-xl transition-all ${value === totalPages - 1 ? 'text-gray-200' : 'text-[#4D44B5] hover:bg-[#F4F2FF]'}`}
                        >
                            <BiSolidLeftArrow className='text-xl' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const header = ['الاسم الكامل', 'رقم الجلوس', 'التاريخ', 'اسم الأب', 'المدينة', 'التواصل', 'الإجراءات'];

export default Page;