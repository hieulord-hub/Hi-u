
import React from 'react';

interface VerifyViewProps {
    onVerify: () => void;
    onBack: () => void;
}

const VerifyView: React.FC<VerifyViewProps> = ({ onVerify, onBack }) => {
    
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const form = target.form;
        if (!form) return;

        const nextElement = form.elements[Array.prototype.indexOf.call(form, target) + 1] as HTMLInputElement | null;
        
        if (nextElement && target.value.length === target.maxLength) {
            nextElement.focus();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gradient-to-b from-black/10 to-transparent backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl text-center relative">
                 <button onClick={onBack} className="absolute top-4 left-4 text-gray-200 hover:text-white" aria-label="Quay lại">
                    <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <h1 className="text-3xl font-bold text-white mb-2 mt-8">Xác thực tài khoản</h1>
                <p className="text-gray-200 mb-8">Nhập mã 6 chữ số đã được gửi đến điện thoại của bạn.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); onVerify(); }}>
                    <div className="flex justify-center gap-2 mb-8">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="tel"
                                maxLength={1}
                                onKeyUp={handleKeyUp}
                                className="w-12 h-14 text-center text-2xl font-bold border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white"
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Xác nhận
                    </button>
                </form>

                <p className="text-sm text-gray-200 mt-6">
                    Không nhận được mã? <button className="font-semibold text-red-300 hover:text-red-200 hover:underline focus:outline-none">Gửi lại</button>
                </p>
            </div>
        </div>
    );
};

export default VerifyView;