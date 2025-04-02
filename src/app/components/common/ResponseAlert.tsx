import React, { useState, useEffect } from 'react';
import styles from '../styles/ResponseAlert.module.css';

interface ResponseAlertProps {
    message: string;
    type?: 'success' | 'error' | 'warning';
    duration?: number;
    onClose?: () => void;
}

const ResponseAlert: React.FC<ResponseAlertProps> = ({
    message,
    type = 'success',
    duration = 1500,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose && onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={styles.alertContainer}>
            <div className={`${styles.alert} ${styles[type]}`}>
                {message}
            </div>
        </div>
    );
};

export default ResponseAlert;