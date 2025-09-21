import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CartItem, User, Voucher } from '../types';
import { sampleVouchers } from '../constants';


interface PaymentViewProps {
    cartItems: CartItem[];
    placeOrder: (paymentMethod: string, note: string, total: number, discount: number, finalTotal: number) => void;
    user: User | null;
    onBack: () => void;
}

const VoucherModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onApply: (voucher: Voucher) => void;
    total: number;
    cartItems: CartItem[];
}> = ({ isOpen, onClose, onApply, total, cartItems }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleApply = () => {
        const voucher = sampleVouchers.find(v => v.id === selectedId);
        if (voucher) {
            onApply(voucher);
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-end justify-center" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="voucher-modal-title"
        >
            <div className="bg-white w-full max-w-2xl rounded-t-2xl p-5 transform transition-transform translate-y-0" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-4">
                    <h3 id="voucher-modal-title" className="text-xl font-bold text-gray-800">Chọn Voucher</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Đóng"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {sampleVouchers.map(voucher => {
                        const isEligible = 
                            (!voucher.minOrder || total >= voucher.minOrder) &&
                            (!voucher.applicableItemId || cartItems.some(item => item.id === voucher.applicableItemId));

                        return (
                             <div key={voucher.id} className={`flex items-center p-3 border rounded-lg ${!isEligible ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}>
                                <div className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-500 flex items-center justify-center rounded-lg mr-4">
                                    <i className="fas fa-ticket-alt text-2xl"></i>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-gray-800">{voucher.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {voucher.minOrder ? `Đơn tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}đ` : 'Không cần đơn tối thiểu'}
                                        {voucher.applicableItemId ? `. Chỉ áp dụng cho món cụ thể.` : ''}
                                    </p>
                                </div>
                                <input 
                                    type="radio" 
                                    name="voucher" 
                                    value={voucher.id}
                                    checked={selectedId === voucher.id}
                                    onChange={() => setSelectedId(voucher.id)}
                                    disabled={!isEligible}
                                    className="form-radio h-5 w-5 text-red-600 focus:ring-red-500"
                                />
                            </div>
                        )
                    })}
                </div>
                 <button 
                    onClick={handleApply}
                    disabled={!selectedId}
                    className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg disabled:bg-gray-300"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};


const PaymentView: React.FC<PaymentViewProps> = ({ cartItems, placeOrder, user, onBack }) => {
    const [selectedMethod, setSelectedMethod] = useState('Cash');
    const [orderNote, setOrderNote] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('Nhà D - FTU, Khuôn viên trường ĐH Ngoại thương');
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

    const discount = useMemo(() => {
        if (!selectedVoucher) return 0;
        
        // Double-check eligibility in case cart changed after applying
        const isEligible = 
            (!selectedVoucher.minOrder || subtotal >= selectedVoucher.minOrder) &&
            (!selectedVoucher.applicableItemId || cartItems.some(item => item.id === selectedVoucher.applicableItemId));

        if (!isEligible) return 0;

        switch (selectedVoucher.type) {
            case 'freeship':
                return selectedVoucher.value;
            case 'percentage':
                return (subtotal * selectedVoucher.value) / 100;
            case 'fixed':
                return selectedVoucher.value;
            default:
                return 0;
        }
    }, [selectedVoucher, subtotal, cartItems]);
    
    const finalTotal = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
    
     // Auto remove voucher if it becomes invalid
    useEffect(() => {
        if (!selectedVoucher) return;

        const isStillEligible = 
            (!selectedVoucher.minOrder || subtotal >= selectedVoucher.minOrder) &&
            (!selectedVoucher.applicableItemId || cartItems.some(item => item.id === selectedVoucher.applicableItemId));

        if (!isStillEligible) {
            setSelectedVoucher(null);
            // In a real app, you might want to show a toast message here
        }
    }, [subtotal, cartItems, selectedVoucher]);
    
    const handleApplyVoucher = useCallback((voucher: Voucher) => {
        setSelectedVoucher(voucher);
        setIsVoucherModalOpen(false);
    }, []);
    
    const handlePlaceOrder = () => {
        placeOrder(selectedMethod, orderNote, subtotal, discount, finalTotal);
    };

    return (
        <div className="h-full bg-white flex flex-col">
            <header className="p-4 flex items-center border-b flex-shrink-0">
                <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-gray-100 transition-colors">
                    <i className="fas fa-arrow-left text-xl text-gray-700"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Thanh toán</h2>
            </header>

            <main className="flex-grow p-4 overflow-y-auto scrollbar-hide">
                {/* Delivery Address */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Giao đến</h3>
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        placeholder="Nhập địa chỉ giao hàng..."
                    />
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Tóm tắt đơn hàng</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span className="text-gray-600">{item.quantity} x {item.name}</span>
                                <span className="font-medium text-gray-800">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                      </div>
                </div>

                {/* Note for seller */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Ghi chú</h3>
                     <textarea
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        placeholder="Ví dụ: không hành, ít cay..."
                        rows={3}
                    ></textarea>
                </div>
                
                 {/* Voucher */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Voucher</h3>
                    <button onClick={() => setIsVoucherModalOpen(true)} className="w-full bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100">
                       <div className="flex items-center text-left">
                           <i className="fas fa-ticket-alt text-red-500 mr-3 text-xl"></i>
                           {selectedVoucher && discount > 0 ? (
                                <div>
                                    <span className='font-bold text-green-600'>{selectedVoucher.description}</span>
                                    <span className="text-xs text-green-600 block">Bạn đã tiết kiệm {discount.toLocaleString('vi-VN')}đ</span>
                                </div>
                           ) : (
                                <span className='text-gray-700'>Chọn hoặc nhập mã</span>
                           )}
                       </div>
                       <i className="fas fa-chevron-right text-gray-400"></i>
                    </button>
                </div>

                {/* Payment Method */}
                <div>
                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Phương thức thanh toán</h3>
                    <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                            <i className="fas fa-money-bill-wave text-green-500 text-xl mr-4 w-8 text-center"></i>
                            <span className="flex-grow font-semibold text-gray-800">Thanh toán khi nhận hàng</span>
                            <input type="radio" name="payment" value="Cash" checked={selectedMethod === 'Cash'} onChange={(e) => setSelectedMethod(e.target.value)} className="form-radio h-5 w-5 text-red-600"/>
                        </label>
                         <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="h-8 w-8 object-contain mr-4"/>
                            <span className="flex-grow font-semibold text-gray-800">ZaloPay</span>
                             <input type="radio" name="payment" value="ZaloPay" checked={selectedMethod === 'ZaloPay'} onChange={(e) => setSelectedMethod(e.target.value)} className="form-radio h-5 w-5 text-red-600"/>
                        </label>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png" alt="ShopeePay" className="h-8 w-8 object-contain mr-4"/>
                            <span className="flex-grow font-semibold text-gray-800">ShopeePay</span>
                             <input type="radio" name="payment" value="ShopeePay" checked={selectedMethod === 'ShopeePay'} onChange={(e) => setSelectedMethod(e.target.value)} className="form-radio h-5 w-5 text-red-600"/>
                        </label>
                        <div className="border rounded-lg transition-all duration-300">
                            <label className="flex items-center p-4 cursor-pointer">
                                <i className="fas fa-credit-card text-blue-500 text-xl mr-4 w-8 text-center"></i>
                                <span className="flex-grow font-semibold text-gray-800">Thẻ tín dụng/ghi nợ</span>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="Card" 
                                    checked={selectedMethod === 'Card'} 
                                    onChange={(e) => setSelectedMethod(e.target.value)} 
                                    className="form-radio h-5 w-5 text-red-600"
                                />
                            </label>
                            {selectedMethod === 'Card' && (
                                <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
                                    <div>
                                        <label htmlFor="cardName" className="block mb-1 text-xs font-medium text-gray-600">Tên trên thẻ</label>
                                        <input
                                            id="cardName"
                                            name="name"
                                            type="text"
                                            value={cardInfo.name}
                                            onChange={handleCardInfoChange}
                                            placeholder="NGUYEN VAN A"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cardNumber" className="block mb-1 text-xs font-medium text-gray-600">Số thẻ</label>
                                        <input
                                            id="cardNumber"
                                            name="number"
                                            type="text"
                                            value={cardInfo.number}
                                            onChange={handleCardInfoChange}
                                            placeholder="•••• •••• •••• ••••"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="cardExpiry" className="block mb-1 text-xs font-medium text-gray-600">Ngày hết hạn</label>
                                            <input
                                                id="cardExpiry"
                                                name="expiry"
                                                type="text"
                                                value={cardInfo.expiry}
                                                onChange={handleCardInfoChange}
                                                placeholder="MM/YY"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="cardCvc" className="block mb-1 text-xs font-medium text-gray-600">CVC</label>
                                            <input
                                                id="cardCvc"
                                                name="cvc"
                                                type="text"
                                                value={cardInfo.cvc}
                                                onChange={handleCardInfoChange}
                                                placeholder="•••"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>
                </div>

            </main>

            <footer className="p-4 border-t bg-white shadow-inner flex-shrink-0">
                 <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Tạm tính:</span>
                        <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                     <div className="flex justify-between items-center text-green-600">
                        <span>Giảm giá:</span>
                        <span className="font-medium">- {discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                     <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                        <span>Tổng cộng:</span>
                        <span className="text-red-600">{finalTotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors text-lg shadow-lg"
                >
                    Đặt hàng
                </button>
            </footer>
            
            <VoucherModal 
                isOpen={isVoucherModalOpen} 
                onClose={() => setIsVoucherModalOpen(false)} 
                onApply={handleApplyVoucher} 
                total={subtotal}
                cartItems={cartItems}
            />
        </div>
    );
};

export default PaymentView;