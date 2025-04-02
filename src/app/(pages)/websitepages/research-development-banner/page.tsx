"use client";
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllResearchDevelopment from '@/app/hooks/research-development/useGetAllResearchDevelopment';
import useGetAllResearchDevelopmentPage from '@/app/hooks/research-development/useGetAllResearchDevelopmentPage';

import React, { useState } from 'react';

const Page = () => {
    const { researchDevelopmentPage, refetch, isLoading, error } = useGetAllResearchDevelopmentPage();

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


        const transformedData2 = {
            title: data.title,
            image_url: data.image,
            subtitle: data.subTitle,
        };


        try {
            let response;

            if (transformedData2.title === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }
            response = await api.put("research-development-page", transformedData2);


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
                    page="research-development-banner"
                    topBarTitle="Research & Development Banner"
                    media="true"
                    mediaImage="true"
                    title="Title"
                    rightSidePreviewItems={false}
                    titlePlaceHolder="Title for page"
                    allBanners={researchDevelopmentPage}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                // reloadPreviewItems={refetch}
                />
            </main>
        </div>
    );
};

export default Page;
