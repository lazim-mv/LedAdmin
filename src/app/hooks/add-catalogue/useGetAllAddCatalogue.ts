import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface Catalogue {
    _id: string;
    title: string;
    content: string;
    image_url: string;
    isFeatured: boolean;
}

interface ApiResponse {
    success: boolean;
    data: Catalogue[];
}

const useGetAllAddCatalogue = () => {
    const [catalogue, setCatalogue] = useState<Catalogue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCatalogue = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('catalogue');
            if (response.data.success) {
                setCatalogue(response.data.data);
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
        fetchCatalogue();
    }, [fetchCatalogue]);

    return {
        catalogue,
        isLoading,
        error,
        refetch: fetchCatalogue
    };
};

export default useGetAllAddCatalogue;
