
import React from 'react';

const PaymentMethodsView: React.FC = () => {
    const savedMethods = [
        { id: 1, type: 'Ví điện tử', detail: 'Momo - **** 1234', icon: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' },
        { id: 2, type: 'Thẻ tín dụng', detail: 'Visa - **** 5678', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png' },
    ];

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Phương thức thanh toán</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Phương thức đã lưu</h3>
                {savedMethods.length > 0 ? (
                    <div className="space-y-3">
                        {savedMethods.map(method => (
                            <div key={method.id} className="flex items-center p-3 border rounded-lg">
                                <img src={method.icon} alt={method.type} className="h-8 w-12 object-contain mr-4"/>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{method.type}</p>
                                    <p className="text-sm text-gray-500">{method.detail}</p>
                                </div>
                                <button className="text-gray-400 hover:text-red-500">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Bạn chưa lưu phương thức thanh toán nào.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-semibold text-gray-700 mb-4">Thêm phương thức mới</h3>
                 <div className="space-y-3">
                     <button className="w-full text-left flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-wallet w-8 text-center text-red-500 mr-3"></i>
                        <span className="font-semibold text-gray-800">Thêm ví điện tử</span>
                        <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                     </button>
                      <button className="w-full text-left flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-credit-card w-8 text-center text-red-500 mr-3"></i>
                        <span className="font-semibold text-gray-800">Thêm thẻ tín dụng/ghi nợ</span>
                         <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default PaymentMethodsView;