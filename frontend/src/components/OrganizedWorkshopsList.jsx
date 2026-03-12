import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trash2, Edit, X, Mail, Building, FileText } from 'lucide-react';
import { useOrganizedWorkshops } from '../hooks/useOrganizedWorkshops';
import { useNavigate } from 'react-router-dom';

export default function OrganizedWorkshopsList() {
    const { workshops, loading, deleteWorkshop, getRegistrants } = useOrganizedWorkshops();
    const [deletingId, setDeletingId] = useState(null);
    const [registrantsData, setRegistrantsData] = useState([]);
    const [viewingRegistrantsFor, setViewingRegistrantsFor] = useState(null);
    const [loadingRegistrants, setLoadingRegistrants] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this workshop? This action cannot be undone.")) return;
        try {
            setDeletingId(id);
            await deleteWorkshop(id);
            if (viewingRegistrantsFor === id) {
                setViewingRegistrantsFor(null);
            }
        } catch (err) {
            alert(err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleViewRegistrants = async (id) => {
        if (viewingRegistrantsFor === id) {
            setViewingRegistrantsFor(null);
            return;
        }

        try {
            setLoadingRegistrants(true);
            setViewingRegistrantsFor(id);
            const data = await getRegistrants(id);
            setRegistrantsData(data);
        } catch (err) {
            alert(err);
            setViewingRegistrantsFor(null);
        } finally {
            setLoadingRegistrants(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-slate-500 font-medium">Loading your workshops...</div>;
    }

    if (workshops.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-3xl border border-slate-200 shadow-sm mt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Workshops Created</h3>
                <p className="text-slate-500 max-w-sm mb-6 font-medium">
                    You haven't created any workshops yet.
                </p>
                <button
                    onClick={() => navigate('/create-workshop')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                    Create Workshop
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">
            <h3 className="text-xl font-extrabold text-slate-800">Workshops Managed By You</h3>
            <div className="grid gap-5">
                {workshops.map((w, i) => (
                    <motion.article
                        key={w.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1">
                                <h4 className="text-lg font-extrabold text-slate-800">{w.title}</h4>
                                <div className="mt-2 text-sm text-slate-500 font-medium">
                                    <p>{new Date(w.date).toLocaleDateString()} at {w.time} • {w.location}</p>
                                    <p className="mt-1">Capacity: {w.registered} / {w.capacity} registered</p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-start shrink-0">
                                <button
                                    onClick={() => handleViewRegistrants(w.id)}
                                    className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                    <Users size={16} />
                                    {viewingRegistrantsFor === w.id ? 'Hide Registrants' : 'View Registrants'}
                                </button>
                                <button
                                    onClick={() => navigate(`/edit-workshop/${w.id}`)}
                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                                    title="Edit Workshop"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    disabled={deletingId === w.id}
                                    onClick={() => handleDelete(w.id)}
                                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors disabled:opacity-50"
                                    title="Delete Workshop"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {viewingRegistrantsFor === w.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-slate-100 overflow-hidden"
                                >
                                    <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Users size={18} className="text-indigo-500" /> Registrant Details
                                    </h5>

                                    {loadingRegistrants ? (
                                        <p className="text-sm text-slate-500 font-medium">Loading details...</p>
                                    ) : registrantsData.length === 0 ? (
                                        <p className="text-sm text-slate-500 font-medium italic">No one has registered for this workshop yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {registrantsData.map(reg => (
                                                <div key={reg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
                                                    <div>
                                                        <p className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                            {reg.attendeeName || reg.name}
                                                            <a href={`mailto:${reg.attendeeEmail || reg.email}`} className="text-indigo-600 hover:underline">
                                                                <Mail size={14} className="inline" />
                                                            </a>
                                                        </p>
                                                        {reg.dept && (
                                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                                                                <Building size={12} /> {reg.dept} {reg.year ? `(Year ${reg.year})` : ''}
                                                            </p>
                                                        )}
                                                        {reg.notes && (
                                                            <p className="text-xs text-slate-600 mt-1 italic flex items-center gap-1.5">
                                                                <FileText size={12} /> "{reg.notes}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-medium shrink-0">
                                                        Registered: {new Date(reg.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
