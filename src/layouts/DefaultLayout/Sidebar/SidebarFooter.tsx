import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import { SidebarFooterProps } from './type';

function SidebarFooter({ onLogout, className = '', renderLogoutButton, renderLogoutModal }: SidebarFooterProps) {
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-red-500/20 text-red-400"
        >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
            <span className="hidden xl:inline select-none font-medium">Đăng xuất</span>
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
            className="custom-modal"
        >
            <p className="text-gray-700">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        </Modal>
    );

    return (
        <div className={`py-4 px-2 border-t border-gray-700 ${className}`}>
            {renderLogoutButton ? renderLogoutButton(showModal) : defaultLogoutButton}
            {renderLogoutModal ? renderLogoutModal(isModalOpen, handleOk, handleCancel) : defaultLogoutModal}
        </div>
    );
}

export default SidebarFooter;
