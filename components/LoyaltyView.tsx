import React from 'react';

const LoyaltyView: React.FC = () => {
    const signatureStamps = [
        { name: 'Kem Bia Đá', collected: true, icon: 'fa-ice-cream' },
        { name: 'Soda Đỏ FTU', collected: true, icon: 'fa-cocktail' },
        { name: 'Bánh Quy D201', collected: false, icon: 'fa-cookie-bite' },
        { name: 'Deadline Coffee', collected: false, icon: 'fa-coffee' },
        { name: 'Soup Hồi Sinh', collected: false, icon: 'fa-concierge-bell' }
    ];
    
    const ActivityItem: React.FC<{ icon: string; text: string; points: string; }> = ({ icon, text, points }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
                <i className={`fas ${icon} w-6 text-center text-gray-500 mr-3`}></i>
                <span className="text-gray-700">{text}</span>
            </div>
            <span className="font-bold text-red-600">{points}</span>
        </div>
    );

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Chương trình Loyalty FTU</h2>

            {/* Tích điểm đổi quà */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <i className="fas fa-star-half-alt text-red-500 mr-3"></i>
                    Tích Điểm Đổi Quà
                </h3>
                
                <div className="space-y-2 mb-4">
                    <ActivityItem icon="fa-utensils" text="Mua combo signature" points="+1 điểm" />
                    <ActivityItem icon="fa-camera-retro" text="Check-in mạng xã hội" points="+2 điểm" />
                    <ActivityItem icon="fa-pen-fancy" text="Review món + tag fanpage" points="Quà đặc biệt" />
                </div>
                
                <div className="text-center bg-red-50 p-6 rounded-lg mb-4">
                    <p className="text-gray-600">Điểm của bạn</p>
                    <p className="text-6xl font-bold text-red-600 my-2">3 <span className="text-2xl">điểm</span></p>
                    <p className="text-gray-500">Tích đủ 5 điểm để đổi quà nhé!</p>
                </div>
                
                <h4 className="font-semibold text-gray-600 mb-2">Mốc phần thưởng:</h4>
                <ul className="list-disc list-inside text-gray-500 space-y-1">
                    <li><span className="font-semibold text-gray-700">5 điểm:</span> Đổi 1 topping / sticker / tích điểm rèn luyện.</li>
                    <li><span className="font-semibold text-gray-700">Phần thưởng khác:</span> Voucher giảm 10%, quà FTU (merch, huy hiệu)...</li>
                </ul>
            </div>

            {/* Daily Streak */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <i className="fas fa-fire-alt text-red-500 mr-3"></i>
                    Chuỗi Check-in Hàng ngày
                </h3>
                <div className="text-center bg-red-50 p-6 rounded-lg">
                    <p className="text-gray-600">Bạn đã check-in</p>
                    <p className="text-6xl font-bold text-red-600 my-2">3 <span className="text-2xl">ngày</span></p>
                    <p className="text-gray-500">Check-in 5 ngày liên tiếp để nhận voucher giảm 10%!</p>
                </div>
            </div>

            {/* Signature Stamp Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <i className="fas fa-stamp text-red-500 mr-3"></i>
                    Sưu tầm Signature
                </h3>
                <p className="text-gray-500 mb-4">Thưởng thức đủ 5 món trong bộ sưu tập FTU Signature & Mood Food để nhận <span className="font-bold text-red-600">1 phần ăn signature miễn phí!</span></p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {signatureStamps.map((stamp, index) => (
                        <div 
                            key={index} 
                            className={`border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-center p-2 transition-all duration-300 ${
                                stamp.collected 
                                ? 'border-red-300 bg-red-50 text-red-600 transform scale-105 shadow-sm' 
                                : 'border-gray-300 text-gray-400'
                            }`}
                        >
                            {stamp.collected ? (
                                <>
                                    <i className={`fas ${stamp.icon} text-4xl`}></i>
                                    <span className="text-xs mt-2 font-semibold">{stamp.name}</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-question text-2xl"></i>
                                     <span className="text-xs mt-2 font-semibold text-gray-500">{stamp.name}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoyaltyView;
