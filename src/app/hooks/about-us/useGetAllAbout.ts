import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface AboutData {
    _id: string;
    title: string;
    content: string;
    image_url: string;
    name?: string;
    value?: string;
    banner_image?: string[];
}

interface ApiResponse {
    success: boolean;
    data: AboutData[];
}

const useGetAllAbout = () => {
    const [aboutData, setAboutData] = useState<AboutData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAboutData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('about');
            if (response.data.success) {
                setAboutData(response.data.data);
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
        fetchAboutData();
    }, [fetchAboutData]);

    return {
        aboutData,
        isLoading,
        error,
        refetch: fetchAboutData
    };
};

export default useGetAllAbout;
