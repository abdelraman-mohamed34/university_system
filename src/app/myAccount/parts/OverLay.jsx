'use client'
import React, { useEffect } from 'react'

function OverLay({ active }) {
    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [active])

    if (active) return null

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-1000 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
    )
}

export default OverLay