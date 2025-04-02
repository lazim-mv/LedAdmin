'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllProductType from '@/app/hooks/proucts/useGetAllProductType';
import { useState } from 'react';

export default function Page() {
    const { productType, refetch, isLoading, error } = useGetAllProductType();

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
                image_url: data.image || "",
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
                response = await api.put(`product-types/${previewItemId}`, transformedData);
            } else {
                response = await api.post("product-types", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Product Type updated successfully"
                        : "Product Type created successfully",
                    type: "success",
                    show: true,
                });
                if (clearCallback) clearCallback()
                refetch();
            } else {
                setAlertConfig({
                    message: `${response?.data.error}`,
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save Product Type:", error);
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
                <BannerForm byIdEndPoint="product-types" topBarTitle='Product Type' mediaImage='true'
                    media='Thumbnail'
                    title='Product Type'
                    titlePlaceHolder='Enter Product Type'
                    page='product-type'
                    onSubmitSuccess={handleSaveSuccess}
                    allBanners={productType}
                    reloadPreiviewItems={refetch}
                />

            </main>
        </div>
    )
}