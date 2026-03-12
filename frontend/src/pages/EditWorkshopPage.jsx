import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Edit3, ArrowRight } from 'lucide-react';

export default function EditWorkshopPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        club: '',
        date: '',
        time: '',
        location: '',
        durationHours: '',
        capacity: '',
        level: 'Beginner',
        topics: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                // To save adding a new backend route for GET single, we can just GET all and find it
                const res = await api.get('/workshops');
                const workshop = res.data.find(w => w.id === parseInt(id));

                if (!workshop) {
                    setError('Workshop not found');
                    setFetching(false);
                    return;
                }

                setFormData({
                    title: workshop.title,
                    club: workshop.club,
                    date: workshop.date.split('T')[0], // format date for input type=date
                    time: workshop.time,
                    location: workshop.location,
                    durationHours: workshop.durationHours,
                    capacity: workshop.capacity,
                    level: workshop.level,
                    topics: workshop.topics.join(', ')
                });
            } catch (err) {
                setError('Failed to fetch workshop data');
            } finally {
                setFetching(false);
            }
        };

        fetchWorkshop();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...formData,
            durationHours: parseInt(formData.durationHours),
            capacity: parseInt(formData.capacity),
            topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            await api.put(`/workshops/${id}`, payload);
            navigate('/my-registrations');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update workshop');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-20 text-slate-500 font-medium">Loading workshop data...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto w-full mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Edit3 size={28} className="text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Edit Workshop</h2>
                    <p className="text-sm text-slate-500 font-medium">Update the details of your workshop</p>
                </div>
            </div>

            {error && (
                <div className="p-3 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700">Workshop Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Club / Organization Name</label>
                        <input
                            type="text"
                            name="club"
                            value={formData.club}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Level</label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Duration (Hours)</label>
                        <input
                            type="number"
                            name="durationHours"
                            value={formData.durationHours}
                            onChange={handleChange}
                            required
                            min="1"
                            max="24"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700">Topics (comma separated)</label>
                        <input
                            type="text"
                            name="topics"
                            value={formData.topics}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/my-registrations')}
                        className="w-1/3 flex justify-center items-center py-3.5 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-2/3 flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                    >
                        {loading ? 'Saving...' : 'Save Changes'} <ArrowRight size={16} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
