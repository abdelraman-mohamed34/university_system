'use client';
import React, { useState } from 'react';
import ScheduleDetails from './parts/ScheduleDetails';
import CalendarComponent from './parts/CalendarComponent';
import Header from '../components/home-page/Header';

function App() {
    const [currentDay, setCurrentDay] = useState('')
    return (
        <div>
            <Header prop={'جداول الأمتجانات & الكويزات'} />

            <div dir='ltr' className="min-h-screen p-8 pt-0 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-3 lg:px-10 py-5 sm:px-4 px-2">
                <CalendarComponent setCurrentDay={setCurrentDay} />
                <ScheduleDetails currentDay={currentDay} />
            </div>
        </div>
    );
};

export default App;