"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/SpecificationVariants.module.css";
import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";

export interface Specification {
    spec: string;
    code: string;
}

interface SpecificationVariantsProps {
    onSpecificationsChange?: (specifications: Specification[]) => void;
    initialSpecifications?: Specification[];
    specAndCodeClear?: boolean;
}

const SpecificationVariants: React.FC<SpecificationVariantsProps> = ({
    onSpecificationsChange,
    initialSpecifications,
    specAndCodeClear,
}) => {
    const [specifications, setSpecifications] = useState<Specification[]>(
        initialSpecifications?.length ? initialSpecifications : [{ spec: "", code: "" }]
    );
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (specAndCodeClear) {
            setSpecifications([{ spec: "", code: "" }]);
        }
    }, [specAndCodeClear]);

    useEffect(() => {
        if (initialSpecifications?.length) {
            setSpecifications(initialSpecifications);
        }
    }, [initialSpecifications]);

    const addSpecification = () => {
        setSpecifications([...specifications, { spec: "", code: "" }]);
    };

    const handleSpecificationChange = (index: number, field: "spec" | "code", value: string) => {
        const newSpecifications = specifications.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setSpecifications(newSpecifications);
    };

    useEffect(() => {
        if (onSpecificationsChange) onSpecificationsChange(specifications);
    }, [specifications, onSpecificationsChange]);

    // Filter specifications based on search query
    const filteredSpecifications = specifications.filter(
        (spec) =>
            spec.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
            spec.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.specContainer}>
            <div className={styles.header}>
                <label className={styles.label}>Add Specification and Product Code</label>
                <button onClick={addSpecification} className={styles.addButton} type="button">
                    +
                </button>
            </div>

            {  <div className={styles.searchContainer}>
                <AiOutlineSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search specifications..."
                    className={`${styles.searchInput} ${styles.specInput}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>}

            <div className={styles.inputContainer}>
                {filteredSpecifications.map((spec, index) => (
                    <div key={index} className={styles.specMainContainer}>
                        <div className={styles.specRow}>
                            <input
                                type="text"
                                name="specificationType"
                                value={spec.spec}
                                onChange={(e) => handleSpecificationChange(index, "spec", e.target.value)}
                                placeholder="Specification"
                                className={styles.specInput}
                            />
                        </div>
                        <div className={styles.specRow}>
                            <input
                                type="text"
                                name="productCode"
                                value={spec.code}
                                onChange={(e) => handleSpecificationChange(index, "code", e.target.value)}
                                placeholder="Short Code"
                                className={styles.specInput}
                            />
                        </div>
                        <AiOutlineDelete
                            className={styles.reactIcon}
                            onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecificationVariants;
