import React, { Suspense } from 'react'
import Image from './Image'

function page() {
  return (
    <Suspense fallback='جاري التحميل...'>
      <Image />
    </Suspense>
  )
}

export default page
