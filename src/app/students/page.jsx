'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/home-page/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../features/AsyncSlices/StudentSlice'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useMediaQuery } from '@chakra-ui/react'

const header = [
    'الاسم الكامل',
    'رقم الجلوس',
    'التاريخ',
    'اسم الأب',
    'المدينة',
    'التواصل',
    'المزيد',
];

const AntTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: 'transparent',
        height: 0,
    },
    '& .MuiTabs-flexContainer': {
        display: 'flex',
        gap: '10px',
    }
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    fontWeight: theme.typography.fontWeightRegular,
    border: '#A098AE solid 1px',
    borderRadius: '50%',
    color: '#A098AE',
    width: '50px',
    height: '50px',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        border: '#A098AE solid 1px',
        opacity: 1,
    },
    '&.Mui-selected': {
        backgroundColor: '#4D44B5',
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeightMedium,
        border: '#4D44B5 solid 1px',
        transition: '0.5s ease',
    },
}));


function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const students = useSelector((st) => st.students.students) || []
    const searched = useSelector((s) => s.searches.search) || ''
    const smallWindow = useMediaQuery('(max-width : 800px)')

    const [value, setValue] = useState(0);

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

    const itemsPerPage = 7
    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage))

    const handleChange = (event, newValue) => setValue(newValue)

    const handleChangeValue = (addValue) => {
        const newValue = value + addValue
        if (newValue >= 0 && newValue < totalPages) {
            setValue(newValue)
        }
    }

    const visibleTabs = 3
    let start = 0;
    let end = visibleTabs;

    if (value >= visibleTabs) {
        start = value - visibleTabs + 1;
        end = value + 1;
    }


    return (
        <div className='lg:lg:px-10 sm:py-5 pb-5 sm:px-7 px-2'>
            <Header prop='الطلاب' showSearch={true} />

            <div className='w-full bg-white rounded-xl overflow-x-auto shadow-md'>
                <ul className='min-w-[700px]'>
                    {/* Header */}
                    <li className='w-full h-15 grid grid-cols-7 items-center font-bold pr-4 gap-10'>
                        {
                            !smallWindow
                                ? [(header.slice(0, 1)) + ' ' + (header.slice(6, 7))].map((item) => (
                                    <h6 key={item}>{item}</h6>
                                ))
                                : header.map((item) => (
                                    <h6 key={item}>{item}</h6>
                                ))
                        }
                    </li>

                    {/* Students */}
                    <div>
                        {filteredStudents.length > 0 ? (
                            filteredStudents
                                .slice(value * itemsPerPage, (value + 1) * itemsPerPage)
                                .map((student, index) => (
                                    <motion.li
                                        key={student.code}
                                        onClick={() => goToDetails(student.code)}
                                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                        transition={{
                                            duration: 0.1,
                                            delay: 0.05 * index,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 16,
                                            mass: 0.6
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative overflow-hidden hide-scrollbar pr-4 py-5 w-full border-t border-gray-200 
                                                    grid grid-cols-7 items-center cursor-pointer 
                                                    hover:bg-gray-50 transition-all duration-300 gap-10"
                                    >
                                        <span className='absolute top-0 right-0 w-1 h-full bg-[#4D44B5]' />
                                        <div className='flex gap-2 place-content-center items-center'>
                                            <h6 className='truncate text-[#303972] font-bold'>{student.fullName}</h6>
                                        </div>
                                        <h6 className='text-[#4D44B5] font-bold'>{student.seatNumber}</h6>
                                        <h6 className='text-[#A098AE]'> {new Date(student.loginDate).toLocaleDateString('ar-EG')}</h6>
                                        <h6>{student.fatherName}</h6>
                                        <h6>{student.city}</h6>
                                        <h6>{student.phone}</h6>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#A098AE]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </motion.li>
                                ))
                        ) : (
                            <motion.li
                                className='relative overflow-hidden pr-8 py-5 w-full border-t border-gray-200 text-center cursor-pointer'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h1>لا يوجد طلاب</h1>
                            </motion.li>
                        )}
                    </div>
                </ul>
            </div>


            {/* Pagination */}
            <div className='w-full mt-5 flex justify-start items-center'>
                <BiSolidRightArrow onClick={() => handleChangeValue(-1)} style={{ cursor: 'pointer', color: '#A098AE' }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginX: '10px', }}>
                    <AntTabs value={value - start}
                        onChange={(event, newValue) => setValue(newValue + start)}
                        aria-label="pagination tabs">
                        {Array.from({ length: totalPages }).slice(start, end).map((_, index) => (
                            <AntTab key={start + index} label={start + index + 1} />
                        ))}
                    </AntTabs>
                </Box>
                <BiSolidLeftArrow onClick={() => handleChangeValue(+1)} style={{ cursor: 'pointer', color: '#A098AE' }} />
            </div>
        </div>
    )
}

export default Page
