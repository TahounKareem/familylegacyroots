import React from "react";
import { Link } from "react-router";
import { MessageCircle, Calendar } from "lucide-react";

interface ConsultantCtaBarProps {
  id?: string;
  className?: string;
}

export function ConsultantCtaBar({ id = "consultant-cta-bar", className = "" }: ConsultantCtaBarProps) {
  return (
    <div
      id={id}
      dir="rtl"
      className={`w-full bg-[#FAF7F5] border border-[#E8DDD4] rounded-2xl px-5 py-4 sm:py-3.5 shadow-xs transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="w-9 h-9 rounded-xl bg-brand-100/60 border border-brand-200/60 flex items-center justify-center text-brand-800 shrink-0 shadow-2xs">
            <MessageCircle className="w-4 h-4 text-brand-800" />
          </div>
          <span className="font-serif font-bold text-brand-900 text-base sm:text-lg leading-relaxed">
            تحدثوا مع مستشار توثيق التراث العائلي
          </span>
        </div>

        {/* CTA Controls: WhatsApp Number + Intro Session Button */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* WhatsApp Direct Chat */}
          <a
            id={`${id}-whatsapp`}
            href="https://wa.me/447403650940"
            target="_blank"
            rel="noopener noreferrer"
            title="تواصل معنا مباشرة عبر واتساب"
            className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-2.5 bg-white hover:bg-emerald-50/50 text-gray-800 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 rounded-xl text-sm transition-all duration-200 shadow-2xs group"
          >
            <span className="w-6 h-6 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
            </span>
            <span className="font-sans font-bold tracking-tight text-gray-800 group-hover:text-emerald-900 text-xs sm:text-sm" dir="ltr">
              (+44) 7403650940
            </span>
          </a>

          {/* Book Intro Session Button */}
          <Link
            id={`${id}-booking`}
            to="/intro-session"
            className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-[#722f37] hover:bg-[#5a242b] text-white rounded-xl font-serif font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-200" />
            <span>أو احجز جلسة تعريف</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
