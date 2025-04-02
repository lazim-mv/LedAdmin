import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface PrivacyPolicy {
    _id: string;
    title: string;
    content: string;
}

interface ApiResponse {
    success: boolean;
    data: Omit<PrivacyPolicy, '_id'>;
}

const useGetAllPrivacyPolicy = () => {
    const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrivacyPolicy = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('privacy-policy');
            if (response.data.success) {
                const transformedData: PrivacyPolicy[] = [
                    { _id: '1', ...response.data.data },
                ];
                setPrivacyPolicy(transformedData);
            } else {
                setError('Failed to fetch privacyPolicy data');
            }
        } catch (err) {
            setError('Failed to fetch privacyPolicy data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrivacyPolicy();
    }, [fetchPrivacyPolicy]);

    return {
        privacyPolicy,
        isLoading,
        error,
        refetch: fetchPrivacyPolicy,
    };
};

export default useGetAllPrivacyPolicy;
