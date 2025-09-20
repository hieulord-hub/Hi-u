import React from 'react';
import { Campaign } from '../types';

interface OfferDetailViewProps {
    campaign: Campaign | null;
    onBack: () => void;
    onNavigateToMenu: () => void;
}

const OfferDetailView: React.FC<OfferDetailViewProps> = ({ campaign, onBack, onNavigateToMenu }) => {
    if (!campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <i className="fas fa-exclamation-triangle text-5xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Không tìm thấy ưu đãi</h2>
                <button onClick={onBack} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="relative">
                    <img src={campaign.imgUrl} alt={campaign.title} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button 
                        onClick={onBack} 
                        className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-all z-10" 
                        aria-label="Quay lại"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="absolute bottom-0 p-6">
                        <h1 className="text-3xl font-bold text-white shadow-lg">{campaign.title}</h1>
                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Chi tiết chương trình</h2>
                        <p className="text-gray-600 leading-relaxed">{campaign.details}</p>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 p-6 bg-gray-50">
                <button 
                    onClick={onNavigateToMenu} 
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
                >
                    Khám phá thực đơn
                </button>
            </div>
        </div>
    );
};

export default OfferDetailView;