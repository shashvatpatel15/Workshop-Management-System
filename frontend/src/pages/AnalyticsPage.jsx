import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRegistrations } from '../hooks/useRegistrations';
import { useOrganizedWorkshops } from '../hooks/useOrganizedWorkshops';
import { PieChart, BarChart2 } from 'lucide-react';
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
        return <div className="text-center py-20 text-slate-500 font-medium">Gathering analytics...</div>;
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
    const topicCounts = {};
    const monthCounts = {};

    if (currentUser.role === 'colleague') {
        registrations.forEach(r => {
            // we don't have direct access to full topics easily without fetching the workshop details,
            // but we can show registration per month.
            const date = new Date(r.createdAt || new Date());
            const month = date.toLocaleString('default', { month: 'short' });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
    }

    // Prepare Data for Organizer
    const capacityLabels = [];
    const registeredData = [];
    const capacityData = [];

    if (currentUser.role === 'organizer') {
        workshops.forEach(w => {
            capacityLabels.push(w.title.substring(0, 15) + '...');
            registeredData.push(w.registered);
            capacityData.push(w.capacity);

            w.topics.forEach(t => {
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
            },
            {
                label: 'Capacity',
                data: capacityData,
                backgroundColor: 'rgba(203, 213, 225, 0.5)',
            }
        ] : [
            {
                label: 'Workshops Joined',
                data: Object.values(monthCounts),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
            }
        ]
    };

    const pieChartData = {
        labels: Object.keys(topicCounts),
        datasets: [
            {
                data: Object.values(topicCounts),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderWidth: 1,
            },
        ],
    };

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
                    <p className="text-sm text-slate-500 font-medium">Gain insights into {currentUser.role === 'organizer' ? 'your performance' : 'your learning journey'}</p>
                </div>
            </div>

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
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }}
                        />
                    </div>
                </div>

                {currentUser.role === 'organizer' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-4 tracking-tight">Topic Distribution</h3>
                        <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                            {Object.keys(topicCounts).length > 0 ? (
                                <Pie
                                    data={pieChartData}
                                    options={{ maintainAspectRatio: false }}
                                />
                            ) : (
                                <p className="text-slate-500 text-sm">No topics added to workshops yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
