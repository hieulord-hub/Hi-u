
import React from 'react';
import { FTU_LOGO_URL } from '../constants';
import { View } from '../types';

interface RegisterViewProps {
    onNavigate: (view: View) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gradient-to-b from-black/10 to-transparent backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <img src={FTU_LOGO_URL} alt="FTU Logo" className="h-20 w-20 mx-auto mb-4 object-cover rounded-full shadow-md" />
                    <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
                    <p className="text-gray-200 mb-8">Bắt đầu trải nghiệm FTU YUM!</p>
                </div>

                <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="fullname" className="block mb-1 text-sm font-semibold text-gray-200">Họ và tên</label>
                        <input
                            id="fullname"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                        />
                    </div>
                     <div>
                        <label htmlFor="studentId" className="block mb-1 text-sm font-semibold text-gray-200">Mã sinh viên</label>
                        <input
                            id="studentId"
                            type="text"
                            placeholder="21xxxxxxxx"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                        />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block mb-1 text-sm font-semibold text-gray-200">Số điện thoại</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="09xxxxxxxx"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="reg_username" className="block mb-1 text-sm font-semibold text-gray-200">Tài khoản</label>
                        <input
                            id="reg_username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="reg_password" className="block mb-1 text-sm font-semibold text-gray-200">Mật khẩu</label>
                        <input
                            id="reg_password"
                            type="password"
                            placeholder="Tạo mật khẩu"
                            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder:text-gray-300"
                        />
                    </div>
                </form>

                <button
                    onClick={() => onNavigate(View.Verify)}
                    className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 mt-8"
                >
                    Đăng ký
                </button>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-200">
                        Đã có tài khoản?{' '}
                        <button onClick={() => onNavigate(View.Login)} className="font-semibold text-red-300 hover:text-red-200 hover:underline focus:outline-none">
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;