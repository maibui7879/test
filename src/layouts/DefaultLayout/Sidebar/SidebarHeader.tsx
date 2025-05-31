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
    const defaultAvatar = (
        <div className="bg-gray-700 rounded-full p-1 transform transition-transform duration-300 hover:scale-105">
            <FaIcon icon={FaUserCircle} className="md:w-14 md:h-14 h-8 w-8 text-gray-200" />
        </div>
    );

    const defaultUserInfo = (
        <>
            <div className="text-white font-semibold text-lg tracking-wide transform transition-all duration-300 hover:translate-x-1">
                {user?.full_name || 'Người dùng'}
            </div>
            <div className="text-gray-300 text-sm truncate">{user?.email || ''}</div>
        </>
    );

    const renderAvatarContent = () => {
        if (renderAvatar) return renderAvatar(user || {});
        if (user?.avatar_url) {
            return (
                <div className="bg-gray-700 rounded-full p-1 transform transition-transform duration-300 hover:scale-105">
                    <img
                        src={
                            typeof user.avatar_url === 'string' ? user.avatar_url : URL.createObjectURL(user.avatar_url)
                        }
                        alt="Avatar"
                        className="md:w-14 md:h-14 h-10 w-10 rounded-full object-cover border-2 border-gray-500"
                    />
                </div>
            );
        }
        return defaultAvatar;
    };

    return (
        <div className={`flex items-center gap-4 px-4 pb-6 border-b border-gray-700 w-full ${className}`}>
            {renderAvatarContent()}
            <div className="flex-1 hidden xl:block">
                {renderUserInfo ? renderUserInfo(user || {}) : defaultUserInfo}
            </div>
        </div>
    );
}

export default SidebarHeader;
