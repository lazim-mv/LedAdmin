import React, { useState } from 'react';
import styles from '../styles/DeleteModal.module.css';
import api from '@/app/axiosConfig';
import ResponseAlert from './ResponseAlert';
import { AxiosError } from 'axios';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    refetchPreviewItemsData?: () => void;
    onClear?: () => void;
    cancelText?: string;
    byIdEndPoint?: string;
    id?: string | null;
    pageName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    refetchPreviewItemsData,
    byIdEndPoint,
    onClear,
    id,
    pageName
}) => {

    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: 'fdsafsd',
        type: 'success',
        show: false,
    });


    const handleDeleteConfirm = async () => {
        try {
            const response = await api.delete(`${byIdEndPoint}/${id}`);

            if (response.status === 200) {
                setAlertConfig({
                    message: 'Deleted Successfully',
                    type: 'success',
                    show: true,
                });
                if (onClear && pageName !== "specsheet-item-values") onClear();
                setTimeout(() => {
                    setAlertConfig(prev => ({ ...prev, show: false }));
                    onClose();
                    if (refetchPreviewItemsData) {
                        refetchPreviewItemsData();
                    }
                }, 1000);
            } else {
                setAlertConfig({
                    message: response?.data?.message || 'Failed to Delete',
                    type: 'error',
                    show: true,
                });
            }
        } catch (error: unknown) {
            console.log(error, "error");

            // Cast to the expected error structure
            const customError = error as {
                message: string;
                type: "success" | "error" | "warning";
                status: number;
            };

            console.log(customError, "my log"); 
            setAlertConfig({
                message: customError?.message || 'Failed to Delete',
                type: customError?.type || 'error',
                show: true,
            });
        }
    };


    if (!isOpen) return null;


    return (
        <>
            {alertConfig.show && (
                <ResponseAlert
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
                />
            )}
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>{title}</h2>
                    </div>
                    <div className={styles.modalBody}>
                        <p>{message}</p>
                    </div>
                    <div className={styles.modalFooter}>
                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={handleDeleteConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;