import React, { Suspense } from 'react'
import AssignmentDetails from './AssignmentDetails'

function page() {
    return (
        <Suspense fallback='جاري التحميل...'>
            <AssignmentDetails />
        </Suspense>
    )
}

export default page
