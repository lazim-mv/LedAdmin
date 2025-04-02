import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';


interface Specification {
    spec: string;
    code: string;
    _id: string;
}

export interface ProductSpecifications {
    _id: string;
    name: string;
    title?: string;
    image_url: string;
    specifications: Specification[];
    banner_image?: string[];
}

interface ProductSpecificationsResponse {
    success: boolean;
    data: ProductSpecifications[];
}

export interface ProductSpecificationsByIdResponse {
    media_url?: string;
    success: boolean;
    data: ProductSpecifications;
}

const useGetAllProductSpecifications = () => {
    const [productSpecifications, setProductSpecifications] = useState<ProductSpecifications[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductSpecifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ProductSpecificationsResponse>('product-specifications');
            if (response.data.success) {
                setProductSpecifications(response.data.data);
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
        fetchProductSpecifications();
    }, [fetchProductSpecifications]);

    return {
        productSpecifications,
        isLoading,
        error,
        refetch: fetchProductSpecifications
    };
};

export default useGetAllProductSpecifications;
