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
        { icon: "📍", text: "123 طريق الجامعة، القاهرة، مصر" },
        { icon: "📞", text: "+20 123 456 7890" },
        { icon: "📧", text: "info@gam3aty.edu" },
    ];

    return (
        <footer className="bg-[#4D44B5] text-white pt-12 pb-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/20 pb-8 mb-6">

                    {/* عمود الشعار والوصف */}
                    <div className="text-right">
                        <h3 className="text-3xl font-bold text-[#FCC43E] mb-3">جامعتي</h3>
                        <p className="text-sm text-white/80">
                            منصة متكاملة لإدارة التعليم والخدمات الأكاديمية.
                        </p>
                    </div>

                    {/* عمود الروابط السريعة */}
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

                    {/* عمود التواصل */}
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

                {/* حقوق النشر */}
                <div className="text-center text-sm text-white/70 pt-4">
                    &copy; {new Date().getFullYear()} جامعتي. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
