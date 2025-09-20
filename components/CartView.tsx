
import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
    cartItems: CartItem[];
    updateCartQuantity: (itemId: number, quantity: number) => void;
    onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, updateCartQuantity, onCheckout }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Giỏ hàng của bạn</h2>
            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <i className="fas fa-shopping-basket text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow">
                            <img src={item.imageUrls[0]} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                <p className="text-red-600 font-semibold">{item.price.toLocaleString('vi-VN')}đ</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">-</button>
                                <span className="font-bold w-8 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">+</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 pt-4 border-t-2 border-dashed">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span className="text-gray-600">Tổng cộng:</span>
                            <span className="text-red-600">{total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartView;