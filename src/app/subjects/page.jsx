'use client'
import React, { useEffect, useState } from 'react';
import Header from '../components/home-page/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColleges } from '../features/AsyncSlices/CollegeSlice';
import Filters from './Filters';
import { motion } from 'framer-motion';
import { Skeleton, SkeletonText, Box } from '@mui/material';
import { fetchProfessors } from '../features/AsyncSlices/ProfSlice';

function Page() {
    const dispatch = useDispatch();
    const colleges = useSelector(c => c.colleges.colleges || []);
    const professors = useSelector(p => p.professors.professors || []);
    const [loading, setLoading] = useState(true);

    const [filterCollege, setFilterCollege] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    useEffect(() => {
        dispatch(fetchColleges()).finally(() => setLoading(false));
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchProfessors()).finally(() => setLoading(false));
    }, [dispatch]);

    const filteredColleges = colleges.filter(col =>
        filterCollege ? col.college === filterCollege : true
    );

    const filteredDepartments = filterCollege
        ? colleges
            .find(col => col.college === filterCollege)?.years
            .flatMap(year => year.departments.map(dept => dept.name)) || []
        : [];

    const uniqueFilteredDepartments = [...new Set(filteredDepartments)];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    // for (const pro of professors) {
    //     console.log(pro)

    // }

    // Skeleton component
    const renderSkeleton = () => (
        <div className="w-full rounded-xl bg-white md:p-10 sm:p-5 p-3 shadow my-5">
            <Skeleton
                variant="text"
                width="30%"
                height={40}
                sx={{
                    mb: 2,
                    backgroundColor: '#F5F5F5',
                    '&::after': {
                        background: 'linear-gradient(90deg, #E5E7EB, #F3F4F6, #E5E7EB)',
                    }
                }} />
            {[1, 2].map((_, i) => (
                <div key={i} className="mb-4">
                    <Skeleton variant="text" width="20%" height={30}
                        sx={{
                            mb: 1,
                            backgroundColor: '#F5F5F5',
                            '&::after': {
                                background: 'linear-gradient(90deg, #E5E7EB, #F3F4F6, #E5E7EB)',
                            }
                        }}
                    />

                    {[1, 2].map((_, j) => (
                        <Box key={j} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-5 gap-2 mb-2">
                            {[1, 2, 3].map((k) => (
                                <Skeleton
                                    key={k}
                                    variant="rectangular"
                                    height={100}
                                    className="rounded-lg"
                                    sx={{
                                        backgroundColor: '#F5F5F5',
                                        '&::after': {
                                            background: 'linear-gradient(90deg, #E5E7EB, #F3F4F6, #E5E7EB)',
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen lg:px-10 sm:py-5 pb-5 sm:px-7 px-2">
            <Header prop="المواد" />

            {/* filter */}
            <Filters
                colleges={colleges}
                filterCollege={filterCollege}
                setFilterCollege={setFilterCollege}
                filterDept={filterDept}
                setFilterDept={setFilterDept}
                filterTerm={filterTerm}
                setFilterTerm={setFilterTerm}
                uniqueFilteredDepartments={uniqueFilteredDepartments}
            />

            {loading ? (
                // عرض Skeleton أثناء التحميل
                <>
                    {Array(2).fill(0).map((_, idx) => <div key={idx}>{renderSkeleton()}</div>)}
                </>
            ) : filteredColleges.length === 0 ? (
                <p className="text-gray-500">لا توجد نتائج مطابقة للفلتر</p>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {filteredColleges.map(college => (
                        <motion.div
                            key={college._id}
                            variants={itemVariants}
                            className='w-full rounded-xl bg-white md:p-10 sm:p-5 p-3 shadow my-5'
                        >
                            <h2 className="text-2xl font-bold mb-4 text-[#4D44B5]">{college.college}</h2>
                            {college.years.map(year => (
                                <motion.div key={year.cate} variants={itemVariants} className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3">{year.cate}</h3>

                                    {year.departments
                                        .filter(dept => filterDept ? dept.name === filterDept : true)
                                        .map(dept => (
                                            <motion.div key={dept.name} variants={itemVariants} className="mb-5">
                                                <h4 className="font-semibold mb-2 text-center">{dept.name}</h4>

                                                {dept.terms
                                                    .filter(term => filterTerm ? term.term === filterTerm : true)
                                                    .map(term => (
                                                        <motion.div key={term.term} variants={itemVariants} className="mb-4">
                                                            <h5 className="font-bold mb-2">الترم {term.term}</h5>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-3 gap-2 bg-[#F3F4FF] sm:p-5 p-3 shadow-inner rounded">
                                                                {term.courses.map(course => {
                                                                    const subjectProf = professors.find(p => p.code === course.professor);
                                                                    return (
                                                                        <motion.div
                                                                            key={course.subCode}
                                                                            className="relative bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden p-3 pr-8"
                                                                        >
                                                                            <span className='absolute h-full w-4 bg-[#4D44B5] right-0 top-0' />
                                                                            <h2 className="font-bold text-lg text-[#4D44B5]">{course.subject}</h2>
                                                                            <p className="text-gray-600 mt-1">القسم: {dept.name}</p>
                                                                            <p className="text-gray-600 mt-1">{subjectProf?.fullName || 'غير محدد'}</p>
                                                                        </motion.div>
                                                                    )
                                                                })}

                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </motion.div>
                                        ))}
                                </motion.div>
                            ))}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default Page;
