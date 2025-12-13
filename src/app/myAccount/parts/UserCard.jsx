'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'
import { globals } from '../../../../data/global'
import { useSession } from 'next-auth/react';
import { fetchCloudinary } from '@/app/features/AsyncSlices/ImagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImage, fetchUsers, uploadProfileImage } from '@/app/features/AsyncSlices/UsersSlice';
import Options from '@/app/components/home-page/Options';
import { Skeleton, Box } from '@mui/material';
import { BiCamera, BiEnvelope, BiBuilding, BiMap, BiPhone, BiUserCheck, BiIdCard } from "react-icons/bi";

// Overlay Loader المحدث
function OverLay({ active }) {
    useEffect(() => {
        if (active) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
        return () => { document.body.style.overflow = 'auto' }
    }, [active])

    if (!active) return null

    return (
        <div className="fixed inset-0 bg-[#303972]/60 backdrop-blur-sm z-[2000] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#4D44B5] border-t-transparent rounded-full"
            />
        </div>
    )
}

const UserCardSkeleton = () => (
    <Box className="bg-white w-full rounded-3xl sm:mb-5 mb-2 pb-6 overflow-hidden shadow-sm">
        <Skeleton variant="rectangular" height={192} animation="wave" />
        <div className="px-10 pt-20">
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="20%" height={25} sx={{ mb: 4 }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: '16px' }} />
                ))}
            </div>
        </div>
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
        dispatch(uploadProfileImage({ img: imageUrl }))
        window.location.reload()
    }

    if (!user) return <UserCardSkeleton />

    return (
        <div dir="rtl">
            <OverLay active={initialState.loading} />

            <AnimatePresence>
                {openOptions && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#303972]/40 backdrop-blur-sm z-[1000]"
                            onClick={() => setOpenOptions(false)}
                        />
                        <Options
                            photo={user?.photo}
                            deleteFunc={() => {
                                dispatch(deleteProfileImage())
                                setOpenOptions(false)
                                window.location.reload()
                            }}
                            click={() => {
                                inputRef.current.click();
                                setOpenOptions(false)
                            }}
                            closeOptions={() => setOpenOptions(false)}
                        />
                    </>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full sm:rounded-3xl rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3"
            >
                {/* Header Profile with Gradients */}
                <div className="relative h-48 bg-gradient-to-r from-[#4D44B5] to-[#827AF3]">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
                        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white" />
                    </div>

                    <div className="absolute -bottom-16 right-10 group">
                        <div className="p-1.5 bg-white rounded-full shadow-xl relative transition-transform group-hover:scale-105">
                            <img
                                className="w-32 h-32 rounded-full object-cover bg-[#C1BBEB]"
                                src={user.photo && user.photo.trim() !== '' ? user.photo : globals?.avatarUserLink}
                                alt={user.fullName}
                            />
                            <button
                                onClick={() => user?.photo && user?.photo?.trim() !== '' ? setOpenOptions(true) : inputRef.current.click()}
                                className="absolute bottom-2 left-2 p-2 bg-[#FCC43E] text-white rounded-xl shadow-lg hover:bg-[#eeb12a] transition-colors"
                            >
                                <BiCamera className="text-xl" />
                            </button>
                            <input ref={inputRef} type="file" onChange={handleFileChange} hidden />
                        </div>
                    </div>
                </div>

                {/* User Information Grid */}
                <div className="pt-20 sm:px-10 px-5 pb-10">
                    <div className="mb-0">
                        <h2 className="text-3xl font-black text-[#303972] mb-1">{user.fullName}</h2>
                        <div className="flex items-center gap-2 text-[#A098AE] font-medium uppercase text-xs tracking-widest">
                            <BiIdCard className="text-lg" /> {user?.role === 'teacher' ? 'معلم' : user?.role === 'student' ? 'طالب' : 'ادمن'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Info Items Card Style */}
                        <InfoItem icon={<BiEnvelope />} label="البريد الإلكتروني" value={user.email} color="bg-blue-50 text-blue-500" />
                        <InfoItem icon={<BiPhone />} label="رقم الهاتف" value={user.phone} color="bg-yellow-50 text-yellow-500" />

                        {user.role === 'student' && (
                            <>
                                <InfoItem icon={<BiBuilding />} label="الكلية والفرقة" value={`${user.faculty} - ${user.currentYear}`} color="bg-purple-50 text-purple-500" />
                                <InfoItem icon={<BiMap />} label="العنوان" value={`${user.city} - ${user.address}`} color="bg-orange-50 text-orange-500" />
                            </>
                        )}

                        <InfoItem icon={<BiUserCheck />} label="الحالة" value={user.status} color="bg-green-50 text-green-500" />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function InfoItem({ icon, label, value, color }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
            <div className={`p-3 rounded-xl shadow-sm bg-white ${color.split(' ')[1]}`}>
                {React.cloneElement(icon, { className: "text-2xl" })}
            </div>
            <div>
                <p className="text-[10px] text-[#A098AE] font-bold uppercase">{label}</p>
                <p className="text-sm font-bold text-[#303972]">{value}</p>
            </div>
        </div>
    )
}   