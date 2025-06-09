import React from 'react';

interface OverlayProps {
    isLoginActive: boolean;
    toggleActive: () => void;
}

const Overlay = ({ isLoginActive, toggleActive }: OverlayProps) => {
    return (
        <div
            className={`relative md:absolute top-0 bottom-0 left-0 md:left-auto md:right-0 w-full md:w-1/2
      bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg md:rounded-l-lg md:rounded-r-none
      flex flex-col items-center justify-center text-center p-6 md:p-8 cursor-pointer
      transition-all duration-700 ease-in-out
      ${isLoginActive ? 'md:left-1/2 md:rounded-l-lg md:rounded-r-none' : 'md:left-auto md:right-0 md:rounded-r-lg md:rounded-l-none'}`}
            onClick={toggleActive}
        >
            {isLoginActive ? (
                <>
                    <h2 className="text-xl md:text-2xl font-bold mb-3">Chưa có tài khoản?</h2>
                    <p className="mb-4 md:mb-6 px-3 md:px-0 text-sm md:text-base">
                        Đăng ký ngay để trải nghiệm nhiều tính năng hấp dẫn!
                    </p>
                    <button className="px-5 md:px-7 py-2 md:py-3 border border-white rounded text-sm md:text-base hover:bg-white hover:text-indigo-600 transition">
                        Đăng ký
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-xl md:text-2xl font-bold mb-3">Đã có tài khoản?</h2>
                    <p className="mb-4 md:mb-6 px-3 md:px-0 text-sm md:text-base">
                        Đăng nhập để tiếp tục sử dụng dịch vụ.
                    </p>
                    <button className="px-5 md:px-7 py-2 md:py-3 border border-white rounded text-sm md:text-base hover:bg-white hover:text-indigo-600 transition">
                        Đăng nhập
                    </button>
                </>
            )}
        </div>
    );
};

export default Overlay;
