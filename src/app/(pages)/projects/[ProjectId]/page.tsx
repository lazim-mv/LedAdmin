'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm'
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllProjectCategories from '@/app/hooks/projects/useGetAllProjectCategories';
import useGetAllProjects from '@/app/hooks/projects/useGetAllProjects';
import useGetAllAddedProduct from '@/app/hooks/proucts/useGetAllAddedProduct';
import useGetAllProductCategory from '@/app/hooks/proucts/useGetAllProductCategory';
import useGetAllProductGroups from '@/app/hooks/proucts/useGetAllProductGroups';
import useGetAllProductType from '@/app/hooks/proucts/useGetAllProductType';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const { ProjectId } = useParams() as { ProjectId: string };


    const { productType } = useGetAllProductType();
    const { productCategory } = useGetAllProductCategory();
    const { productGroups } = useGetAllProductGroups();
    const { projectCategories } = useGetAllProjectCategories();
    const { addedProduct } = useGetAllAddedProduct();
    const { projects, refetch } = useGetAllProjects();

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const [addProjectFormData, setAddProjectFormData] = useState({
        name: '',
        code: '',
        projectCategory: '',
        productType: '',
        productCategory: '',
        productGroup: '',
        architect: [] as string[],
        productsArray: [] as string[],
        imageUrl: 'https://example.com/product-a.jpg',
    });



    const handleSaveSuccess = async (data: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => {



        const transformedData = {
            name: editorFormData?.editorTitle,
            location: editorFormData?.editorTitle2,
            banner_image: data.banner_image,
            description: editorContent,
            media_resource: editorFormData?.media_resource,
            project_category: addProjectFormData?.projectCategory,
            // product_category: addProjectFormData?.productCategory,
            // product_type: addProjectFormData?.productType,
            // product_group: addProjectFormData?.productGroup,
            associated_product: addProjectFormData?.productsArray,
            architect: addProjectFormData?.architect,
        }


        if (transformedData.name === "") {
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
                response = await api.put(`project/${previewItemId}`, transformedData);
            } else {
                response = await api.post("project", transformedData);
            }

            if (response.status === 200 || response.status === 201) {
                setAlertConfig({
                    message: previewItemId
                        ? "Project updated successfully"
                        : "Project created successfully",
                    type: "success",
                    show: true,
                });
                refetch();
                // if (clearCallback) clearCallback()
            } else {
                setAlertConfig({
                    message: `${response?.data.message}`,
                    type: "warning",
                    show: true,
                });
            }
        } catch (error: any) {
            console.error("Failed to save project:", error);
            setAlertConfig({
                message: error.message,
                type: "error",
                show: true,
            });
        }
    };

    const handleProjectTypeChange = (name: string, value: string) => {
        setAddProjectFormData((prev) => ({ ...prev, projectCategory: value }));
    };

    const handleTypeChange = (name: string, value: string) => {
        setAddProjectFormData((prev) => ({ ...prev, productType: value }));
    };

    const handleCategoryChange = (name: string, value: string) => {
        setAddProjectFormData((prev) => ({ ...prev, productCategory: value }));
    };

    const handleGroupChange = (name: string, value: string) => {
        setAddProjectFormData((prev) => ({ ...prev, productGroup: value }));
    };

    const handleDetailsChange = (name: string, value: string) => {
        setAddProjectFormData((prev) => ({ ...prev, name: value }));
    };

    const handleMultiStringChange = (name: string, value: string[]) => {
        setAddProjectFormData((prev) => ({ ...prev, architect: value }))
    }

    const handleSelectedProducts = (selected: string[]) => {
        setAddProjectFormData((prev) => ({ ...prev, productsArray: selected }));
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
                    byIdEndPoint="project" topBarTitle='Edit Project'
                    media='Add Banner'
                    mediaImage='true'
                    page='edit-project'



                    rightSidePreviewItems={false}
                    // bottomPreviewItems={true}
                    additionalClass='fullWidth'
                    textEditor='true'
                    editorImage='true'
                    editorTitle='Project Name'
                    editorTitlePlaceHolder='Name of the project'
                    editorTitle2='Location'
                    editorTitlePlaceHolder2='Project Location'
                    rightSidePickersWithEditor={true}
                    editorClassName='width1000'
                    previewContainerClassName={'previewContainerFullWidth'}
                    allBanners={projects}
                    onSubmitSuccess={handleSaveSuccess}
                    onMultiStringChange={handleMultiStringChange}


                    productOptions={addedProduct}
                    TypeOptions={productType}
                    CategoryOptions={productCategory}
                    GroupOptions={productGroups}
                    ProjectCategoryOptions={projectCategories}

                    onChangeMultiSelect={handleSelectedProducts}
                    onProjectCategoryChange={handleProjectTypeChange}
                    onTypeChange={handleTypeChange}
                    onCategoryChange={handleCategoryChange}
                    onGroupChange={handleGroupChange}
                    onDetailsChange={handleDetailsChange}
                    multipleImages={true}
                    getById={ProjectId}
                // reloadPreiviewItems={refetch}
                />
            </main>
        </div>
    )
}

