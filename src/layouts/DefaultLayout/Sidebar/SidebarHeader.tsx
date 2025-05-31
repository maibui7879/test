import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import FaIcon from '@/utils/FaIconUtils';

interface User {
    avatar_url?: string | File;
    full_name?: string;
    email?: string;
}

interface SidebarHeaderProps {
    user?: User;
    className?: string;
    renderAvatar?: (user: User) => React.ReactNode;
    renderUserInfo?: (user: User) => React.ReactNode;
}

function SidebarHeader({ user, className = '', renderAvatar, renderUserInfo }: SidebarHeaderProps) {
    const defaultAvatar = <FaIcon icon={FaUserCircle} className="md:w-16 md:h-16 h-8 w-8 text-gray-400" />;

    const defaultUserInfo = (
        <>
            <div className="text-white font-semibold text-2xl">{user?.full_name || 'Người dùng'}</div>
            <div className="text-gray-400 text-xl truncate">{user?.email || ''}</div>
        </>
    );

    const renderAvatarContent = () => {
        if (renderAvatar) return renderAvatar(user || {});
        if (user?.avatar_url) {
            return (
                <img
                    src={typeof user.avatar_url === 'string' ? user.avatar_url : URL.createObjectURL(user.avatar_url)}
                    alt="Avatar"
                    className="md:w-16 md:h-16 h-12 w-12 rounded-full object-cover"
                />
            );
        }
        return defaultAvatar;
    };

    return (
        <div className={`flex items-center gap-3 px-4 pb-6 border-b border-gray-700 w-full ${className}`}>
            {renderAvatarContent()}
            <div className="flex-1 hidden xl:block">
                {renderUserInfo ? renderUserInfo(user || {}) : defaultUserInfo}
            </div>
        </div>
    );
}

export default SidebarHeader;
