import React from 'react';
import { useUser } from '../../../contexts/useAuth/userContext';
import { FaUserCircle } from 'react-icons/fa';
import FaIcon from '../../../utils/FaIconUtils';
const SidebarHeader = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-3 px-4 pb-6 border-b border-gray-700">
      {user?.avatar_url ? (
        <img
        src={
            typeof user.avatar_url === 'string'
            ? user.avatar_url
            : URL.createObjectURL(user.avatar_url)
        }
        alt="Avatar"
        className="md:w-16 md:h-16 h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <FaIcon icon={FaUserCircle} className="md:w-16 md:h-16 h-8 w-8 text-gray-400" />
      )}
      <div className="flex-1 hidden xl:block">
        <div className="text-white font-semibold text-2xl">{user?.full_name || 'Người dùng'}</div>
        <div className="text-gray-400 text-xl truncate">{user?.email || ''}</div>
      </div>
    </div>
  );
};

export default SidebarHeader;
