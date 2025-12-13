'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/home-page/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfessors } from '../features/AsyncSlices/ProfSlice'
import { useRouter } from 'next/navigation'
import { Box, Tabs, Tab, Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { motion } from "framer-motion"
import { globals } from '../../../data/global'
import { useSession } from 'next-auth/react'

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

export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const professors = useSelector((prof) => prof.professors.professors) || []

    const { data: session } = useSession()

    const [value, setValue] = useState(0)
    const itemsPerPage = 10
    const totalPages = Math.max(1, Math.ceil(professors.length / itemsPerPage))
    const visibleTabs = 3

    useEffect(() => { dispatch(fetchProfessors()) }, [dispatch])

    const goToTeacherDetails = (code) => {
        if (typeof window !== 'undefined') localStorage.setItem('selectedTeacher', code)
        router.push('/teachers-deatails')
    }

    const handleChangeValue = (addValue) => {
        const newValue = value + addValue
        if (newValue >= 0 && newValue < totalPages) setValue(newValue)
    }

    let start = 0, end = visibleTabs
    if (value >= visibleTabs) { start = value - visibleTabs + 1; end = value + 1 }

    // Skeleton Loader
    const SkeletonLoader = () => (
        <div className='grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
            {[...Array(itemsPerPage)].map((_, idx) => (
                <motion.div
                    key={idx}
                    className='relative overflow-hidden rounded-lg flex flex-col justify-center items-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                    <Skeleton variant="circular" width={80} height={80} sx={{ backgroundColor: '#F5F5F5', mb: 2 }} />
                    <Skeleton variant="text" width={60} height={20} sx={{ backgroundColor: '#F5F5F5', mb: 1 }} />
                    <Skeleton variant="text" width={40} height={15} sx={{ backgroundColor: '#F5F5F5' }} />
                </motion.div>
            ))}
        </div>
    )

    if (!professors) return <SkeletonLoader />

    return (
        <div className='lg:px-10 sm:py-5 pb-5 sm:px-7 px-2 pt-0 sm:pt-0'>
            <Header showAddTeacher={session?.user?.role === 'admin' ? true : false} prop='المعلمون' />

            <div className='grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                {professors
                    .slice(value * itemsPerPage, (value + 1) * itemsPerPage)
                    .map((pr, idx) => (
                        <motion.div
                            key={pr.code}
                            onClick={() => goToTeacherDetails(pr.code)}
                            className='relative overflow-hidden rounded-lg bg-white flex flex-col justify-center items-center py-5 cursor-pointer hover:shadow-lg transition-shadow'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <span className='absolute w-full h-10 top-0 bg-[#4D44B5]' />
                            <div className='overflow-hidden aspect-square w-30 rounded-full flex justify-center items-center bg-[#C1BBEB] z-10 border-5 border-white'>
                                {pr.photo?.trim() !== "" ? (
                                    <img src={pr.photo} alt={pr.fullName} className='object-cover aspect-square w-full h-full' />
                                ) : (
                                    <img src={globals?.avatarUserLink} alt={pr.fullName} className='object-cover aspect-square w-full h-full' />
                                )}
                            </div>
                            <h6 className='text-center font-bold mt-2'>{pr.fullName}</h6>
                            <h6 className='text-center text-gray-600'>{pr.degree}</h6>
                        </motion.div>
                    ))}
            </div>

            {professors?.length !== 0 && (
                <div className='w-full mt-5 flex justify-center items-center'>
                    <BiSolidRightArrow onClick={() => handleChangeValue(-1)} style={{ cursor: 'pointer', color: '#A098AE' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginX: '10px' }}>
                        <AntTabs
                            value={value - start}
                            onChange={(_, newValue) => setValue(newValue + start)}
                            aria-label="pagination tabs"
                        >
                            {Array.from({ length: totalPages }).slice(start, end).map((_, index) => (
                                <AntTab key={start + index} label={start + index + 1} />
                            ))}
                        </AntTabs>
                    </Box>
                    <BiSolidLeftArrow onClick={() => handleChangeValue(+1)} style={{ cursor: 'pointer', color: '#A098AE' }} />
                </div>
            )}

        </div>
    )
}
