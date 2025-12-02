"use client";

import { sidebarMenu } from "../data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { setShowDrawer } from "../features/NormalSlices/drawerSlice";

export default function SideBar() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const showDrawer = useSelector(d => d.drawer.showDrawer); // menu btn

    // Sidebar items component
    const SidebarItems = () => (
        <ul>
            {sidebarMenu.map(item => {
                const isActive = pathname === item.path;
                return (
                    <Link key={item.name} href={item.path}>
                        <li
                            className={`p-3 my-0.5 text-lg rounded-l-3xl flex gap-2 items-center whitespace-nowrap cursor-pointer
                                ${isActive
                                    ? "bg-[#F5F5F5] text-[#4D44B5]"
                                    : "bg-transparent text-white hover:bg-[#F5F5F5] hover:text-[#4D44B5]"}`}
                            onClick={() => dispatch(setShowDrawer(false))}
                        >
                            <span>{item.icon}</span>
                            <h6>{item.name}</h6>
                        </li>
                    </Link>
                );
            })}
        </ul>
    );

    // Sidebar content
    const sidebarContent = (
        <>
            {/* Header */}
            <div className="flex justify-center items-center p-4 gap-3">
                <h2 className="text-lg text-white font-semibold">Akademi</h2>
                <span className="aspect-square rounded-xl p-1.5 px-3 text-center bg-[#FB7D5B] text-white font-bold text-2xl">
                    A
                </span>
            </div>

            {/* Body */}
            <div className="w-full h-130 pl-4 flex-1 overflow-y-auto hide-scrollbar">
                <SidebarItems />
            </div>
        </>
    );

    // Desktop sidebar
    const desktopSidebar = (
        <motion.div
            className="fixed top-0 left-0 h-full w-[250px] bg-[#4D44B5] flex-col pb-10 lg:flex hidden z-50"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {sidebarContent}
        </motion.div>
    );

    // Mobile sidebar portal
    const mobileSidebar = showDrawer
        ? createPortal(
            <motion.div
                className="fixed inset-0 z-50 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div
                    className="bg-black/70 w-full h-screen backdrop-blur"
                    onClick={() => dispatch(setShowDrawer(false))}
                />
                {/* Sidebar */}
                <motion.div
                    className="absolute left-0 h-full w-[250px] bg-[#4D44B5] flex-col pb-10 z-50"
                    initial={{ x: -250 }}
                    animate={{ x: 0 }}
                    exit={{ x: -250 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {sidebarContent}
                </motion.div>
            </motion.div>,
            document.getElementById("sidebar-root")
        )
        : null;

    return (
        <>
            {desktopSidebar}
            {mobileSidebar}
        </>
    );
}