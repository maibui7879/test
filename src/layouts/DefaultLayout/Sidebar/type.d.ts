export interface SidebarFooterProps {
    onLogout?: () => void;
    className?: string;
    renderLogoutButton?: (onClick: () => void) => React.ReactNode;
    renderLogoutModal?: (isOpen: boolean, onOk: () => void, onCancel: () => void) => React.ReactNode;
}

export interface SidebarItem {
    icon?: React.ReactNode;
    path: string;
    label: string;
    subItems?: {
        icon?: React.ReactNode;
        path: string;
        label: string;
    }[];
}

export interface SidebarProps {
    children?: React.ReactNode;
    items?: SidebarItem[];
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export interface SidebarSubItem {
    icon?: React.ReactNode;
    path: string;
    label: string;
}

export interface SidebarItemProps {
    icon?: React.ReactNode;
    path: string;
    label: string;
    subItems?: SidebarSubItem[];
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
}
