import { useState, useEffect, useRef } from "react";
import styles from "../styles/MultiSelect.module.css";

interface OptionType {
    _id: string;
    name: string;
}

interface MultiSelectProps {
    options?: OptionType[];
    selectedValues?: string[];
    placeholder?: string;
    onChangeMultiSelect?: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedValues = [],
    placeholder = "Select options...",
    onChangeMultiSelect,
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<string[]>(selectedValues);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelected(selectedValues);
    }, [selectedValues]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelection = (optionId: string) => {
        let updatedSelected = selected.includes(optionId)
            ? selected.filter((id) => id !== optionId)
            : [...selected, optionId];

        setSelected(updatedSelected);
        if (onChangeMultiSelect)
            onChangeMultiSelect(updatedSelected);
    };

    const filteredOptions = (Array.isArray(options) ? options : []).filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className={styles.multiSelect} ref={dropdownRef}>
            <label htmlFor="multiSelect">Select Products</label>
            <div className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
                <div className={styles.selectedValues}>
                    {selected.length > 0
                        ? selected.map((id) => options?.find((opt) => opt._id === id)?.name).join(", ")
                        : placeholder}
                </div>
                <div className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</div>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <input
                        type="text"
                        className={styles.search}
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className={styles.options}>
                        {filteredOptions && filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option._id}
                                    className={`${styles.option} ${selected.includes(option._id) ? styles.selected : ""}`}
                                    onClick={() => toggleSelection(option._id)}
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noOptions}>No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
