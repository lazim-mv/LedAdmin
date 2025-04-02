import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ResearchDevelopmentData {
    _id: string;
    title: string;
    subtitle: string;
    image_url: string;
}

interface ApiResponse {
    success: boolean;
    data: ResearchDevelopmentData[];
}

const useGetAllResearchDevelopmentPage = () => {
    const [researchDevelopmentPage, setResearchDevelopment] = useState<ResearchDevelopmentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResearchDevelopment = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('research-development-page');
            if (response.data.success) {
                const formattedData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setResearchDevelopment(formattedData);
            } else {
                setError('Failed to fetch research development data');
            }
        } catch (err) {
            setError('Failed to fetch research development data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResearchDevelopment();
    }, [fetchResearchDevelopment]);

    return {
        researchDevelopmentPage,
        isLoading,
        error,
        refetch: fetchResearchDevelopment
    };
};

export default useGetAllResearchDevelopmentPage;
