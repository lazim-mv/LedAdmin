import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface CookiePolicy {
    _id: string;
    title: string;
    content: string;
}

interface ApiResponse {
    success: boolean;
    data: Omit<CookiePolicy, '_id'>;
}

const useGetAllCookiePolicy = () => {
    const [cookiePolicy, setCookiePolicy] = useState<CookiePolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchCookiePolicy = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('cookie-policy');
            if (response.data.success) {
                const transformedData: CookiePolicy[] = [
                    { _id: '1', ...response.data.data },
                ];
                setCookiePolicy(transformedData);
            } else {
                setError('Failed to fetch cookie policy data');
            }
        } catch (err) {
            setError('Failed to fetch cookie policy data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {

        fetchCookiePolicy();
    }, [fetchCookiePolicy]);

    return {
        cookiePolicy,
        isLoading,
        error,
        refetch: fetchCookiePolicy,
    };
};

export default useGetAllCookiePolicy;
