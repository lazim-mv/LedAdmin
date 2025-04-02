import { useState, useEffect, useRef } from 'react';
import styles from '../styles/SelectComponent.module.css';
import type { SelectOptions } from '../BannerForm';

interface SelectComponentProps {
    label?: string;
    value: string;
    onChange: (id: string, name?: string) => void;
    placeholder?: string;
    options?: SelectOptions[];
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    label = 'Product Type',
    value,
    onChange,
    placeholder = `Select ${label}`,
    options = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedName, setSelectedName] = useState<string | undefined>("placeholder");
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update the selected name whenever the value changes
    useEffect(() => {
        const selectedOption = options.find((option) => option._id === value);
        console.log(options, selectedOption, value, "setSelectedName dafsf");
        setSelectedName(selectedOption?.name || placeholder);
    }, [value, options, placeholder]);

    const handleSelect = (id: string, name?: string) => {
        if (name) {
            console.log(id, "selectedOption1 from compon");
            onChange(id, name);
        }
        setIsOpen(false);
    };

    console.log(selectedName, "setSelectedName");

    return (
        <div className={styles.formGroup} ref={selectRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.selectWrapper} >
                <div
                    className={styles.selectControl}
                    onClick={() => setIsOpen(!isOpen)} style={{ cursor: options.length > 0 ? 'pointer' : 'not-allowed' }}
                >
                    <span className={selectedName ? styles.value : styles.placeholder}>
                        {selectedName}
                    </span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
                </div>
                {isOpen && (
                    <div className={styles.optionsList}>
                        {options.map((option) => (
                            <div
                                key={option._id}
                                className={styles.option}
                                onClick={() => handleSelect(option._id, option.name)}
                            >
                                {option.name}
                            </div>
                        )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectComponent;
