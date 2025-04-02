"use client";
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllResearchDevelopment from '@/app/hooks/research-development/useGetAllResearchDevelopment';

import React, { useState } from 'react';

const Page = () => {
    const { researchDevelopment, refetch, isLoading, error } = useGetAllResearchDevelopment();

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
            title: editorFormData?.editorTitle,
            subtitle: editorFormData?.editorTitle2,
            media_url: editorFormData?.media_resource && editorFormData?.media_resource.length > 0 ? editorFormData?.media_resource[0] : editorFormData?.editorVideoUrl,
            content: editorContent,
        };



        if (transformedData.title === "") {
            setAlertConfig({
                message: "Incomplete fields detected. Please review and submit again.",
                type: "warning",
                show: true,
            });
            return;
        }

        try {
            let response;

            if (previewItemId) {
                response = await api.put(`research-development/${previewItemId}`, transformedData);
            } else {
                response = await api.post("research-development", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Research and Development updated successfully"
                        : "Research and Development created successfully",
                    type: "success",
                    show: true,
                });
                refetch();
                if (clearCallback) clearCallback()
            } else {
                setAlertConfig({
                    message: `${response?.data?.error || "Unexpected error occurred"}`,
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save Research and Development:", error);
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
                <BannerForm
                    byIdEndPoint="research-development"
                    page="research-development"
                    topBarTitle="Research & Development"
                    rightSidePreviewItems={false}
                    rightSidePreviewItemsWithEditor={true}
                    editorVideo="Video url"
                    editorTitle="Title"
                    editorTitlePlaceHolder="Title for page"
                    editorTitle2="Sub Title"
                    editorVideoPlaceHolder2="Enter video url"
                    textEditor="true"
                    titlePlaceHolder="Title for page"
                    allBanners={researchDevelopment}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                    editorImage="image"
                // reloadPreviewItems={refetch}
                />
            </main>
        </div>
    );
};

export default Page;
