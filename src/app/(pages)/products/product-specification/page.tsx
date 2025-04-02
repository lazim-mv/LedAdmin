'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import { Specification } from '@/app/components/common/SpecificationVariants';
import useGetAllProductSpecifications from '@/app/hooks/proucts/useGetAllProductSpecifications';
import { useState } from 'react';

export default function Page() {
    const [specficationData, setSpecficationData] = useState<Specification[]>([]);
    const { productSpecifications, refetch } = useGetAllProductSpecifications();

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
                specifications: specficationData,
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
                response = await api.put(`product-specifications/${previewItemId}`, transformedData);
            } else {
                response = await api.post("product-specifications", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Product Specification updated successfully"
                        : "Product Specification created successfully",
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
            console.error("Failed to save Product Specification:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };


    const handleSpecificationsChange = (specifications: Specification[]) => {
        setSpecficationData(specifications);
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
                <BannerForm byIdEndPoint="product-specifications" topBarTitle='Product Specification'
                    title='Add Specification Name'
                    titlePlaceHolder='Specification Name'
                    page='Product Specification'
                    allBanners={productSpecifications}
                    onSubmitSuccess={handleSaveSuccess}
                    reloadPreiviewItems={refetch}
                    onSpecificationsChange={handleSpecificationsChange}
                />
            </main>
        </div>
    )
}