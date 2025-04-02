"use client"
import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import styles from "../styles/Header.module.css"

type Props = {
    page?: string;
}

const Header: React.FC<Props> = ({ page }) => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('accessToken');
        router.push('/login');
    }

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <h1 className={styles.logoText}>Dashboard</h1>
            </div>
            <div className={styles.buttonContainer}>
                {page !== "login" && <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.saveButton}
                >
                    Log Out
                </button>}
            </div>
        </div>
    )
}

export default Header