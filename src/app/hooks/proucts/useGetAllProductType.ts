import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ProductType {
    _id: string;
    name: string;
    title?: string;
    value?: string;
}

interface ApiResponse {
    success: boolean;
    data: ProductType[];
}

const useGetAllProductType = () => {
    const [productType, setProductType] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductType = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('product-types');
            if (response.data.success) {
                setProductType(response.data.data);
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
        fetchProductType();
    }, [fetchProductType]);

    return {
        productType,
        isLoading,
        error,
        refetch: fetchProductType
    };
};

export default useGetAllProductType;
