import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CalendarPlus, ArrowRight, CheckCircle } from 'lucide-react';

export default function CreateWorkshopPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

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
            await api.post('/workshops', payload);
            setSuccess(true);
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create workshop');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mt-20 text-center p-8 bg-white border border-emerald-200 rounded-3xl shadow-sm"
            >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Workshop Created!</h3>
                <p className="text-slate-500 font-medium">Redirecting to homepage...</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto w-full mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CalendarPlus size={28} className="text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Workshop</h2>
                    <p className="text-sm text-slate-500 font-medium">Add a new dynamic workshop to the hub</p>
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
                            placeholder="e.g. Intro to Advanced Web Dev"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none"
                            placeholder="Describe what attendees will learn, prerequisites, and what to bring..."
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
                            placeholder="e.g. Coding Club"
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
                            <option value="All Levels">All Levels</option>
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
                            placeholder="e.g. Room 402, Building A or Online (Zoom)"
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
                            placeholder="e.g. React, Node.js, Frontend"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                    >
                        {loading ? 'Publishing...' : 'Publish Workshop'} <ArrowRight size={16} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
