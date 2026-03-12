import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-bar flex items-center justify-between px-6 py-4 border-b border-slate-200 backdrop-blur-xl bg-white/80 sticky top-0 z-40">
            <Link
                to="/"
                className="brand flex items-center gap-3 transition-transform hover:scale-[1.02]"
            >
                <div className="brand-logo w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_20px_rgba(79,70,229,0.25)]">
                    W
                </div>
                <div className="brand-text flex flex-col">
                    <span className="brand-title text-lg font-bold tracking-tight text-slate-900 leading-tight">
                        Workshop Hub
                    </span>
                    <span className="brand-subtitle text-xs text-slate-500 font-medium tracking-wide">
                        Elevate Your Skills
                    </span>
                </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <Link
                    to="/"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === '/'
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                        }`}
                >
                    <CalendarDays size={16} />
                    <span>Explore</span>
                </Link>
                {currentUser && (
                    <Link
                        to="/my-registrations"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === '/my-registrations'
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                            }`}
                    >
                        <LayoutDashboard size={16} />
                        <span>My Hub</span>
                    </Link>
                )}
                {currentUser && currentUser.role === 'organizer' && (
                    <Link
                        to="/create-workshop"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === '/create-workshop'
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                            }`}
                    >
                        <CalendarDays size={16} />
                        <span>Create Workshop</span>
                    </Link>
                )}
            </nav>

            <div className="flex items-center gap-3">
                {currentUser ? (
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-600 shadow-sm">
                            <Users size={16} className="text-indigo-500" />
                            <span className="font-medium truncate max-w-[120px]">{currentUser.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
                        >
                            <LogIn size={16} /> Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:-translate-y-[1px]"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
