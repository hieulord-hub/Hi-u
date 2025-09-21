
import React from 'react';
import { View } from '../types';

interface PasswordResetSentViewProps {
    onNavigate: (view: View) => void;
}

const PasswordResetSentView: React.FC<PasswordResetSentViewProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gradient-to-b from-black/10 to-transparent backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                     <i className="fas fa-paper-plane text-4xl text-green-300"></i>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Đã gửi yêu cầu!</h1>
                <p className="text-gray-200 mb-8">Vui lòng kiểm tra email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
                
                <button
                    onClick={() => onNavigate(View.Login)}
                    className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                    Quay lại Đăng nhập
                </button>
            </div>
        </div>
    );
};

export default PasswordResetSentView;
