export interface SidebarFooterProps {
    onLogout?: () => void;
    className?: string;
    renderLogoutButton?: (onClick: () => void) => React.ReactNode;
    renderLogoutModal?: (isOpen: boolean, onOk: () => void, onCancel: () => void) => React.ReactNode;
    collapsed?: boolean;
}

export interface SidebarProps {
    children?: React.ReactNode;
    items?: SidebarItem[];
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    collapsed: boolean;
    isMobile?: boolean;
}

export default SidebarProps;
