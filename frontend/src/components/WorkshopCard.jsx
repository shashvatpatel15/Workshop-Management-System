import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Zap, CheckCircle2 } from 'lucide-react';
import { formatDate, getRelativeStatus } from '../utils/dateUtils';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function WorkshopCard({ w, onRegisterClick }) {
    const isFull = w.registered >= w.capacity;
    const status = getRelativeStatus(w.date);
    const fillPercent = Math.min(
        100,
        Math.round((w.registered / w.capacity) * 100)
    );

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "workshop-card group flex flex-col gap-4 p-5 rounded-2xl border bg-white relative overflow-hidden transition-all duration-300 shadow-sm",
                isFull
                    ? "border-red-200 bg-red-50/10"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] bg-white/60 backdrop-blur-md"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-start gap-4 relative z-10">
                <div className="space-y-2 flex-1">
                    <h3 className="text-[17px] font-bold text-slate-800 leading-tight group-hover:text-indigo-900 transition-colors">
                        {w.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                            <Zap size={12} className="text-indigo-500" />
                            {w.club}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                            {w.level}
                        </span>
                    </div>
                </div>
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border shrink-0 shadow-sm",
                    isFull
                        ? "bg-red-50 text-red-600 border-red-200"
                        : status.includes("Completed")
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}>
                    {isFull ? <Users size={12} /> : status === "Completed" ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />}
                    {isFull ? "Full capacity" : status}
                </span>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-3 text-[13px] text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" />
                        <span className="truncate">{formatDate(w.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-purple-500" />
                        <span className="truncate">{w.location}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <Clock size={14} className="text-slate-500" />
                        <span>{w.durationHours} hours immersive session</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                        <span className={cn("text-slate-500", isFull && "text-red-500")}>
                            {isFull ? "Registration closed" : "Available seats"}
                        </span>
                        <span className="text-slate-700">
                            {w.registered} / {w.capacity}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 inset-shadow-sm">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 shadow-sm",
                                fillPercent > 80 ? "bg-amber-500" : fillPercent === 100 ? "bg-red-500" : "bg-indigo-500"
                            )}
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                    {w.topics.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md shadow-sm drop-shadow-sm hover:bg-white hover:text-indigo-600 transition-colors">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className={cn(
                    "text-xs font-bold",
                    isFull ? "text-red-500" : "text-emerald-600"
                )}>
                    {!isFull && `${w.capacity - w.registered} spot${w.capacity - w.registered === 1 ? '' : 's'} remaining`}
                </span>
                <button
                    type="button"
                    disabled={isFull}
                    onClick={() => onRegisterClick(w)}
                    className={cn(
                        "relative inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 overflow-hidden group/btn shadow-sm",
                        isFull
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-[1px]"
                    )}
                >
                    {!isFull && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />}
                    <span className="relative">Register Now</span>
                </button>
            </div>
        </motion.article>
    );
}
