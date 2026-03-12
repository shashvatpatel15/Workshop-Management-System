import React from 'react';
import { useRegistrations } from '../hooks/useRegistrations';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
    const { currentUser } = useAuth();
    const { registrations } = useRegistrations();

    let statusText = "Sign in to start exploring";

    if (currentUser) {
        if (currentUser.role === 'organizer') {
            statusText = `Organizer Account Active`;
        } else {
            statusText = `${registrations.length} workshop${registrations.length === 1 ? "" : "s"} registered`;
        }
    }

    return (
        <footer className="mt-auto py-6 px-4 md:px-8 border-t border-slate-200 bg-slate-50 rounded-b-[26px]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <div className="font-bold text-slate-600 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-accent-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm">W</div>
                        Workshop Hub
                    </div>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="text-xs font-medium">Built with <Heart size={10} className="inline text-red-400" /> for college workshops</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${currentUser ? (currentUser.role === 'organizer' ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-400'} shadow-sm`}></span>
                        <span id="registrationCount">{statusText}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">&copy; {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
}
