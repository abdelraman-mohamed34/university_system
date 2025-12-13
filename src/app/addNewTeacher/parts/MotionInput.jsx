'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react';

function MotionInput({ label, id, type = 'text', value, onChange, placeholder, options = [], isRequired = true, multiple = false, error }) {

    const [isFocused, setIsFocused] = useState(false);

    const selectSize = multiple ? Math.min(options.length + (multiple && options.length > 0 ? 1 : 0), 6) : undefined;

    const handleChipToggle = (selectedValue) => {
        let newValues;

        const currentValues = Array.isArray(value) ? value : [];

        if (currentValues.includes(selectedValue)) {
            newValues = currentValues.filter(v => v !== selectedValue);
        } else {
            newValues = [...currentValues, selectedValue];
        }

        const syntheticEvent = {
            target: {
                name: id,
                value: newValues,
                type: 'multiselect-chip',
            }
        };
        onChange(syntheticEvent);
    };

    const borderClass = error
        ? 'border-red-500 ring-2 ring-red-200'
        : isFocused
            ? 'border-indigo-500 ring-2 ring-indigo-200'
            : 'border-gray-300';


    const isChipMultiSelect = type === 'select' && multiple === true;

    return (
        <motion.div className="flex flex-col justify-between space-y-2">
            <label htmlFor={id} className={`text-sm font-semibold ${error ? 'text-red-600' : 'text-gray-700'}`}>
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>

            {isChipMultiSelect ? (
                <div
                    id={id}
                    className={`w-full p-3 border rounded-lg transition duration-200 focus:outline-none flex flex-wrap gap-2 
                        ${borderClass}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    tabIndex={0}
                >
                    {options.length > 0 ? (
                        options.map((opt) => {
                            const isSelected = Array.isArray(value) && value.includes(opt.value);

                            return (
                                <motion.button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleChipToggle(opt.value)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition duration-150 ease-in-out cursor-pointer flex items-center 
                                        ${isSelected
                                            ? 'bg-[#4D44B5] text-white shadow-md hover:bg-[#303972]'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {opt.label}
                                    {isSelected && <X size={12} className="mr-1" />}
                                </motion.button>
                            );
                        })
                    ) : (
                        <span className="text-gray-500 text-sm">لا توجد خيارات متاحة.</span>
                    )}
                </div>

            ) : type === 'select' ? (
                <select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    multiple={multiple}
                    required={isRequired}
                    {...(multiple && { size: selectSize })}
                    className={`w-full p-3 border rounded-lg transition duration-200 focus:outline-none 
                        ${borderClass}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                    {!multiple && <option value="">{placeholder}</option>}
                    {options.map((opt, i) => (
                        <option key={opt.value || i} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={isRequired}
                    className={`w-full text-black p-3 border rounded-lg transition duration-200 focus:outline-none
                        ${borderClass}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1" dir="rtl">{error}</p>
            )}

        </motion.div>
    );
};

export default MotionInput;