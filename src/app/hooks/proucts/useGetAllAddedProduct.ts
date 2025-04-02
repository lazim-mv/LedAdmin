import { useState, useEffect, useCallback } from 'react';
import api from '@/app/axiosConfig';

export interface Resource {
    title: string;
    fileUrl: string;
    _id: string;
}

export interface SpecificationDetail {
    spec: string;
    code: string;
    _id: string;
}

export interface NestedSpecification {
    name?: string;
    id?: string;
    specifications: SpecificationDetail[];
    selected_specs?: SpecificationDetail[];
}

interface SpecItem {
    _id: string;
    name: string;
    category: string;
}

export interface NestedSpecSheetConfig {
    name?: string;
    id?: string;
    spec_item: SpecItem[];
    selected_values?: SpecificationDetail[];
}

interface ProductType {
    _id?: string;
    name?: string;
    imageUrl?: string;
}

interface productCategory {
    _id?: string;
    name?: string;
    imageUrl?: string;
}

interface projectCategory {
    _id?: string;
    name?: string;
    imageUrl?: string;
}

interface productGroup {
    _id?: string;
    name?: string;
    imageUrl?: string;
}

export interface AddedProduct {
    title?: string;
    _id: string;
    name: string;
    imageUrl: string;
    code: string;
    productType?: ProductType;
    productCategory?: productCategory;
    productGroup?: productGroup;
    resources: Resource[];
    projectCategory?: projectCategory;
    specifications?: NestedSpecification[];
    specSheet?: NestedSpecSheetConfig[];
    description: string;
    product_diagrams: string[];
}

export interface byIdAddedProduct {
    title?: string;
    _id: string;
    name: string;
    imageUrl: string;
    code: string;
    productType?: string;
    productCategory?: string;
    productGroup?: string;
    resources: Resource[];
    specifications: NestedSpecification[];
    specSheet?: NestedSpecSheetConfig[];
    projectCategory?: string;
    description: string;
    product_diagrams: string[];
}

interface MetaData {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
}

export interface ApiResponse {
    success: boolean;
    data: {
        data: AddedProduct[];
        meta: MetaData;
    };
}

const useGetAllAddedProduct = () => {
    const [addedProduct, setAddedProduct] = useState<AddedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [meta, setMeta] = useState<MetaData | null>(null);

    const fetchAddedProduct = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Reset error state before fetching

        try {
            let params: Record<string, any> = {};
            if (search) {
                params.search = search;
            } else {
                params = { page, limit };
            }

            const response = await api.get<ApiResponse>('product', { params });

            if (response.data.success) {
                setAddedProduct(response.data.data.data);
                setMeta(response.data.data.meta);
            } else {
                setError('Failed to fetch product data');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch product data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchAddedProduct();
    }, [fetchAddedProduct]);

    return {
        addedProduct,
        isLoading,
        error,
        meta,
        page,
        limit,
        search,
        setPage,
        setLimit,
        setSearch,
        refetch: fetchAddedProduct
    };
};

export default useGetAllAddedProduct;
