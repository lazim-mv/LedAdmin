"use client"
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './AllProducts.module.css';
import useGetAllAddedProduct, { AddedProduct, NestedSpecification } from '@/app/hooks/proucts/useGetAllAddedProduct';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/app/components/common/DeleteModal';
import Image from 'next/image';
import TopBar from '@/app/components/TopBar';

interface ProductTableProps { }

const SpecificationsModal = ({
    isOpen,
    onClose,
    specifications
}: {
    isOpen: boolean,
    onClose: () => void,
    specifications?: NestedSpecification[]
}) => {
    if (!isOpen || !specifications) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Product Specifications</h2>
                    <button onClick={onClose} className={styles.closeModalButton}>
                        <IoClose />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {specifications.map((specGroup) => (
                        <div key={specGroup.id} className={styles.specModalGroup}>
                            <h3>{specGroup.name}</h3>
                            <div className={styles.specModalItems}>
                                {specGroup.selected_specs?.map((spec) => (
                                    <div key={spec._id} className={styles.specModalItem}>
                                        <span>{spec.spec}</span>
                                        <span className={styles.specCode}>({spec.code})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductTable: React.FC<ProductTableProps> = () => {
    const router = useRouter();
    const { addedProduct, refetch, error, isLoading, meta, page, setPage, limit, setLimit, search, setSearch } = useGetAllAddedProduct();

    const [sortField, setSortField] = useState<keyof AddedProduct>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [specModalOpen, setSpecModalOpen] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState(search || '');

    const handleSearchChange = (value: string) => {
        setPage(1);
        setSearchInput(value);
        setSearch(value);
    };

    if (error) {
        return (
            <div className="appContainer" style={{ display: "flex" }}>
                <main className="appMain" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div className={styles.loading}>Error loading projects: {error}</div>
                </main>
            </div>
        )
    }

    const handleSort = (field: keyof AddedProduct) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedProducts = addedProduct && addedProduct.length
        ? [...addedProduct].sort((a, b) => {
            let aValue: string = '';
            let bValue: string = '';

            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (typeof fieldA === 'object' && fieldA !== null && 'name' in fieldA) {
                aValue = fieldA.name as string;
            } else {
                aValue = (fieldA as string) || '';
            }

            if (typeof fieldB === 'object' && fieldB !== null && 'name' in fieldB) {
                bValue = fieldB.name as string;
            } else {
                bValue = (fieldB as string) || '';
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        })
        : [];

    const renderSpecifications = (specs?: NestedSpecification[], productId?: string) => {
        if (!specs || specs.length === 0) return <span>No specifications</span>;

        return (
            <div className={styles.specContainer}>
                {specs.slice(0, 1).map(specGroup => {
                    return (
                        <div key={specGroup.id} className={styles.specGroup}>
                            <div>
                                <span className={styles.specGroupName}>{specGroup.name}: </span>
                                {specGroup.selected_specs?.slice(0, 1).map((spec, index) => (
                                    <span key={spec._id} className={styles.specItem}>
                                        {spec.spec} ({spec.code})
                                        {specGroup.selected_specs && index < specGroup.selected_specs.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {(() => {
                    // Calculate total specs across all groups
                    const totalSpecs = specs.reduce((total, group) =>
                        total + (group.selected_specs?.length || 0), 0);

                    // Calculate visible specs (first spec of first group)
                    const visibleSpecs = specs[0]?.selected_specs?.slice(0, 1).length || 0;

                    // Calculate remaining specs
                    const remainingSpecs = totalSpecs - visibleSpecs;

                    return remainingSpecs > 0 ? (
                        <button
                            className={styles.expandButton}
                            onClick={() => productId && setSpecModalOpen(productId)}
                        >
                            +{remainingSpecs} More
                        </button>
                    ) : null;
                })()}
            </div>
        );
    };

    const handleEdit = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const handleDeleteClick = (productId: string) => {
        setSelectedProductId(productId);
        setDeleteModalOpen(true);
    };

    const selectedProductSpecs = specModalOpen
        ? sortedProducts.find(p => p._id === specModalOpen)?.specifications
        : undefined;

    const hanldeImageOpen = (image_url: string) => {
        window.open(image_url, '_blank');
    }





    return (
        <div className="appContainer">
            <main className="appMain">
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setSelectedProductId(null);
                    }}
                    id={selectedProductId}
                    byIdEndPoint='product'
                    refetchPreviewItemsData={refetch}
                    title="Confirm Delete"
                    message="Are you sure you want to delete?"
                />

                <SpecificationsModal
                    isOpen={!!specModalOpen}
                    onClose={() => setSpecModalOpen(null)}
                    specifications={selectedProductSpecs}
                />

                <TopBar
                    title="Products"
                    search={true}
                    searchValue={searchInput}
                    onSearchChange={handleSearchChange}
                    saveButtonDisabled={true}
                />

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>
                                    Product Name
                                    {sortField === 'name' && (
                                        <span className={styles.sortIcon}>
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                {/* <th onClick={() => handleSort('projectCategory')}>
                                    Project Category
                                    {sortField === 'projectCategory' && (
                                        <span className={styles.sortIcon}>
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th> */}
                                <th onClick={() => handleSort('productType')}>
                                    Type
                                    {sortField === 'productType' && (
                                        <span className={styles.sortIcon}>
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('productCategory')}>
                                    Product Category
                                    {sortField === 'productCategory' && (
                                        <span className={styles.sortIcon}>
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th onClick={() => handleSort('code')}>
                                    Product Code
                                    {sortField === 'code' && (
                                        <span className={styles.sortIcon}>
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th>Specifications</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td><div className={styles.productInfo}>
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className={styles.productImage}
                                                onClick={() => hanldeImageOpen(product.imageUrl)}
                                            />
                                            <span>{product.name}</span>
                                        </div></td>
                                        {/* <td>{product.projectCategory?.name}</td> */}
                                        <td>{product.productType?.name}</td>
                                        <td>{product.productCategory?.name}</td>
                                        <td>{product.code}</td>
                                        <td>
                                            <div className={styles.specifications}>
                                                {renderSpecifications(product.specifications || [], product._id)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={`${styles.actionButton} ${styles.editButton}`}
                                                    onClick={() => handleEdit(product._id)}
                                                    aria-label="Edit product"
                                                >
                                                    <FaRegEdit />
                                                </button>
                                                <button
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                    onClick={() => handleDeleteClick(product._id)}
                                                    aria-label="Delete product"
                                                >
                                                    <AiOutlineDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.noData}>
                                        No products available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.pagination}>
                    <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                        className={`${styles.paginationButton} ${page <= 1 ? styles.disabled : ""}`}
                    >
                        Previous
                    </button>
                    <span>
                        Page {meta?.currentPage} of {meta?.totalPages}
                    </span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= (meta?.totalPages || 1)}
                        className={`${styles.paginationButton} ${page >= (meta?.totalPages || 1) ? styles.disabled : ""}`}
                    >
                        Next
                    </button>
                    <select className={styles.select} value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </main>
        </div>
    );
};

export default ProductTable;