import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useState, useEffect, useMemo, useRef } from 'react';
import styles from '../styles/PreviewItems.module.css';

import { AboutData } from '@/app/hooks/about-us/useGetAllAbout';
import { ResearchDevelopmentData } from '@/app/hooks/research-development/useGetAllResearchDevelopment';
import { Banners } from '@/app/hooks/banner/useGetAllBanner';
import { TermsCondition } from '@/app/hooks/terms-conditions/useGetAllTermsCondition';
import { ProjectCategories } from '@/app/hooks/projects/useGetAllProjectCategories';
import { ItemValues } from '@/app/hooks/item-values/useGetAllItemValues';
import ConfirmationModal from './DeleteModal';
import api from '@/app/axiosConfig';
import ResponseAlert from './ResponseAlert';

interface PreviewItemsProps {
    datas?: (Banners | AboutData | ResearchDevelopmentData | TermsCondition | ProjectCategories | ItemValues)[];
    previewContainerClassName?: string;
    clickById?: (DataId: string) => void;
    itemsPerPage?: number;
    refetchPreviewItemsData?: () => void;
    onClear?: () => void;
    page?: string;
    pageName?: string;
    byIdEndPoint?: string;
    previewItemHeadername?: string;
}

interface ProductOrder {
    id: string;
    order: number;
}

const PreviewItems = ({
    datas = [],
    previewContainerClassName,
    clickById,
    itemsPerPage = 20,
    refetchPreviewItemsData,
    page = "",
    byIdEndPoint,
    previewItemHeadername,
    pageName,
    onClear
}: PreviewItemsProps) => {
    const [alertConfig, setAlertConfig] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        show: boolean;
    }>({
        message: '',
        type: 'success',
        show: false
    });
    const isInitialMount = useRef(true);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedHomeCheckboxes, setSelectedHomeCheckboxes] = useState<Set<string>>(new Set());
    const [selectedProductCheckboxes, setSelectedProductCheckboxes] = useState<Set<string>>(new Set());
    const [reOrder, setReOrder] = useState<ProductOrder[]>([]);
    const [hasUpdated, setHasUpdated] = useState(false);

    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({
        key: '',
        direction: 'desc'
    });

    const safeItems = Array.isArray(datas) ? datas : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [datas]);

    const sortedItems = useMemo(() => {
        let sortableItems = [...safeItems];

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a._id.toString().toLowerCase();
                const bValue = b._id.toString().toLowerCase();

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sortableItems;
    }, [safeItems, sortConfig]);

    const filteredItems = useMemo(() => {
        return sortedItems.filter(item =>
            (item?.title || item?.name || item?.value || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedItems, searchTerm]);

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const initialHomeSelected = new Set(
            datas
                .filter(item => (item as Banners).isFav)
                .map(item => item._id)
        );
        const initialProductSelected = new Set(
            datas
                .filter(item => (item as Banners).isVisible)
                .map(item => item._id)
        );
        setSelectedHomeCheckboxes(initialHomeSelected);
        setSelectedProductCheckboxes(initialProductSelected);
    }, [datas]);

    const handleSort = (key: string) => {
        setSortConfig(prevSort => {
            if (prevSort.key === key) {
                return {
                    key,
                    direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
                };
            }

            return {
                key,
                direction: 'asc'
            };
        });
    };

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'home' | 'product') => {
        e.stopPropagation();
        const isChecked = e.target.checked;
        const setState = type === 'home' ? setSelectedHomeCheckboxes : setSelectedProductCheckboxes;
        const currentSet = type === 'home' ? selectedHomeCheckboxes : selectedProductCheckboxes;

        const newSelectedIds = new Set(currentSet);

        if (isChecked) {
            // if (newSelectedIds.size >= 6) {
            //     setAlertConfig({
            //         message: 'Maximum 6 items can be selected',
            //         type: 'warning',
            //         show: true,
            //     });
            //     return;
            // }
            newSelectedIds.add(id);
        } else {
            newSelectedIds.delete(id);
        }

        setState(newSelectedIds);

        const endpoint = type === 'home' ? 'set-favorite' : 'set-visible';

        try {
            const response = await api.patch(`product-types/${endpoint}`, {
                productTypeIds: Array.from(newSelectedIds),
            });

            if (response.status !== 200) {
                throw new Error("Failed to update status");
            }

            setAlertConfig({
                message: 'Status Updated successfully',
                type: 'success',
                show: true,
            });

            refetchPreviewItemsData?.();
        } catch (error: any) {
            setAlertConfig({
                message: error.message,
                type: 'error',
                show: true,
            });

            setState((prev) => {
                const revertSet = new Set(prev);
                if (isChecked) revertSet.delete(id);
                else revertSet.add(id);
                return revertSet;
            });
        }
    };

    const handleClick = (dataId: string) => {
        if (clickById) clickById(dataId);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (productId: string) => {
        setSelectedProductId(productId);
        setDeleteModalOpen(true);
    };

    const handleChangeOrder = (productId: string, order: string) => {
        const numericOrder = Number(order);
        if (isNaN(numericOrder)) return;

        setReOrder((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === productId);

            if (existingIndex !== -1) {
                const updatedOrders = [...prev];
                updatedOrders[existingIndex].order = numericOrder;
                return updatedOrders;
            } else {
                return [...prev, { id: productId, order: numericOrder }];
            }
        });
    };

    useEffect(() => {
        if (pageName === "product-type" || pageName === "product-category") {
            const currentItemIds = new Set(currentItems.map(item => item._id));
            const currentReorderIds = new Set(reOrder.map(item => item.id));

            const needsUpdate =
                reOrder.length === 0 ||
                currentItems.length !== reOrder.length ||
                !currentItems.every(item => currentReorderIds.has(item._id));

            if (needsUpdate) {
                const existingOrdersMap = Object.fromEntries(reOrder.map(item => [item.id, item.order]));

                const updatedReOrder = currentItems
                    .filter((item): item is { _id: string; order?: number } => "order" in item)
                    .map((item) => ({
                        id: item._id,
                        order: existingOrdersMap[item._id] ?? item.order ?? 0,
                    }));

                // ✅ Prevent state updates if the new value is the same as the existing state
                if (JSON.stringify(reOrder) !== JSON.stringify(updatedReOrder)) {
                    setReOrder(updatedReOrder);
                }
            }
        }
    }, [pageName, currentItems]);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return; // Prevent first execution
        }

        if (!hasUpdated || reOrder.length === 0) return;

        let endPoint: string | null = null;
        let keyName: string | null = null;

        if (pageName === "product-type") {
            endPoint = "product-types";
            keyName = "productTypeOrders";
        } else if (pageName === "product-category") {
            endPoint = "product-categories";
            keyName = "productCategoryOrders";
        }

        if (!endPoint || !keyName) return;

        const sendReorderRequest = async () => {
            try {
                const response = await api.patch(`${endPoint}/reorder`, {
                    [keyName]: reOrder,
                });

                // if (response.status === 200 && hasUpdated) {
                //     setAlertConfig({
                //         message: "Order Updated successfully",
                //         type: "success",
                //         show: true,
                //     });
                // }

                console.log("Reorder successful", response.data);
            } catch (error) {
                console.error("Error reordering:", error);
            }
        };

        const timeout = setTimeout(sendReorderRequest, 500);
        return () => clearTimeout(timeout);
    }, [reOrder, pageName]);

    useEffect(() => {
        if (reOrder.length > 0) {
            setHasUpdated(true);
        }
    }, [reOrder]);





    const renderSortIcon = () => {
        if (sortConfig.key) {
            return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    const isLoading = currentItems.length === 0 && safeItems.length > 0;
    const [hoveredCheckbox, setHoveredCheckbox] = useState<string | null>(null);
    return (
        <>
            {alertConfig.show && (
                <ResponseAlert
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
                />
            )}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedProductId(null);
                }}
                id={selectedProductId}
                byIdEndPoint={byIdEndPoint}
                // onConfirm={handleDeleteConfirm}
                refetchPreviewItemsData={refetchPreviewItemsData}
                title="Confirm Delete"
                message="Are you sure you want to delete?"
                onClear={onClear}
                pageName={pageName}
            />
            <div className={`${styles.previewContainer} ${previewContainerClassName ? styles[previewContainerClassName] : ''}`}>
                <div className={styles.previewHeader}>
                    <div className={styles.headerLeft}>

                        <span
                            className={styles.headerColumn}
                            onClick={() => handleSort('name')}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', minWidth: pageName === "product-type" ? "7.5vw" : "", maxWidth: pageName === "product-type" ? "7.5vw" : "" }}
                        >
                            {previewItemHeadername ? previewItemHeadername : 'Name'}
                            {renderSortIcon()}
                        </span>
                        {pageName === "product-type" &&
                            <>
                                <span
                                    className={styles.headerColumn}
                                    onClick={() => handleSort('name')}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', minWidth: "3.9375vw", justifyContent: "center" }}
                                >
                                    {"Home"}
                                </span>
                                <span
                                    className={styles.headerColumn}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', minWidth: "3.9375vw", justifyContent: "center" }}
                                >
                                    {"Product"}
                                </span>
                            </>
                        }
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>
                    <span className={styles.headerColumn}>Action</span>
                </div>

                {currentItems.length === 0 ? (
                    <div className={styles.noDataMessage}>
                        No information to display
                    </div>
                ) :
                    <div className={styles.bannerList}>
                        {currentItems.map((item) => {
                            const existingOrder = reOrder.find((orderItem) => orderItem.id === item._id)?.order || "";

                            return (
                                <div key={item._id} className={styles.bannerItem}>
                                    <div
                                        className={styles.itemLeft} style={{ maxWidth: pageName === "product-type" ? "7.5vw" : "" }}
                                    >
                                        {(pageName === "product-type" || pageName === "product-category") &&
                                            <div className={styles.inputContainer}>
                                                <input
                                                    type="text"
                                                    name="button.text"
                                                    value={existingOrder}
                                                    onChange={(e) => handleChangeOrder(item._id, e.target.value)}
                                                    className={styles.input}
                                                    placeholder="No"
                                                    style={{ flex: 1 }}
                                                />
                                            </div>}
                                        <span className={styles.bannerName} style={{ minWidth: pageName === "product-type" ? "7.5vw" : "", maxWidth: pageName === "product-type" ? "7.5vw" : "" }}>
                                            {item?.title || item?.name || item?.value}
                                        </span>

                                        <div className={styles.checkboxGroup} style={{ display: pageName === "product-type" ? "flex" : "none" }}>
                                            <div
                                                className={styles.checkboxCol}
                                            >
                                                <div
                                                    className={styles.checkboxWrapper}
                                                    onMouseEnter={() => setHoveredCheckbox(`inner-${item._id}`)}
                                                    onMouseLeave={() => setHoveredCheckbox(null)}

                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={selectedHomeCheckboxes.has(item._id)}
                                                        onChange={(e) => handleSelect(e, item._id, 'home')}
                                                        className={styles.checkboxInput}
                                                    // disabled={selectedHomeCheckboxes.size >= 6 && !selectedHomeCheckboxes.has(item._id)}
                                                    />
                                                    <span className={styles.customCheckbox}>
                                                        <svg className={styles.checkIcon} viewBox="0 0 24 24">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                    </span>
                                                    {/* {hoveredCheckbox === `inner-${item._id}` && (
                                                <div className={styles.tooltip}>Home Page</div>
                                            )} */}
                                                </div>
                                            </div>
                                            <div
                                                className={styles.checkboxCol}
                                            >
                                                <div
                                                    className={styles.checkboxWrapper}
                                                    onMouseEnter={() => setHoveredCheckbox(`outer-${item._id}`)}
                                                    onMouseLeave={() => setHoveredCheckbox(null)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProductCheckboxes.has(item._id)}
                                                        onChange={(e) => handleSelect(e, item._id, 'product')}
                                                        className={styles.checkboxInput}
                                                        // disabled={selectedProductCheckboxes.size >= 6 && !selectedProductCheckboxes.has(item._id)}
                                                    />
                                                    <span className={styles.customCheckbox}>
                                                        <svg className={styles.checkIcon} viewBox="0 0 24 24">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                    </span>
                                                    {/* {hoveredCheckbox === `outer-${item._id}` && (
                                                    <div className={styles.tooltip}>Product Page</div>
                                                )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {pageName === "product-group" && previewItemHeadername === "Product Types" ||
                                        pageName === "product-group" && previewItemHeadername === "Product Categories" ||
                                        pageName === "product-category" && previewItemHeadername === "Product Types" ||
                                        pageName === "specsheet-item" && previewItemHeadername === "Specsheet Category" ||
                                        pageName === "specsheet-item-values" && previewItemHeadername === "Specsheet Category" ||
                                        pageName === "specsheet-item-values" && previewItemHeadername === "Specsheet Item"
                                        ? "" :
                                        <div className={styles.actionButtons}>
                                            <div className={styles.actionButton}
                                                onClick={() => handleDeleteClick(item._id)}>
                                                <AiOutlineDelete
                                                    className={`${styles.reactIcon} ${styles.deleteIcon}`}
                                                />
                                            </div>
                                            <div
                                                className={styles.actionButton}
                                                onClick={() => handleClick(item._id)}
                                            >
                                                <FaRegEdit
                                                    className={`${styles.reactIcon} ${styles.editIcon}`}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                }



                {datas.length > 20 && (
                    <div className={styles.pagination}>
                        <button
                            disabled={currentPage === 1}
                            onClick={goToPreviousPage}
                            className={styles.paginationButton}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index + 1)}
                                className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={goToNextPage}
                            className={styles.paginationButton}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PreviewItems;