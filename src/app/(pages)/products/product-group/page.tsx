'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllProductCategory, { ProductCategory } from '@/app/hooks/proucts/useGetAllProductCategory';
import useGetAllProductGroups, { ProductGroups } from '@/app/hooks/proucts/useGetAllProductGroups';
import useGetAllProductType, { ProductType } from '@/app/hooks/proucts/useGetAllProductType';
import { useCallback, useEffect, useState } from 'react';

export default function Page() {
    const { productType } = useGetAllProductType();
    const { productGroups, refetch } = useGetAllProductGroups();

    const [typeId, setTypeId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);

    const [previewItemHeadername, setPreviewItemHeadername] = useState<string>("Product Types");

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    // Initial preview data setup with product types
    useEffect(() => {
        if (productType) {
            setPreviewData(productType);
        }
    }, [productType]);

    // Fetch and update product categories when type changes
    const fetchProductCategories = useCallback(async (selectedTypeId: string) => {
        try {
            const response = await api.get(`product-categories`, {
                params: { productTypeId: selectedTypeId }
            });
            setProductCategories(response.data.data);
            setPreviewData(response.data.data);
        } catch (error) {
            console.error("Error fetching product categories:", error);
            setProductCategories([]);
            setPreviewData([]);
        }
    }, []);

    // Fetch and update product groups when category changes
    const fetchProductGroups = useCallback(async (typeId: string, selectedCategoryId: string) => {
        try {
            const response = await api.get(`product-groups`, {
                params: { productTypeId: typeId, productCategoryId: selectedCategoryId }
            });
            setPreviewData(response.data.data);
        } catch (error) {
            console.error("Error fetching product family:", error);
            setPreviewData([]);
        }
    }, []);

    // Handle type selection
    useEffect(() => {
        if (typeId) {
            fetchProductCategories(typeId);
            setPreviewItemHeadername("Product Categories")
        }
        if (!typeId || typeId === "") {
            setPreviewItemHeadername("Product Types")
            setPreviewData(productType)
        }
    }, [typeId, fetchProductCategories]);



    // Handle category selection
    useEffect(() => {
        if (categoryId) {
            fetchProductGroups(typeId, categoryId);
            setPreviewItemHeadername("Product Family")
        }
    }, [categoryId, fetchProductGroups]);

    const handleSaveSuccess = async (
        data: FormData,
        editorContent?: string,
        editorFormData?: EditorFormDataType,
        previewItemId?: string,
        clearCallback?: () => void
    ) => {
        try {
            const transformedData = {
                name: data.title,
                productType: data.selectedOptionId,
                productCategory: data.selectedOptionId2,
                image_url: data.image || "",
            };

            if (transformedData.name === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            const endpoint = `product-groups${previewItemId ? `/${previewItemId}` : ''}`;
            const method = previewItemId ? 'put' : 'post';
            const response = await api[method](endpoint, transformedData);

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: `Product Family ${previewItemId ? 'updated' : 'created'} successfully`,
                    type: "success",
                    show: true,
                });

                if (categoryId) {
                    await fetchProductGroups(typeId, categoryId);
                }
                if (clearCallback) clearCallback();
            } else {
                setAlertConfig({
                    message: response?.data.error || 'Operation failed',
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save Product Family:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const handleChangeSelectOptions = (id: string) => {
        setTypeId(id);
        setCategoryId("");
    };

    const handleChangeSelectOptions2 = (id: string) => {
        setCategoryId(id);
    };

    return (
        <div className="appContainer">
            <main className="appMain">
                {alertConfig.show && (
                    <ResponseAlert
                        message={alertConfig.message}
                        type={alertConfig.type}
                        onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
                    />
                )}
                <BannerForm
                    byIdEndPoint="product-groups"
                    topBarTitle='Product Family'
                    mediaImage='true'
                    media='Thumbnail'
                    title='Add Product Family'
                    titlePlaceHolder='Family Name'
                    page='product-group'
                    options={productType}
                    options2={productCategories}
                    allBanners={previewData}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                    selectOptionChange={handleChangeSelectOptions}
                    selectOptionChange2={handleChangeSelectOptions2}
                    previewItemHeadername={previewItemHeadername}
                />
            </main>
        </div>
    );
}