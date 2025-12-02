
"use client";
import { motion } from "framer-motion";

export default function EditAssignmentModal({
    assignment,
    newTitle,
    setNewTitle,
    setNewDeatails,
    newDeatails,
    setFile,
    preview,
    setPreview,
    updateAssignment,
    onClose
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur bg-opacity-40 flex justify-center items-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white w-full max-w-4xl p-5 rounded-lg shadow-lg"
            >
                <h2 className="text-xl font-bold text-[#4D44B5] mb-4">تعديل الواجب</h2>

                {/* تغيير العنوان */}
                <label className="block mb-2 font-medium">عنوان الواجب</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border rounded p-2 mb-4 bg-gray-50 focus:ring-2 focus:ring-[#4D44B5]"
                />
                <label className="block mb-2 font-medium"> الواجب</label>
                <input
                    type="text"
                    value={newDeatails}
                    onChange={(e) => setNewDeatails(e.target.value)}
                    className="w-full border rounded p-2 mb-4 bg-gray-50 focus:ring-2 focus:ring-[#4D44B5]"
                />

                {/* تغيير الصورة */}
                <div className="flex flex-col gap-3">

                    <label className="font-medium">تغيير الصورة</label>

                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full max-h-60 object-contain rounded mb-3"
                        />
                    ) : assignment?.img ? (
                        <img
                            src={assignment.img}
                            alt="current"
                            className="w-full max-h-60 object-contain rounded mb-3"
                        />
                    ) : null}

                    <label
                        htmlFor="editFile"
                        className="w-full border-dashed border-gray-300 border-2 p-4 rounded text-center cursor-pointer text-gray-500 hover:bg-gray-50 transition"
                    >
                        اختر صورة جديدة
                    </label>
                    <input
                        id="editFile"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files[0];
                            setFile(f);
                            if (f) setPreview(URL.createObjectURL(f));
                        }}
                    />
                </div>

                {/* أزرار */}
                <div className="flex justify-between mt-5 gap-2">
                    <button
                        onClick={updateAssignment}
                        className="flex-1 px-4 py-2 bg-[#4D44B5] text-white rounded hover:bg-[#5c52ce]"
                    >
                        حفظ التعديلات
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400/70"
                    >
                        إلغاء
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
