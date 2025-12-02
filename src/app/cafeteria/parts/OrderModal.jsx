'use client'
import { backDefaultCount, decrement, increment, updateFood } from "@/app/features/AsyncSlices/FoodSlice"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

export default function OrderModal({ open, onClose, item, onConfirm }) {
    const dispatch = useDispatch()
    const quantity = useSelector(q => q.food.count)
    if (!open) return null

    const orderAndUpdateThisOne = () => {
        dispatch(updateFood({
            id: item.id,
            stock: item.stock - quantity,
            sales: item.sales + quantity,
        }))
        dispatch(backDefaultCount())
    }


    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-40 flex items-center justify-center z-50 px-3"
                onClick={() => {
                    onClose()
                    dispatch(backDefaultCount())
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
                >
                    <h2 className="text-xl font-bold text-[#4D44B5] mb-4 text-center">
                        تأكيد طلب الوجبة
                    </h2>

                    <div className="flex flex-col gap-3 text-gray-700">
                        <p><span className="font-semibold">الوجبة:</span> {item?.name}</p>
                        <p><span className="font-semibold">التقييم:</span> ⭐ {item?.rating}</p>
                        <p><span className="font-semibold">عدد الطلبات:</span> {item?.sales}</p>

                        {/* اختيار الكمية */}
                        <div className="flex items-center gap-3 mt-2">
                            <span className="font-semibold">الكمية:</span>
                            <button onClick={() => dispatch(decrement())} className="px-3 py-1 bg-gray-200 rounded">-</button>
                            <span className="px-2">{quantity}</span>
                            <button onClick={() => dispatch(increment(item))} className="px-3 py-1 bg-gray-200 rounded">+</button>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6 gap-3">
                        <button
                            onClick={() => {
                                onClose()
                                dispatch(backDefaultCount())
                            }}
                            className="flex-1 py-2 rounded-lg border border-gray-400 text-gray-600"
                        >
                            إلغاء
                        </button>

                        <button
                            onClick={() => {
                                orderAndUpdateThisOne()
                                onConfirm(item, quantity)
                                onClose()
                            }}
                            className="flex-1 py-2 rounded-lg bg-[#4D44B5] text-white"
                        >
                            تأكيد الطلب
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
