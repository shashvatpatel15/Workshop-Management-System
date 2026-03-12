import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, LogOut, LogIn, PieChart, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const navLinks = [
        { to: '/', label: 'Explore', icon: CalendarDays, show: true },
        { to: '/my-registrations', label: 'My Hub', icon: LayoutDashboard, show: !!currentUser },
        { to: '/create-workshop', label: 'Create', icon: Plus, show: currentUser?.role === 'organizer' },
        { to: '/analytics', label: 'Analytics', icon: PieChart, show: !!currentUser },
    ];

    const visibleLinks = navLinks.filter(l => l.show);

    return (
        <header className="top-bar flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 backdrop-blur-xl bg-white/80 sticky top-0 z-40">
            <Link
                to="/"
                className="brand flex items-center gap-3 transition-transform hover:scale-[1.02]"
                onClick={() => setMobileMenuOpen(false)}
            >
                <div className="brand-logo w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_20px_rgba(79,70,229,0.25)]">
                    W
                </div>
                <div className="brand-text flex flex-col">
                    <span className="brand-title text-lg font-bold tracking-tight text-slate-900 leading-tight">
                        Workshop Hub
                    </span>
                    <span className="brand-subtitle text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                        Elevate Your Skills
                    </span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                {visibleLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === link.to
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                            }`}
                    >
                        <link.icon size={16} />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-2">
                {/* Desktop user area */}
                <div className="hidden md:flex items-center gap-2">
                    {currentUser ? (
                        <>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-600 shadow-sm hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-xs font-bold text-indigo-600">{currentUser.name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                                <span className="font-medium truncate max-w-[120px]">{currentUser.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                                title="Log Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
                            >
                                <LogIn size={16} /> Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:-translate-y-[1px]"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 md:hidden"
                    >
                        <nav className="p-4 space-y-1">
                            {visibleLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === link.to
                                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    <link.icon size={18} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                                {currentUser ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-xs font-bold text-indigo-600">{currentUser.name?.charAt(0)?.toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <span className="block">{currentUser.name}</span>
                                                <span className="text-xs text-slate-400 capitalize">{currentUser.role}</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span>Log Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex-1 text-center py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
