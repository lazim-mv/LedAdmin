import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProductSpecification.module.css';
import { SpecSheetItems } from '@/app/hooks/specsheet-items/useGetAllSpecSheetItems';
import { NestedSpecSheetConfig } from '@/app/hooks/proucts/useGetAllAddedProduct';

interface ProductSpecificationProps {
    specifications: SpecSheetItems[] | undefined;
    defaultSpecSheetSettings?: NestedSpecSheetConfig[];
    onChange?: (selectedValues: { spec_item: string; selected_values: string[] }[]) => void;
    onClearProductSpecification?: boolean;
}

interface SelectedSpecs {
    [productId: string]: string[];
}

interface GroupedSpecifications {
    [categoryName: string]: SpecSheetItems[];
}

const SpecSheetSelection: React.FC<ProductSpecificationProps> = ({
    specifications,
    defaultSpecSheetSettings = [],
    onChange,
    onClearProductSpecification,
}) => {
    const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpecs>(() => {
        const initialSelected: SelectedSpecs = {};
        defaultSpecSheetSettings.forEach(({ id, selected_values }) => {
            if (id && selected_values?.length) {
                initialSelected[id] = selected_values.map(spec => spec._id);
            }
        });
        return initialSelected;
    });

    console.log(defaultSpecSheetSettings, "fjdaksklsaklF");

    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [expanded, setExpanded] = useState(() => defaultSpecSheetSettings.length > 0);
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Group specifications by category
    const groupedSpecifications = specifications?.reduce<GroupedSpecifications>((acc, spec) => {
        const categoryName = spec.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(spec);
        return acc;
    }, {});

    if (groupedSpecifications) {
        Object.keys(groupedSpecifications).forEach(category => {
            groupedSpecifications[category].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        });
    }

    // Convert to sorted array of entries and back to object to maintain category order
    const sortedGroupedSpecifications = Object.fromEntries(
        Object.entries(groupedSpecifications || {})
            .sort(([categoryB], [categoryA]) =>
                categoryA.localeCompare(categoryB)
            )
    );

    useEffect(() => {
        if (defaultSpecSheetSettings.length > 0) {
            setExpanded(true);
        }

        const newSelectedSpecs: SelectedSpecs = {};
        defaultSpecSheetSettings.forEach(({ id, selected_values }) => {
            if (id && selected_values?.length) {
                newSelectedSpecs[id] = selected_values.map(spec => spec._id);
            }
        });

        setSelectedSpecs(newSelectedSpecs);

        const formattedSelection = Object.entries(newSelectedSpecs).map(([specification, selected_specs]) => ({
            spec_item: specification,
            selected_values: selected_specs,
        }));
        onChange?.(formattedSelection);
    }, [defaultSpecSheetSettings]);

    useEffect(() => {
        if (onClearProductSpecification) {
            setSelectedSpecs({});
            onChange?.([]);
        }
    }, [onClearProductSpecification]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            openDropdowns.forEach(dropdownId => {
                if (dropdownRefs.current[dropdownId] && !dropdownRefs.current[dropdownId]?.contains(event.target as Node)) {
                    setOpenDropdowns(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(dropdownId);
                        return newSet;
                    });
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdowns]);

    const toggleDropdown = (productId: string) => {
        setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const toggleSpecification = (productId: string, specId: string) => {
        setSelectedSpecs(prev => {
            const currentSelected = prev[productId] || [];
            let newSelected: string[];

            if (currentSelected.includes(specId)) {
                newSelected = currentSelected.filter(id => id !== specId);
            } else {
                newSelected = [...currentSelected, specId];
            }

            const newSelectedSpecs = { ...prev, [productId]: newSelected };

            if (newSelected.length === 0) {
                delete newSelectedSpecs[productId];
            }

            const formattedSelection = Object.entries(newSelectedSpecs).map(([spec_item, selected_values]) => ({
                spec_item,
                selected_values,
            }));

            onChange?.(formattedSelection);
            return newSelectedSpecs;
        });
    };

    const getSelectedText = (productId: string, product: SpecSheetItems) => {
        const selected = selectedSpecs[productId] || [];
        if (selected.length === 0) return 'Select items...';

        const selectedItems = product.values
            .filter(spec => selected.includes(spec.id))
            .map(spec => `${spec.value} (${spec.value_shortform})`);

        return selectedItems.join(', ');
    };

    const sortSpecifications = (
        specifications: { id: string; value: string; value_shortform: string }[],
        selectedIds: string[],
        searchTerm: string
    ) => {
        return [...specifications]
            .filter(spec =>
                !searchTerm ||
                spec.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spec.value_shortform.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const aSelected = selectedIds.includes(a.id);
                const bSelected = selectedIds.includes(b.id);
                if (aSelected && !bSelected) return -1;
                if (!aSelected && bSelected) return 1;
                return 0;
            });
    };

    return (
        <div className={styles.container} style={{ height: expanded ? "auto" : "max-content" }}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Specsheet Settings</h2>
                <button className={styles.expandButton} onClick={() => setExpanded(!expanded)}>
                    {expanded ? '-' : '+'}
                </button>
            </div>

            {expanded && sortedGroupedSpecifications && Object.entries(sortedGroupedSpecifications).map(([categoryName, categorySpecs]) => (
                <div key={categoryName} className={styles.categoryContainer}>
                    <div className={styles.categoryName}>
                        {categoryName}
                    </div>
                    <div className={styles.specificationsDropdowns}>
                        {categorySpecs.map((product) => (
                            <div key={product._id} className={styles.dropdownContainer}>
                                <div className={styles.label}>{product.name}</div>
                                <div className={styles.selectorWrapper}
                                    ref={(el) => {
                                        dropdownRefs.current[product._id] = el;
                                    }}
                                >
                                    <div
                                        className={styles.selector}
                                        onClick={() => toggleDropdown(product._id)}
                                    >
                                        <div className={styles.selectedText}>
                                            {getSelectedText(product._id, product)}
                                        </div>
                                        <div className={styles.arrow}>
                                            {openDropdowns.has(product._id) ? '▼' : '▲'}
                                        </div>
                                    </div>

                                    {openDropdowns.has(product._id) && (
                                        <div className={styles.dropdown}>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className={styles.searchInput}
                                                value={searchTerms[product._id] || ''}
                                                onChange={(e) => setSearchTerms(prev => ({
                                                    ...prev,
                                                    [product._id]: e.target.value
                                                }))}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className={styles.optionsList}>
                                                {sortSpecifications(
                                                    product.values,
                                                    selectedSpecs[product._id] || [],
                                                    searchTerms[product._id] || ''
                                                ).map((spec) => (
                                                    <div
                                                        key={spec.id}
                                                        className={`${styles.option} ${selectedSpecs[product._id]?.includes(spec.id) ? styles.selected : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSpecification(product._id, spec.id);
                                                        }}
                                                    >
                                                        {spec.value} ({spec.value_shortform})
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpecSheetSelection;