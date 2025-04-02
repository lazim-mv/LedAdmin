'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllProductCategory, { ProductCategory } from '@/app/hooks/proucts/useGetAllProductCategory';
import useGetAllProductType from '@/app/hooks/proucts/useGetAllProductType';
import { useCallback, useEffect, useState } from 'react';

export default function Page() {
    const { productType } = useGetAllProductType();
    const { productCategory, refetch } = useGetAllProductCategory();

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const [typeId, setTypeId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);

    const [previewItemHeadername, setPreviewItemHeadername] = useState<string>("Product Types");


    useEffect(() => {
        if (productType) {
            setPreviewData(productType);
        }
    }, [productType]);

    const fetchProductCategories = useCallback(async (selectedTypeId: string) => {
        try {
            const response = await api.get(`product-categories`, {
                params: { productTypeId: selectedTypeId }
            });
            setProductCategories(response.data.data);
            setPreviewData(response.data.data);
        } catch (error) {
            setProductCategories([]);
            setPreviewData([]);
        }
    }, []);

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



    const handleSaveSuccess = async (data: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => {

        try {
            let response;


            const transformedData = {
                name: data.title,
                productType: data.selectedOptionId,
                image_url: data.image,
            }

            if (transformedData.name === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            if (previewItemId) {
                response = await api.put(`product-categories/${previewItemId}`, transformedData);
            } else {
                response = await api.post("product-categories", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Banner updated successfully"
                        : "Banner created successfully",
                    type: "success",
                    show: true,
                });
                refetch();
                if (clearCallback) clearCallback()
            } else {
                setAlertConfig({
                    message: `${response?.data.error}`,
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save banner:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const handleChangeSelectOptions = (id: string) => {
        setTypeId(id);
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
                <BannerForm byIdEndPoint="product-categories" topBarTitle='Product Category' mediaImage='true'
                    media='Thumbnail'
                    title='Add Product Category'
                    titlePlaceHolder='Category Name'
                    selectComponent='true'
                    page='product-category'
                    options={productType}
                    allBanners={previewData}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                    selectOptionChange={handleChangeSelectOptions}
                    previewItemHeadername={previewItemHeadername}
                    selectLabel='Product Type'
                />
            </main>
        </div>
    )
}