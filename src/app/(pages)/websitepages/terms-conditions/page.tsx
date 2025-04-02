"use client"
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllTermsCondition from '@/app/hooks/terms-conditions/useGetAllTermsCondition';

import React, { useState } from 'react'

const Page = () => {
    const { termsCondition, refetch, isLoading, error } = useGetAllTermsCondition();



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

            const response = await api.put("terms-conditions", transformedData);


            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Terms & Conditions updated successfully"
                        : "Terms & Conditions created successfully",
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
            console.error("Failed to save Terms & Conditions:", error);
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
                <BannerForm byIdEndPoint="terms-conditions"
                    topBarTitle="Terms & Conditions"
                    textEditor='true'
                    title='Title'
                    titlePlaceHolder='Title for page'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={termsCondition}
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}

export default Page