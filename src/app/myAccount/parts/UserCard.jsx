'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'
import { globals } from '../../../../data/global'
import { useSession } from 'next-auth/react';
import { fetchCloudinary } from '@/app/features/AsyncSlices/ImagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImage, fetchUsers, uploadProfileImage } from '@/app/features/AsyncSlices/UsersSlice';
import Link from 'next/link';
import Options from '@/app/components/home-page/Options';
import { Skeleton, Box } from '@mui/material';

function OverLay({ active }) {
    useEffect(() => {
        if (active) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
        return () => { document.body.style.overflow = 'auto' }
    }, [active])

    if (!active) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-1000 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
    )
}

// Skeleton Loader
const UserCardSkeleton = () => (
    <Box className="bg-white w-full rounded-xl sm:mb-5 mb-2 pb-3 overflow-hidden p-5 shadow">
        <Skeleton
            variant="rectangular"
            height={150}
            sx={{ borderRadius: 2, backgroundColor: '#F5F5F5', '&::after': { background: 'linear-gradient(90deg, #F5F5F5, #E0E0E0, #F5F5F5)' } }}
        />
        <Skeleton
            variant="text"
            width="40%"
            height={35}
            sx={{ mt: 3, mb: 1, backgroundColor: '#F5F5F5', '&::after': { background: 'linear-gradient(90deg, #F5F5F5, #E0E0E0, #F5F5F5)' } }}
        />
        {[...Array(6)].map((_, i) => (
            <Skeleton
                key={i}
                variant="text"
                width={`${80 - i * 5}%`}
                height={25}
                sx={{ mb: 1, backgroundColor: '#F5F5F5', '&::after': { background: 'linear-gradient(90deg, #F5F5F5, #E0E0E0, #F5F5F5)' } }}
            />
        ))}
    </Box>
)

export default function UserCard() {
    const dispatch = useDispatch()
    const { data: session } = useSession();
    const currentUser = session?.user
    const users = useSelector(u => u.users.users)
    const user = users?.find(u => u.code === currentUser?.code)
    const initialState = useSelector(d => d.images)
    const inputRef = useRef()
    const [openOptions, setOpenOptions] = useState(false)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const result = await dispatch(fetchCloudinary(file)).unwrap()
        const imageUrl = result?.url
        dispatch(uploadProfileImage({ id: user.code, img: imageUrl }))
        window.location.reload()
    }

    if (!user) {
        return <UserCardSkeleton />
    }

    return (
        <>
            <OverLay active={initialState.loading} />
            {openOptions && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed top-0 left-0 w-full h-screen bg-black/80  z-900 backdrop-blur"
                        onClick={() => setOpenOptions(false)}
                    />
                    <Options
                        photo={user?.photo}
                        deleteFunc={() => {
                            dispatch(deleteProfileImage({ id: user?.code }))
                            setOpenOptions(false)
                        }}
                        click={() => {
                            inputRef.current.click();
                            setOpenOptions(false)
                        }}
                    />
                </>
            )}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white w-full rounded-xl sm:mb-5 mb-2 pb-3 overflow-hidden"
            >
                <div className="relative w-full h-50 bg-[#4D44B5] mb-10">
                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                        <span className="absolute top-15 lg:right-20 right-2  bg-[#FCC43E] rounded aspect-square lg:w-70 w-40 lg:border-35 lg:border-[#FCC43E] lg:rounded-full z-10" />
                        <span className="absolute top-25 lg:right-70 right-30 bg-[#FB7D5B] rounded aspect-square lg:w-48 w-35 lg:border-35 lg:border-[#FB7D5B]  lg:rounded-full" />
                    </div>
                    <span className="aspect-square w-40 rounded-full cursor-pointer overflow-hidden border-4 border-white absolute top-32 sm:left-10 sm:right-auto right-2 z-20 bg-[#C1BBEB] shadow">
                        <img
                            className="w-full h-full object-cover"
                            src={user.photo && user.photo.trim() !== '' ? user.photo : globals?.avatarUserLink}
                            alt={user.fullName}
                            onClick={() => user?.photo?.trim() !== '' ? setOpenOptions(!openOptions) : inputRef.current.click()}
                        />
                        <input
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                            hidden
                        />
                    </span>
                </div>

                <div className="px-10 mb-6 pt-15 sm:pt-0">
                    <h2 className="text-2xl font-bold">{user.fullName}</h2>
                    <p>{user.email}</p>
                    {user.role === 'student' ? (
                        <>
                            <p>الكلية: {user.faculty}</p>
                            <p>الفرقة: {user.currentYear}</p>
                            <p>الحالة: {user.status}</p>
                            <p>المدينة: {user.city} - العنوان: {user.address}</p>
                            <p>رقم هاتف الطالب: {user.phone}</p>
                        </>
                    ) : (
                        <>
                            <p>الكلية:</p>
                            <p>الحالة: {user.status}</p>
                            <p>رقم الهاتف: {user.phone}</p>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    )
}
