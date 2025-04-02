import { IoSearchOutline } from 'react-icons/io5';
import styles from './styles/TopBar.module.css';

interface TopBarProps {
    title?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    previewItemId?: string;
    onClearClick?: () => void;
    saveButtonDisabled?: boolean;
    page?: string;
    search?: boolean;
    searchValue?: string | undefined;
    onSearchChange?: (value: string) => void;
}

const TopBar = ({
    title,
    buttonText = "Save",
    onButtonClick,
    previewItemId,
    onClearClick,
    saveButtonDisabled = false,
    page,
    search = false,
    searchValue = "",
    onSearchChange
}: TopBarProps) => {

    return (
        <div className={styles.topBar}>
            <div className={styles.topBarTitleAndSearch}>
                <h1 className={styles.title}>{title}</h1>
                {search && (
                    <div className={styles.searchContainer}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className={styles.topBarButtons}>
                {!(page === "edit-product" || page === "edit-project") && previewItemId && (
                    <button
                        type="button"
                        onClick={onClearClick}
                        className={styles.saveButton}
                    >
                        Clear
                    </button>
                )}
                {!saveButtonDisabled && (
                    <button
                        type="button"
                        onClick={onButtonClick}
                        className={styles.saveButton}
                    >
                        {buttonText}
                    </button>
                )}
            </div>

        </div>
    );
};

export default TopBar;
