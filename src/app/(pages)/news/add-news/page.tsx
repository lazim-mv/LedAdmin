'use client';
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllNews from '@/app/hooks/news/useGetAllNews';

import React, { useState } from 'react'

const Page = () => {

    const { newsData, refetch, isLoading, error } = useGetAllNews();

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
                title: editorFormData?.editorTitle,
                content: editorContent,
                image_url: data.image,
                postedDate: new Date(editorFormData?.editorDate + 'T00:00:00.000Z')
            }

            if (transformedData.title === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            if (previewItemId) {
                response = await api.put(`news/${previewItemId}`, transformedData);
            } else {
                response = await api.post("news", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "News updated successfully"
                        : "News created successfully",
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
            console.error("Failed to save News:", error);
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
                <BannerForm byIdEndPoint="news" topBarTitle="News"
                    onSubmitSuccess={handleSaveSuccess}
                    editorTitle='Title'
                    editorTitlePlaceHolder='Title for page'
                    media='Add Banner'
                    mediaImage='true'
                    textEditor='true'
                    editorDate="Date"
                    additionalClass='fullWidth'
                    rightSidePreviewItems={false}
                    rightSidePreviewItemsWithEditor={true}
                    allBanners={newsData}
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}

export default Page