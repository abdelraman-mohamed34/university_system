// app/exam-details/page.jsx
import React, { Suspense } from "react";
import ExamPage from "./ExamPage";

export default function PageWrapper() {
    return (
        <Suspense fallback={<div className="text-center p-10">جارٍ التحميل...</div>}>
            <ExamPage />
        </Suspense>
    );
}
