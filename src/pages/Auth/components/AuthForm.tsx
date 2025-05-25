import React, { useState } from 'react';
import Login from './login';
import Register from './register';
import Overlay from './Overlay';

const AuthForm: React.FC = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);

    const toggleActive = () => setIsLoginActive((prev) => !prev);

    const switchToLogin = () => setIsLoginActive(true);

    return (
        <div className="relative w-full mx-auto min-h-[600px] bg-white rounded-lg shadow-lg flex overflow-hidden">
            <div
                className={`w-1/2 transition-all duration-700 ease-in-out transform ${
                    isLoginActive ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-75 z-10 pointer-events-none'
                }`}
            >
                <Login />
            </div>

            <div
                className={`w-1/2 transition-all duration-700 ease-in-out transform ${
                    !isLoginActive ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-75 z-10 pointer-events-none'
                }`}
            >
                <Register onRegisterSuccess={switchToLogin} />
            </div>

            <Overlay isLoginActive={isLoginActive} toggleActive={toggleActive} />
        </div>
    );
};

export default AuthForm;
