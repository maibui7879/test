import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@contexts/useAuth/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NotFoundPage = () => {
    const { user } = useUser();

    const getMessage = () => {
        if (!user) {
            return {
                title: 'Bạn chưa đăng nhập!',
                description: 'Vui lòng đăng nhập để tiếp tục sử dụng hệ thống',
            };
        }
        return {
            title: 'Trang không tồn tại!',
            description: 'Vui lòng kiểm tra lại đường dẫn',
        };
    };

    const message = getMessage();

    return (
        <main
            className="fixed inset-0 grid place-items-center px-6 py-24 sm:py-32 lg:px-8"
            style={{
                backgroundImage:
                    'url("https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                width: '100vw',
            }}
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="text-center relative z-10">
                <p className="text-base font-semibold text-white">404</p>
                <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                    {message.title}
                </h1>
                <p className="mt-6 text-pretty text-lg font-medium text-gray-200 sm:text-xl/8">{message.description}</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Lượn về đăng nhập đê
                    </Link>
                    {user && (
                        <Link to="/dashboard" className="text-sm font-semibold text-white hover:text-gray-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Về trang chủ
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
};

export default NotFoundPage;
