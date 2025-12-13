'use client'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { setSearch } from '@/app/features/NormalSlices/searchSlice';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { setShowDrawer } from '@/app/features/NormalSlices/drawerSlice';

function Header({ prop, showSearch, showAddTeacher }) {

    // auth
    const { data: session } = useSession();
    const route = '/myAccount';
    const dispatch = useDispatch()

    return (
        <div className='w-full'>
            {/* الجزء العلوي: الأفاتار، العنوان، زر الإضافة، وزر قائمة الهاتف */}
            <div className="relative w-full flex justify-between items-center sm:py-5 pt-5 pb-3 lg:pl-0 pl-8 pr-3">

                {/* الأفاتار والعنوان */}
                <div className='flex items-center gap-3'>
                    <Link href={route}>
                        {session?.user ? (
                            session?.user?.photo?.trim() === '' || !session?.user?.photo ? (
                                <Avatar
                                    sx={{ bgcolor: '#C1BBEB' }}
                                    alt={session?.user?.fullName}
                                    src="/broken-image.jpg"
                                >
                                </Avatar>
                            ) : (
                                <span className='w-10 h-10 rounded-full flex bg-white overflow-hidden shadow-xl'>
                                    <img src={session?.user?.photo} alt="profile image" className='object-cover' />
                                </span>
                            )
                        ) : (
                            <span className='w-10 aspect-square rounded-full justify-center items-center flex bg-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </span>
                        )}
                    </Link>
                    <h1 className="font-bold lg:text-3xl sm:text-2xl text-lg text-[#303972]">{prop}</h1>
                </div>

                {/* صندوق البحث (يظهر على الشاشات الكبيرة/الكمبيوتر فقط) */}
                {showSearch === true && (
                    <div className="hidden lg:flex items-center gap-2 rounded-3xl px-4 py-1 border border-gray-300 bg-white ml-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.2}
                            stroke="currentColor"
                            className={`w-5 h-5 text-[#303972] cursor-pointer font-bold`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="ابحث..."
                            className="focus:outline-none"
                            onChange={(e) => dispatch(setSearch(e.target.value))}
                        />
                    </div>
                )}

                {/* زر فتح القائمة الجانبية (يظهر على الشاشات الصغيرة فقط) */}
                <button className='absolute left-3 lg:hidden flex' onClick={() => dispatch(setShowDrawer(true))}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* زر إضافة معلم (يظهر على اليمين) */}
                {showAddTeacher && (
                    <Link href={'/addNewTeacher'}
                        className="flex justify-center items-center gap-2 bg-white text-[#4D44B5] p-3 px-5 rounded-2xl 
                            hover:bg-[#4D44B5] hover:text-white hover:scale-105 transition-all duration-200 lg:ml-0 ml-3"
                    >
                        <p>إضافة</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </Link>
                )}
            </div>

            {/* صندوق البحث (يظهر تحت الرأس وعلى الشاشات الصغيرة فقط) */}
            {showSearch === true && (
                <div className="flex w-full px-2 mb-4 lg:hidden">
                    <div className="flex items-center flex-1 gap-2 rounded-3xl px-4 py-1 border border-gray-300 bg-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.2}
                            stroke="currentColor"
                            className={`w-5 h-5 text-[#303972] cursor-pointer font-bold`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="ابحث..."
                            className="focus:outline-none flex-1"
                            onChange={(e) => dispatch(setSearch(e.target.value))}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header