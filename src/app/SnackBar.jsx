'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSnackbar } from './features/NormalSlices/snackSlice';

export default function SnackBar() {
    const dispatch = useDispatch();
    const showSnackbar = useSelector((s) => s.snackbar.showSnackbar);

    // لإضافة تأثير التلاشي (Fade-in/out)
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showSnackbar?.state) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [showSnackbar?.state]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            dispatch(setShowSnackbar({ state: false, message: '', severity: '' }));
        }, 300);
    };

    if (!showSnackbar?.state && !isVisible) return null;

    return (
        <div
            className={`fixed bottom-4 left-4 z-50 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
            <div className="flex items-center bg-[#F5F5F5] text-white px-4 py-3 rounded shadow-lg min-w-[300px] font-tajawal">

                <div className="flex-shrink-0 ml-3">
                    {showSnackbar?.severity === 'success' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 text-[#66BB6A]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    )}
                    {showSnackbar?.severity === 'warn' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 text-orange-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    )}
                    {showSnackbar?.severity === 'error' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    )}
                </div>

                <div className="flex-grow text-right text-[15px] font-medium px-2 text-gray-700">
                    {showSnackbar?.message || "Connecting to store"}
                </div>

                {/* زر الإغلاق (Action) */}
                <button
                    onClick={handleClose}
                    className="mr-10 flex items-center text-[#66BB6A] transition-colors uppercase font-bold text-sm focus:outline-none"
                    aria-label="cancel connection"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}