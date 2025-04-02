import React, { useState, useEffect } from 'react'
import styles from "../styles/MultipleImageUpload.module.css"
import { TfiGallery } from 'react-icons/tfi'
import api from '@/app/axiosConfig';
import Image from 'next/image';

export interface UploadData {
    description: string;
    product_diagrams: string[];
}

interface MultipleImageUploadProps {
    onUploadDrawingsAndDescription?: (data: { description: string, product_diagrams: string[] }) => void;
    defaultDataDrwaingAndDescription?: Partial<UploadData>;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
    onUploadDrawingsAndDescription,
    defaultDataDrwaingAndDescription
}) => {
    const [description, setDescription] = useState(defaultDataDrwaingAndDescription?.description || '');
    const [imagesUpload, setImagesUpload] = useState<string[]>(defaultDataDrwaingAndDescription?.product_diagrams || []);

    useEffect(() => {
        if (onUploadDrawingsAndDescription) {
            onUploadDrawingsAndDescription({
                description,
                product_diagrams: imagesUpload
            });
        }
    }, [description, imagesUpload]);

    useEffect(() => {
        if (defaultDataDrwaingAndDescription?.product_diagrams || defaultDataDrwaingAndDescription?.description) {
            setDescription(defaultDataDrwaingAndDescription?.description || '');
            setImagesUpload(defaultDataDrwaingAndDescription?.product_diagrams || []);
        }
    }, [defaultDataDrwaingAndDescription])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Get the presigned URL using your configured axios instance
            const presignedUrlResponse = await api.get('file/upload-url');

            if (!presignedUrlResponse.data?.success) {
                throw new Error('Failed to get upload URL');
            }

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


            setImagesUpload((prev) => [...prev, fileUrl]);


            return fileUrl;

        } catch (error) {

            console.error('Upload error:', error);

            console.error('Error uploading file:', error);

            throw error;
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleDeleteImage = (url: string) => {
        setImagesUpload((prev) => prev.filter((image) => image !== url));

        // Optional: If you want to notify the parent component about the deletion
        if (onUploadDrawingsAndDescription) {
            onUploadDrawingsAndDescription({
                description,
                product_diagrams: imagesUpload.filter((image) => image !== url)
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <input
                    type="text"
                    name="remarks"
                    value={description}
                    onChange={handleDescriptionChange}
                    className={styles.input}
                    placeholder="Enter Description"
                />
            </div>
            <div className={styles.drawings}>
                <div>
                    <label className={styles.label} htmlFor="imageUpload">Drawings</label>
                    <div
                        className={styles.mediaButton}
                        onClick={() => document.getElementById("drawings")?.click()}
                    >
                        <TfiGallery className={styles.reactIcon} />
                    </div>
                </div>
                {Array.isArray(imagesUpload) && imagesUpload.length > 0 && imagesUpload.map((url, index) => (
                    url && typeof url === 'string' && /^https?:\/\//.test(url) && (
                        <div key={url} className={styles.imageWrapper}>
                            <Image
                                src={url}
                                width={100}
                                height={100}
                                alt={`banner-image-${index}`}
                                className={styles.imagePreview}
                                onClick={() => window.open(url)}
                            />
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteImage(url)}
                            >
                                ✕
                            </button>
                        </div>
                    )
                ))}
            </div>
            {<input
                type="file"
                id="drawings"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'image')}
            />}
        </div>
    )
}

export default MultipleImageUpload