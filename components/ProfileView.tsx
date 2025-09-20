
import React from 'react';
import { User, View } from '../types';

interface ProfileViewProps {
    user: User | null;
    onLogout: () => void;
    onNavigate: (view: View) => void;
}

const ProfileOption: React.FC<{icon: string, label: string, view: View, onNavigate: (v: View) => void}> = ({ icon, label, view, onNavigate }) => (
    <button onClick={() => onNavigate(view)} className="w-full text-left flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <i className={`${icon} w-8 text-center text-xl text-red-500 mr-4`}></i>
        <span className="flex-grow font-semibold text-gray-700">{label}</span>
        <i className="fas fa-chevron-right text-gray-400"></i>
    </button>
);


const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onNavigate }) => {
    if (!user) {
        return <div className="p-4 text-center text-gray-500">Không có thông tin người dùng.</div>;
    }

    const profileOptions = [
        { icon: 'fas fa-history', label: 'Lịch sử mua hàng', view: View.OrderHistory },
        { icon: 'fas fa-star', label: 'Khách hàng thân thiết', view: View.Loyalty },
        { icon: 'fas fa-credit-card', label: 'Phương thức thanh toán', view: View.PaymentMethods },
        { icon: 'fas fa-bell', label: 'Thông báo', view: View.Notifications },
        { icon: 'fas fa-question-circle', label: 'FAQs', view: View.FAQs },
        { icon: 'fas fa-comment-dots', label: 'Góp ý', view: View.Feedback },
    ];


    return (
        <div className="p-4 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tài khoản</h2>
             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col items-center mb-6">
                    {user.avatarUrl ? (
                         <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 shadow-md" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center mb-4">
                            <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-700">{user.name}</h3>
                    {user.studentId && <p className="text-sm text-gray-500 mt-1">MSV: {user.studentId}</p>}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <i className="fas fa-envelope w-6 text-gray-400 mr-3"></i>
                        <span className="text-gray-700">{user.email}</span>
                    </div>
                     <div className="flex items-center">
                        <i className="fas fa-phone w-6 text-gray-400 mr-3"></i>
                        <span className="text-gray-700">{user.phone}</span>
                    </div>
                </div>
                 <button 
                    onClick={() => onNavigate(View.EditProfile)}
                    className="w-full mt-8 bg-red-50 text-red-600 font-bold py-3 rounded-lg hover:bg-red-100 transition-colors">
                    Chỉnh sửa thông tin
                </button>
             </div>
             <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-3">
                    {profileOptions.map(option => (
                        <ProfileOption key={option.view} {...option} onNavigate={onNavigate} />
                    ))}
                </div>
             </div>
             <div className="mt-6">
                <button 
                    onClick={onLogout}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Đăng xuất
                </button>
             </div>
        </div>
    );
};

export default ProfileView;
