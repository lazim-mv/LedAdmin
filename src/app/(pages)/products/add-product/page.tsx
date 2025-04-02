'use client'
import api from '@/app/axiosConfig';
import BannerForm, { EditorFormDataType, FormData } from '@/app/components/BannerForm';
import PreviewItems from '@/app/components/common/PreviewItems';
import ResponseAlert from '@/app/components/common/ResponseAlert';
import useGetAllItemValues from '@/app/hooks/item-values/useGetAllItemValues';
import useGetAllProjectCategories from '@/app/hooks/projects/useGetAllProjectCategories';
import useGetAllAddedProduct, { AddedProduct } from '@/app/hooks/proucts/useGetAllAddedProduct';
import useGetAllProductCategory, { ProductCategory } from '@/app/hooks/proucts/useGetAllProductCategory';
import useGetAllProductGroups, { ProductGroups } from '@/app/hooks/proucts/useGetAllProductGroups';
import useGetAllProductSpecifications from '@/app/hooks/proucts/useGetAllProductSpecifications';
import useGetAllProductType from '@/app/hooks/proucts/useGetAllProductType';
import useGetAllSpecSheetItems from '@/app/hooks/specsheet-items/useGetAllSpecSheetItems';
import { useEffect, useState } from 'react';

// Define the interface for specification
interface ProductSpecification {
  specification: string;
  selected_specs: string[];
}

interface SpecSheetSettings {
  spec_item: string;
  selected_values: string[];
}

// Define the interface for the form data
export interface AddProductFormData {
  title?: string;
  productType: string;
  productCategory: string;
  productGroup: string;
  name: string;
  code: string;
  image_url?: string;
  imageUrl?: string;
  productSpecifications: ProductSpecification[];
  specSheetSettings: SpecSheetSettings[];
  resources: FileUploadData[];
  banner_image?: string[];
  product_diagrams?: string[];
  description?: string;
  projectCategory?: string;
}

interface FileUploadData {
  title: string;
  fileUrl: string;
}

export default function Page() {
  const { productType } = useGetAllProductType();
  // const { productCategory } = useGetAllProductCategory();
  // const { productGroups } = useGetAllProductGroups();
  const { projectCategories } = useGetAllProjectCategories();
  const { productSpecifications } = useGetAllProductSpecifications();
  const { specSheetItems } = useGetAllSpecSheetItems();
  const { addedProduct, refetch } = useGetAllAddedProduct();

  const [productCategory, setProductCategory] = useState<ProductCategory[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroups[]>([])



  const [alertConfig, setAlertConfig] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    show: boolean;
  }>({
    message: '',
    type: 'success',
    show: false,
  });

  const [addProductFormData, setAddProductFormData] = useState<AddProductFormData>({
    name: '',
    code: '',
    productType: '',
    productCategory: '',
    productGroup: '',
    imageUrl: '',
    productSpecifications: [],
    specSheetSettings: [],
    resources: [],
  });

  useEffect(() => {
    if (addProductFormData?.productType) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`product-categories`, {
            params: { productTypeId: addProductFormData.productType }
          });
          setProductCategory(response.data.data);
        } catch (error) {
          console.error("Error fetching product categories:", error);
        }
      };

      fetchProduct();
    }
  }, [addProductFormData?.productType]);

  useEffect(() => {
    if (addProductFormData?.productCategory) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`product-groups`, {
            params: { productTypeId: addProductFormData.productType, productCategoryId: addProductFormData.productCategory }
          });
          setProductGroups(response.data.data);
        } catch (error) {
          console.error("Error fetching product categories:", error);
        }
      };

      fetchProduct();
    }
  }, [addProductFormData?.productCategory]);


  const handleSaveSuccess = async (data: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => {
    const transformedData = {
      ...addProductFormData,
      imageUrl: data.image,
    };
    try {


      if (addProductFormData.name === "") {
        setAlertConfig({
          message: "Incomplete fields detected. Please review and submit again.",
          type: "warning",
          show: true,
        });
        return;
      }

      const response = previewItemId
        ? await api.put(`product/${previewItemId}`, transformedData)
        : await api.post('product', transformedData);

      setAlertConfig({
        message: previewItemId ? 'Product updated successfully' : 'Product created successfully',
        type: 'success',
        show: true,
      });
      refetch();
      if (clearCallback) clearCallback();

    } catch (error: any) {
      console.error('Failed to save Product:', error);
      setAlertConfig({
        message: error.message,
        type: error.type,
        show: true,
      });
    }
  };

  const handleTypeChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, productType: value, productCategory: '', productGroup: '' }));
  };



  const handleCategoryChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, productCategory: value, productGroup: '' }));
  };

  const handleGroupChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, productGroup: value }));
  };

  const handleDetailsChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, name: value }));
  };

  const handleCodeChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, code: value }));
  };

  const handleSpecificationChangeSelect = (selectedValues: ProductSpecification[]) => {
    setAddProductFormData((prev) => ({ ...prev, productSpecifications: selectedValues }));
  };

  const handleSpecSheetConfigChangeSelect = (selectedValues: SpecSheetSettings[]) => {
    setAddProductFormData((prev) => ({ ...prev, specSheetSettings: selectedValues }));
  };


  const handleFileUploadResources = async (fileUrl: string, fileName: string) => {

    const newResource: FileUploadData = {
      title: fileName,
      fileUrl,
    };

    setAddProductFormData((prev) => {
      const existingResourceIndex = prev.resources.findIndex(
        (resource) => resource.title === fileName
      );

      if (existingResourceIndex !== -1) {
        const updatedResources = [...prev.resources];
        updatedResources[existingResourceIndex].fileUrl = fileUrl;
        return {
          ...prev,
          resources: updatedResources,
        };
      }

      return {
        ...prev,
        resources: [...prev.resources, newResource],
      };
    });
  };

  const handleFileUploadDrawingsAndDescription = async (data: { description: string, product_diagrams: string[] }) => {
    setAddProductFormData((prev) => ({ ...prev, description: data.description, product_diagrams: data.product_diagrams }));
  }

  const handleProjectTypeChange = (name: string, value: string) => {
    setAddProductFormData((prev) => ({ ...prev, projectCategory: value }));
  };


  return (
    <div className="appContainer">
      <main className="appMain">
        {alertConfig.show && (
          <ResponseAlert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
          />
        )}
        <BannerForm
          onSubmitSuccess={handleSaveSuccess}

          byIdEndPoint="product"
          topBarTitle="Add Product"
          mediaImage="true"
          media="true"
          rightSidePreviewItems={false}
          // bottomPreviewItems={true}
          additionalClass="addProductClass"
          page="add-product"

          TypeOptions={productType}
          CategoryOptions={productCategory}
          GroupOptions={productGroups}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onGroupChange={handleGroupChange}
          onDetailsChange={handleDetailsChange}
          onAdditionalInfoChange={handleCodeChange}
          onProjectCategoryChange={handleProjectTypeChange}
          previewContainerClassName="customWidth"
          allBanners={addedProduct}
          productSpecifications={productSpecifications}
          itemValues={specSheetItems}
          onChangeSpecifications={handleSpecificationChangeSelect}
          onChangeSpecSheetConfig={handleSpecSheetConfigChangeSelect}
          onFileUpload={handleFileUploadResources}
          onUploadDrawingsAndDescription={handleFileUploadDrawingsAndDescription}
          ProjectCategoryOptions={projectCategories}
        />
      </main>
      {/* <PreviewItems
        previewContainerClassName="customWidth"
        datas={addedProduct}
        byIdEndPoint="product"
        refetchPreviewItemsData={reloadPreviewItems}
      /> */}
    </div>
  );
}
