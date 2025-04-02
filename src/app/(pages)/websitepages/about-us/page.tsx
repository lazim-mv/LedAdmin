"use client"
import api from '@/app/axiosConfig'
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert'
import useGetAllAbout from '@/app/hooks/about-us/useGetAllAbout'

import React, { useState } from 'react'

const Page = () => {
    const { aboutData, refetch, isLoading, error } = useGetAllAbout();

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
                title: data.title,
                content: editorContent,
                image_url: data.image,
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
                response = await api.put(`about/${previewItemId}`, transformedData);
            } else {
                response = await api.post("about", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "About updated successfully"
                        : "About created successfully",
                    type: "success",
                    show: true,
                });
                reloadPreiviewItems();
                if (clearCallback) clearCallback()
            } else {
                setAlertConfig({
                    message: `${response?.data.error}`,
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save About:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const reloadPreiviewItems = () => {
        refetch();
    }
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
                    allBanners={aboutData}
                    onSubmitSuccess={handleSaveSuccess}
                    textEditor='true' title='Title'
                    titlePlaceHolder='Title for page'
                    topBarTitle="About us"
                    byIdEndPoint='about'
                    media='true'
                    mediaImage='true'
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}

export default Page