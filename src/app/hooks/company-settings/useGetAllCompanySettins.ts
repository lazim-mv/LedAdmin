import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface CompanySettingsData {
    _id: string;
    contactEmail?: string,
    additionalInfo?: string,
    socialMedia: SocialMedia,
    title?: string;
    value?: string;
    image_url?: string;
}

export interface SocialMedia {
    instagram?: string,
    facebook?: string,
    twitter?: string,
    linkedin?: string,
    youtube?: string,
}

interface ApiResponse {
    success: boolean;
    data: CompanySettingsData[];
}

const useGetAllCompanySettings = () => {
    const [companySettings, setCompanySettings] = useState<CompanySettingsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanySettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse>('company-settings');
            if (response.data.success) {
                console.log(response.data, "response");
                const formattedData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setCompanySettings(formattedData);
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
        fetchCompanySettings();
    }, [fetchCompanySettings]);

    return {
        companySettings,
        isLoading,
        error,
        refetch: fetchCompanySettings
    };
};

export default useGetAllCompanySettings;
