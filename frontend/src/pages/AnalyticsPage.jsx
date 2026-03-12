import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRegistrations } from '../hooks/useRegistrations';
import { useOrganizedWorkshops } from '../hooks/useOrganizedWorkshops';
import { PieChart, BarChart2, TrendingUp, Users, Calendar, Zap } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AnalyticsPage() {
    const { currentUser } = useAuth();
    const { registrations, loading: regLoading } = useRegistrations();
    const { workshops, loading: workshopLoading } = useOrganizedWorkshops();

    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        if (currentUser.role === 'organizer' && workshops.length > 0) {
            setHasData(true);
        } else if (currentUser.role === 'colleague' && registrations.length > 0) {
            setHasData(true);
        } else {
            setHasData(false);
        }
    }, [currentUser, registrations, workshops]);

    if (regLoading || workshopLoading) {
        return (
            <div className="max-w-5xl mx-auto mt-6 space-y-6 p-4">
                <div className="h-8 bg-slate-100 rounded-xl w-1/3 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[350px] bg-white border border-slate-200 rounded-3xl animate-pulse" />
                    <div className="h-[350px] bg-white border border-slate-200 rounded-3xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="max-w-4xl mx-auto mt-12 py-20 px-4 text-center bg-slate-50 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                <BarChart2 size={48} className="text-slate-300 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Not Enough Data</h3>
                <p className="text-slate-500 max-w-sm font-medium">
                    {currentUser.role === 'organizer'
                        ? "You haven't created any workshops yet to show analytics."
                        : "You haven't registered for any workshops yet to show analytics."}
                </p>
            </div>
        );
    }

    // Prepare Data for Colleague
    const monthCounts = {};
    const clubCounts = {};

    if (currentUser.role === 'colleague') {
        registrations.forEach(r => {
            const date = new Date(r.created_at || new Date());
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            monthCounts[month] = (monthCounts[month] || 0) + 1;

            if (r.club) {
                clubCounts[r.club] = (clubCounts[r.club] || 0) + 1;
            }
        });
    }

    // Prepare Data for Organizer
    const capacityLabels = [];
    const registeredData = [];
    const capacityData = [];
    const topicCounts = {};

    if (currentUser.role === 'organizer') {
        workshops.forEach(w => {
            capacityLabels.push(w.title.length > 20 ? w.title.substring(0, 20) + '...' : w.title);
            registeredData.push(w.registered);
            capacityData.push(w.capacity);

            (w.topics || []).forEach(t => {
                topicCounts[t] = (topicCounts[t] || 0) + 1;
            });
        });
    }

    const barChartData = {
        labels: currentUser.role === 'organizer' ? capacityLabels : Object.keys(monthCounts),
        datasets: currentUser.role === 'organizer' ? [
            {
                label: 'Registered',
                data: registeredData,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 8,
            },
            {
                label: 'Capacity',
                data: capacityData,
                backgroundColor: 'rgba(203, 213, 225, 0.5)',
                borderRadius: 8,
            }
        ] : [
            {
                label: 'Workshops Joined',
                data: Object.values(monthCounts),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 8,
            }
        ]
    };

    const pieChartData = {
        labels: currentUser.role === 'organizer' ? Object.keys(topicCounts) : Object.keys(clubCounts),
        datasets: [
            {
                data: currentUser.role === 'organizer' ? Object.values(topicCounts) : Object.values(clubCounts),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                ],
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    };

    // Summary stats
    const totalRegistered = currentUser.role === 'organizer'
        ? workshops.reduce((sum, w) => sum + w.registered, 0)
        : registrations.length;
    const totalCapacity = currentUser.role === 'organizer'
        ? workshops.reduce((sum, w) => sum + w.capacity, 0)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto w-full mt-6 space-y-8 p-4"
        >
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <PieChart size={28} className="text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics Dashboard</h2>
                    <p className="text-sm text-slate-500 font-medium">Gain insights into {currentUser.role === 'organizer' ? 'your workshop performance' : 'your learning journey'}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Calendar size={16} className="text-indigo-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">
                        {currentUser.role === 'organizer' ? workshops.length : registrations.length}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                        {currentUser.role === 'organizer' ? 'Workshops' : 'Registrations'}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Users size={16} className="text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">{totalRegistered}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">Total Registrants</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Zap size={16} className="text-purple-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">
                        {currentUser.role === 'organizer' ? Object.keys(topicCounts).length : Object.keys(clubCounts).length}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                        {currentUser.role === 'organizer' ? 'Unique Topics' : 'Clubs Joined'}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <TrendingUp size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">
                        {currentUser.role === 'organizer' && totalCapacity > 0
                            ? `${Math.round((totalRegistered / totalCapacity) * 100)}%`
                            : `${registrations.filter(r => new Date(r.date) >= new Date()).length}`}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                        {currentUser.role === 'organizer' ? 'Avg Fill Rate' : 'Upcoming'}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 tracking-tight">
                        {currentUser.role === 'organizer' ? 'Capacity Fill Rates' : 'Activity Over Time'}
                    </h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <Bar
                            data={barChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: { font: { family: 'Inter', weight: 600 } }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(0,0,0,0.04)' },
                                        ticks: { font: { family: 'Inter', size: 11 } }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { family: 'Inter', size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 tracking-tight">
                        {currentUser.role === 'organizer' ? 'Topic Distribution' : 'Club Distribution'}
                    </h3>
                    <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                        {(currentUser.role === 'organizer' ? Object.keys(topicCounts).length : Object.keys(clubCounts).length) > 0 ? (
                            <Pie
                                data={pieChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { font: { family: 'Inter', weight: 600, size: 11 }, padding: 16 }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <p className="text-slate-500 text-sm">No data available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
