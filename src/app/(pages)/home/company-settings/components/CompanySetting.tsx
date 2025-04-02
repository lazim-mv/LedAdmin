import React from 'react'
import styles from "./CompanySetting.module.css"
import { CompanySettingsData } from '@/app/hooks/company-settings/useGetAllCompanySettins'

export type companySettingsProps = {
    companySettingsData?: CompanySettingsData,
    handleCompanySettingsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CompanySetting: React.FC<companySettingsProps> = ({
    companySettingsData,
    handleCompanySettingsChange
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            name="contactEmail"
                            value={companySettingsData?.contactEmail || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter contact mail"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 6L12 13L2 6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Additional Info</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            name="additionalInfo"
                            value={companySettingsData?.additionalInfo || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter additional Info"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 6L12 13L2 6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Instagram</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="url"
                            name="instagram"
                            value={companySettingsData?.socialMedia?.instagram || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter Instagram URL"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.5 6.5H17.51" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Facebook</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="url"
                            name="facebook"
                            value={companySettingsData?.socialMedia?.facebook || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter Facebook URL"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Twitter</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="url"
                            name="twitter"
                            value={companySettingsData?.socialMedia?.twitter || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter Twitter URL"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28444C14.0247 3.6117 13.2884 4.1942 12.773 4.95372C12.2575 5.71324 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>LinkedIn</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="url"
                            name="linkedin"
                            value={companySettingsData?.socialMedia?.linkedin || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter LinkedIn URL"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 9H2V21H6V9Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>YouTube</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="url"
                            name="youtube"
                            value={companySettingsData?.socialMedia?.youtube || ''}
                            onChange={handleCompanySettingsChange}
                            className={styles.input}
                            placeholder="Enter YouTube URL"
                        />
                        <div className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92922 4.59318 2.50197 4.84824 2.16134 5.19941C1.82071 5.55057 1.57878 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988758 13.537 1.14273 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0112 9.96295 22.8573 8.1787 22.54 6.42Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanySetting