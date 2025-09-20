import React from 'react';
import { Campaign } from '../types';
import { sampleCampaigns } from '../constants';

interface OffersViewProps {
    onViewCampaign: (campaign: Campaign) => void;
}

const OfferCard: React.FC<{campaign: Campaign, onClick: () => void}> = ({campaign, onClick}) => (
    <div onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <img src={campaign.imgUrl} alt={campaign.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <h3 className="text-xl font-bold text-red-600">{campaign.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
             <div className="text-right mt-4">
                <span className="text-sm font-semibold text-red-500 hover:underline">Xem chi tiết &rarr;</span>
            </div>
        </div>
    </div>
);

const OffersView: React.FC<OffersViewProps> = ({ onViewCampaign }) => {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ưu đãi & Sự kiện</h2>
            
            {sampleCampaigns.map(campaign => (
                <OfferCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={() => onViewCampaign(campaign)} 
                />
            ))}
        </div>
    );
};

export default OffersView;