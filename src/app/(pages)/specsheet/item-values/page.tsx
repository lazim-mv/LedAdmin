"use client"
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllSpecSheetCategories from '@/app/hooks/specsheet-categories/useGetAllSpecSheetCategories';
import { useCallback, useEffect, useState } from 'react';

const Page = () => {
    const { specSheetCategories, refetch, isLoading, error } = useGetAllSpecSheetCategories();

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const [categoryId, setCategoryId] = useState<string>("");
    const [specSheetItems, setSpecSheetItems] = useState<any[]>([]);
    const [itemId, setItemId] = useState<string>("");
    const [itemValues, setItemValues] = useState<any[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [previewItemHeadername, setPreviewItemHeadername] = useState<string>("Specsheet Category");



    const fetchSpecSheetItems = useCallback(async (categoryId: string) => {
        try {
            const response = await api.get(`specsheet-items`, {
                params: { categoryId }
            });
            setSpecSheetItems(response.data.data);
            setPreviewData(response.data.data);
        } catch (error) {
            console.error("Error fetching specsheet items:", error);
            setSpecSheetItems([]);
            setPreviewData([]);
        }
    }, []);


    const fetchItemValues = useCallback(async (categoryId: string, itemId: string) => {
        try {
            const response = await api.get(`specsheet-item-value`, {
                params: { categoryId, itemId }
            });
            setItemValues(response.data.data);
            setPreviewData(response.data.data);
        } catch (error) {
            console.error("Error fetching item values:", error);
            setItemValues([]);
            setPreviewData([]);
        }
    }, []);




    useEffect(() => {
        if (!categoryId && categoryId === "") {
            setPreviewData(specSheetCategories || []);
            setSpecSheetItems([]);
            setItemValues([]);
            setPreviewItemHeadername("Specsheet Category")
        } else if (categoryId && itemId) {
            fetchItemValues(categoryId, itemId);
        } else if (categoryId && itemId === "") {
            fetchSpecSheetItems(categoryId);
        }
    }, [categoryId, itemId, specSheetCategories, fetchSpecSheetItems]);

    // Handle item changes
    useEffect(() => {

        if (categoryId && itemId) {
            fetchItemValues(categoryId, itemId);
            setPreviewItemHeadername("Item Values")
        } else if (categoryId) {

            setPreviewData(specSheetItems);
            setPreviewItemHeadername("Specsheet Item")
        }
    }, [itemId, categoryId, fetchItemValues]);


    const handleSaveSuccess = async (
        data: FormData,
        editorContent?: string,
        editorFormData?: EditorFormDataType,
        previewItemId?: string,
        clearCallback?: () => void
    ) => {
        try {
            const transformedData = {
                value: data.title3,
                value_shortform: data.title4,
                image_url: data.image,
                item: itemId,
            };

            if (transformedData.value === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            const endpoint = previewItemId
                ? `specsheet-item-value/${previewItemId}`
                : "specsheet-item-value";

            const method = previewItemId ? 'put' : 'post';
            const response = await api[method](endpoint, transformedData);

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: `Specsheet value ${previewItemId ? 'updated' : 'created'} successfully`,
                    type: "success",
                    show: true,
                });

                // Refresh the current view
                if (categoryId && itemId) {
                    await fetchItemValues(categoryId, itemId);
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
            console.error("Failed to save Specsheet value:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const handleChangeSelectOptions = (id: string) => {
        setCategoryId(id);
        setItemId("");
    };

    const handleChangeSelectOptions2 = (id: string) => {
        setItemId(id);
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
                    byIdEndPoint="specsheet-item-value"
                    topBarTitle='Item Values'
                    page='specsheet-item-values'
                    media='true'
                    mediaImage='true'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={previewData}
                    reloadPreiviewItems={refetch}
                    selectLabel='Category'
                    options={specSheetCategories}
                    options2={specSheetItems}
                    title3='Add Item Value'
                    titlePlaceHolder3='Enter Item Value'
                    title4='Short'
                    titlePlaceHolder4='Short'
                    selectOptionChange={handleChangeSelectOptions}
                    selectOptionChange2={handleChangeSelectOptions2}
                    previewItemHeadername={previewItemHeadername}
                />
            </main>
        </div>
    );
};

export default Page;