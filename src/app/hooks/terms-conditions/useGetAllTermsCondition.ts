import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface TermsCondition {
    _id: string;
    title: string;
    content: string;
    name?: string;
    value?: string;
    image_url?:string;
}

interface ApiResponse {
    success: boolean;
    data: Omit<TermsCondition, '_id'>; // The API response contains a single object without _id
}

const useGetAllTermsCondition = () => {
    const [termsCondition, setTermsCondition] = useState<TermsCondition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTermsCondition = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('terms-conditions');
            if (response.data.success) {
                const transformedData: TermsCondition[] = [
                    { _id: '1', ...response.data.data },
                ];
                setTermsCondition(transformedData);
            } else {
                setError('Failed to fetch TermsCondition data');
            }
        } catch (err) {
            setError('Failed to fetch TermsCondition data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTermsCondition();
    }, [fetchTermsCondition]);

    return {
        termsCondition,
        isLoading,
        error,
        refetch: fetchTermsCondition,
    };
};

export default useGetAllTermsCondition;
