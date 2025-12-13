'use client'
import { useEffect, useRef } from 'react'
import OneSignal from 'react-onesignal'

export default function OneSignalInitializer() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const initOneSignal = async () => {
            try {
                await OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                    allowLocalhostAsSecureOrigin: true,
                    notifyButton: { enable: true },
                });

                initialized.current = true;
                const OS = window.OneSignal || OneSignal;
                if (OS.Slidedown && typeof OS.Slidedown.promptHttpPermission === 'function') {
                    await OS.Slidedown.promptHttpPermission();
                } else if (typeof OS.showSlidedownPrompt === 'function') {
                    await OS.showSlidedownPrompt();
                } else {
                    console.warn("OneSignal Slidedown methods not found, check SDK version.");
                }

            } catch (error) {
                console.error("OneSignal Initialization Error:", error);
            }
        };

        initOneSignal();
    }, []);

    return null;
}