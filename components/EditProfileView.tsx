
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditProfileViewProps {
    user: User | null;
    onSave: (updatedUser: User) => void;
    onBack: () => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onSave, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [studentId, setStudentId] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setStudentId(user.studentId || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    if (!user) {
        return (
            <div className="p-4 text-center">
                <p>Không tìm thấy thông tin người dùng.</p>
                <button onClick={onBack} className="text-red-500 mt-4">Quay lại</button>
            </div>
        );
    }
    
    const handleChangeAvatar = () => {
        const randomId = Math.random().toString(36).substring(7);
        setAvatarUrl(`https://i.pravatar.cc/150?u=${randomId}`);
    };

    const handleSave = () => {
        const updatedUser: User = { ...user, name, email, phone, studentId, avatarUrl };
        onSave(updatedUser);
    };

    return (
        <div className="h-full bg-white flex flex-col font-sans">
            <header className="p-4 flex items-center border-b flex-shrink-0">
                <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-gray-100 transition-colors" aria-label="Quay lại">
                    <i className="fas fa-arrow-left text-xl text-gray-700"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
            </header>
            <main className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col items-center mb-8">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover mb-4 shadow-md" />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-red-500 text-white flex items-center justify-center mb-4">
                                <span className="text-5xl font-bold">{name.charAt(0)}</span>
                            </div>
                        )}
                        <button type="button" onClick={handleChangeAvatar} className="text-sm font-semibold text-red-600 hover:underline">
                            Thay đổi ảnh đại diện
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">Họ và tên</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                            />
                        </div>
                         <div>
                            <label htmlFor="studentId" className="block mb-2 text-sm font-semibold text-gray-700">Mã sinh viên</label>
                            <input
                                id="studentId"
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="Ví dụ: 2112345678"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                            />
                        </div>
                    </form>
                </div>
            </main>
            <footer className="p-4 border-t bg-white shadow-inner flex-shrink-0">
                <button
                    onClick={handleSave}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
                >
                    Lưu thay đổi
                </button>
            </footer>
        </div>
    );
};

export default EditProfileView;
