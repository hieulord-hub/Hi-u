import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingViewProps {
    order: Order | null;
    onNewOrder: () => void;
    onChat: () => void;
    onRateOrder: () => void;
}

const StatusStep: React.FC<{ icon: string; label: string; isActive: boolean; isCompleted: boolean; }> = ({ icon, label, isActive, isCompleted }) => (
    <div className="relative flex flex-col items-center w-1/4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted || isActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <p className={`mt-2 font-semibold text-center text-sm ${isCompleted || isActive ? 'text-red-600' : 'text-gray-500'}`}>{label}</p>
        {isActive && <div className="absolute top-3 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>}
    </div>
);

const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onNewOrder, onChat, onRateOrder }) => {
    if (!order) {
        return (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
                <button onClick={onNewOrder} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                    Đặt đơn hàng mới
                </button>
            </div>
        );
    }

    const statuses = [OrderStatus.Confirmed, OrderStatus.Preparing, OrderStatus.Delivering, OrderStatus.Completed];
    const currentStatusIndex = statuses.indexOf(order.status);
    const isOrderCompleted = order.status === OrderStatus.Completed;

    const getProgressWidth = () => {
        if (currentStatusIndex < 0) return '0%';
        const percentage = (currentStatusIndex / (statuses.length - 1)) * 100;
        return `${percentage}%`;
    };
    
    const showShipperInfo = currentStatusIndex >= 2;

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {isOrderCompleted ? "Giao hàng thành công!" : "Theo dõi đơn hàng"}
                    </h2>
                     <p className="text-gray-500 mb-8">
                        {isOrderCompleted ? "Cảm ơn bạn đã đặt hàng tại FTU YUM" : `Mã đơn hàng: `}
                        {!isOrderCompleted && <span className="font-semibold text-red-600">{order.id}</span>}
                    </p>
                </div>

                <div className="relative my-10">
                    <div className="absolute left-0 top-6 w-full h-1 bg-gray-200"></div>
                    <div
                        className="absolute left-0 top-6 h-1 bg-red-500 transition-all duration-500 ease-out"
                        style={{ width: getProgressWidth() }}
                    ></div>
                    <div className="relative flex justify-between">
                        <StatusStep icon="fa-check" label={OrderStatus.Confirmed} isActive={currentStatusIndex === 0} isCompleted={currentStatusIndex > 0} />
                        <StatusStep icon="fa-utensils" label={OrderStatus.Preparing} isActive={currentStatusIndex === 1} isCompleted={currentStatusIndex > 1} />
                        <StatusStep icon="fa-motorcycle" label={OrderStatus.Delivering} isActive={currentStatusIndex === 2} isCompleted={currentStatusIndex > 2} />
                        <StatusStep icon="fa-gift" label={OrderStatus.Completed} isActive={currentStatusIndex === 3} isCompleted={currentStatusIndex >= 3} />
                    </div>
                </div>

                {showShipperInfo && order.shipper && !isOrderCompleted && (
                    <div className="mt-10 p-4 border-t-2 border-dashed">
                         <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Tài xế đang giao hàng</h3>
                         <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <img src={order.shipper.avatarUrl} alt="Shipper" className="w-14 h-14 rounded-full mr-4 border-2 border-red-200" />
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{order.shipper.name}</p>
                                    <p className="text-sm text-gray-500">Đang đến chỗ bạn!</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <a href={`tel:${order.shipper.phone}`} className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                                    <i className="fas fa-phone-alt text-xl"></i>
                                </a>
                                <button onClick={onChat} className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                    <i className="fas fa-comment-dots text-xl"></i>
                                </button>
                            </div>
                         </div>
                    </div>
                )}
                
                {isOrderCompleted ? (
                    <div className="text-center mt-8">
                        <button
                            onClick={onRateOrder}
                            className="w-full mb-4 bg-yellow-400 text-gray-800 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors text-lg"
                        >
                            <i className="fas fa-star mr-2"></i>Đánh giá ngay
                        </button>
                        <button
                            onClick={onNewOrder}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
                        >
                            Đặt đơn hàng mới
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onNewOrder}
                        className="w-full mt-8 bg-red-100 text-red-700 font-bold py-3 rounded-lg hover:bg-red-200 transition-colors text-lg"
                    >
                        Đặt đơn hàng mới
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderTrackingView;