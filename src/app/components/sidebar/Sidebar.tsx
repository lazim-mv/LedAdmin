"use client"
import { useEffect, useState } from 'react'
import styles from '../styles/Sidebar.module.css'
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { menuItems } from './menuItems';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    children?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const pathName = usePathname();
    const [openMenu, setOpenMenu] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const findParentMenu = (path: string) => {
        for (const item of menuItems) {
            // Check if path matches exact menu key (for root dynamic routes)
            if (path.startsWith(`/${item.key}/`)) {
                return item.key;
            }

            // Check sub-items for exact match or dynamic routes
            if (item.subItems.some(subItem =>
                path === subItem.path ||
                (subItem.path.includes(':') && path.startsWith(subItem.path.split(':')[0]))
            )) {
                return item.key;
            }
        }
        return '';
    };




    useEffect(() => {
        const parentMenu = findParentMenu(pathName);
        setOpenMenu(parentMenu);
    }, [pathName]);

    const handleMenuClick = (key: string) => {
        setOpenMenu(prev => prev === key ? '' : key);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <>
            <div className={`${styles.mobileHamburger}`} onClick={toggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className={`${styles.container} ${isSidebarOpen ? styles.mobileSidebarOpen : ''}`}>
                <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.mobileSidebar : ''}`}>
                    {menuItems.map((item) => (
                        <div key={item.key} className={styles.menuItems}>
                            <div
                                className={`${styles.menuItem} ${item.subItems.some(subItem =>
                                    pathName.startsWith(subItem.path.replace(/:\w+/, '')) ||
                                    pathName.startsWith(`/${item.key}/`)
                                ) ? styles.activeParent : ''
                                    }`}
                                onClick={() => handleMenuClick(item.key)}
                            >
                                <span>
                                    {item.icon && <item.icon className={styles.menuIcon} />}
                                    {item.title}
                                </span>
                                {openMenu === item.key ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {openMenu === item.key && (
                                <>
                                    {item.subItems.map((subItem, index) => (
                                        <Link
                                            href={subItem.path}
                                            key={`${item.key}-${index}`}
                                            className={`${styles.submenuItem} ${pathName === subItem.path ? styles.activeSubItem : ''}`}
                                            onClick={toggleSidebar}
                                        >
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}
                </nav>
                {children}
            </div>
        </>
    );
};

export default Sidebar;