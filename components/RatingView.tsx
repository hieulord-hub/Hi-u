import React, { useState } from 'react';
import { Order } from '../types';

interface RatingViewProps {
    order: Order | null;
    onSubmitRating: () => void;
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex justify-center text-4xl text-gray-300 mb-6 space-x-2">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        className="focus:outline-none transition-transform transform hover:scale-125"
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <i className={`fas fa-star ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                    </button>
                );
            })}
        </div>
    );
};

const Tag: React.FC<{ label: string, isSelected: boolean, onClick: () => void }> = ({ label, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);


const RatingView: React.FC<RatingViewProps> = ({ order, onSubmitRating }) => {
    const [serviceRating, setServiceRating] = useState(0);
    const [shipperRating, setShipperRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tag)) {
                newSet.delete(tag);
            } else {
                newSet.add(tag);
            }
            return newSet;
        });
    };
    
    const feedbackTags = ["Ngon miệng", "Giao hàng nhanh", "Shipper thân thiện", "Đóng gói đẹp", "Giá cả hợp lý"];

    if (!order) {
        return <div className="p-4 text-center">Không tìm thấy thông tin đơn hàng để đánh giá.</div>;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Đánh giá đơn hàng</h2>
            <p className="text-gray-500 mb-6 text-center">Mã đơn: {order.id}</p>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={(e) => { e.preventDefault(); onSubmitRating(); }}>
                    {/* Service Rating */}
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Chất lượng dịch vụ</h3>
                    <StarRating rating={serviceRating} setRating={setServiceRating} />

                    {/* Shipper Rating */}
                    {order.shipper && (
                         <>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Tài xế {order.shipper.name}</h3>
                            <div className="flex justify-center mb-4">
                                <img src={order.shipper.avatarUrl} alt={order.shipper.name} className="w-16 h-16 rounded-full border-2 border-red-200" />
                            </div>
                            <StarRating rating={shipperRating} setRating={setShipperRating} />
                         </>
                    )}
                    
                    {/* Feedback Tags */}
                     <h3 className="text-lg font-semibold text-gray-700 mb-3">Cho chúng tôi biết thêm nhé</h3>
                     <div className="flex flex-wrap gap-2 mb-6">
                        {feedbackTags.map(tag => (
                           <Tag key={tag} label={tag} isSelected={selectedTags.has(tag)} onClick={() => toggleTag(tag)} />
                        ))}
                     </div>


                    {/* Comment Box */}
                    <label htmlFor="feedback-comment" className="text-lg font-semibold text-gray-700 mb-2 block">Bình luận</label>
                    <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Hãy chia sẻ cảm nhận của bạn..."
                    ></textarea>

                    <button
                        type="submit"
                        disabled={serviceRating === 0 || shipperRating === 0}
                        className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Gửi đánh giá
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RatingView;