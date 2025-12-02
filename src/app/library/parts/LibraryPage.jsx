'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Box } from '@mui/material'
import BookCard from './BookCard'
import Header from '@/app/components/home-page/Header'
import { fetchBooks } from '@/app/features/AsyncSlices/LibrarySlice'

export default function LibraryPage() {
    const dispatch = useDispatch()
    const books = useSelector((state) => state.library.books) || []
    const loading = useSelector((state) => state.library.loading)

    useEffect(() => {
        dispatch(fetchBooks())
    }, [dispatch])

    // Skeleton Loader
    const SkeletonLoader = () => (
        <Box className="p-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
            ))}
        </Box>
    )

    return (
        <div className="lg:px-10 py-5 sm:px-4 px-2 pt-0">
            <Header prop="المكتبة" />

            {loading ? (
                <SkeletonLoader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    )
}
