import React from 'react';
import Link from 'next/link';

function Footer() {
    const quickLinks = [
        { name: "حول جامعتي", href: "/about" },
        { name: "الخدمات الطلابية", href: "/services" },
        { name: "الخصوصية", href: "/privacy" },
        { name: "شروط الاستخدام", href: "/terms" },
    ];

    const contactInfo = [
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            , text: "123 طريق الجامعة، القاهرة، مصر"
        },
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
            , text: "+20 123 456 7890"
        },
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>
            , text: "info@gam3aty.edu"
        },
    ];

    return (
        <footer className="bg-[#4D44B5] text-white pt-12 pb-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/20 pb-8 mb-6">

                    {/* logo */}
                    <div className="text-right">
                        <h3 className="text-3xl font-bold text-[#FCC43E] mb-3">جامعتي</h3>
                        <p className="text-sm text-white/80">
                            منصة متكاملة لإدارة التعليم والخدمات الأكاديمية.
                        </p>
                    </div>

                    {/* links */}
                    <div className="text-right">
                        <h4 className="text-lg font-semibold mb-4 border-b border-[#FCC43E]/50 pb-1 w-fit">
                            روابط سريعة
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name} className="hover:text-[#FCC43E] transition duration-200">
                                    <Link href={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-right">
                        <h4 className="text-lg font-semibold mb-4 border-b border-[#FCC43E]/50 pb-1 w-fit">
                            تواصل معنا
                        </h4>
                        <ul className="space-y-3">
                            {contactInfo.map((item) => (
                                <li key={item.text} className="flex items-center text-white/90">
                                    <span className="text-lg ml-3">{item.icon}</span>
                                    <span className="text-sm">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* copy right */}
                <div className="text-center text-sm text-white/70 pt-4">
                    &copy; {new Date().getFullYear()} جامعتي. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
