import { useState, useRef, useEffect } from "react";
import styles from "../styles/RightSidePicker.module.css";

interface OptionType {
    _id: string;
    name: string;
}

interface PickerProps {
    pickerName: "type" | "category" | "family";
    options?: OptionType[] | [];
    value: string;
    labelName?: string;
    additionalClass?: string;
    onChange: (pickerName: "type" | "category" | "family", value: string) => void;
}

const Picker: React.FC<PickerProps> = ({ pickerName, options, value, onChange, labelName, additionalClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDisplayName = (): string => {
        if (!value) return "Select option";
        const selectedOption = options?.find((opt) => opt._id === value);
        return selectedOption ? selectedOption.name : "Select option";
    };

    return (
        <div className={`${styles.rightSidePickerContainer} ${additionalClass ? styles[additionalClass] : ''}`}>
            <div className={styles.selectContainer}>
                <label>{labelName ? labelName : `Select Product ${pickerName.charAt(0).toUpperCase() + pickerName.slice(1)}`}</label>
                <div
                    className={styles.customSelect}
                    ref={dropdownRef}
                    role="combobox"
                    aria-expanded={isOpen}
                >
                    <div
                        className={styles.selectControl}
                        onClick={() => setIsOpen(!isOpen)}
                        tabIndex={0}
                    >
                        <span className={value ? styles.value : styles.placeholder}>{getDisplayName()}</span>
                        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
                    </div>
                    {isOpen && (
                        <div className={styles.optionsList}>
                            {options?.map((option) => (
                                <div
                                    key={option._id}
                                    className={`${styles.option} ${value === option._id ? styles.selected : ""}`}
                                    onClick={() => {
                                        onChange(pickerName, option._id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Picker;
