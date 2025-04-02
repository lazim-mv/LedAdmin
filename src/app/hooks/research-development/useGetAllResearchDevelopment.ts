import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ResearchDevelopmentData {
    _id: string;
    title: string;
    subtitle: string;
    content: string;
    media_url: string;
    image_url: string;
    name?: string;
    value?: string;
    banner_image?: string[];
}

interface ApiResponse {
    success: boolean;
    data: ResearchDevelopmentData[];
}

const useGetAllResearchDevelopment = () => {
    const [researchDevelopment, setResearchDevelopment] = useState<ResearchDevelopmentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResearchDevelopment = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('research-development');
            if (response.data.success) {
                setResearchDevelopment(response.data.data);
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
        fetchResearchDevelopment();
    }, [fetchResearchDevelopment]);

    return {
        researchDevelopment,
        isLoading,
        error,
        refetch: fetchResearchDevelopment
    };
};

export default useGetAllResearchDevelopment;
