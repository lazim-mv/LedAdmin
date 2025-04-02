import {
    FaHome,
    FaFileAlt,
    FaNewspaper,
    // FaCatalog,
    FaProjectDiagram,
    FaCogs,
    FaBoxOpen
} from 'react-icons/fa';
import { GrCatalog } from "react-icons/gr";

import { IconType } from 'react-icons';

interface MenuItem {
    title: string;
    key: string;
    icon?: IconType;
    subItems: {
        name: string;
        path: string;
    }[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Home',
        key: 'home',
        icon: FaHome,
        subItems: [
            {
                name: "Banner",
                path: "/home/banner"
            },
            {
                name: "Company Settings",
                path: "/home/company-settings"
            },
        ]
    },
    {
        title: 'Pages',
        key: 'websitepages',
        icon: FaFileAlt,
        subItems: [
            {
                name: "About us",
                path: "/websitepages/about-us"
            },
            {
                name: "Research & Development Banner",
                path: "/websitepages/research-development-banner"
            },
            {
                name: "Research & Development",
                path: "/websitepages/research-development"
            },
            {
                name: "Terms & Conditions",
                path: "/websitepages/terms-conditions"
            },
            {
                name: "Privacy Policy",
                path: "/websitepages/privacy-policy"
            },
            {
                name: "Cookie Policy",
                path: "/websitepages/cookie-policy"
            }
        ]
    },
    {
        title: 'News',
        key: 'news',
        icon: FaNewspaper,
        subItems: [
            {
                name: "Add News",
                path: "/news/add-news"
            },
        ]
    },
    {
        title: 'Catalogue',
        key: 'catalogue',
        icon: GrCatalog,
        subItems: [
            {
                name: "Add Catalogue",
                path: "/catalogue/add-catalogue"
            }
        ]
    },
    {
        title: 'Projects',
        key: 'projects',
        icon: FaProjectDiagram,
        subItems: [
            {
                name: "Project Category",
                path: "/projects/project-category"
            },
            {
                name: "Add Project",
                path: "/projects/add-project"
            },
            {
                name: "All Projects",
                path: "/projects/all-projects"
            }
        ]
    },
    {
        title: 'Specsheet Settings',
        key: 'spechseet',
        icon: FaCogs,
        subItems: [
            {
                name: "Specsheet Categories",
                path: "/specsheet/specsheet-categories"
            },
            {
                name: "Specsheet Items",
                path: "/specsheet/specsheet-items"
            },
            {
                name: "Item Values",
                path: "/specsheet/item-values"
            },
        ]
    },
    {
        title: 'Products',
        key: 'products',
        icon: FaBoxOpen,
        subItems: [
            {
                name: "Product Type",
                path: "/products/product-type"
            },
            {
                name: "Product Category",
                path: "/products/product-category"
            },
            {
                name: "Product Family",
                path: "/products/product-group"
            },
            {
                name: "Product Specification",
                path: "/products/product-specification"
            },
            {
                name: "Add Products",
                path: "/products/add-product"
            },
            {
                name: "All Products",
                path: "/products/all-products"
            }
        ]
    },
];