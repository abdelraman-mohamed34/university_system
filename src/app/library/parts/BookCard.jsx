'use client'
import React from 'react'

export default function BookCard({ book }) {
    return (
        <div className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <img
                src={book.image || '/default-book.png'}
                alt={book.title}
                className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-bold text-[#4D44B5] truncate">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2 truncate">{book.author}</p>
            <p className="text-gray-500 text-sm line-clamp-3">{book.description}</p>
        </div>
    )
}
