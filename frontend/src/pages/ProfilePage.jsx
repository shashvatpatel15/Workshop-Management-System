import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
    const { currentUser, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setFormData({
                    name: res.data.name,
                    email: res.data.email,
                    password: '' // Don't fetch password
                });
            } catch (err) {
                setError('Failed to load profile details');
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const dataToUpdate = { name: formData.name, email: formData.email };
            if (formData.password) {
                dataToUpdate.password = formData.password;
            }

            const res = await api.put('/users/profile', dataToUpdate);
            updateUser(res.data.user);
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) return;

        try {
            setDeleting(true);
            await api.delete('/users/profile');
            logout();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account');
            setDeleting(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-20 text-slate-500 font-medium">Loading profile...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto w-full mt-10 space-y-8 p-4"
        >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <User size={28} className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Profile</h2>
                        <p className="text-sm text-slate-500 font-medium">Manage your personal settings</p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 mb-6 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-medium">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700">New Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                placeholder={"••••••••"}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                        >
                            {loading ? 'Saving...' : 'Save Profile'} <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-red-800 font-bold text-lg flex items-center gap-2">
                        <AlertTriangle size={18} /> Danger Zone
                    </h3>
                    <p className="text-red-600 text-sm mt-1 max-w-sm">
                        Deleting your account will permanently remove all your registrations and managed workshops.
                    </p>
                </div>
                <button
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold text-sm transition-colors shadow-sm shrink-0"
                >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
            </div>
        </motion.div>
    );
}
