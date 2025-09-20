import React from 'react';
import { FoodItem } from '../types';

interface FoodItemCardProps {
    item: FoodItem;
    onAddToCart: (item: FoodItem) => void;
    onViewDetails: (item: FoodItem) => void;
    isFavorite: boolean;
    onToggleFavorite: (itemId: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onAddToCart, onViewDetails, isFavorite, onToggleFavorite }) => {
    
    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onAddToCart(item);

        const card = (e.target as HTMLElement).closest('.food-item-card');
        const img = card?.querySelector('img');
        const cartIcon = document.getElementById('cart-icon');

        if (img && cartIcon) {
            const imgRect = img.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            const flyingImg = img.cloneNode(true) as HTMLImageElement;
            flyingImg.style.position = 'fixed';
            flyingImg.style.left = `${imgRect.left}px`;
            flyingImg.style.top = `${imgRect.top}px`;
            flyingImg.style.width = `${imgRect.width}px`;
            flyingImg.style.height = `${imgRect.height}px`;
            flyingImg.style.objectFit = 'cover';
            flyingImg.style.borderRadius = '0.5rem';
            flyingImg.style.zIndex = '1000';
            flyingImg.style.transition = 'all 0.6s cubic-bezier(0.55, -0.04, 0.83, 0.67)';
            
            document.body.appendChild(flyingImg);

            requestAnimationFrame(() => {
                flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
                flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
                flyingImg.style.width = '0px';
                flyingImg.style.height = '0px';
                flyingImg.style.opacity = '0';
            });
            
            setTimeout(() => {
                flyingImg.remove();
                cartIcon.classList.add('cart-pulse');
                setTimeout(() => {
                    cartIcon.classList.remove('cart-pulse');
                }, 400);
            }, 600);
        }
    };
    
    const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onToggleFavorite(item.id);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col food-item-card">
            <div onClick={() => onViewDetails(item)} className="cursor-pointer">
                <img src={item.imageUrls[0]} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm h-10 overflow-hidden">{item.description}</p>
                </div>
            </div>
            <div className="p-4 pt-0 mt-auto">
                 <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-red-600">{item.price.toLocaleString('vi-VN')}đ</span>
                        <div className="flex items-center text-sm text-gray-500">
                            <i className="fas fa-star text-yellow-400 mr-1"></i>
                            <span>{item.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="flex items-center rounded-full bg-red-600 overflow-hidden shadow-md h-10">
                        <button
                            onClick={handleAddToCart}
                            className="text-white font-semibold pl-3 pr-2 sm:pl-4 sm:pr-3 h-full hover:bg-red-700 transition-colors flex items-center"
                            aria-label={`Thêm ${item.name} vào giỏ hàng`}
                        >
                            <i className="fas fa-plus mr-1 sm:mr-2"></i>
                            <span className="hidden sm:inline">Thêm</span>
                        </button>
                        <div className="w-px bg-red-500 h-6 self-center"></div>
                        <button
                            onClick={handleToggleFavorite}
                            className="w-12 h-full flex items-center justify-center text-white hover:bg-red-700 transition-colors focus:outline-none"
                            aria-label={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                        >
                            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xl`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodItemCard;