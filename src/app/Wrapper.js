"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import SideBar from "./fixed/SideBar";
import { SessionProvider } from "next-auth/react";
import SnackBar from "./SnackBar";
import { usePathname } from "next/navigation";
import OneSignalInitializer from "./components/OneSignalInitializer";
import Footer from "./Footer";

export default function Wrapper({ children }) {
    const pathname = usePathname();
    const noSidebarPaths = ["/login"];
    const showSidebar = !noSidebarPaths.includes(pathname);


    return (
        <Provider store={store}>
            <SessionProvider>
                <div id="sidebar-root"></div>

                <div className="flex w-full min-h-screen">
                    <main className="flex-1 min-h-screen flex flex-col justify-between w-full">
                        <div className="flex-grow w-full">
                            {children}
                        </div>
                        <Footer />
                    </main>
                    {showSidebar && (
                        <div className="hidden lg:block">
                            <SideBar />
                        </div>
                    )}
                </div>

                <SnackBar />
                <OneSignalInitializer />

            </SessionProvider>
        </Provider>
    );
}