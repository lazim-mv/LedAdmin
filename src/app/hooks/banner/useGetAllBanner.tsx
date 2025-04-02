import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

interface BannerButton {
    text: string;
    link: string;
}

export interface Banners {
    _id: string;
    button: BannerButton;
    title: string;
    subtitle: string;
    media_url: string;
    active: boolean;
    isFav?: boolean;
    isVisible?: boolean;
    name?: string;
    value?: string;
    image_url?: string;
}

const useGetAllBanner = () => {
    const [banners, setBanners] = useState<Banners[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('banner');
            setBanners(response.data);
        } catch (err) {
            setError('Failed to fetch banners');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    return {
        banners,
        isLoading,
        error,
        refetch: fetchBanners
    };
};

export default useGetAllBanner;
