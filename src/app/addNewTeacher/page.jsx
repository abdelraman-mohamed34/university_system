'use client'
import React from 'react'
import Header from '../components/home-page/Header'
import PerformancesDeatails from './parts/PerformancesDeatails'

function page() {


    return (
        <div className='relative w-full rounded-xl p-5 gap-4 lg:px-10 sm:px-7sm:py-5 pb-5 px-2'>
            <Header prop={'إضافة معلم جديد'} />
            <PerformancesDeatails />
        </div>
    )
}

export default page
