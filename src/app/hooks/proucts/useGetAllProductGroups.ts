import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ProductGroups {
    _id: string;
    name: string;
    title?: string;
    value?: string;
}

interface ApiResponse {
    success: boolean;
    data: ProductGroups[];
}

const useGetAllProductGroups = () => {
    const [productGroups, setProductGroups] = useState<ProductGroups[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('product-groups');
            if (response.data.success) {
                setProductGroups(response.data.data);
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
        fetchProductGroups();
    }, [fetchProductGroups]);

    return {
        productGroups,
        isLoading,
        error,
        refetch: fetchProductGroups
    };
};

export default useGetAllProductGroups;
