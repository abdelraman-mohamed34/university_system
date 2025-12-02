'use client'
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function Filters({
    colleges,
    filterCollege,
    setFilterCollege,
    filterDept,
    setFilterDept,
    filterTerm,
    setFilterTerm,
    uniqueFilteredDepartments
}) {
    return (
        <div className="flex flex-row sm:gap-3 gap-1 mb-6">

            {/* فلتر الكلية */}
            <Autocomplete
                options={colleges.map(col => col.college)}
                value={filterCollege}
                onChange={(e, newValue) => {
                    setFilterCollege(newValue || '');
                    setFilterDept('');
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="الكلية"
                        variant="outlined"
                        size="small"
                        sx={{
                            input: {
                                color: '#4D44B5',
                                fontWeight: '500',
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                backgroundColor: '#FFF',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                    boxShadow: 'none',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#A098AE',
                            },
                            '& .MuiAutocomplete-endAdornment': {
                                right: '8px',
                            },
                        }}
                    />
                }
                ListboxProps={{
                    sx: {
                        '& .MuiAutocomplete-option': {
                            '&.Mui-focused': { backgroundColor: '#F3F4FF' },
                            '&.Mui-selected': { backgroundColor: '#F3F4FF', color: '#1E1E1E' },
                        },
                    }
                }}
                className="flex-1"
            />

            {/* فلتر القسم */}
            <Autocomplete
                options={uniqueFilteredDepartments}
                value={filterDept}
                onChange={(e, newValue) => setFilterDept(newValue || '')}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="القسم"
                        variant="outlined"
                        size="small"
                        sx={{
                            input: { color: '#4D44B5', fontWeight: '500' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                backgroundColor: '#FFF',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                    boxShadow: 'none',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                },
                            },
                            '& .MuiInputLabel-root': { color: '#A098AE' },
                            '& .MuiAutocomplete-endAdornment': { right: '8px' },
                        }}
                    />
                }
                ListboxProps={{
                    sx: {
                        '& .MuiAutocomplete-option': {
                            '&.Mui-focused': { backgroundColor: '#F3F4FF' },
                            '&.Mui-selected': { backgroundColor: '#F3F4FF', color: '#1E1E1E' },
                        },
                    }
                }}
                className="flex-1"
            />

            {/* فلتر الترم */}
            <Autocomplete
                options={[1, 2]}
                getOptionLabel={(option) => option.toString()}
                value={filterTerm}
                onChange={(e, newValue) => setFilterTerm(newValue || '')}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="الترم"
                        variant="outlined"
                        size="small"
                        sx={{
                            input: { color: '#4D44B5', fontWeight: '500' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                backgroundColor: '#FFF',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                    boxShadow: 'none',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#C0B9E3',
                                },
                            },
                            '& .MuiInputLabel-root': { color: '#A098AE' },
                            '& .MuiAutocomplete-endAdornment': { right: '8px' },
                        }}
                    />
                }
                ListboxProps={{
                    sx: {
                        '& .MuiAutocomplete-option': {
                            '&.Mui-focused': { backgroundColor: '#F3F4FF' },
                            '&.Mui-selected': { backgroundColor: '#F3F4FF', color: '#1E1E1E' },
                        },
                    }
                }}
                className="flex-1"
            />

        </div>
    )
}
