import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ItemValues {
    _id: string;
    value?: string;
    title?: string;
    name?: string;
    value_shortform?: string;
    category?: Category;
    item?: Item;
    image_url?: string;
}

interface Item {
    _id: string,
    name: string,
    category: string
}

interface Category {
    _id: string;
    name: string;
}

interface ApiResponse {
    success: boolean;
    data: ItemValues[];
}

const useGetAllItemValues = () => {
    const [itemValues, setItemValues] = useState<ItemValues[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItemValues = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('specsheet-item-value');
            if (response.data.success) {
                setItemValues(response.data.data);
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
        fetchItemValues();
    }, [fetchItemValues]);

    return {
        itemValues,
        isLoading,
        error,
        refetch: fetchItemValues
    };
};

export default useGetAllItemValues;
