import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import FoodItemCard from './FoodItemCard';

interface MenuViewProps {
    foodItems: FoodItem[];
    addToCart: (item: FoodItem) => void;
    // FIX: Add onViewDetails to props to be passed to FoodItemCard
    onViewDetails: (item: FoodItem) => void;
    initialMode: 'all' | 'mood';
    favorites: Set<number>;
    onToggleFavorite: (itemId: number) => void;
}

type SortByType = 'popularity' | 'rating' | 'price_asc' | 'price_desc';

const MenuView: React.FC<MenuViewProps> = ({ foodItems, addToCart, initialMode, onViewDetails, favorites, onToggleFavorite }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('popularity');

    const baseItems = useMemo(() => {
        if (initialMode === 'mood') {
            return foodItems.filter(item => item.category === 'FTU Signature' || item.category === 'Thực đơn Cảm xúc');
        }
        return foodItems;
    }, [foodItems, initialMode]);

    const displayedItems = useMemo(() => {
        let items = [...baseItems];

        // Filter by search query
        if (searchQuery.trim() !== '') {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort items
        switch (sortBy) {
            case 'rating':
                items.sort((a, b) => b.rating - a.rating);
                break;
            case 'price_asc':
                items.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                items.sort((a, b) => b.price - a.price);
                break;
            case 'popularity':
            default:
                items.sort((a, b) => b.popularity - a.popularity);
                break;
        }

        return items;
    }, [baseItems, searchQuery, sortBy]);
    
    const sortOptions: { key: SortByType; label: string }[] = [
        { key: 'popularity', label: 'Phổ biến' },
        { key: 'rating', label: 'Đánh giá' },
        { key: 'price_asc', label: 'Giá tăng dần' },
        { key: 'price_desc', label: 'Giá giảm dần' },
    ];

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {initialMode === 'mood' ? "FTU's Mood Food & Signature" : "Thực đơn"}
            </h2>

            {/* Search Bar */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {/* Filter Buttons */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Sắp xếp theo</h3>
                <div className="flex flex-wrap gap-2">
                    {sortOptions.map(option => (
                        <button
                            key={option.key}
                            onClick={() => setSortBy(option.key)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                sortBy === option.key
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Item Grid */}
            {displayedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedItems.map(item => (
                        // FIX: Pass missing isFavorite and onToggleFavorite props to FoodItemCard
                        <FoodItemCard 
                            key={item.id} 
                            item={item} 
                            onAddToCart={addToCart} 
                            onViewDetails={onViewDetails} 
                            isFavorite={favorites.has(item.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                     <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Không tìm thấy món ăn phù hợp.</p>
                </div>
            )}
        </div>
    );
};

export default MenuView;