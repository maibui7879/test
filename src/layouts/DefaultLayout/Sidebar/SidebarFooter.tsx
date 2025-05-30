import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import FaIcon from '../../../utils/FaIconUtils';
import { Modal } from 'antd';

interface SidebarFooterProps {
    onLogout?: () => void;
    className?: string;
    renderLogoutButton?: (onClick: () => void) => React.ReactNode;
    renderLogoutModal?: (isOpen: boolean, onOk: () => void, onCancel: () => void) => React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
    onLogout,
    className = '',
    renderLogoutButton,
    renderLogoutModal,
}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);

    const handleOk = () => {
        onLogout?.();
        setIsModalOpen(false);
        navigate('/auth');
    };

    const handleCancel = () => setIsModalOpen(false);

    const defaultLogoutButton = (
        <button
            onClick={showModal}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 hover:font-medium"
        >
            <FaIcon icon={FaSignOutAlt} className="text-lg" />
            <span className="hidden xl:inline select-none">Đăng xuất</span>
        </button>
    );

    const defaultLogoutModal = (
        <Modal
            title="Xác nhận đăng xuất"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
        >
            <p>Bạn chắc chắn muốn đăng xuất?</p>
        </Modal>
    );

    return (
        <div className={`py-8 px-2 text-red-400 border-t border-gray-600 ${className}`}>
            {renderLogoutButton ? renderLogoutButton(showModal) : defaultLogoutButton}
            {renderLogoutModal ? renderLogoutModal(isModalOpen, handleOk, handleCancel) : defaultLogoutModal}
        </div>
    );
};

export default SidebarFooter;
