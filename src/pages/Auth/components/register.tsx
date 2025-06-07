import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { registerApi } from '../../../services/authServices';
import { useUser } from '../../../contexts/useAuth/userContext';

interface RegisterProps {
    onRegisterSuccess: () => void; // Callback khi đăng ký thành công
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate họ và tên
        if (!fullName.trim() || fullName.trim().length < 2) {
            setError('Họ và tên phải có ít nhất 2 ký tự');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không hợp lệ');
            return;
        }

        // Validate mật khẩu độ mạnh
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự, gồm chữ cái và số');
            return;
        }

        // Validate mật khẩu khớp nhau
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp');
            return;
        }

        // Nếu mọi validate đều pass thì tiến hành đăng ký
        setLoading(true);
        try {
            await registerApi(email, password, fullName);
            await login(email, password);

            toast.success('Đăng ký thành công! Chào mừng bạn đến với ứng dụng!', { autoClose: 2000 });

            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại');
            toast.error('Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Đăng ký tài khoản</h2>

                {error && <div className="mb-4 text-red-600 text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white font-semibold ${
                            loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
