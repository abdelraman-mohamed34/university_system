'use client'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { EditAssignment } from '../../features/AsyncSlices/CollegeSlice'
import { fetchCloudinary } from '../../features/AsyncSlices/ImagesSlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function EditAssignmentModal({ assignment, currentSubCode, onClose }) {
    const dispatch = useDispatch()
    const [newTitle, setNewTitle] = useState(assignment.title)
    const [newDetails, setNewDetails] = useState(assignment.question)
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [loading, setLoading] = useState(false)

    const inputRef = useRef()

    const handleUpdate = async () => {
        if (!newTitle.trim()) return alert("يرجى إدخال عنوان")
        setLoading(true)
        let uploadedUrls = Array.isArray(assignment.img) ? [...assignment.img] : (assignment.img ? [assignment.img] : [])

        try {
            if (files.length > 0) {
                const results = await Promise.all(files.map(f => dispatch(fetchCloudinary(f)).unwrap()))
                uploadedUrls = [...uploadedUrls, ...results.map(r => r.url)]
            }

            await dispatch(EditAssignment({
                subCode: currentSubCode,
                assignmentId: assignment.id,
                updates: { ...assignment, title: newTitle, question: newDetails, img: uploadedUrls }
            }))
            window.location.reload()
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const onFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...selectedFiles])
        setPreviews(prev => [...prev, ...selectedFiles.map(f => URL.createObjectURL(f))])
    }

    return (
        <div className="fixed inset-0 z-[100] flex sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                className="bg-white w-full max-w-3xl rounded-3xl sm:rounded-2xl p-6 text-right m-2"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-bold text-[#303972]">تعديل بيانات الواجب</h3>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">عنوان الواجب</label>
                        <input
                            className="w-full border-2 border-gray-100 focus:border-[#4D44B5] p-3 rounded-xl bg-gray-50 outline-none transition-all"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">التفاصيل أو الأسئلة</label>
                        <textarea
                            className="w-full border-2 border-gray-100 focus:border-[#4D44B5] p-3 rounded-xl bg-gray-50 outline-none transition-all"
                            rows={4}
                            value={newDetails}
                            onChange={e => setNewDetails(e.target.value)}
                        />
                    </div>

                    {/* Image Preview & Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 mr-1">المرفقات الإضافية</label>
                        <div className="grid grid-cols-4 gap-2">
                            <AnimatePresence>
                                {previews.map((p, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square">
                                        <img src={p} className="w-full h-full object-cover rounded-xl border-2 border-gray-100" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#4D44B5] transition-all text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[10px] mt-1">أضف صور</span>
                                <input type="file" multiple className="hidden" ref={inputRef} onChange={onFileChange} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    <button
                        disabled={loading}
                        onClick={handleUpdate}
                        className={`flex-[2] py-3.5 bg-[#4D44B5] text-white rounded-xl font-bold shadow-lg shadow-[#4D44B5]/20 flex items-center justify-center gap-2 transition-transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {loading ? "جاري الحفظ..." : "تحديث الواجب"}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 border-2 border-gray-100 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </motion.div>
        </div>
    )
}