import styles from './styles/BannerForm.module.css';
import { TfiGallery } from "react-icons/tfi";
import { IoVideocamOutline } from "react-icons/io5";
import { act, useEffect, useRef, useState } from 'react';
import PreviewItems from './common/PreviewItems';
import TopBar from './TopBar';
import Editor from './TextEditor/TextEditor';
import { LuFileSpreadsheet } from "react-icons/lu";
import RightSidePicker from './common/RightSidePicker';
import SelectComponent from './common/SelectComponent';
import DownloadsResources, { ResourceItem } from './common/DownloadsResources';
import SpecificationVariants, { Specification } from './common/SpecificationVariants';
import api from '../axiosConfig';
import ResponseAlert from './common/ResponseAlert';
import { Banners } from '../hooks/banner/useGetAllBanner';
import { Banner } from '../hooks/banner/useGetByIdBanner';

import { AboutData } from '../hooks/about-us/useGetAllAbout';
import { ResearchDevelopmentData } from '../hooks/research-development/useGetAllResearchDevelopment';
import useGetByIdPreviewData from '../hooks/common/useGetByIdPreviewData';
import { TermsCondition } from '../hooks/terms-conditions/useGetAllTermsCondition';
import { ProjectCategories } from '../hooks/projects/useGetAllProjectCategories';
import { on } from 'events';
import { ProductSpecifications, ProductSpecificationsByIdResponse, } from '../hooks/proucts/useGetAllProductSpecifications';
import { ProductType } from '../hooks/proucts/useGetAllProductType';
import Image from 'next/image';
import MultiSelect from './common/MultiSelectPicker';
import { ProjectsType } from '../hooks/projects/useGetAllProjects';
import { ItemValues } from '../hooks/item-values/useGetAllItemValues';
import { AddedProduct, byIdAddedProduct, NestedSpecification, NestedSpecSheetConfig, Resource } from '../hooks/proucts/useGetAllAddedProduct';
import Picker from './common/picker';
import { SpecSheetItems } from '../hooks/specsheet-items/useGetAllSpecSheetItems';
import MultipleImageUpload, { UploadData } from './common/MultipleImageUpload';
import { FaFilePdf } from 'react-icons/fa';
import CompanySetting from '../(pages)/home/company-settings/components/CompanySetting';
import { CompanySettingsData, SocialMedia } from '../hooks/company-settings/useGetAllCompanySettins';






export interface FormData {
    title?: string,
    title3?: string,
    title4?: string,
    subTitle?: string,
    button: {
        text?: string,
        link?: string,
    },
    media_url: string,
    image_url?: string,
    video_url?: string,
    isFeatured?: boolean;
    image?: string;
    pdf?: string;
    banner_image?: string[],
    selectedOptionId?: string;
    selectedOptionId2?: string;
    imagesArray?: string[];
    companySettingsData?: CompanySettingsData,
}

export interface DownloadPdfData {
    [key: string]: {
        [key: string]: string;
    };
}

export interface EditorFormDataType {
    editorTitle?: string,
    editorTitle2?: string,
    editorVideoUrl?: string,
    editorDate?: string,
    media_resource?: string[],

}

type AboutDataWithData = {
    media_url?: string;
    data: AboutData
}


type ResearchDevelopmentWithData = {
    media_url?: string;
    data: ResearchDevelopmentData
}

type BannerDataWithData = {
    media_url?: string;
    success: boolean;
    data: Banner;
};

type AddProductFormDataWithData = {
    media_url?: string;
    data: byIdAddedProduct
}

type ProjectTypeWithData = {
    media_url?: string;
    data: ProjectsType
}

export type SelectOptions = {
    _id: string;
    name?: string;
}

type PreviewItemType = BannerDataWithData | AboutDataWithData | ResearchDevelopmentWithData | ProductSpecificationsByIdResponse | AddProductFormDataWithData | ProjectTypeWithData;

type productCategoryType = {
    _id: string;
    name: string;
    title?: string;
}



type Props = {
    getById?: string;

    // Form Input Props
    title?: string;
    title2?: string;
    title3?: string;
    title4?: string;
    titlePlaceHolder?: string;
    titlePlaceHolder2?: string;
    titlePlaceHolder3?: string;
    titlePlaceHolder4?: string;
    buttonLink?: string;
    media?: string;
    videoUrl?: string;
    mediaVideo?: string;
    mediaImage?: string;
    mediaPdf?: string;

    // Editor Props
    textEditor?: string;
    editorTitle?: string;
    editorTitle2?: string;
    editorTitlePlaceHolder?: string;
    editorTitlePlaceHolder2?: string;
    editorVideoPlaceHolder2?: string;
    editorVideo?: string;
    editorImage?: string;
    editorDate?: string;
    editorClassName?: string;

    // UI Props
    topBarTitle?: string;
    additionalClass?: string;
    previewContainerClassName?: string;
    selectComponent?: string;
    selectLabel?: string;
    page?: string;
    previewItemHeadername?: string;

    // Select Component Props
    options?: SelectOptions[];
    options2?: SelectOptions[];

    // Sidebar & Picker Props
    rightSidePreviewItems?: true | false;
    rightSidePreviewItemsWithEditor?: true | false;
    rightSidePickersWithEditor?: true | false;
    bottomPreviewItems?: true | false;
    pickerItem?: string;
    pickerItem2?: string;
    pickerItem3?: string;
    pickerItem4?: string;
    pickerItem5?: string;
    productOptions?: ProductType[];
    TypeOptions?: ProductType[];
    CategoryOptions?: productCategoryType[];
    GroupOptions?: productCategoryType[];
    productSpecifications?: ProductSpecifications[];
    itemValues?: SpecSheetItems[];
    ProjectCategoryOptions?: ProjectCategories[];

    multipleImages?: boolean;


    // Data & API Props
    downloadPdfData?: DownloadPdfData | null;
    allBanners?: Banners[] | AboutData[] | ResearchDevelopmentData[] | TermsCondition[] | ProjectCategories[] | ItemValues[] | ResearchDevelopmentData[] | CompanySettingsData[];
    byIdEndPoint: string;

    // Event Handlers
    onContinue?: (updatedField: { [key: string]: string }) => void;
    onSubmitSuccess?: (response: FormData, editorContent?: string, editorFormData?: EditorFormDataType, previewItemId?: string, clearCallback?: () => void) => void;
    reloadPreiviewItems?: () => void;
    onSpecificationsChange?: (specifications: Specification[]) => void;

    onChangeMultiSelect?: (selected: string[]) => void;
    onProjectCategoryChange?: (name: string, value: string) => void;
    onTypeChange?: (name: string, value: string) => void;
    onCategoryChange?: (name: string, value: string) => void;
    onGroupChange?: (name: string, value: string) => void;
    onDetailsChange?: (name: string, value: string) => void;
    onMultiStringChange?: (name: string, values: string[]) => void;
    onAdditionalInfoChange?: (name: string, value: string) => void;
    onChangeSpecifications?: (selectedValues: { specification: string; selected_specs: string[] }[]) => void;
    onChangeSpecSheetConfig?: (selectedValues: { spec_item: string; selected_values: string[] }[]) => void;
    onFileUpload?: (fileUrl: string, fileName: string) => void;
    handleCompanySettingsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

    dataCallBack?: (singleAddedProdcut: byIdAddedProduct) => void;
    selectOptionChange?: (id: string, name?: string) => void;
    selectOptionChange2?: (id: string, name?: string) => void;
    onUploadDrawingsAndDescription?: (data: { description: string, product_diagrams: string[] }) => void;
};

const BannerForm: React.FC<Props> = ({
    getById,

    title,
    title2,
    title3,
    title4,
    titlePlaceHolder,
    titlePlaceHolder2,
    titlePlaceHolder3,
    titlePlaceHolder4,
    buttonLink,
    media,
    videoUrl,
    mediaVideo,
    mediaImage,
    mediaPdf,

    // Editor Props
    textEditor,
    editorTitle,
    editorTitle2,
    editorTitlePlaceHolder,
    editorTitlePlaceHolder2,
    editorVideo,
    editorImage,
    editorDate,
    editorClassName,

    // UI Props
    topBarTitle,
    additionalClass,
    previewContainerClassName,
    selectComponent,
    selectLabel,
    page,
    previewItemHeadername,

    // Select Component Props
    options = [],
    options2 = [],

    // Sidebar & Picker Props
    rightSidePreviewItems = true,
    rightSidePreviewItemsWithEditor = false,
    rightSidePickersWithEditor = false,
    bottomPreviewItems = false,
    productOptions,
    TypeOptions,
    CategoryOptions,
    GroupOptions,
    ProjectCategoryOptions,

    // Data & API Props
    downloadPdfData,
    allBanners,
    byIdEndPoint,

    // Event Handlers
    onContinue,
    onSubmitSuccess,
    reloadPreiviewItems,
    onSpecificationsChange,

    productSpecifications,
    itemValues,

    onChangeMultiSelect,
    onProjectCategoryChange,
    onTypeChange,
    onCategoryChange,
    onGroupChange,
    onDetailsChange,
    onMultiStringChange,
    onAdditionalInfoChange,
    onChangeSpecifications,
    onChangeSpecSheetConfig,
    onFileUpload,
    multipleImages = false,
    dataCallBack,
    selectOptionChange,
    selectOptionChange2,
    onUploadDrawingsAndDescription,
    editorVideoPlaceHolder2,
}) => {
    const [selectedOption1, setSelectedOption1] = useState<string>("");
    const [selectedOption2, setSelectedOption2] = useState<string>("");
    const [editorContent, setEditorContent] = useState("");
    const [addCatalogueFeature, setAddCatalogueFeature] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string>("");
    const [previewItemId, setPreviewItemId] = useState<string>("");


    const [typeId, setTypeId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [groupId, setGrouptId] = useState<string>("");
    const [rightSidePickerName, setRightSidePickerName] = useState<string>("");
    const [creditsArray, setCreditsArray] = useState<string[]>([])
    const [additionalInfo, setAdditionalInfo] = useState<string>("");
    const [projectCategoryId, setProjectCategoryId] = useState<string>("");



    const [formData, setFormData] = useState<FormData>({
        title: '',
        title3: '',
        title4: '',
        subTitle: '',
        button: {
            text: "",
            link: ""
        },
        media_url: '',
    });

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false,
    });

    const [editorFormData, setEditorFormData] = useState<EditorFormDataType>({
        editorTitle: '',
        editorTitle2: '',
        editorVideoUrl: '',
        editorDate: '',
        media_resource: [],
    });

    const { data, isLoading, error, refetch } = useGetByIdPreviewData<PreviewItemType>(byIdEndPoint, previewItemId || '');


    type DataWithTitle = { title: string };
    type DataWithSubtitle = { subtitle?: string };
    type DataWithButton = { button?: { text: string; link: string } };
    type DataWithContent = { content?: string, description?: string; };
    type DataWithMediaUrl = { media_url?: string };
    type DataWithImageUrl = { image_url?: string };
    type DataWithFileUrl = { file_url?: string };
    type DataWithBannerImageUrls = { banner_image?: string[] };
    type DataWithIsFeatured = { isFeatured?: boolean };
    type DataWithCategory = { category: { _id?: string } };
    type DataWithProductType = { productType: { _id?: string } };
    type DataWithProductCategory = { productCategory: { _id?: string } };
    type DataWithItem = { item: { _id?: string } };
    type DataWithValue = { value: string };
    type DataWithValueShortForm = { value_shortform: string };
    type DataWithimageUrl = { imageUrl: string };


    // type GenericPreviewData =
    //     DataWithTitle &
    //     (DataWithSubtitle | DataWithButton | DataWithContent | DataWithMediaUrl | DataWithIsFeatured);

    // console.log(data, "data");

    const [multiSelectOptions, setMultiSelectOptions] = useState<string[]>([]);


    useEffect(() => {
        if ((page === "add-project" || page === "edit-project") && data) {
            const associatedProductIds = (data as ProjectTypeWithData)?.data?.associated_product?.map(product => product._id) || [];
            if (onChangeMultiSelect) {
                onChangeMultiSelect(associatedProductIds);
            }
            setMultiSelectOptions(associatedProductIds);
        }
    }, [data, page]);

    useEffect(() => {
        if (getById) {
            setPreviewItemId(getById);
        }

    }, [getById])

    useEffect(() => {
        if (page === "research-development-banner" && allBanners) {
            setFormData({
                title: allBanners?.[0]?.title,
                subTitle: '',
                button: {
                    text: "",
                    link: ""
                },
                media_url: '',
                image: allBanners?.[0]?.image_url
            })
            if (allBanners && allBanners.length > 0) {
                const firstBanner = allBanners[0];

                if ("image_url" in firstBanner) {
                    setUploadedImageUrl(firstBanner.image_url || "");
                }
            }
        }

        if (page === "companySettings" && allBanners && allBanners.length > 0) {
            // Check if the data has the expected shape before using it
            const potentialCompanyData = allBanners[0];

            // Validate that this is indeed CompanySettingsData
            if ('_id' in potentialCompanyData && 'socialMedia' in potentialCompanyData) {
                const companyData = potentialCompanyData as CompanySettingsData;

                setFormData(prevData => ({
                    ...prevData,
                    companySettingsData: {
                        _id: companyData._id,
                        contactEmail: companyData.contactEmail || '',
                        additionalInfo: companyData.additionalInfo || '',
                        socialMedia: {
                            instagram: companyData.socialMedia?.instagram || '',
                            facebook: companyData.socialMedia?.facebook || '',
                            twitter: companyData.socialMedia?.twitter || '',
                            linkedin: companyData.socialMedia?.linkedin || '',
                            youtube: companyData.socialMedia?.youtube || ''
                        }
                    }
                }));
            } else {
                console.error('Data for companySettings page does not have the expected structure');
            }
        }
    }, [page, allBanners])




    const [drawingsAndDescription, setDrawingsAndDescription] = useState<UploadData>()
    const [specSheetSettings, setSpecSheetSettings] = useState<NestedSpecSheetConfig[]>([]);
    const [resourceData, setResourceData] = useState<Resource[]>([]);
    const [specificationVariants, setSpecificationVariants] = useState<NestedSpecification[]>([]);

    useEffect(() => {
        if (data && page === "edit-product") {
            if ((data as AddProductFormDataWithData)?.data.productType
                && onTypeChange && onCategoryChange && onGroupChange
                && onDetailsChange && onAdditionalInfoChange) {
                setTypeId((data as AddProductFormDataWithData)?.data.productType || '');
                setCategoryId((data as AddProductFormDataWithData)?.data.productCategory || '');
                setGrouptId((data as AddProductFormDataWithData)?.data.productGroup || '');
                setRightSidePickerName((data as AddProductFormDataWithData)?.data.name || '');
                setAdditionalInfo((data as AddProductFormDataWithData)?.data.code || '');
                setSpecificationVariants((data as AddProductFormDataWithData)?.data.specifications || [])
                setSpecSheetSettings((data as AddProductFormDataWithData)?.data.specSheet || []);
                setResourceData((data as AddProductFormDataWithData)?.data.resources || []);
                if (dataCallBack) dataCallBack((data as AddProductFormDataWithData)?.data);
                setProjectCategoryId((data as AddProductFormDataWithData)?.data.projectCategory || '')
                setDrawingsAndDescription({
                    description: (data as AddProductFormDataWithData)?.data.description || '',
                    product_diagrams: (data as AddProductFormDataWithData)?.data.product_diagrams || []
                })
            }
        }

        if (data && page === "edit-project") {
            setProjectCategoryId((data as ProjectTypeWithData)?.data.project_category?._id || '')
            // setRightSidePickerName((data as ProjectTypeWithData)?.data.architect || '')
            setCreditsArray((data as ProjectTypeWithData)?.data.architect || [])
        }
    }, [page, data])




    useEffect(() => {
        if (page === "edit-product" && data && typeId !== "" && categoryId !== "" && groupId && onTypeChange && onCategoryChange && onGroupChange
            && onDetailsChange && onAdditionalInfoChange && onProjectCategoryChange) {
            onTypeChange('type', typeId || '');
            onCategoryChange('productCategory', categoryId || '');
            onGroupChange('productGroup', groupId || '');
            onDetailsChange('name', rightSidePickerName || '')
            onAdditionalInfoChange('code', additionalInfo || '')
            onProjectCategoryChange('project_category', projectCategoryId || '')
        }

        if (page === "edit-project" && projectCategoryId && onProjectCategoryChange && creditsArray && onMultiStringChange) {
            onProjectCategoryChange('project_category', projectCategoryId || '')
            onMultiStringChange('Credits', creditsArray)
            // onDetailsChange('architect', rightSidePickerName || '')
        }
    }, [typeId, groupId, categoryId, creditsArray, rightSidePickerName, additionalInfo, projectCategoryId, page, data])

    useEffect(() => {
        if (data && page === "Product Specification") {
            if ((data as ProductSpecificationsByIdResponse)?.data.specifications && onSpecificationsChange) {
                onSpecificationsChange((data as ProductSpecificationsByIdResponse)?.data.specifications);
            }
        }
    }, [data, page]);


    useEffect(() => {
        if (data) {
            const actualData = data.data || data;

            if (actualData) {
                const formDataUpdate: {
                    title: string;
                    title3?: string;
                    title4?: string;
                    subTitle: string;
                    button: { text: string; link: string };
                    media_url: string;
                    fileUrl?: string;
                    video_url?: string;
                    image?: string;
                    isFeatured?: boolean;
                    selectedOptionId?: string;
                    selectedOptionId2?: string;
                    banner_image?: string[];
                } = {
                    title: actualData.title || actualData.name || '',
                    subTitle: '',
                    button: { text: '', link: '' },
                    media_url: '',
                };


                // Extract subtitle if exists
                if ('subtitle' in actualData) {
                    formDataUpdate.subTitle = (actualData as DataWithSubtitle).subtitle || '';
                }

                // Extract button if exists
                if ('button' in actualData) {
                    const buttonData = (actualData as DataWithButton).button;
                    if (buttonData) {
                        formDataUpdate.button = {
                            text: buttonData.text || '',
                            link: buttonData.link || '',
                        };
                    }
                }

                if ('content' in actualData || 'description' in actualData) {

                    setEditorContent(
                        (actualData as DataWithContent).content ||
                        (actualData as DataWithContent).description ||
                        ''
                    );
                }

                if ('media_url' in actualData) {
                    const mediaUrl = (actualData as DataWithMediaUrl).media_url || '';

                    if (mediaUrl) {
                        const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(mediaUrl);

                        if (isVideo) {
                            formDataUpdate.video_url = mediaUrl;
                            formDataUpdate.image = "";
                            setUploadedImageUrl("");
                        } else {
                            formDataUpdate.video_url = "";
                            formDataUpdate.image = ((actualData as DataWithMediaUrl).media_url || '')
                            setUploadedImageUrl((actualData as DataWithMediaUrl).media_url || '')
                            formDataUpdate.media_url = (actualData as DataWithMediaUrl).media_url || '';
                        }
                    }
                }

                if ('imageUrl' in actualData) {
                    setUploadedImageUrl((actualData as DataWithimageUrl).imageUrl || '')
                    formDataUpdate.image = (actualData as DataWithimageUrl).imageUrl || '';
                }

                if ('value' in actualData) {
                    formDataUpdate.title3 = (actualData as DataWithValue).value || '';
                }

                if ('value_shortform' in actualData) {
                    formDataUpdate.title4 = (actualData as DataWithValueShortForm).value_shortform || '';
                }

                // Handle category or item
                // if ('category' in actualData || 'item' in actualData) {
                //     const id = (actualData as DataWithCategory)?.category?._id || (actualData as DataWithItem)?.item?._id;

                //     // Set the id to both formDataUpdate and selectedProductType
                //     setSelectedOption1(id || '');
                //     formDataUpdate.selectedOptionId = id || ''; // Add the id to formData
                // }

                if ('category' in actualData) {
                    const id = (actualData as DataWithCategory)?.category?._id || '';
                    setSelectedOption1(id || '');
                    formDataUpdate.selectedOptionId = id || '';
                }



                if ('productType' in actualData) {
                    const id = (actualData as DataWithProductType)?.productType?._id;
                    setSelectedOption1(id || '');
                    formDataUpdate.selectedOptionId = id || '';
                }

                if ('productCategory' in actualData) {
                    const id = (actualData as DataWithProductCategory)?.productCategory?._id;
                    setSelectedOption2(id || '');
                    formDataUpdate.selectedOptionId2 = id || '';
                }

                if ('isFeatured' in actualData) {
                    const featuredData = actualData as DataWithIsFeatured;
                    formDataUpdate.isFeatured = featuredData.isFeatured || false;
                    setAddCatalogueFeature(featuredData.isFeatured || false);
                }

                if ('image_url' in actualData) {
                    setUploadedImageUrl((actualData as DataWithImageUrl).image_url || '')
                    formDataUpdate.image = (actualData as DataWithImageUrl).image_url || '';
                }

                if ('banner_image' in actualData) {
                    setUploadedImageUrls((actualData as DataWithBannerImageUrls).banner_image || [])
                    formDataUpdate.banner_image = (actualData as DataWithBannerImageUrls).banner_image || [];
                }

                if ('file_url' in actualData) {
                    setUploadedPdfUrl((actualData as DataWithFileUrl).file_url || '')
                    formDataUpdate.fileUrl = (actualData as DataWithFileUrl).file_url || '';
                }

                setFormData(formDataUpdate);
            } else {
                console.log('No valid data found');
            }
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            // Handle nested button object
            if (name.startsWith('button.')) {
                const buttonKey = name.split('.')[1];
                return {
                    ...prev,
                    button: {
                        ...prev.button,
                        [buttonKey]: value
                    }
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleChangeSelectOptions = (id: string, name?: string) => {
        if (name) {
            setSelectedOption1(id);
            if (page === "specsheet-category" || page === "specsheet-item") {
                setSelectedOption2("")
                if (selectOptionChange2) selectOptionChange2(id, name);
            }
            if (selectOptionChange) selectOptionChange(id, name);
        }

        setFormData(prev => {
            return {
                ...prev,
                selectedOptionId: id

            }
        });
    }

    const handleChangeSelectOptions2 = (id: string, name?: string) => {
        if (name) {
            setSelectedOption2(id);
            if (selectOptionChange2) selectOptionChange2(id, name);
        }

        setFormData(prev => {
            return {
                ...prev,
                title3: '',
                title4: '',
                selectedOptionId2: id

            }
        });
    }




    const handleSave = async () => {
        if (page === "specsheet-item-values" && onSubmitSuccess) {
            onSubmitSuccess(formData, editorContent, editorFormData, previewItemId, handleClearItemValues);
        }

        if (page !== 'specsheet-item-values' && onSubmitSuccess) {
            onSubmitSuccess(formData, editorContent, editorFormData, previewItemId, handleClearClick);
        }
    };

    const handleResourceChange = (selectedResources: ResourceItem[]) => {
        console.log('Selected resources:', selectedResources);
    };


    const handleTextEditorContent = (content: string) => {
        setEditorContent(content)
    }

    const getPreviewDataId = (id: string) => {
        setPreviewItemId(id)
    }

    const [resetEditor, setResetEditor] = useState(false);
    const [clearProductSpecification, setClearProductSpecification] = useState(false);
    const [specAndCodeClear, setSpecAndCodeClear] = useState(false);
    const newKey = Date.now().toString();

    const clearRef = useRef<(() => void) | null>(null);

    const handleClearItemValues = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            title3: "",
            title4: "",
            image: "",
        }));
    };


    const handleClearClick = () => {
        setPreviewItemId("");
        setFormData({
            title: '',
            subTitle: '',
            button: {
                text: "",
                link: ""
            },
            media_url: '',
            video_url: '',
            image: "",
            banner_image: [],
            title3: "",
            title4: "",
        });

        setTypeId("");
        setCategoryId("");
        setGrouptId("");
        setRightSidePickerName("");
        setAdditionalInfo("");
        setProjectCategoryId("");

        setResetEditor(true);
        setTimeout(() => setResetEditor(false), 100);
        setSpecAndCodeClear(true);
        setTimeout(() => setSpecAndCodeClear(false), 100);
        setEditorContent("");
        setSelectedOption1("");
        setSelectedOption2("");
        setEditorFormData({
            editorTitle: '',
            editorTitle2: '',
            editorVideoUrl: '',
            editorDate: '',
            media_resource: []
        });

        setMultiSelectOptions([]);
        setAddCatalogueFeature(false);
        setAlertConfig({
            message: '',
            type: 'success',
            show: false,
        });

        setUploadedImageUrl("");
        setUploadedPdfUrl("");
        setUploadedImageUrls([]);
        setDrawingsAndDescription({ description: "", product_diagrams: [] });

        setSpecificationVariants([]);
        setSpecSheetSettings([]);
        setResourceData([]);
        setClearProductSpecification(true);
        setTimeout(() => setClearProductSpecification(false), 100);
        if (onTypeChange) onTypeChange("", "");
        if (onCategoryChange) onCategoryChange("", "");
        if (onGroupChange) onGroupChange("", "");
        if (onDetailsChange) onDetailsChange("", "");
        if (onAdditionalInfoChange) onAdditionalInfoChange("", "");
        if (onProjectCategoryChange) onProjectCategoryChange("", "");
        if (reloadPreiviewItems) reloadPreiviewItems();
        if (selectOptionChange2) selectOptionChange2("", "");
        if (selectOptionChange) selectOptionChange("", "");

    };








    const handleEditorFormDataChange = (data: {
        editorTitle: string;
        editorTitle2: string;
        editorVideoUrl: string;
        editorDate: string;
        description?: string;
        media_resource: string[];
    }) => {
        setEditorFormData(data);
    };


    const handleAddCataogueFeatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setAddCatalogueFeature(isChecked);
        setFormData(prev => {
            return {
                ...prev,
                isFeatured: isChecked
            };
        });
    }




    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Get the presigned URL using your configured axios instance
            const presignedUrlResponse = await api.get('file/upload-url');

            if (!presignedUrlResponse.data?.success) {
                throw new Error('Failed to get upload URL');
            }
            console.log(presignedUrlResponse.data.data.uploadURL, "fkldsajlk");

            const { uploadURL } = presignedUrlResponse.data.data;

            // For the S3 upload, we need to use fetch or plain axios
            // because we don't want to include the auth headers or base URL
            const uploadResponse = await api.put(uploadURL, file, {
                headers: {
                    'Content-Type': file.type,
                },
                // Disable the default authorization header for this request
                transformRequest: [(data, headers) => {
                    delete headers.Authorization;
                    return data;
                }],
            });

            if (uploadResponse.status !== 200) {
                throw new Error('Failed to upload file to S3');
            }

            // Get the public URL from the uploadURL
            const fileUrl = uploadURL.split('?')[0];

            if (type === 'image' && !multipleImages) {
                setUploadedImageUrl(fileUrl);
                setFormData(prev => {
                    return {
                        ...prev,
                        [type]: fileUrl,
                    };
                });
            } else if (type === 'pdf') {
                setUploadedPdfUrl(fileUrl);
                setFormData(prev => {
                    return {
                        ...prev,
                        [type]: fileUrl,
                    };
                });
            } else if (type === 'image' && multipleImages) {
                setFormData((prev) => ({
                    ...prev,
                    banner_image: [...(prev.banner_image || []), fileUrl],
                }));
                setUploadedImageUrls((prev) => [...prev, fileUrl]);
            }


            // setUploadedImageUrl(fileUrl)

            return fileUrl;

        } catch (error) {

            console.error('Upload error:', error);

            console.error('Error uploading file:', error);

            throw error;
        }
    };

    const handleSpecificationsChange = (specifications: Specification[]) => {
        if (onSpecificationsChange) onSpecificationsChange(specifications);
    };

    const handleDetailsChange = (name: string, value: string) => {
        if (onDetailsChange) onDetailsChange(name, value);
        setRightSidePickerName(value);
    };

    const handleMultiStringChange = (name: string, value: string[]) => {
        if (onMultiStringChange) onMultiStringChange(name, value);
    }

    const handleAdditionalInfoChange = (name: string, value: string) => {
        if (onAdditionalInfoChange) onAdditionalInfoChange(name, value);
        setAdditionalInfo(value);
    };

    const handleSpecificationChangeSelect = (selectedValues: { specification: string; selected_specs: string[] }[]) => {
        onChangeSpecifications?.(selectedValues);
    }

    const handleSpecSheetConfigChangeSelect = (selectedValues: { spec_item: string; selected_values: string[] }[]) => {
        onChangeSpecSheetConfig?.(selectedValues);
    }

    const handleFileUploadResources = async (fileUrl: string, fileName: string) => {
        if (onFileUpload) onFileUpload(fileUrl, fileName);
    };

    const handleSelectedProducts = async (selectedProducts: string[]) => {
        if (onChangeMultiSelect) onChangeMultiSelect(selectedProducts)
    }

    const handleDeleteImage = (imageUrl: string) => {
        setUploadedImageUrls((prev) => prev.filter(url => url !== imageUrl))
        setFormData(prev => ({
            ...prev,
            banner_image: prev.banner_image?.filter(url => url !== imageUrl) || []
        }));
    };

    const handleDeleteImageSingle = () => {
        setUploadedImageUrl("");
        setFormData(prev => ({
            ...prev,
            image: ""
        }));
    };

    const handleDeletePdf = () => {
        setUploadedPdfUrl("");
        setFormData(prev => ({
            ...prev,
            pdf: ""
        }));
    };

    const handlePickerChange = (pickerName: "type" | "category" | "family", value: string) => {
        if (pickerName === "type") {
            if (onTypeChange) onTypeChange('type', value)
            setTypeId(value);
            setCategoryId("");
            setGrouptId('');
        } else if (pickerName === "category") {
            if (onCategoryChange) onCategoryChange('category', value)
            setCategoryId(value);
            setGrouptId('');
        } else {
            if (onGroupChange) onGroupChange('group', value)
            setGrouptId(value);
        }
    };

    const handlePickerChangeProjectCategory = (pickerName: "type" | "category" | "family", value: string) => {
        if (pickerName === "type") {
            if (onProjectCategoryChange) onProjectCategoryChange('type', value)
            setProjectCategoryId(value);
        }
    };


    const handlePdfClick = () => {
        if (uploadedPdfUrl) {
            window.open(uploadedPdfUrl, '_blank');
        }
    };

    const hanldeImageOpen = (image_url: string) => {
        if (image_url) {
            window.open(image_url, '_blank');
        }
    };

    const handleInputChangeCompanySettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Create a copy of the current formData
        setFormData((prevData: FormData) => {
            // Initialize companySettingsData with proper typing
            const currentCompanyData: CompanySettingsData = prevData.companySettingsData || {
                _id: '', // Provide a default empty string for _id
                socialMedia: {} as SocialMedia // Explicitly type the social media object
            };

            // Handle special case for nested social media fields
            if (['instagram', 'facebook', 'twitter', 'linkedin', 'youtube'].includes(name)) {
                // Update the social media field inside the nested structure
                return {
                    ...prevData,
                    companySettingsData: {
                        ...currentCompanyData,
                        socialMedia: {
                            ...currentCompanyData.socialMedia,
                            [name]: value
                        }
                    }
                };
            }

            else if (name === 'contactEmail') {
                return {
                    ...prevData,
                    companySettingsData: {
                        ...currentCompanyData,
                        contactEmail: value
                    }
                };
            }
            else if (name === 'additionalInfo') {
                return {
                    ...prevData,
                    companySettingsData: {
                        ...currentCompanyData,
                        additionalInfo: value
                    }
                };
            }
            // Handle any other fields (non-company settings related)
            else {
                return {
                    ...prevData,
                    [name]: value
                };
            }
        });
    };







    return (
        <>
            <TopBar title={topBarTitle}
                onButtonClick={handleSave}
                previewItemId={previewItemId}
                onClearClick={handleClearClick}
                page={page}
            />
            <div className={styles.verticalContainer}>
                <div
                    className={`${styles.formContainer} `}
                >
                    {alertConfig.show && (
                        <ResponseAlert
                            message={alertConfig.message}
                            type={alertConfig.type}
                            onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
                        />
                    )}
                    <form style={{ display: page === "research-development" ? "none" : "", width: page === "research-development-banner" || page === "companySettings" ? "100%" : "" }} className={`${styles.form} ${additionalClass ? styles[additionalClass] : ''
                        }`}>
                        {title &&

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{title}</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder={titlePlaceHolder}
                                />
                            </div>
                        }

                        {page === 'companySettings' &&
                            <CompanySetting
                                companySettingsData={formData.companySettingsData}
                                handleCompanySettingsChange={handleInputChangeCompanySettings} />
                        }

                        {page === "Product Specification" &&
                            <SpecificationVariants
                                onSpecificationsChange={handleSpecificationsChange}
                                initialSpecifications={(data as ProductSpecificationsByIdResponse)?.data.specifications}
                                specAndCodeClear={specAndCodeClear}
                            />}
                        {title2 && <div className={styles.formGroup}>
                            <label className={styles.label}>{title2}</label>
                            {
                                page === "add-catalogue" &&
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={addCatalogueFeature}
                                        onChange={(e) => handleAddCataogueFeatureSelect(e)}
                                        className={styles.checkbox}
                                        style={{ marginRight: "1vw" }}
                                    // style={{ display: page === "product-type" ? "flex" : "none" }}
                                    />
                                    {addCatalogueFeature &&
                                        <input
                                            type="text"
                                            name="subTitle"
                                            value={formData.subTitle}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder={titlePlaceHolder2}
                                            style={{ width: page === "add-catalogue" ? "95%" : "100%" }}
                                        />
                                    }
                                </div>
                            }
                            {page !== "add-catalogue" && <input
                                type="text"
                                name="subTitle"
                                value={formData.subTitle}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder={titlePlaceHolder2}
                            />
                            }
                        </div>}


                        {title3 && page === 'specsheet-item-values' &&
                            <>

                                <SelectComponent label='Category'
                                    options={options}
                                    onChange={handleChangeSelectOptions}
                                    value={selectedOption1}
                                />
                                <SelectComponent label='Item Name'
                                    options={options2}
                                    onChange={handleChangeSelectOptions2}
                                    value={selectedOption2}
                                />

                                <div className={styles.itemValues}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>{title3}</label>
                                        <input
                                            type="text"
                                            name="title3"
                                            value={formData.title3}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder={titlePlaceHolder3}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>{title4}</label>
                                        <input
                                            type="text"
                                            name="title4"
                                            value={formData.title4}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder={titlePlaceHolder4}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {title4 &&
                            <div className={styles.formGroup}>

                            </div>
                        }
                        {/* {selectComponent && <SelectComponent onChange={handleChangeSelectOptions} value='' />} */}
                        {selectComponent &&
                            <SelectComponent label={selectLabel ? selectLabel : 'Add Product Type'}
                                options={options}
                                onChange={handleChangeSelectOptions}
                                value={selectedOption1}
                            />
                        }

                        {page === "product-group" &&
                            <div>
                                <SelectComponent options={options}
                                    onChange={handleChangeSelectOptions}
                                    value={selectedOption1} label='Product Type'
                                />
                                <SelectComponent options={options2}
                                    onChange={handleChangeSelectOptions2}
                                    value={selectedOption2} label='Product Category'
                                />
                            </div>
                        }
                        {buttonLink && <div className={styles.formGroup}>
                            <label className={styles.label}>Button</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    name="button.text"
                                    value={formData.button?.text}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Button Name"
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="text"
                                    name="button.link"
                                    value={formData.button?.link}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Link to"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>}
                        {media && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    {media !== 'true' && media !== "" ? media : 'Add Media'}
                                </label>
                                <div className={styles.mediaButtons}>

                                    {mediaImage && !multipleImages ? (
                                        <>
                                            {uploadedImageUrl && /^https?:\/\//.test(uploadedImageUrl) ? (
                                                <div className={styles.imageWrapper}>
                                                    <Image
                                                        src={uploadedImageUrl}
                                                        width={100}
                                                        height={100}
                                                        alt="Uploaded Preview"
                                                        className={styles.imagePreview}
                                                        onClick={() => hanldeImageOpen(uploadedImageUrl)}
                                                    />
                                                    <button
                                                        className={styles.deleteButton}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteImageSingle();
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : !formData.video_url && <div
                                                className={styles.mediaButton}
                                                onClick={() => document.getElementById("imageUpload")?.click()}
                                            >
                                                <TfiGallery className={styles.reactIcon} />
                                            </div>}

                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={styles.mediaButton}
                                                onClick={() => document.getElementById("imageUpload")?.click()}
                                            >
                                                <TfiGallery className={styles.reactIcon} />
                                            </div>
                                            {Array.isArray(uploadedImageUrls) && uploadedImageUrls.length > 0 && uploadedImageUrls.map((url, index) => (
                                                <div key={url} className={styles.imageWrapper}>
                                                    <Image
                                                        src={url}
                                                        width={100}
                                                        height={100}
                                                        alt={`banner-image-${index}`}
                                                        className={styles.imagePreview}
                                                        onClick={() => hanldeImageOpen(url)}
                                                    />
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDeleteImage(url)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {/* Video Upload Button */}
                                    {mediaVideo && (
                                        <div className={styles.mediaButton} style={{ cursor: 'not-allowed' }}>
                                            <IoVideocamOutline className={styles.reactIcon} />
                                        </div>
                                    )}

                                    {/* Video URL Input */}
                                    {videoUrl && uploadedImageUrl === "" && (
                                        <div className={`${styles.formGroup} ${styles.formGroupVideoUrl}`}>
                                            <input
                                                type="text"
                                                name="video_url"
                                                value={formData.video_url}
                                                onChange={handleChange}
                                                className={styles.input}
                                                placeholder="video url"
                                            />
                                        </div>
                                    )}
                                    {/* PDF Upload Button */}
                                    {mediaPdf && (
                                        <>
                                            {uploadedPdfUrl ? (
                                                <div
                                                    className={` ${styles.pdfWrapper}`}
                                                >
                                                    <FaFilePdf
                                                        className={styles.reactIconPdf}
                                                        color="red"
                                                        size={24}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={handlePdfClick}
                                                    />
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDeletePdf()}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className={styles.mediaButton}
                                                    onClick={() => document.getElementById("pdfUpload")?.click()}
                                                >
                                                    <LuFileSpreadsheet className={styles.reactIcon} />
                                                </div>
                                            )}
                                        </>

                                    )}
                                </div>
                                {/* Hidden File Inputs */}
                                {<input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, 'image')}
                                />}
                                <input
                                    type="file"
                                    id="videoUpload"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                />
                                <input
                                    type="file"
                                    id="pdfUpload"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, 'pdf')}
                                />
                            </div>
                        )}
                    </form >
                    {(page === "add-product" || page === "edit-product") &&
                        <>
                            <Picker pickerName="type" options={TypeOptions} value={typeId} onChange={handlePickerChange} />
                            <Picker pickerName="category" options={CategoryOptions} value={categoryId} onChange={handlePickerChange} />
                            <Picker pickerName="family" options={GroupOptions} value={groupId} onChange={handlePickerChange} />
                            <div className={styles.addProductInputs}>
                                <RightSidePicker
                                    pickerLabel="Product Name"
                                    defaultValue={rightSidePickerName}
                                    additionalClass={additionalClass}
                                    pickerInputClass="pickerInputWidth"
                                    onChange={(name, value) => handleDetailsChange(name, value)}
                                />
                                <RightSidePicker
                                    pickerLabel="Product Code"
                                    defaultValue={additionalInfo}
                                    additionalClass="widthAdjust"
                                    onChange={(name, value) => handleAdditionalInfoChange(name, value)}
                                />
                                <Picker labelName='Select Application'
                                    pickerName="type" options={ProjectCategoryOptions} value={projectCategoryId}
                                    onChange={handlePickerChangeProjectCategory} />

                            </div>
                            <MultipleImageUpload onUploadDrawingsAndDescription={onUploadDrawingsAndDescription}
                                defaultDataDrwaingAndDescription={drawingsAndDescription} />

                            <DownloadsResources onChange={handleResourceChange}
                                onFileUpload={handleFileUploadResources}
                                onChangeSpecification={handleSpecificationChangeSelect}
                                onChangeSpecSheetConfig={handleSpecSheetConfigChangeSelect}
                                downloadPdfData={downloadPdfData}
                                itemValues={itemValues}
                                defaultSelected={specificationVariants}
                                defaultResources={resourceData}
                                defaultSpecSheetSettings={specSheetSettings}
                                productSpecifications={productSpecifications}
                                onClearProductSpecification={clearProductSpecification}
                            />
                        </>
                    }
                    {rightSidePreviewItems &&
                        <PreviewItems datas={allBanners}
                            clickById={getPreviewDataId}
                            refetchPreviewItemsData={reloadPreiviewItems}
                            byIdEndPoint={byIdEndPoint}
                            onClear={handleClearClick}
                            previewItemHeadername={previewItemHeadername}
                            pageName={page}
                        />}
                </div >


                {textEditor &&
                    <div className={styles.textEditorContainer}>
                        <Editor editorDate={editorDate}
                            value={editorContent}
                            onChange={(content) => handleTextEditorContent(content)}
                            editorClassName={editorClassName}
                            editorVideo={editorVideo}
                            editorImage={editorImage}
                            editorTitle={editorTitle}
                            editorTitlePlaceHolder={editorTitlePlaceHolder}
                            editorTitle2={editorTitle2}
                            editorTitlePlaceHolder2={editorTitlePlaceHolder2}
                            defaultData={data}
                            onFormDataChange={handleEditorFormDataChange}
                            resetEditor={resetEditor}
                            editorVideoPlaceHolder2={editorVideoPlaceHolder2}
                        />
                        {rightSidePreviewItemsWithEditor &&
                            <PreviewItems byIdEndPoint={byIdEndPoint}
                                datas={allBanners}
                                clickById={getPreviewDataId}
                                refetchPreviewItemsData={reloadPreiviewItems}
                                onClear={handleClearClick}
                                previewItemHeadername={previewItemHeadername}
                                pageName={page}
                            />}
                        {(page === "add-project" || page === "edit-project") &&
                            < div className={styles.addProjectPicker}>
                                <Picker additionalClass='addProject' labelName='Select Project Category'
                                    pickerName="type" options={ProjectCategoryOptions} value={projectCategoryId}
                                    onChange={handlePickerChangeProjectCategory} />
                                <MultiSelect
                                    options={productOptions}
                                    selectedValues={multiSelectOptions}
                                    onChangeMultiSelect={(selected) => handleSelectedProducts(selected)}
                                />

                                <RightSidePicker
                                    pickerLabel="Credits"
                                    isMultiString={true}
                                    defaultStrings={creditsArray}
                                    onMultiStringChange={(name, value) => handleMultiStringChange(name, value)}
                                // onChange={(name, value) => handleDetailsChange(name, value)}
                                />
                            </div>
                        }

                    </div>
                }
                {
                    bottomPreviewItems &&
                    <PreviewItems
                        clickById={getPreviewDataId}
                        previewContainerClassName={previewContainerClassName}
                        datas={allBanners}
                        byIdEndPoint={byIdEndPoint}
                        refetchPreviewItemsData={reloadPreiviewItems}
                        onClear={handleClearClick}
                        previewItemHeadername={previewItemHeadername}
                        pageName={page}
                    />
                }
            </div >
        </>
    );
};

export default BannerForm;