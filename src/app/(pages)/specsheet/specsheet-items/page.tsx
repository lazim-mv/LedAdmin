"use client"
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllSpecSheetCategories, { SpecSheetCategories } from '@/app/hooks/specsheet-categories/useGetAllSpecSheetCategories';
import useGetAllSpecSheetItems from '@/app/hooks/specsheet-items/useGetAllSpecSheetItems';
import { useCallback, useEffect, useState } from 'react';

const Page = () => {
    const { specSheetItems, refetch, isLoading, error } = useGetAllSpecSheetItems();
    const {
        specSheetCategories,
        refetch: categoriesRefetch,
        isLoading: categoriesIsLoading,
        error: categoriesError
    } = useGetAllSpecSheetCategories();

    const [categoryId, setCategoryId] = useState<string>("");
    const [previewData, setPreviewData] = useState<SpecSheetCategories[]>([]);

    const [previewItemHeadername, setPreviewItemHeadername] = useState<string>("Specsheet Category");

    // Fetch items based on category ID
    const fetchItemsByCategory = useCallback(async (id: string) => {
        try {
            const response = await api.get(`specsheet-items`, {
                params: { categoryId: id }
            });
            setPreviewData(response.data.data);
        } catch (error) {
            console.error("Error fetching item values:", error);
        }
    }, []);

    // Handle preview data updates
    useEffect(() => {
        if (!categoryId) {
            setPreviewData(specSheetCategories);
            setPreviewItemHeadername("Specsheet Category")
        } else {
            fetchItemsByCategory(categoryId);
            setPreviewItemHeadername("Specsheet Item")
        }
    }, [categoryId, specSheetItems, fetchItemsByCategory]);

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const handleSaveSuccess = async (
        data: FormData,
        editorContent?: string,
        editorFormData?: EditorFormDataType,
        previewItemId?: string,
        clearCallback?: () => void
    ) => {

        const transformedData = {
            name: data.title,
            category: data?.selectedOptionId,
        };

        try {


            if (transformedData.name === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            const response = previewItemId
                ? await api.put(`specsheet-items/${previewItemId}`, transformedData)
                : await api.post("specsheet-items", transformedData);

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: `Specsheet Item ${previewItemId ? 'updated' : 'created'} successfully`,
                    type: "success",
                    show: true,
                });

                // Refresh data based on current category filter
                if (categoryId) {
                    await fetchItemsByCategory(categoryId);
                } else {
                    await refetch();
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
            console.error("Failed to save Specsheet Item:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const handleChangeSelectOptions = (id: string) => {
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
                    byIdEndPoint="specsheet-items"
                    topBarTitle='Specsheet Item'
                    page='specsheet-item'
                    title='Item Name'
                    titlePlaceHolder='Item Name'
                    selectComponent='true'
                    selectLabel='Category'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={previewData}
                    options={specSheetCategories}
                    reloadPreiviewItems={refetch}
                    selectOptionChange={handleChangeSelectOptions}
                    previewItemHeadername={previewItemHeadername}

                />
            </main>
        </div>
    );
};

export default Page;