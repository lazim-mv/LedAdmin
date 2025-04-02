"use client";
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllCompanySettings from '@/app/hooks/company-settings/useGetAllCompanySettins';

import React, { useState } from 'react';

const Page = () => {
    const { companySettings, refetch, isLoading, error } = useGetAllCompanySettings();

    console.log(companySettings, "companySettings");

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


        console.log(data.companySettingsData, "saveHandler");


        try {
            let response;

            if (data?.companySettingsData?.contactEmail === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }
            response = await api.put("company-settings", data.companySettingsData);


            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Company Settings updated successfully"
                        : "Company Settings created successfully",
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
            console.error("Failed to save Company Settings:", error);
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
                    byIdEndPoint="company-settings"
                    page="companySettings"
                    topBarTitle="Company Settings"
                    rightSidePreviewItems={false}
                    allBanners={companySettings}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                // reloadPreviewItems={refetch}
                />
            </main>
        </div>
    );
};

export default Page;
