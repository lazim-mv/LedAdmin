
"use client"
import api from '@/app/axiosConfig'
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert'
import useGetAllPrivacyPolicy from '@/app/hooks/privacy-policy/useGetAllPrivacyPolicy'

import React, { useState } from 'react'

const Page = () => {

    const { privacyPolicy, refetch, isLoading, error } = useGetAllPrivacyPolicy();



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


            const transformedData = {
                title: data.title,
                content: editorContent,
            }

            if (transformedData.title === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }


            const response = await api.put("privacy-policy", transformedData);


            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Privacy Policy updated successfully"
                        : "Privacy Policy created successfully",
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
            console.error("Failed to save Privacy Policy:", error);
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
                <BannerForm byIdEndPoint="privacy-policy"
                    topBarTitle="Privacy Policy"
                    textEditor='true'
                    title='Title'
                    titlePlaceHolder='Title for page'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={privacyPolicy}
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}

export default Page