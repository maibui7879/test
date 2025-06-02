import React from 'react';
import { useUser } from '@contexts/useAuth/userContext';

function Header() {
    const { user, logout } = useUser();

    const getAvatarUrl = () => {
        if (!user?.avatar_url) {
            return `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}`;
        }
        if (typeof user.avatar_url === 'string') {
            return user.avatar_url;
        }
        // If it's a File object, create a URL for it
        return URL.createObjectURL(user.avatar_url);
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
                        </div>
                        <div className="hidden md:block ml-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300 text-sm font-medium">
                                    Welcome, {user?.full_name || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="sr-only">View notifications</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                />
                            </svg>
                        </button>

                        <div className="relative ml-3">
                            <div>
                                <button
                                    type="button"
                                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src={getAvatarUrl()} alt="" />
                                </button>
                            </div>

                            <div
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                                tabIndex={-1}
                            >
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="user-menu-item-0"
                                >
                                    Your Profile
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="user-menu-item-1"
                                >
                                    Settings
                                </a>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="user-menu-item-2"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
