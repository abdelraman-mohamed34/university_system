'use client'

import { useSession } from 'next-auth/react';
import React from 'react'

export default function NotesCard() {
    const { data: session } = useSession();
    const user = session?.user
    const notes = user?.notes
    return (
        <></>
        // <div className="mt-6 p-4 rounded-md bg-white shadow-md">
        //     <h6 className="font-semibold">ملاحظات شخصية:</h6>
        //     <p>{notes || 'لا توجد ملاحظات'}</p>
        // </div>
    )
}
