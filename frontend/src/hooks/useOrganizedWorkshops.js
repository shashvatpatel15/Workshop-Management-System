import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function useOrganizedWorkshops() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchWorkshops = useCallback(async () => {
        if (!currentUser || currentUser.role !== 'organizer') return;
        try {
            setLoading(true);
            const res = await api.get('/workshops');
            // Filter only workshops created by current user
            const myWorkshops = res.data.filter(w => w.created_by === currentUser.id);
            setWorkshops(myWorkshops);
        } catch (err) {
            console.error('Error fetching organized workshops:', err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && currentUser.role === 'organizer') {
            fetchWorkshops();
        } else {
            setWorkshops([]);
            setLoading(false);
        }
    }, [currentUser, fetchWorkshops]);

    const deleteWorkshop = async (id) => {
        try {
            await api.delete(`/workshops/${id}`);
            await fetchWorkshops();
        } catch (err) {
            throw err.response?.data?.message || 'Server error';
        }
    };

    const getRegistrants = async (id) => {
        try {
            const res = await api.get(`/workshops/${id}/registrants`);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || 'Server error';
        }
    };

    return { workshops, deleteWorkshop, getRegistrants, loading, fetchWorkshops };
}
