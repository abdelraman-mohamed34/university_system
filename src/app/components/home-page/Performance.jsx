"use client";
import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Jan", this: 10, last: 20 },
    { name: "Feb", this: 60, last: 35 },
    { name: "Mar", this: 90, last: 50 },
    { name: "Apr", this: 40, last: 25 },
    { name: "May", this: 20, last: 10 },
    { name: "Jun", this: 55, last: 65 },
    { name: "Jul", this: 50, last: 75 },
    { name: "Aug", this: 35, last: 50 },
    { name: "Sep", this: 45, last: 40 },
    { name: "Oct", this: 80, last: 90 },
    { name: "Nov", this: 70, last: 110 },
    { name: "Dec", this: 55, last: 60 },
];

export default function Performance() {
    const [isSmallScreen] = useMediaQuery("(max-width: 450px)");

    return (
        <div className="rounded-xl bg-white sm:p-6 pb-8 w-full lg:h-100 sm:h-70 h-50 sm:mt-5 mt-2">
            {/* ====== TITLE ====== */}
            <div className="sm:p-0 pt-2 pr-3">
                <h2 className="lg:text-2xl sm:text-xl text-lg font-semibold mb-4 text-[#303972]">مستوي النجاح اخر 10 سنين</h2>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: -30, bottom: 0 }}
                >
                    {/* ====== GRADIENTS ====== */}
                    <defs>
                        <linearGradient id="thisWeek" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FCC43E" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#FCC43E" stopOpacity={0.05} />
                        </linearGradient>

                        <linearGradient id="lastWeek" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6A59" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#FF6A59" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    {/* ===== GRID ===== */}
                    <CartesianGrid vertical stroke="#E3E0F8" strokeDasharray="3 3" />

                    {/* ===== X Axis ===== */}
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#A7A3B5", fontSize: 14 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* ===== Y Axis ===== */}
                    <YAxis
                        tick={{ fill: "#A7A3B5", fontSize: 14 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 120]}
                    />

                    {/* ===== TOOLTIP ===== */}
                    <Tooltip
                        contentStyle={{
                            background: "#fff",
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        cursor={null}
                    />

                    {/* ===== LINES ===== */}
                    <Line
                        type="monotone"
                        dataKey="this"
                        stroke="#FCC43E"
                        strokeWidth={!isSmallScreen ? 6 : 4}
                        dot={{ r: 0, fill: "#fff", strokeWidth: 1, stroke: "#FCC43E" }}
                        activeDot={{ r: 0 }}
                        fill="url(#thisWeek)"
                    />
                    <Line
                        type="monotone"
                        dataKey="last"
                        stroke="#FF6A59"
                        strokeWidth={!isSmallScreen ? 6 : 4}
                        activeDot={{ r: 5 }}
                        dot={{ r: 0, fill: "#fff", strokeWidth: 1, stroke: "#FCC43E" }}
                        fill="url(#lastWeek)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div >
    );
}
