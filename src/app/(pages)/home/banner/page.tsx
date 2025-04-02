'use client'

import api from "@/app/axiosConfig"
import BannerForm, { EditorFormDataType, FormData } from "@/app/components/BannerForm"
import ResponseAlert from "@/app/components/common/ResponseAlert";
import useGetAllBanner from "@/app/hooks/banner/useGetAllBanner"
import { useState } from "react";


export default function Page() {
    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const { banners, error, isLoading, refetch } = useGetAllBanner()

    const handleSaveSuccess = async (data: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => {
        console.log(data, "dataurl");

        try {
            const transformedData = {
                title: data.title,
                subtitle: data.subTitle,
                media_url: data?.video_url && data.video_url !== "" ? data.video_url : data.image,
                button: {
                    text: data.button.text,
                    link: data.button.link,
                }
            }

            if (transformedData.title === "") {
                setAlertConfig({
                    message: "Incomplete fields detected. Please review and submit again.",
                    type: "warning",
                    show: true,
                });
                return;
            }

            let response;

            if (previewItemId) {
                response = await api.put(`banner/${previewItemId}`, transformedData);
            } else {
                response = await api.post("banner", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Banner updated successfully"
                        : "Banner created successfully",
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
            console.error("Failed to save banner:", error);
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
                    allBanners={banners}
                    onSubmitSuccess={handleSaveSuccess}
                    videoUrl='true'
                    mediaImage='true'
                    mediaVideo='true'
                    topBarTitle='Add New Banner'
                    buttonLink='true' media='true'
                    title='Title'
                    titlePlaceHolder='Title for banner'
                    title2='Sub Title'
                    titlePlaceHolder2='Sub title for banner'
                    byIdEndPoint="banner"
                    reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}