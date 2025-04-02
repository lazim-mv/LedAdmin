import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProductSpecification.module.css';
import { NestedSpecification } from '@/app/hooks/proucts/useGetAllAddedProduct';

interface Specification {
    spec: string;
    code: string;
    _id: string;
}

interface ProductSpecifications {
    _id: string;
    name: string;
    specifications: Specification[];
}

interface ProductSpecificationProps {
    specifications: ProductSpecifications[] | undefined;
    defaultSelected?: NestedSpecification[];
    onChange?: (selectedValues: { specification: string; selected_specs: string[] }[]) => void;
    onHeightChange?: (height: number) => void;
    onClearProductSpecification?: boolean;
}

interface SelectedSpecs {
    [productId: string]: string[];
}

const ProductSpecification: React.FC<ProductSpecificationProps> = ({
    specifications,
    defaultSelected = [],
    onChange,
    onHeightChange,
    onClearProductSpecification,
}) => {
    const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpecs>(() => {
        const initialSelected: SelectedSpecs = {};
        defaultSelected.forEach(({ id, selected_specs }) => {
            if (id && selected_specs?.length) {
                initialSelected[id] = selected_specs.map(spec => spec._id);
            }
        });
        return initialSelected;
    });

    useEffect(() => {
        if (defaultSelected.length > 0) {
            setExpanded(true);
        }

        const newSelectedSpecs: SelectedSpecs = {};
        defaultSelected.forEach(({ id, selected_specs }) => {
            if (id && selected_specs?.length) {
                newSelectedSpecs[id] = selected_specs.map(spec => spec._id);
            }
        });

        setSelectedSpecs(newSelectedSpecs);
        const formattedSelection = Object.entries(newSelectedSpecs).map(([specification, selected_specs]) => ({
            specification,
            selected_specs,
        }));
        onChange?.(formattedSelection);
    }, [defaultSelected]);



    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [expanded, setExpanded] = useState(() => defaultSelected.length > 0);

    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

            const formattedSelection = Object.entries(newSelectedSpecs).map(([specification, selected_specs]) => ({
                specification,
                selected_specs,
            }));

            onChange?.(formattedSelection);
            return newSelectedSpecs;
        });
    };

    const getSelectedText = (productId: string, product: ProductSpecifications) => {
        const selected = selectedSpecs[productId] || [];
        if (selected.length === 0) return 'Select items...';

        const selectedItems = product.specifications
            .filter(spec => selected.includes(spec._id))
            .map(spec => `${spec.spec} (${spec.code})`);

        return selectedItems.join(', ');
    };

    const sortSpecifications = (
        specifications: Specification[],
        selectedIds: string[],
        searchTerm: string
    ) => {
        return [...specifications]
            .filter(spec =>
                !searchTerm ||
                spec.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spec.code.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const aSelected = selectedIds.includes(a._id);
                const bSelected = selectedIds.includes(b._id);
                if (aSelected && !bSelected) return -1;
                if (!aSelected && bSelected) return 1;
                return 0;
            });
    };

    const sortedSpecifications = specifications && specifications.sort((a, b) =>
        a._id.toString().localeCompare(b._id.toString())
    );


    return (
        <div className={styles.container} style={{ height: expanded ? "auto" : "max-content" }}>


            <div className={styles.titleContainer} >
                <h2 className={styles.title}>Product Specifications</h2>
                <button className={styles.expandButton} onClick={() => setExpanded(!expanded)}>
                    {expanded ? '-' : '+'}
                </button>
            </div>
            {expanded &&
                <>
                    {sortedSpecifications?.map((product) => (
                        <div
                            key={product._id}
                            className={styles.dropdownContainer}
                            // ref={(el) => {
                            //     dropdownRefs.current[product._id] = el;
                            // }}
                        >
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
                                                product.specifications,
                                                selectedSpecs[product._id] || [],
                                                searchTerms[product._id] || ''
                                            ).map((spec) => (
                                                <div
                                                    key={spec._id}
                                                    className={`${styles.option} ${selectedSpecs[product._id]?.includes(spec._id) ? styles.selected : ''
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSpecification(product._id, spec._id);
                                                    }}
                                                >
                                                    {spec.spec} ({spec.code})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            }
        </div>
    );
};

export default ProductSpecification;