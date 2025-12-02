"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import SideBar from "./fixed/SideBar";
import { SessionProvider } from "next-auth/react";
import SnackBar from "./SnackBar";
import { usePathname } from "next/navigation";

export default function Wrapper({ children }) {

    const pathname = usePathname();
    const noSidebarPaths = ["/login"];
    const showSidebar = !noSidebarPaths.includes(pathname);

    return (

        // redux
        <Provider store={store}>
            {/* Next Auth */}
            <SessionProvider>
                <div id="sidebar-root"></div>
                <div className={`${showSidebar && ' lg:grid lg:grid-cols-[1fr_250px]'} w-full`}>
                    {showSidebar && <SideBar />}

                    {children}

                    {/* react portal */}
                    <SnackBar />
                </div>
            </SessionProvider>
        </Provider>
    )
}