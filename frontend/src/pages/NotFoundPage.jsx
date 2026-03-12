import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Search } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center"
        >
            <div className="relative mb-8">
                <div className="text-[120px] font-black text-slate-100 leading-none select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg">
                        <Search size={36} className="text-indigo-400" />
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
                Page Not Found
            </h1>
            <p className="text-slate-500 max-w-md mb-8 font-medium leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been moved. 
                Let's get you back to exploring workshops.
            </p>

            <div className="flex gap-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:-translate-y-[1px]"
                >
                    <Home size={16} />
                    Go Home
                    <ArrowRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
}
