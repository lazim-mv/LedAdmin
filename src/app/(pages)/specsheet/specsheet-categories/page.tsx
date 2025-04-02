
"use client"
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllSpecSheetCategories from '@/app/hooks/specsheet-categories/useGetAllSpecSheetCategories';
import { useState } from 'react';

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



    const handleSaveSuccess = async (data: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => {

        try {
            let response;


            const transformedData = {
                name: data.title,
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
                response = await api.put(`specsheet-categories/${previewItemId}`, transformedData);
            } else {
                response = await api.post("specsheet-categories", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Specsheet Categories updated successfully"
                        : "Specsheet Categories created successfully",
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
            console.error("Failed to save Specsheet Categories:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
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
                <BannerForm byIdEndPoint="specsheet-categories" topBarTitle='Specsheet Category'
                    title='Add Category'
                    titlePlaceHolder='Category Name'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={specSheetCategories}
                    reloadPreiviewItems={refetch}

                />
            </main>
        </div>
    )
}

export default Page