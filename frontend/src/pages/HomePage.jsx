import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Grid, LayoutList, Calendar, Users, Tag, Sparkles, TrendingUp } from "lucide-react";
import WorkshopCard from "../components/WorkshopCard";
import RegistrationModal from "../components/RegistrationModal";
import { isUpcoming, isThisWeek, isThisMonth } from "../utils/dateUtils";
import { useRegistrations } from "../hooks/useRegistrations";
import api from '../api/axios';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function SkeletonCard() {
    return (
        <div className="p-5 rounded-2xl border border-slate-200 bg-white animate-pulse space-y-4">
            <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-50 rounded-lg w-1/3" />
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-20 shrink-0" />
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-50 rounded w-1/2" />
                <div className="h-3 bg-slate-50 rounded w-2/3" />
            </div>
            <div className="h-2 bg-slate-100 rounded-full w-full" />
            <div className="flex gap-2">
                <div className="h-5 bg-slate-50 rounded w-16" />
                <div className="h-5 bg-slate-50 rounded w-20" />
            </div>
        </div>
    );
}

export default function HomePage() {
    const [workshopsList, setWorkshopsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const [search, setSearch] = useState("");
    const [club, setClub] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [view, setView] = useState("grid");
    const [activeTag, setActiveTag] = useState(null);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [toast, setToast] = useState(null);
    const [toastError, setToastError] = useState(null);

    const { addRegistration } = useRegistrations();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workshopsRes, statsRes] = await Promise.all([
                    api.get('/workshops'),
                    api.get('/workshops/stats').catch(() => ({ data: null }))
                ]);
                setWorkshopsList(workshopsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch workshops data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const clubs = useMemo(
        () => Array.from(new Set(workshopsList.map((w) => w.club))).sort(),
        [workshopsList]
    );

    const topics = useMemo(() => {
        const set = new Set();
        workshopsList.forEach((w) => (w.topics || []).forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [workshopsList]);

    const filteredWorkshops = useMemo(() => {
        const q = search.trim().toLowerCase();
        return workshopsList
            .filter((w) => {
                if (
                    q &&
                    !(
                        w.title.toLowerCase().includes(q) ||
                        w.club.toLowerCase().includes(q) ||
                        (w.description || '').toLowerCase().includes(q) ||
                        (w.topics || []).join(" ").toLowerCase().includes(q)
                    )
                ) {
                    return false;
                }

                if (club !== "all" && w.club !== club) {
                    return false;
                }

                if (activeTag && !(w.topics || []).includes(activeTag)) {
                    return false;
                }

                if (dateFilter === "upcoming" && !isUpcoming(w.date)) {
                    return false;
                }
                if (dateFilter === "thisWeek" && !isThisWeek(w.date)) {
                    return false;
                }
                if (dateFilter === "thisMonth" && !isThisMonth(w.date)) {
                    return false;
                }

                return true;
            });
    }, [search, club, dateFilter, activeTag, workshopsList]);

    useEffect(() => {
        if (!toast && !toastError) return;
        const id = setTimeout(() => {
            setToast(null);
            setToastError(null);
        }, 4000);
        return () => clearTimeout(id);
    }, [toast, toastError]);

    const handleClearFilters = () => {
        setSearch("");
        setClub("all");
        setDateFilter("all");
        setActiveTag(null);
    };

    const onRegisterClick = (workshop) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setSelectedWorkshop(workshop);
    };

    const handleSubmitRegistration = async (event) => {
        event.preventDefault();
        if (!selectedWorkshop) return;

        const form = event.currentTarget;
        const formData = new FormData(form);

        const dept = formData.get("dept") || "";
        const year = formData.get("year") || "";
        const notes = formData.get("notes") || "";

        try {
            await addRegistration({
                workshopId: selectedWorkshop.id,
                dept: dept || null,
                year: year || null,
                notes: notes || null,
            });

            setWorkshopsList(prev => prev.map(w => w.id === selectedWorkshop.id ? { ...w, registered: w.registered + 1 } : w));

            setSelectedWorkshop(null);
            setToast("Successfully registered! Check 'My Hub' for details.");
        } catch (err) {
            setToastError(typeof err === 'string' ? err : 'Error registering for workshop. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 border border-indigo-700/50 p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)]">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-300/10 blur-[60px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-400/10 blur-[60px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white/90 backdrop-blur-sm"
                    >
                        <Sparkles size={12} />
                        {stats ? `${stats.upcomingWorkshops} upcoming workshops` : 'Workshop Hub'}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
                    >
                        Discover Your Next <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                            Breakthrough
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-indigo-100 max-w-xl leading-relaxed font-medium"
                    >
                        Explore hands-on workshops, expert-led sessions, and collaborative learning events across campus. Upskill and connect.
                    </motion.p>

                    {stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-6 pt-2"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">{stats.totalWorkshops}</div>
                                <div className="text-xs text-indigo-200 font-medium">Workshops</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">{stats.totalUsers}</div>
                                <div className="text-xs text-indigo-200 font-medium">Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">{stats.totalRegistrations}</div>
                                <div className="text-xs text-indigo-200 font-medium">Registrations</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Filters Section */}
            <section className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm relative z-20">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-2/5 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Search</label>
                        <div className="relative group">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find by title, club, or topic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Organization</label>
                        <div className="relative group">
                            <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <select
                                value={club}
                                onChange={(e) => setClub(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                            >
                                <option value="all">All Clubs</option>
                                {clubs.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Timeline</label>
                        <div className="relative group">
                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                            >
                                <option value="all">Any Date</option>
                                <option value="upcoming">Upcoming Only</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex justify-end">
                        <button
                            onClick={handleClearFilters}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
                            title="Clear all filters"
                        >
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {topics.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <Tag size={14} className="text-slate-400 mr-1" />
                        {topics.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setActiveTag(prev => prev === topic ? null : topic)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border shadow-sm",
                                    activeTag === topic
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-md transform -translate-y-0.5"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100"
                                )}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Available Sessions</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        {loading ? "Loading workshops..." : filteredWorkshops.length === 0
                            ? "No sessions match your applied filters."
                            : `Showing ${filteredWorkshops.length} session${filteredWorkshops.length > 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl w-max shadow-sm">
                    <button
                        onClick={() => setView('grid')}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            view === 'grid' ? "bg-slate-100 text-indigo-600 shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600 border border-transparent"
                        )}
                        title="Grid View"
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            view === 'list' ? "bg-slate-100 text-indigo-600 shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600 border border-transparent"
                        )}
                        title="List View"
                    >
                        <LayoutList size={18} />
                    </button>
                </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredWorkshops.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 rounded-3xl border border-slate-200"
                >
                    <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                        <Search size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No workshops found</h3>
                    <p className="text-sm text-slate-500 max-w-sm mb-4">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
                    >
                        Clear All Filters
                    </button>
                </motion.div>
            )}

            {/* Grid rendering */}
            {!loading && filteredWorkshops.length > 0 && (
                <motion.div
                    layout
                    className={cn(
                        "gap-6",
                        view === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "flex flex-col max-w-4xl"
                    )}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredWorkshops.map(w => (
                            <WorkshopCard
                                key={w.id}
                                w={w}
                                onRegisterClick={onRegisterClick}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {selectedWorkshop && (
                <RegistrationModal
                    selectedWorkshop={selectedWorkshop}
                    onClose={() => setSelectedWorkshop(null)}
                    onSubmit={handleSubmitRegistration}
                />
            )}

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-white border border-emerald-200 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.15)] backdrop-blur-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{toast}</p>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}

                {toastError && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-white border border-red-200 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.15)] backdrop-blur-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{toastError}</p>
                        <button
                            onClick={() => setToastError(null)}
                            className="ml-2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
