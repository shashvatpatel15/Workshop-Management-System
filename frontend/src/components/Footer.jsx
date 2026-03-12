import React from 'react';
import { useRegistrations } from '../hooks/useRegistrations';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { currentUser } = useAuth();
    const { registrations } = useRegistrations();

    let statusText = "Sign in to manage workshops";

    if (currentUser) {
        if (currentUser.role === 'organizer') {
            statusText = `Organizer Account Active`;
        } else {
            statusText = `${registrations.length} workshop${registrations.length === 1 ? "" : "s"} registered`;
        }
    }

    return (
        <footer className="mt-auto py-6 px-4 md:px-8 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 rounded-b-[26px]">
            <div className="font-medium flex items-center gap-2">
                <span className="text-slate-400">&copy; {new Date().getFullYear()}</span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="text-slate-600">Built for college clubs &amp; colleagues</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${currentUser ? (currentUser.role === 'organizer' ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-400'} shadow-sm`}></span>
                <span id="registrationCount">{statusText}</span>
            </div>
        </footer>
    );
}
