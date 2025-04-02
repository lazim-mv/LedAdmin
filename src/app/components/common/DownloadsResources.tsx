import { useState, useEffect } from 'react';
import styles from '../styles/DownloadsResources.module.css';
import { DownloadPdfData } from '../BannerForm';
import { ProductSpecifications } from '@/app/hooks/proucts/useGetAllProductSpecifications';
import ProductSpecification from './ProductSpecification';
import ResponseAlert from './ResponseAlert';
import api from '@/app/axiosConfig';
import SpecSheetSelection from './SpecSheetSelection';
import { NestedSpecification, NestedSpecSheetConfig, Resource } from '@/app/hooks/proucts/useGetAllAddedProduct';
import { IoClose } from 'react-icons/io5';
import { SpecSheetItems } from '@/app/hooks/specsheet-items/useGetAllSpecSheetItems';

export interface ResourceItem {
    id: string;
    name: string;
    isChecked: boolean;
    fileUrl?: string;
}

interface DownloadsResourcesProps {
    onChange?: (selectedItems: ResourceItem[]) => void;
    downloadPdfData?: DownloadPdfData | null;
    productSpecifications?: ProductSpecifications[] | undefined;
    itemValues?: SpecSheetItems[] | undefined;
    onChangeSpecification?: (selectedValues: { specification: string; selected_specs: string[] }[]) => void;
    onChangeSpecSheetConfig?: (selectedValues: { spec_item: string; selected_values: string[] }[]) => void;
    onFileUpload?: (fileUrl: string, fileName: string) => void;
    defaultSelected?: NestedSpecification[] | [];
    defaultSpecSheetSettings: NestedSpecSheetConfig[] | [];
    defaultResources?: Resource[] | [];
    onClearProductSpecification?: boolean;
}

const DownloadsResources: React.FC<DownloadsResourcesProps> = ({
    onChange,
    downloadPdfData,
    defaultSelected,
    defaultSpecSheetSettings,
    productSpecifications,
    itemValues,
    onChangeSpecification,
    onChangeSpecSheetConfig,
    onFileUpload,
    defaultResources,
    onClearProductSpecification,

}) => {
    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false,
    });

    const [resources, setResources] = useState<ResourceItem[]>([
        { id: '1', name: 'Image', isChecked: false },
        { id: '2', name: '3DS', isChecked: false },
        { id: '3', name: 'PDF Catalogue', isChecked: false },
        { id: '4', name: 'DXF Technical Drawing', isChecked: false },
        { id: '5', name: 'IES Photometric File', isChecked: false },
        { id: '6', name: 'Drawing', isChecked: false },
        { id: '7', name: 'LDT Photometric file', isChecked: false },
        { id: '8', name: 'PDF Instruction Sheet', isChecked: false },
        { id: '9', name: 'BIM Objects', isChecked: false },
        { id: '10', name: 'Specification Sheet', isChecked: false },
        { id: '11', name: 'Spec Sheet', isChecked: false },
    ]);

    const [expanded, setExpanded] = useState(false);


    // Initialize resources with default values
    useEffect(() => {
        if (defaultResources && defaultResources.length > 0) {
            setExpanded(true);
            const updatedResources = resources.map(resource => {
                const defaultResource = defaultResources.find(dr => dr.title === resource.name);
                if (defaultResource) {
                    onFileUpload?.(defaultResource.fileUrl, resource.name);
                    return { ...resource, fileUrl: defaultResource.fileUrl, isChecked: true };
                }
                return resource;
            });
            setResources(updatedResources);
        }
    }, [defaultResources]);

    const handleCheckboxChange = (id: string) => {
        const updatedResources = resources.map((resource) =>
            resource.id === id
                ? { ...resource, isChecked: !resource.isChecked }
                : resource
        );
        setResources(updatedResources);
        onChange?.(updatedResources);
    };

    const handleSpecificationChange = (selectedValues: { specification: string; selected_specs: string[] }[]) => {
        onChangeSpecification?.(selectedValues);
    };

    const handleSpecSheetConfig = (selectedValues: { spec_item: string; selected_values: string[] }[]) => {
        onChangeSpecSheetConfig?.(selectedValues);
    };

    const handleDeleteFile = (resourceName: string) => {
        const updatedResources = resources.map(resource =>
            resource.name === resourceName
                ? { ...resource, fileUrl: undefined }
                : resource
        );
        setResources(updatedResources);
        onFileUpload?.('', resourceName); // Notify parent about file deletion
        setAlertConfig({
            message: `${resourceName} file deleted successfully!`,
            type: 'success',
            show: true,
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const presignedUrlResponse = await api.get('file/upload-url');

            if (!presignedUrlResponse.data?.success) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadURL } = presignedUrlResponse.data.data;

            const uploadResponse = await fetch(uploadURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (uploadResponse.status !== 200) {
                throw new Error('Failed to upload file to S3');
            }

            const fileUrl = uploadURL.split('?')[0];

            // Update resources with the new file URL
            const updatedResources = resources.map(resource =>
                resource.name === type
                    ? { ...resource, fileUrl }
                    : resource
            );
            setResources(updatedResources);

            setAlertConfig({
                message: `File "${file.name}" uploaded successfully!`,
                type: 'success',
                show: true,
            });

            onFileUpload?.(fileUrl, type);

        } catch (error) {
            console.error('Upload error:', error);
            setAlertConfig({
                message: `Failed to upload file`,
                type: 'error',
                show: true,
            });
        }
    };

    return (
        <div className={styles.mainWrapper}>
            {alertConfig.show && (
                <ResponseAlert
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
                />
            )}

            <div className={styles.productSpecificationWrapper}>
                <ProductSpecification
                    defaultSelected={defaultSelected}
                    specifications={productSpecifications}
                    onChange={handleSpecificationChange}
                    onClearProductSpecification={onClearProductSpecification}
                />
                <SpecSheetSelection
                    defaultSpecSheetSettings={defaultSpecSheetSettings}
                    specifications={itemValues}
                    onChange={handleSpecSheetConfig}
                    onClearProductSpecification={onClearProductSpecification}
                />
            </div>

            <div className={styles.container} style={{ height: expanded ? "auto" : "max-content" }}>
                <div className={styles.titleContainer} >
                    <h2 className={styles.title}>Downloads and Resources</h2>
                    <button className={styles.expandButton} onClick={() => setExpanded(!expanded)}>
                        {expanded ? '-' : '+'}
                    </button>
                </div>
                {expanded &&
                    <div className={styles.resourcesGrid}>
                        {resources.map((resource) => (
                            <div key={resource.id} className={styles.resourceItem}>
                                <div className={styles.resourceContent}>
                                    <input
                                        type="checkbox"
                                        checked={resource.isChecked}
                                        onChange={() => handleCheckboxChange(resource.id)}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.resourceName}>
                                        {resource.name}
                                        {resource.fileUrl && (
                                            <div className={styles.fileInfo}>
                                                <a
                                                    href={resource.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.fileLink}
                                                >
                                                    View File
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteFile(resource.name)}
                                                    className={styles.deleteButton}
                                                    aria-label="Delete file"
                                                >
                                                    <IoClose />
                                                </button>
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    id={`file-upload-${resource.id}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, resource.name)}
                                />
                                <label htmlFor={`file-upload-${resource.id}`} className={styles.downloadButton}>
                                    ↑
                                </label>
                            </div>
                        ))}
                    </div>
                }
            </div>

        </div>
    );
};

export default DownloadsResources;