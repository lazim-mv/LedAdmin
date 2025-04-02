import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

const useGetByIdPreviewData = <T>(endpoint: string, id: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return; // Exit if id is empty

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get<T>(`${endpoint ? endpoint : ""}/${id}`);
            setData(response.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchData,
    };
};

export default useGetByIdPreviewData;
