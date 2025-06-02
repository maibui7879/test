function Dashboard() {
    return (
        <>
            <div className="flex">
                {/* Sidebar for Desktop */}
                <div className="hidden md:block w-64 h-screen bg-indigo-800 text-white p-4">
                    {/* Logo */}
                    <div className="mb-6">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm1-3.07c-2.24 0-4-1.76-4-4 0-2.24 1.76-4 4-4s4 1.76 4 4c0 2.24-1.76 4-4 4z" />
                        </svg>
                    </div>

                    {/* Menu Items */}
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">5</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 14a2 2 0 012-2h8a2 2 0 012 2v2H4v-2z" />
                            </svg>
                            <span>Team</span>
                        </li>
                        <li className="flex items-center justify-between p-2 hover:bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z" />
                                </svg>
                                <span>Projects</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">12</span>
                        </li>
                        <li className="flex items-center justify-between p-2 hover:bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v12h8V4H6zm2 2h4v2H8V6zm0 4h4v2H8v-2zm0 4h4v2H8v-2z" />
                                </svg>
                                <span>Calendar</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">20+</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z" />
                            </svg>
                            <span>Documents</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-2-4l2-2 2 2V8H8v4z" />
                            </svg>
                            <span>Reports</span>
                        </li>
                    </ul>

                    {/* Teams Section */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold uppercase">Your teams</h3>
                        <ul className="mt-2 space-y-2">
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    H
                                </span>
                                <span>Heroicons</span>
                            </li>
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    T
                                </span>
                                <span>Tailwind Labs</span>
                            </li>
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    W
                                </span>
                                <span>Workcation</span>
                            </li>
                        </ul>
                    </div>

                    {/* User Profile */}
                    <div className="absolute bottom-4 flex items-center space-x-2">
                        <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="User" />
                        <span>Tom Cook</span>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden fixed top-0 left-0 p-4">
                    <button id="menu-btn" className="text-indigo-800 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Sidebar */}
                <div id="mobile-menu" className="hidden md:hidden fixed inset-0 bg-indigo-800 text-white p-4 z-50">
                    <div className="flex justify-between items-center mb-6">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm1-3.07c-2.24 0-4-1.76-4-4 0-2.24 1.76-4 4-4s4 1.76 4 4c0 2.24-1.76 4-4 4z" />
                        </svg>
                        <button id="close-btn" className="text-white focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">5</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 14a2 2 0 012-2h8a2 2 0 012 2v2H4v-2z" />
                            </svg>
                            <span>Team</span>
                        </li>
                        <li className="flex items-center justify-between p-2 hover:bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z" />
                                </svg>
                                <span>Projects</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">12</span>
                        </li>
                        <li className="flex items-center justify-between p-2 hover:bg-indigo-600 rounded">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v12h8V4H6zm2 2h4v2H8V6zm0 4h4v2H8v-2zm0 4h4v2H8v-2z" />
                                </svg>
                                <span>Calendar</span>
                            </div>
                            <span className="bg-indigo-500 text-white rounded-full px-2 py-1 text-xs">20+</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4h12v12H4V4zm2 2v8h8V6H6z" />
                            </svg>
                            <span>Documents</span>
                        </li>
                        <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-2-4l2-2 2 2V8H8v4z" />
                            </svg>
                            <span>Reports</span>
                        </li>
                    </ul>

                    <div className="mt-8">
                        <h3 className="text-sm font-semibold uppercase">Your teams</h3>
                        <ul className="mt-2 space-y-2">
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    H
                                </span>
                                <span>Heroicons</span>
                            </li>
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    T
                                </span>
                                <span>Tailwind Labs</span>
                            </li>
                            <li className="flex items-center space-x-2 p-2 hover:bg-indigo-600 rounded">
                                <span className="bg-indigo-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                    W
                                </span>
                                <span>Workcation</span>
                            </li>
                        </ul>
                    </div>

                    <div className="absolute bottom-4 flex items-center space-x-2">
                        <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="User" />
                        <span>Tom Cook</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Main Content</h1>
                    <p>This is the main content area. It will adjust based on the sidebar visibility.</p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
