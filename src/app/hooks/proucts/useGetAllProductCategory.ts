import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ProductCategory {
    _id: string;
    name: string;
    title?: string;
    value?: string;
}

interface ApiResponse {
    success: boolean;
    data: ProductCategory[];
}

const useGetAllProductCategory = () => {
    const [productCategory, setProductCategory] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductCategory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('product-categories');
            if (response.data.success) {
                setProductCategory(response.data.data);
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
        fetchProductCategory();
    }, [fetchProductCategory]);

    return {
        productCategory,
        isLoading,
        error,
        refetch: fetchProductCategory
    };
};

export default useGetAllProductCategory;
