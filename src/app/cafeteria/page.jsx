'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFood } from '../features/AsyncSlices/FoodSlice'
import Link from 'next/link'
import Header from '../components/home-page/Header'
import { motion } from 'framer-motion'
import OrderModal from './parts/OrderModal'
import { useSession } from 'next-auth/react'
import { setShowSnackbar } from '../features/NormalSlices/snackSlice'

// Skeleton Component
const FoodSkeleton = () => (
    <div className="animate-pulse p-4 grid grid-cols-6 gap-2 bg-gray-100 rounded-lg">
        <div className="h-5 bg-gray-300 rounded col-span-1" />
        <div className="h-5 bg-gray-300 rounded col-span-1" />
        <div className="h-5 bg-gray-300 rounded col-span-1" />
        <div className="h-5 bg-gray-300 rounded col-span-1" />
        <div className="h-8 bg-gray-300 rounded col-span-1" />
        <div className="h-8 bg-gray-300 rounded col-span-1" />
    </div>
)

function Page() {

    const { foods, loading } = useSelector(f => f.food)
    console.log(foods)

    const dispatch = useDispatch()

    const [openModal, setOpenModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const { data: session } = useSession()
    const user = session?.user
    const handleOrderClick = (item) => {
        setSelectedItem(item)
        setOpenModal(true)
    }

    const confirmOrder = (item) => {
        console.log("Order confirmed:", item)
    }

    useEffect(() => {
        dispatch(fetchFood())
    }, [dispatch])

    return (
        <div className="lg:px-10 sm:py-5 pb-5 sm:px-7 px-2">
            <Header prop={'الطعام'} />

            <div className="w-full rounded-xl bg-white md:p-10 sm:p-5 p-3 shadow my-5">

                {/* Skeleton Loader */}
                {loading && (
                    <ul className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FoodSkeleton key={i} />
                        ))}
                    </ul>
                )}

                {/* Real Data */}
                {!loading && (
                    <ul className="flex flex-col gap-3">
                        {foods?.map((item, index) => (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="
                                        p-4 
                                        grid 
                                        grid-cols-2 
                                        sm:grid-cols-3 
                                        md:grid-cols-4 
                                        lg:grid-cols-6 
                                        gap-2 
                                        bg-gray-50 
                                        rounded-lg 
                                        hover:bg-gray-100 
                                        transition
                                    "
                            >
                                {/* اسم الوجبة - يظهر دائمًا */}
                                <div className="flex items-center font-bold text-lg whitespace-nowrap text-[#303972]">
                                    {item.name}
                                </div>

                                {/* التقييم - يظهر من sm فما فوق */}
                                <p className="font-semibold hidden sm:flex items-center justify-center gap-1">
                                    {item.rating}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-yellow-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </p>

                                {/* عدد الطلبات - يظهر من md فما فوق */}
                                <div className="hidden md:flex items-center gap-2 justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#4D44B5]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                    </svg>
                                    <div className="flex flex-col text-center">
                                        <p className="font-semibold">{item.sales}</p>
                                        <p className="text-xs text-gray-400">كل الطلبات</p>
                                    </div>
                                </div>

                                {/* نسبة الشراء - تظهر من lg */}
                                <div className="hidden lg:flex justify-center items-center gap-2">
                                    <p className="font-semibold">{item.purchaseRate * 100}%</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 text-[#4D44B5]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                    </svg>
                                </div>

                                {/* زر طلب - يظهر دائمًا */}
                                <button onClick={() => {
                                    user ? handleOrderClick(item) : dispatch(setShowSnackbar({
                                        message: 'تحتاج الي تسجيل الدخول للطلب',
                                        state: true,
                                        severity: 'warning',
                                    }))
                                }}
                                    className="py-1 px-3 rounded-lg bg-[#4D44B5] text-white hover:bg-[#3c358b] transition">
                                    طلب
                                </button>

                                {/* إعدادات - تظهر من md فما فوق */}
                                <Link href="#" className="hidden md:flex text-gray-500 justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </Link>
                            </motion.li>

                        ))}
                    </ul>
                )}
            </div>
            <OrderModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                item={selectedItem}
                onConfirm={confirmOrder}
            />
        </div>
    )
}

export default Page
