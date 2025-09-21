
import React from 'react';
import { FTU_LOGO_URL } from '../constants';
import { View } from '../types';

interface LoginViewProps {
    onLogin: () => void;
    onNavigate: (view: View) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gradient-to-b from-black/10 to-transparent backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <img src={FTU_LOGO_URL} alt="FTU Logo" className="h-24 w-24 mx-auto mb-4 object-cover rounded-full shadow-md" />
                    <h1 className="text-3xl font-bold text-white mb-2">FTU YUM</h1>
                    <p className="text-gray-200 mb-8">Chào mừng bạn đến với hệ thống đặt đồ ăn!</p>
                </div>

                <form className="space-y-4 text-left">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-sm font-semibold text-gray-200">
                            Tài khoản
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Tên đăng nhập (ví dụ: msv_ftu)"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                            defaultValue="sinhvien_ftu"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-200">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                            defaultValue="********"
                        />
                    </div>
                </form>
                
                <div className="text-right mt-4">
                    <button onClick={() => onNavigate(View.ResetPassword)} className="text-sm font-semibold text-red-300 hover:text-red-200 hover:underline focus:outline-none">
                        Quên mật khẩu?
                    </button>
                </div>

                <button
                    onClick={onLogin}
                    className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 mt-4"
                >
                    Đăng nhập
                </button>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-200">
                        Chưa có tài khoản?{' '}
                        <button onClick={() => onNavigate(View.Register)} className="font-semibold text-red-300 hover:text-red-200 hover:underline focus:outline-none">
                            Đăng ký ngay
                        </button>
                    </p>
                </div>
                 <p className="text-xs text-gray-300 mt-6 text-center">
                    Đây là một sản phẩm prototype. Nhấn "Đăng nhập" để tiếp tục.
                </p>
            </div>
        </div>
    );
};

export default LoginView;