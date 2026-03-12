import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedUser = localStorage.getItem('wms_user');
            const token = localStorage.getItem('wms_token');

            if (storedUser && token) {
                try {
                    setCurrentUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user session");
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('wms_token', token);
            localStorage.setItem('wms_user', JSON.stringify(user));
            setCurrentUser(user);

            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password, role });
            const { token, user } = response.data;

            localStorage.setItem('wms_token', token);
            localStorage.setItem('wms_user', JSON.stringify(user));
            setCurrentUser(user);

            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Signup failed';
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('wms_user');
        localStorage.removeItem('wms_token');
    };

    const value = {
        currentUser,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
