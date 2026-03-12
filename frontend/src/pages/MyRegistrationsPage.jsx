import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistrations } from '../hooks/useRegistrations';
import { Bookmark, Calendar, Building, Mail, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyRegistrationsPage() {
    const { registrations, removeRegistration } = useRegistrations();
    const [removingId, setRemovingId] = useState(null);

    const handleDeregister = async (id) => {
        if (!window.confirm("Are you sure you want to deregister from this workshop?")) return;
        try {
            setRemovingId(id);
            await removeRegistration(id);
        } catch (err) {
            alert(err);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        My Dashboard
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        You're currently registered for <span className="text-indigo-600 font-bold">{registrations.length}</span> upcoming session{registrations.length !== 1 && 's'}.
                    </p>
                </div>
                <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center shadow-sm">
                    <Bookmark size={24} className="text-indigo-600" />
                </div>
            </div>

            <AnimatePresence>
                {registrations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-full bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 flex items-center justify-center">
                            <Calendar size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Registrations</h3>
                        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed font-medium">
                            Explore our catalogue of workshops and level up your skills today.
                        </p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 hover:-translate-y-[1px]"
                        >
                            Browse Catalog <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-5">
                        {registrations.map((reg, i) => (
                            <motion.article
                                key={reg.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white backdrop-blur-xl border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row gap-6 hover:border-indigo-300 transition-colors group relative overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors pointer-events-none" />

                                <div className="flex-1 space-y-5 relative z-10">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-700 transition-colors tracking-tight">
                                            {reg.workshopTitle}
                                        </h3>
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide shadow-sm">
                                            {reg.club}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600 font-medium">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <span className="text-xs font-black text-slate-400">@</span>
                                            </div>
                                            <span className="truncate">{reg.attendeeName}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <Mail size={12} className="text-purple-500" />
                                            </div>
                                            <span className="truncate">{reg.attendeeEmail}</span>
                                        </div>
                                        {reg.dept && (
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                    <Building size={12} className="text-emerald-500" />
                                                </div>
                                                <span className="truncate">{reg.dept} {reg.year ? `• Year ${reg.year}` : ''}</span>
                                            </div>
                                        )}
                                        {reg.notes && (
                                            <div className="flex items-center gap-2.5 sm:col-span-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                    <FileText size={12} className="text-amber-500" />
                                                </div>
                                                <span className="truncate text-slate-500 italic">"{reg.notes}"</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:border-l sm:border-slate-100 sm:pl-6 flex flex-col justify-end sm:items-end w-full sm:w-auto shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 relative z-10">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Booked On
                                    </span>
                                    <span className="text-sm font-extrabold text-slate-700">
                                        {new Date(reg.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <button
                                        disabled={removingId === reg.workshop_id}
                                        onClick={() => handleDeregister(reg.workshop_id)}
                                        className="mt-3 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors w-full sm:w-auto"
                                    >
                                        {removingId === reg.workshop_id ? 'Removing...' : 'Deregister'}
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
