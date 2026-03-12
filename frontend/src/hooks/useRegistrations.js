import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function useRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchRegistrations = useCallback(async () => {
        if (!currentUser) return;
        try {
            setLoading(true);
            const res = await api.get('/registrations/me');
            setRegistrations(res.data);
        } catch (err) {
            console.error('Error fetching registrations:', err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchRegistrations();
        } else {
            setRegistrations([]);
            setLoading(false);
        }
    }, [currentUser, fetchRegistrations]);

    const addRegistration = async (registrationData) => {
        try {
            await api.post('/registrations', registrationData);
            // Re-fetch instead of manually appending to ensure data consistency with backend DB structure
            await fetchRegistrations();
        } catch (err) {
            throw err.response?.data?.message || 'Server error';
        }
    };

    const removeRegistration = async (workshopId) => {
        try {
            await api.delete(`/registrations/${workshopId}`);
            await fetchRegistrations();
        } catch (err) {
            throw err.response?.data?.message || 'Server error';
        }
    };

    return { registrations, addRegistration, removeRegistration, loading, fetchRegistrations };
}
