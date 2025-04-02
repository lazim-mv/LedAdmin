import { useState, useEffect, useCallback } from "react";
import api from "@/app/axiosConfig";

type AssociatedProduct = {
    _id: string;
    name?: string;
};

type ProjectCategory = {
    _id: string;
    name: string;
};

export interface ProjectsType {
    _id: string;
    name: string;
    title?: string;
    value?: string;
    architect?: string[];
    image_url?: string;
    media_url?: string;
    associated_product?: AssociatedProduct[];
    project_category?: ProjectCategory;
    banner_image?: string[];
    location?: string;
    product_type?: string;
    product_group?: string;
}

interface MetaData {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
}

export interface ProjectTypeWithData {
    success: boolean;
    data: {
        data: ProjectsType[];
        meta: MetaData;
    };
}

const useGetAllProjects = () => {
    const [projects, setProjects] = useState<ProjectsType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState<string | null>(null);
    const [meta, setMeta] = useState<MetaData | null>(null);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, any> = { page, limit };
            if (search) params.search = search;

            const response = await api.get<ProjectTypeWithData>("project", { params });

            if (response.data.success) {
                setProjects(response.data.data.data);
                setMeta(response.data.data.meta);
            } else {
                setError("Failed to fetch projects data");
            }
        } catch (err) {
            setError("Failed to fetch projects data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        isLoading,
        error,
        meta,
        page,
        limit,
        search,
        setPage,
        setLimit,
        setSearch,
        refetch: fetchProjects,
    };
};

export default useGetAllProjects;
