import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

interface BannerButton {
    text: string;
    link: string;
}

export interface Banner {
    _id: string;
    button: BannerButton;
    title: string;
    subtitle: string;
    media_url: string;
    image_url?: string;
    active: boolean;
    name?: string;
    banner_image?: string[];
}

const useGetByIdBanner = (id: string | null) => {
    const [banner, setBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBanner = useCallback(async () => {
        if (!id) return; // Exit if id is null or empty

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`banner/${id}`);
            setBanner(response.data);
        } catch (err) {
            setError('Failed to fetch banner');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    return {
        banner,
        isLoading,
        error,
        refetch: fetchBanner,
    };
};

export default useGetByIdBanner;
