"use client"
import React, { useState } from 'react';
import styles from '../login/Login.module.css';
import { useRouter } from 'next/navigation';
import api from '@/app/axiosConfig';
import Cookies from 'js-cookie';
import ResponseAlert from '@/app/components/common/ResponseAlert';


const ResetPasswordPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginPayload = {
            username: username,
            password: oldPassword,
        }

        const payload = {
            email: email,
            newPassword: password
        }

        try {
            const loginResponse = await api.post('/auth/login', loginPayload);

            if (loginResponse.status === 200) {
                const token = loginResponse.data.data.access_token;
                // Store token in cookies for consistency
                Cookies.set('token', loginResponse.data.data.access_token, {
                    expires: 1,
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });


                const resetPasswordResponse = await api.post('/auth/change-password', payload);

                if (resetPasswordResponse.status === 200) {
                    setAlertConfig({
                        message: "Password changed successfully",
                        type: "success",
                        show: true,
                    });
                    router.push("/home/banner")
                } else {
                    setError(resetPasswordResponse.data.message);
                }
            } else {
                setError(loginResponse.data.message);
            }
        } catch (error: any) {
            setError(error.message || 'Reset password failed');
        }
    };

    return (
        <div className={styles.loginContainer}>
            {alertConfig.show && (
                <ResponseAlert
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
                />
            )}
            <div className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <div className={styles.textContainer}>
                        <h1>Change Password</h1>
                    </div>
                    <label className={styles.label}>Email</label>
                    <input
                        type="text"
                        placeholder="Enter email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>User Name</label>
                    <input
                        type="text"
                        placeholder="Enter User Name"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Current Password</label>
                    <input
                        type="text"
                        placeholder="Enter Password"
                        className={styles.input}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input
                        type="text"
                        placeholder="Enter Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button type="button" onClick={handleResetPassword} className={styles.submitButton}>
                    Change Password
                </button>
                <a className={styles.resetPassword} href="/login">Go back and login</a>

            </div>
        </div>
    );
};

export default ResetPasswordPage;