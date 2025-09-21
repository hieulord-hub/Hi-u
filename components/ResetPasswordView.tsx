
import React from 'react';
import { View } from '../types';

interface ResetPasswordViewProps {
    onNavigate: (view: View) => void;
}

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gradient-to-b from-black/10 to-transparent backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl text-center relative">
                <h1 className="text-3xl font-bold text-white mb-2">Quên mật khẩu?</h1>
                <p className="text-gray-200 mb-8">Nhập email hoặc MSV của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); onNavigate(View.PasswordResetSent); }}>
                    <div className="text-left mb-6">
                         <label htmlFor="reset-email" className="block mb-1 text-sm font-semibold text-gray-200">
                            Email hoặc Mã sinh viên
                        </label>
                        <input
                            id="reset-email"
                            type="text"
                            placeholder="sinhvien@ftu.edu.vn hoặc 21..."
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Gửi hướng dẫn
                    </button>
                </form>

                <p className="text-sm text-gray-200 mt-6">
                    <button onClick={() => onNavigate(View.Login)} className="font-semibold text-red-300 hover:text-red-200 hover:underline focus:outline-none">
                        Quay lại Đăng nhập
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordView;
