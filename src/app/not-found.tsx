import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
      <div className="max-w-md w-full bg-[#121622] border-2 border-[#232B3E] rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 mx-auto flex-shrink-0 drop-shadow-[0_4px_16px_rgba(229,169,60,0.35)]">
          <Image
            src="/karnataka-gym-logo.png"
            alt="Karnataka Gym Hubballi"
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-[#E5A93C] font-mono block">404</span>
          <h1 className="text-xl font-black text-white">Page Not Found</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            The page you are looking for does not exist or has been moved. Check the URL or return to Karnataka Gym home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/"
            className="flex-1 bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Go to Home</span>
          </Link>
          <a
            href="tel:9902667407"
            className="flex-1 bg-[#1A2234] hover:bg-[#232D44] border border-[#2B354C] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#E5A93C]" />
            <span>Call Helpline</span>
          </a>
        </div>

        <div className="pt-2 border-t border-[#1C2333] text-[10px] text-slate-500">
          Karnataka Gym Hubballi • Station Road, Hubballi - 580020
        </div>
      </div>
    </div>
  );
}

