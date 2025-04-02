'use client';
import { useEffect, useState } from "react";
import styles from "../styles/TextEditor.module.css";
import dynamic from "next/dynamic";
import { TfiGallery } from "react-icons/tfi";
import Image from "next/image";
import api from "@/app/axiosConfig";

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
    <p style={{ fontSize: '1vw' }}>Loading editor...</p>
  </div>
});

interface EditorProps {
  value?: string;
  onChange?: (content: string) => void;
  editorTitle?: string;
  editorTitle2?: string;
  editorTitlePlaceHolder?: string;
  editorTitlePlaceHolder2?: string;
  editorVideoPlaceHolder2?: string;
  editorVideo?: string;
  editorImage?: string;
  editorDate?: string;
  editorClassName?: string;
  defaultData?: any;
  onFormDataChange?: (data: {
    editorTitle: string;
    editorTitle2: string;
    editorVideoUrl: string;
    editorDate: string;
    description: string;
    media_resource: string[];
  }) => void;
  resetEditor: boolean;
}

const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  editorTitle,
  editorTitle2,
  editorTitlePlaceHolder,
  editorTitlePlaceHolder2,
  editorVideoPlaceHolder2,
  editorVideo,
  editorImage,
  editorDate,
  editorClassName,
  defaultData,
  onFormDataChange,
  resetEditor,
}) => {
  const [formData, setFormData] = useState<{
    editorTitle: string;
    editorTitle2: string;
    editorVideoUrl: string;
    editorDate: string;
    description: string;
    media_resource: string[];
  }>({
    editorTitle: '',
    editorTitle2: '',
    editorVideoUrl: '',
    editorDate: '',
    description: '',
    media_resource: [],
  });

  const [editorImageUrls, setEditorImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (resetEditor) {
      setFormData({
        editorTitle: '',
        editorTitle2: '',
        editorVideoUrl: '',
        editorDate: '',
        description: '',
        media_resource: []
      });
    }
  }, [resetEditor])

  useEffect(() => {
    if (defaultData) {
      const data = defaultData.data;
      const updatedFormData = {
        editorTitle: data.title || data.name || '',
        editorTitle2: data.editorTitle2 || data.location || data.subtitle || '',
        editorVideoUrl: data.media_url || '',
        editorDate: data.postedDate ? new Date(data.postedDate).toISOString().split('T')[0] : '',
        description: data.description || '',
        media_resource: data.media_resource || [],
      };

      setEditorImageUrls(updatedFormData.media_resource);

      setFormData(updatedFormData);

      // Notify parent component
      onFormDataChange?.({
        ...updatedFormData,
        description: value || ''
      });
    }
  }, [defaultData]);

  useEffect(() => {
    if (formData.editorVideoUrl || formData.media_resource.length > 0) {
      setFormData((prev) => ({
        ...prev,
        editorVideoUrl: formData.editorVideoUrl,
        media_resource: formData.media_resource,
      }));
    }
  }, [formData.editorVideoUrl]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "link"],
      ["image", "blockquote", "video"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
      [{ align: [] }],
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
      media_resource: [],
    };

    setFormData(updatedFormData);

    // Notify parent component
    onFormDataChange?.({
      ...updatedFormData,
      description: value || ''
    });
  };

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

      // Upload the file to S3 using a PUT request
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

      onFormDataChange?.({
        ...formData,
        media_resource: [...formData.media_resource, fileUrl],
        description: formData?.description || "",
      });

      setFormData((prev) => ({
        ...prev,
        media_resource: [...prev.media_resource, fileUrl], // Append the new file URL to the array
      }));



      setEditorImageUrls((prev) => [...prev, fileUrl]);
      return fileUrl;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setEditorImageUrls((prev) => prev.filter(url => url !== imageUrl));
    setFormData(prev => ({
      ...prev,
      media_resource: prev.media_resource?.filter(url => url !== imageUrl) || [],
    }));

    onFormDataChange?.({
      ...formData,
      media_resource: formData.media_resource?.filter(url => url !== imageUrl) || [],
      description: formData?.description || "",
    });
  };

  const hanldePreviewImage = (url: string) => {
    window.open(url, '_blank');
  }

  return (
    <div className={`${styles.container} ${editorClassName ? styles[editorClassName] : ''}`}>
      <h2>Description</h2>
      {editorTitle && (
        <div className={styles.formGroup}>
          <label className={styles.label}>{editorTitle}</label>
          <input
            type="text"
            name="editorTitle"
            value={formData.editorTitle}
            onChange={handleChange}
            className={styles.input}
            placeholder={editorTitlePlaceHolder}
          />
        </div>
      )}


      {editorTitle2 && (
        <div className={styles.formGroup}>
          <label className={styles.label}>{editorTitle2}</label>
          <input
            type="text"
            name="editorTitle2"
            value={formData.editorTitle2}
            onChange={handleChange}
            className={styles.input}
            placeholder={editorTitlePlaceHolder2}
          />
        </div>
      )}

      <div className={styles.editorContainer}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          className={styles.editor}
        />
      </div>

      {editorImage && formData.editorVideoUrl === "" &&
        <div className={styles.mediaButtons}>

          <div
            className={styles.mediaButton}
            onClick={() => document.getElementById("editorImageUpload")?.click()}
          >
            <TfiGallery className={styles.reactIcon} />
            {<input
              type="file"
              id="editorImageUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'image')}
            />}
          </div>
          {Array.isArray(editorImageUrls) && editorImageUrls.length > 0 && editorImageUrls.map((url, index) => (
            <div key={url} className={styles.imageWrapper}>
              <Image
                src={url}
                width={100}
                height={100}
                alt={`banner-image-${index}`}
                className={styles.imagePreview}
                onClick={() => hanldePreviewImage(url)}
              />
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteImage(url)}
              >
                ✕
              </button>
            </div>
          ))}

        </div>

      }

      {editorVideo && formData?.media_resource?.length === 0 && (
        <div className={styles.formGroup}>
          <label className={styles.label}>{editorVideo}</label>
          <input
            type="text"
            name="editorVideoUrl"
            value={formData.editorVideoUrl}
            onChange={handleChange}
            className={styles.input}
            placeholder={editorVideoPlaceHolder2}
          />
        </div>
      )}

      {editorDate && (
        <div className={`${styles.formGroup} ${styles.dateGroup}`}>
          <label className={styles.label}>{editorDate}</label>
          <input
            type="date"
            name="editorDate"
            value={formData.editorDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;