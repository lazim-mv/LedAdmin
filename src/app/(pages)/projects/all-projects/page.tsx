"use client";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import styles from "./AllProjects.module.css";
import useGetAllProjects, { ProjectsType } from "@/app/hooks/projects/useGetAllProjects";
import TopBar from "@/app/components/TopBar";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/app/components/common/DeleteModal";

const ProjectTable: React.FC = () => {
    const router = useRouter();
    const { projects, refetch, error, isLoading, meta, page, setPage, limit, setLimit, search, setSearch } = useGetAllProjects();

    const [sortField, setSortField] = useState<keyof ProjectsType>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const handleSort = (field: keyof ProjectsType) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedProjects = projects?.length
        ? [...projects].sort((a, b) => {
            const aValue = a[sortField] ?? "";
            const bValue = b[sortField] ?? "";
            const aStr = Array.isArray(aValue) ? aValue.join(", ") : String(aValue);
            const bStr = Array.isArray(bValue) ? bValue.join(", ") : String(bValue);

            if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
            return 0;
        })
        : [];

    const handleEdit = (projectId: string) => {
        router.push(`/projects/${projectId}`);
    };

    const handleDeleteClick = (productId: string) => {
        setSelectedProjectId(productId);
        setDeleteModalOpen(true);
    };



    return (
        <div className="appContainer">
            <main className="appMain">
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setSelectedProjectId(null);
                    }}
                    id={selectedProjectId}
                    byIdEndPoint="project"
                    refetchPreviewItemsData={refetch}
                    title="Confirm Delete"
                    message="Are you sure you want to delete?"
                />
                <TopBar title="All Projects" saveButtonDisabled={true} />
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("name")}>
                                    Project Name {sortField === "name" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th onClick={() => handleSort("location")}>
                                    Location {sortField === "location" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th onClick={() => handleSort("project_category")}>
                                    Project Category {sortField === "project_category" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th onClick={() => handleSort("architect")}>
                                    Credits {sortField === "architect" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th onClick={() => handleSort("associated_product")}>
                                    Associated Products {sortField === "associated_product" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProjects.length > 0 ? (
                                sortedProjects.map((project) => (
                                    <tr key={project._id}>
                                        <td>{project.name}</td>
                                        <td>{project.location}</td>
                                        <td>{project.project_category?.name || "-"}</td>
                                        <td>
                                            {project.architect?.length ? (
                                                <div className={styles.architectCell}>
                                                    {(() => {
                                                        const isRowExpanded = expandedRows.has(project._id);
                                                        const architects = project.architect;
                                                        const displayedArchitects = isRowExpanded
                                                            ? architects
                                                            : architects.slice(0, 1);

                                                        const toggleExpand = () => {
                                                            setExpandedRows(prev => {
                                                                const newSet = new Set(prev);
                                                                if (isRowExpanded) {
                                                                    newSet.delete(project._id);
                                                                } else {
                                                                    newSet.add(project._id);
                                                                }
                                                                return newSet;
                                                            });
                                                        };

                                                        return (
                                                            <>
                                                                {displayedArchitects.map((architect, index) => (
                                                                    <span key={index} className={styles.architectItem}>
                                                                        {architect}
                                                                    </span>
                                                                ))}
                                                                {architects.length > 1 && (
                                                                    <button
                                                                        onClick={toggleExpand}
                                                                        className={styles.showMoreButton}
                                                                    >
                                                                        {isRowExpanded ? (
                                                                            "Show less"
                                                                        ) : (
                                                                            <>
                                                                                <span>{architects.length - 1} more</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.productsList}>
                                                {project.associated_product?.length
                                                    ? project.associated_product.map((product, index) => (
                                                        <span key={index} className={styles.productItem}>
                                                            {product.name}
                                                        </span>
                                                    ))
                                                    : "-"}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleEdit(project._id)}>
                                                    <FaRegEdit />
                                                </button>
                                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDeleteClick(project._id)}>
                                                    <AiOutlineDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.noData}>
                                        No projects available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
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
            </main >
        </div >
    );
};

export default ProjectTable;
