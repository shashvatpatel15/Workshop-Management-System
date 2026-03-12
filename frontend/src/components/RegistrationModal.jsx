import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, Mail, Building, GraduationCap, MessageSquare } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function RegistrationModal({
    selectedWorkshop,
    onClose,
    onSubmit
}) {
    if (!selectedWorkshop) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-80 pointer-events-none" />

                    <div className="relative px-6 py-6 sm:px-8 border-b border-slate-100">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight" id="modal-title">
                                    Register for {selectedWorkshop.title}
                                </h3>
                                <div className="flex flex-col gap-1 text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-indigo-500" />
                                        {formatDate(selectedWorkshop.date)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-purple-500" />
                                        {selectedWorkshop.location} • {selectedWorkshop.club}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="relative px-6 py-6 sm:px-8 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="nameInput" className="block text-sm font-bold text-slate-700">
                                    Full Name <span className="text-indigo-500">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        id="nameInput"
                                        name="name"
                                        required
                                        className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="emailInput" className="block text-sm font-bold text-slate-700">
                                    Company Email <span className="text-indigo-500">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={16} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        id="emailInput"
                                        name="email"
                                        required
                                        className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="deptInput" className="block text-sm font-bold text-slate-700">
                                        Department
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            id="deptInput"
                                            name="dept"
                                            className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                            placeholder="e.g. CSE, ECE"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="yearInput" className="block text-sm font-bold text-slate-700">
                                        Experience Level
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <GraduationCap size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <select
                                            id="yearInput"
                                            name="year"
                                            className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                        >
                                            <option value="" disabled selected className="text-slate-400">Select level</option>
                                            <option value="junior">Junior</option>
                                            <option value="mid">Mid-level</option>
                                            <option value="senior">Senior</option>
                                            <option value="lead">Lead/Manager</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="notesInput" className="block text-sm font-bold text-slate-700">
                                    Notes (Optional)
                                </label>
                                <div className="relative group">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <MessageSquare size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <textarea
                                        id="notesInput"
                                        name="notes"
                                        rows={3}
                                        className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none shadow-sm"
                                        placeholder="Any specific questions or expectations?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-3 sm:justify-end border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 border border-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-[1px]"
                            >
                                Confirm Registration
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
