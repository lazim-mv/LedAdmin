import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface ProjectCategories {
    _id: string;
    name: string;
    title?: string;
    value?: string;
    image_url?: string;
}

interface ApiResponse {
    success: boolean;
    data: ProjectCategories[];
}

const useGetAllProjectCategories = () => {
    const [projectCategories, setProjectCategories] = useState<ProjectCategories[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjectCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('project-categories');
            if (response.data.success) {
                setProjectCategories(response.data.data);
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
        fetchProjectCategories();
    }, [fetchProjectCategories]);

    return {
        projectCategories,
        isLoading,
        error,
        refetch: fetchProjectCategories
    };
};

export default useGetAllProjectCategories;
