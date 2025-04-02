import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface NewsData {
    _id: string;
    title: string;
    content: string;
    image_url: string;
}

interface ApiResponse {
    success: boolean;
    data: NewsData[];
}

const useGetAllNews = () => {
    const [newsData, setNewsData] = useState<NewsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNewsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('news');
            if (response.data.success) {
                setNewsData(response.data.data);
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
        fetchNewsData();
    }, [fetchNewsData]);

    return {
        newsData,
        isLoading,
        error,
        refetch: fetchNewsData
    };
};

export default useGetAllNews;
