
import React from 'react';
import { CartItem, View } from '../types';

interface CartViewProps {
    cartItems: CartItem[];
    updateCartQuantity: (itemId: number, quantity: number) => void;
    onCheckout: () => void;
    onNavigate: (view: View) => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, updateCartQuantity, onCheckout, onNavigate }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Giỏ hàng của bạn</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md mt-8">
                    <i className="fas fa-shopping-basket text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống.</p>
                    <button 
                        onClick={() => onNavigate(View.Home)}
                        className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors text-lg"
                    >
                        Khám phá thực đơn
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex bg-white p-4 rounded-lg shadow-md items-start relative transition-shadow duration-300 hover:shadow-xl">
                                <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-24 rounded-md object-cover mr-4" />
                                <div className="flex-grow flex flex-col justify-between h-24">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 leading-tight pr-8">{item.name}</h3>
                                        <p className="text-red-600 font-semibold text-md mt-1">{item.price.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <div className="flex items-center space-x-2 border border-gray-200 rounded-full p-1 w-fit">
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Giảm số lượng">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="font-bold w-8 text-center text-gray-800" aria-live="polite">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Tăng số lượng">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => updateCartQuantity(item.id, 0)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50" aria-label={`Xóa ${item.name} khỏi giỏ hàng`}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Tóm tắt đơn hàng</h3>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium text-gray-800">{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Giảm giá:</span>
                                    <span className="font-medium text-gray-800">0đ</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed my-3 pt-3 flex justify-between items-center text-xl font-bold">
                                <span className="text-gray-700">Tổng cộng:</span>
                                <span className="text-red-600">{total.toLocaleString('vi-VN')}đ</span>
                            </div>
                            
                            <button
                                onClick={onCheckout}
                                className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Thanh toán <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartView;
