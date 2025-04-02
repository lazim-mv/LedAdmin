import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface SpecSheetCategories {
    _id: string;
    name: string;
    title?: string;
}

interface ApiResponse {
    success: boolean;
    data: SpecSheetCategories[];
}

const useGetAllSpecSheetCategories = () => {
    const [specSheetCategories, setSpecSheetCategories] = useState<SpecSheetCategories[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSpecSheetCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('specsheet-categories');
            if (response.data.success) {
                setSpecSheetCategories(response.data.data);
            } else {
                setError('Failed to fetch about data');
            }
        } catch (err) {
            setError('Failed to fetch about data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpecSheetCategories();
    }, [fetchSpecSheetCategories]);

    return {
        specSheetCategories,
        isLoading,
        error,
        refetch: fetchSpecSheetCategories
    };
};

export default useGetAllSpecSheetCategories;
