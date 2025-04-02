import { useState, useEffect, useRef } from 'react';
import styles from '../styles/RightSidePicker.module.css';

interface OptionType {
    _id: string;
    name: string;
    image_url?: string;
}

interface RightSidePickerProps {
    options?: OptionType[];
    pickerLabel: string;
    defaultValue?: string;
    onChange?: (name: string, value: string) => void;
    additionalClass?: string;
    pickerInputClass?: string;
    value?: string;
    key?: string;
    isMultiString?: boolean;
    defaultStrings?: string[];
    onMultiStringChange?: (name: string, values: string[]) => void;
}

const RightSidePicker: React.FC<RightSidePickerProps> = ({
    pickerLabel,
    defaultValue = '',
    onChange,
    pickerInputClass = '',
    value: controlledValue,
    key,
    isMultiString = false,
    defaultStrings = [],
    onMultiStringChange
}) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const [multiStrings, setMultiStrings] = useState<string[]>(defaultStrings);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;


    useEffect(() => {
        if (isMultiString) {
            setMultiStrings(defaultStrings);
        } else if (isControlled) {
            setInternalValue(controlledValue);
        } else if (key) {
            setInternalValue(defaultValue);
        }
    }, [defaultStrings, controlledValue, isControlled, defaultValue, key, isMultiString]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (isMultiString) {
            setCurrentInput(newValue);
            setIsDropdownOpen(true);
        } else {
            if (!isControlled) {
                setInternalValue(newValue);
            }
            onChange?.(pickerLabel, newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isMultiString && e.key === 'Enter' && currentInput.trim()) {
            e.preventDefault();
            if (!multiStrings.includes(currentInput.trim())) {
                const updatedStrings = [...multiStrings, currentInput.trim()];
                setMultiStrings(updatedStrings);
                onMultiStringChange?.(pickerLabel, updatedStrings);
            }
            setCurrentInput('');
        }
    };

    const removeString = (stringToRemove: string) => {
        const updatedStrings = multiStrings.filter(str => str !== stringToRemove);
        setMultiStrings(updatedStrings);
        onMultiStringChange?.(pickerLabel, updatedStrings);
    };

    return (
        <div
            className={`${styles.selectContainer} ${pickerInputClass ? styles[pickerInputClass] : ''}`}
            ref={dropdownRef}
        >
            <label htmlFor={pickerLabel}>{pickerLabel}</label>
            <input
                id={pickerLabel}
                type="text"
                name={pickerLabel}
                className={styles.input}
                placeholder={isMultiString ? "Type and press Enter to add" : pickerLabel}
                value={isMultiString ? currentInput : (defaultValue || '')}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => isMultiString && setIsDropdownOpen(true)}
            />

            {isMultiString && (
                <div className={styles.dropdown}>
                    {multiStrings.length > 0 ? (
                        multiStrings.map((str, index) => (
                            <div key={index} className={styles.dropdownItem}>
                                <span>{str}</span>
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeString(str)}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className={styles.dropdownItem}>No credits added</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RightSidePicker;