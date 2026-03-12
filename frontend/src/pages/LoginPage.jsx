import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return setError('Please fill in all fields');
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden relative"
        >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-80 pointer-events-none" />

            <div className="relative z-10">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-6">
                    <LogIn size={28} className="text-indigo-600" />
                </div>

                <h2 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
                    Welcome Back
                </h2>
                <p className="text-center text-sm text-slate-500 font-medium mb-8">
                    Log in to access your workshops and connect with colleagues.
                </p>

                {error && (
                    <div className="p-3 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium text-center shadow-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">
                            Company Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 bg-white border border-slate-200 rounded-xl text-slate-800 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition-all shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-[1px]"
                        >
                            {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={16} />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
