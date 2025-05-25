// Overlay.tsx
import React from 'react';

interface OverlayProps {
    isLoginActive: boolean;
    toggleActive: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isLoginActive, toggleActive }) => {
    return (
        <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-indigo-600 text-white
        rounded-r-lg
        flex flex-col items-center justify-center
        text-center p-10
        cursor-pointer
        transition-all duration-700 ease-in-out
        ${isLoginActive ? 'left-1/2' : 'left-0'}`}
            onClick={toggleActive}
        >
            {isLoginActive ? (
                <>
                    <h2 className="text-3xl font-bold mb-4">Chưa có tài khoản?</h2>
                    <p className="mb-8">Đăng ký ngay để trải nghiệm nhiều tính năng hấp dẫn!</p>
                    <button className="px-8 py-3 border border-white rounded hover:bg-white hover:text-indigo-600 transition">
                        Đăng ký
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold mb-4">Đã có tài khoản?</h2>
                    <p className="mb-8">Đăng nhập để tiếp tục sử dụng dịch vụ.</p>
                    <button className="px-8 py-3 border border-white rounded hover:bg-white hover:text-indigo-600 transition">
                        Đăng nhập
                    </button>
                </>
            )}
        </div>
    );
};

export default Overlay;
