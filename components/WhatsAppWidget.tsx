"use client";

import { motion } from "framer-motion";

// Official WhatsApp SVG icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.558 1.875 14.09 .843 11.458.841c-5.437 0-9.862 4.42-9.866 9.865-.001 1.714.457 3.39 1.32 4.908l-.99 3.612 3.703-.97zM17.487 14.39c-.3-.15-1.774-.875-2.026-.967-.253-.09-.436-.137-.62.137-.183.274-.707.875-.867 1.058-.16.183-.32.206-.62.056-3.01-1.503-4.887-3.86-5.882-5.57-.263-.452-.03-.697.195-.922.203-.203.436-.514.654-.772.218-.258.29-.442.436-.737.144-.294.07-.55-.035-.762-.105-.21-.867-2.09-1.19-2.868-.314-.757-.633-.654-.867-.666-.225-.012-.482-.015-.74-.015-.258 0-.678.096-.1.314-.16.183-.346-.575-.922-1.41-1.284-.338-.344-.66-.463-.995-.463-.332 0-.616.03-.83.09-.21.058-.437.214-.654.452-.218.238-.83.81-.83 1.977 0 1.167.848 2.296.967 2.456.12.16 1.67 2.548 4.044 3.57.566.243.83.322 1.096.406.57.18 1.09.155 1.5.093.456-.068 1.775-.726 2.027-1.43.25-.702.25-1.306.175-1.43-.075-.124-.275-.198-.574-.348z" />
    </svg>
);

export default function WhatsAppWidget() {
    const whatsappUrl = "https://wa.me/917737796817?text=Hello%20Tenet%20Archives%2C%20I%20have%20a%20question%20about%20your%20collection...";

    return (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-40 flex flex-col items-end">
            {/* Main Floating Button */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
                aria-label="Contact support on WhatsApp"
            >
                {/* Official Icon */}
                <WhatsAppIcon className="w-6 h-6 lg:w-7 lg:h-7" />
            </motion.a>
        </div>
    );
}
