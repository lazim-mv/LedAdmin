'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllAddCatalogue from '@/app/hooks/add-catalogue/useGetAllAddCatalogue';
import { useState } from 'react';

export default function Page() {

    const { catalogue, refetch, isLoading, error } = useGetAllAddCatalogue();

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
        const transformedData = {
            image_url: data.image,
            file_url: data.pdf,
            title: data.title,
            isFeatured: data.isFeatured,
            subtitle: data.subTitle,
        }

        try {
            let response;




            if (transformedData.title === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            if (previewItemId) {
                response = await api.put(`catalogue/${previewItemId}`, transformedData);
            } else {
                response = await api.post("catalogue", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Catalogue updated successfully"
                        : "Catalogue created successfully",
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
            console.error("Failed to save Catalogue:", error);
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
                <BannerForm byIdEndPoint="catalogue" topBarTitle='Catalogue'
                    media='true'
                    title='Catalogue Title'
                    titlePlaceHolder='Title for Catalogue'
                    title2='Featured'
                    titlePlaceHolder2='Sub title for featured'
                    mediaImage='true'
                    mediaPdf='true'
                    page="add-catalogue"
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={catalogue}
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}