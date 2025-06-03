import React, { useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@contexts/useAuth/userContext';
import { SidebarFooterProps } from './type';

const SidebarFooter: React.FC<SidebarFooterProps> = React.memo(({ collapsed }) => {
    const { logout } = useUser();

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <Tooltip title={collapsed ? 'Đăng xuất' : ''} placement="right">
                <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faSignOutAlt} className="text-gray-400" />}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center hover:bg-gray-700"
                >
                    {!collapsed && <span className="ml-2 text-gray-400">Đăng xuất</span>}
                </Button>
            </Tooltip>
        </div>
    );
});

SidebarFooter.displayName = 'SidebarFooter';

export default SidebarFooter;
