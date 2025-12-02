'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

function Page() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('src')

  if (!imageUrl) return <p className='text-white'>No image provided</p>

  return (
    <div className='w-full h-screen bg-black flex justify-center items-center sm:p-5'>
      <TransformWrapper
        defaultScale={1}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false }}
      >
        {() => (
          <TransformComponent>
            <img
              src={imageUrl}
              alt='Preview'
              className='max-w-full max-h-screen'
            />
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  )
}

export default Page
