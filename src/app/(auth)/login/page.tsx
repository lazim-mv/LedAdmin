"use client"
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/app/axiosConfig';

const LoginPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('auth/login', { username, password });
            localStorage.setItem('accessToken', response.data.data.access_token);

            // Set cookie for server-side auth check
            Cookies.set('token', response.data.data.access_token, {
                expires: 1,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            if (response.status === 200) {
                router.push("/home/banner")
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Login failed');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <div className={styles.textContainer}>
                        <h1>Welcome Back</h1>
                        <p>Login to continue</p>
                    </div>
                    <label className={styles.label}>User Name</label>
                    <input
                        type="text"
                        placeholder="Enter User name"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className={`${styles.input} `}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={styles.showPassword}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button type="submit" className={styles.submitButton}>
                    Login
                </button>

                <a className={styles.resetPassword} href="/reset-password">Reset Password</a>
            </form>
        </div>
    );
};

export default LoginPage;