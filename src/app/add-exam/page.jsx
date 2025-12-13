import React, { Suspense } from 'react'
import AddExamPage from './AddExamPage'

function page() {
    return (
        <Suspense fallback='جاري التحميل...'>
            <AddExamPage />
        </Suspense>
    )
}

export default page
