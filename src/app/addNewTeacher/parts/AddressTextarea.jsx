'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

function AddressTextarea({ value, onChange }) {
    const maxLength = 2000;
    const charsRemaining = maxLength - value.length;
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            className="flex flex-col space-y-2 col-span-1 md:col-span-2"
        >
            <label htmlFor="address" className="text-sm font-semibold text-gray-700">
                العنوان <span className="text-red-500">*</span>
            </label>
            <div className={`relative border rounded-lg transition duration-200 
                    ${isFocused ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}`}
            >
                <textarea
                    id="address"
                    name="address"
                    rows="5"
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    className="w-full p-3 resize-none rounded-lg focus:outline-none"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <div className="absolute bottom-1 right-3 text-xs text-gray-500">
                    {charsRemaining}/2000
                </div>
            </div>
        </motion.div>
    );
}

export default AddressTextarea
