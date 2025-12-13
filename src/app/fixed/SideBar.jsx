"use client";

import { sidebarMenu } from "../data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { setShowDrawer } from "../features/NormalSlices/drawerSlice";
import { globals } from "../../../data/global";

export default function SideBar() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const showDrawer = useSelector(d => d.drawer.showDrawer);

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
                                    ? "bg-[#F3F4FF] text-[#4D44B5]"
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
            <div className="flex justify-center items-center p-4 gap-3">
                <h2 className="sm:text-2xl text-lg text-white font-semibold">جامعتي</h2>
                <img src={globals.logoLink} alt="logo" className="w-10 aspect-square object-cover" />
            </div>

            <div className="w-full pl-4 flex-1 overflow-y-auto hide-scrollbar">
                <SidebarItems />
            </div>
        </>
    );

    const desktopSidebar = (
        <motion.div
            className="sticky top-0 h-screen w-[250px] bg-[#4D44B5] flex-col pb-10 lg:flex hidden z-50 overflow-hidden border-r border-[#F3F4FF]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className='flex flex-col h-full'>
                {sidebarContent}
            </div>
        </motion.div>
    );

    // Mobile sidebar portal (Fixed behavior)
    const mobileSidebar = showDrawer
        ? createPortal(
            <motion.div
                className="fixed inset-0 z-50 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className="bg-black/70 w-full h-screen backdrop-blur"
                    onClick={() => dispatch(setShowDrawer(false))}
                />
                <motion.div
                    className="absolute left-0 h-full w-[250px] bg-[#4D44B5] flex-col pb-10 z-50"
                    initial={{ x: -250 }}
                    animate={{ x: 0 }}
                    exit={{ x: -250 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className='flex flex-col h-full'>
                        {sidebarContent}
                    </div>
                </motion.div>
            </motion.div>,
            // تم تغيير createPortal من react-dom بدلاً من react
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