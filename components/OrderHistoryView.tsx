import React from 'react';
import { Order, OrderStatus, CartItem } from '../types';

interface OrderHistoryViewProps {
    orders: Order[];
    onReorder: (items: CartItem[]) => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        [OrderStatus.Completed]: 'bg-green-100 text-green-800',
        [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
        [OrderStatus.Delivering]: 'bg-blue-100 text-blue-800',
        [OrderStatus.Preparing]: 'bg-yellow-100 text-yellow-800',
        [OrderStatus.Confirmed]: 'bg-purple-100 text-purple-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, onReorder }) => {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lịch sử mua hàng</h2>
            {orders.length === 0 ? (
                <div className="text-center py-10">
                    <i className="fas fa-history text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-gray-800">Mã đơn: <span className="text-red-600">{order.id}</span></p>
                                    <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString('vi-VN')}</p>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="border-t border-b border-dashed py-3 my-3 space-y-2">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center text-sm">
                                        <p className="text-gray-600"><span className="font-semibold">{item.quantity}x</span> {item.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-800">
                                    Tổng: {(order.finalTotal ?? order.total).toLocaleString('vi-VN')}đ
                                </span>
                                {order.status === OrderStatus.Completed && (
                                    <button
                                        onClick={() => onReorder(order.items)}
                                        className="bg-red-50 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                    >
                                        <i className="fas fa-redo-alt mr-2"></i>Đặt lại
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryView;
