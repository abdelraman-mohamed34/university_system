import React, { Suspense } from 'react'
import Data from './Data'

function page() {
    return (
        <Suspense fallback='جاري التحميل ...'>
            <Data />
        </Suspense>
    )
}

export default page
