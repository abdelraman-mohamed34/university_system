
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "./Wrapper.js";
import OneSignalInitializer from "./components/OneSignalInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "جامعتي",
  description: "مطور من قبل عبدالرحمن طالب في كلية الهندسة الزراعية جامعة الأزهر بالقاهرة - +201021079171",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OneSignalInitializer />
        <Wrapper>{children}</Wrapper>
      </body>
    </html >
  );
}
