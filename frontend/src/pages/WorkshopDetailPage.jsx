import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useRegistrations } from '../hooks/useRegistrations';
import RegistrationModal from '../components/RegistrationModal';
import {
    Calendar, MapPin, Clock, Users, Zap, ArrowLeft,
    CheckCircle, Tag, User, Share2
} from 'lucide-react';
import { formatDate, getRelativeStatus } from '../utils/dateUtils';

export default function WorkshopDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addRegistration } = useRegistrations();

    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const res = await api.get(`/workshops/${id}`);
                setWorkshop(res.data);
            } catch (err) {
                setError('Workshop not found');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshop();
    }, [id]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleRegisterClick = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const handleSubmitRegistration = async (event) => {
        event.preventDefault();
        if (!workshop) return;
        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            await addRegistration({
                workshopId: workshop.id,
                dept: formData.get('dept') || null,
                year: formData.get('year') || null,
                notes: formData.get('notes') || null,
            });
            setWorkshop(prev => ({ ...prev, registered: prev.registered + 1 }));
            setShowModal(false);
            setToast('Successfully registered for this workshop!');
        } catch (err) {
            setToast(typeof err === 'string' ? err : 'Registration failed');
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-20 space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 bg-slate-100 rounded-xl animate-pulse" style={{ width: `${90 - i * 15}%` }} />
                ))}
            </div>
        );
    }

    if (error || !workshop) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Workshop Not Found</h2>
                <p className="text-slate-500 mb-6">The workshop you're looking for doesn't exist.</p>
                <Link to="/" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm">
                    Browse Workshops
                </Link>
            </div>
        );
    }

    const isFull = workshop.registered >= workshop.capacity;
    const status = getRelativeStatus(workshop.date);
    const fillPercent = Math.min(100, Math.round((workshop.registered / workshop.capacity) * 100));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Main Card */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="relative px-6 sm:px-8 pt-8 pb-6">
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                                <Zap size={12} /> {workshop.club}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {workshop.level}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${
                                isFull
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : status === 'Completed'
                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                                {isFull ? <Users size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                {isFull ? 'Full' : status}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                            {workshop.title}
                        </h1>

                        {workshop.description && (
                            <p className="text-slate-600 leading-relaxed text-[15px] max-w-2xl">
                                {workshop.description}
                            </p>
                        )}

                        {workshop.organizer_name && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <User size={14} className="text-indigo-500" />
                                Organized by <span className="font-bold text-slate-700">{workshop.organizer_name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="px-6 sm:px-8 py-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <Calendar size={18} className="text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Date</div>
                                <div className="text-sm font-bold text-slate-700">{formatDate(workshop.date)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                <Clock size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Time & Duration</div>
                                <div className="text-sm font-bold text-slate-700">{workshop.time} • {workshop.durationHours}h</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <MapPin size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Location</div>
                                <div className="text-sm font-bold text-slate-700">{workshop.location}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <Users size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Capacity</div>
                                <div className="text-sm font-bold text-slate-700">{workshop.registered} / {workshop.capacity} registered</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity Bar */}
                <div className="px-6 sm:px-8 pb-4">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                fillPercent === 100 ? 'bg-red-500' : fillPercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs font-bold text-slate-400">
                        <span>{isFull ? 'Full' : `${workshop.capacity - workshop.registered} spots remaining`}</span>
                        <span>{fillPercent}% filled</span>
                    </div>
                </div>

                {/* Topics */}
                {workshop.topics && workshop.topics.length > 0 && (
                    <div className="px-6 sm:px-8 pb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase">Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {workshop.topics.map(t => (
                                <span key={t} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="px-6 sm:px-8 py-6 border-t border-slate-100 flex flex-wrap gap-3">
                    <button
                        onClick={handleRegisterClick}
                        disabled={isFull}
                        className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold rounded-xl transition-all ${
                            isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 hover:-translate-y-[1px]'
                        }`}
                    >
                        {isFull ? 'Registration Closed' : 'Register Now'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Share2 size={16} />
                        {copied ? 'Link Copied!' : 'Share'}
                    </button>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <RegistrationModal
                    selectedWorkshop={workshop}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitRegistration}
                />
            )}

            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-white border border-emerald-200 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex items-center gap-3"
                >
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span className="text-sm font-bold text-slate-800">{toast}</span>
                </motion.div>
            )}
        </motion.div>
    );
}
