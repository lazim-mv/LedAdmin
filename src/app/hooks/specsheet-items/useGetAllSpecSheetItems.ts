import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface SpecSheetItems {
    _id: string;
    name: string;
    title?: string;
    category: Category;
    values: Values[];
}

interface Category {
    _id: string;
    name: string;
}

export interface Values {
    id: string;
    value: string;
    value_shortform: string;
}

interface ApiResponse {
    success: boolean;
    data: SpecSheetItems[];
}

const useGetAllSpecSheetItems = () => {
    const [specSheetItems, setSpecSheetItems] = useState<SpecSheetItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSpecSheetItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('specsheet-items');
            if (response.data.success) {
                setSpecSheetItems(response.data.data);
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
        fetchSpecSheetItems();
    }, [fetchSpecSheetItems]);

    return {
        specSheetItems,
        isLoading,
        error,
        refetch: fetchSpecSheetItems
    };
};

export default useGetAllSpecSheetItems;
