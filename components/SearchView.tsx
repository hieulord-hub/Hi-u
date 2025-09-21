
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FoodItem, View } from '../types';
import FoodItemCard from './FoodItemCard';

interface SearchViewProps {
    foodItems: FoodItem[];
    addToCart: (item: FoodItem) => void;
    onViewProduct: (item: FoodItem) => void;
    favorites: Set<number>;
    onToggleFavorite: (itemId: number) => void;
    onBack: () => void;
}

const SearchView: React.FC<SearchViewProps> = ({ foodItems, addToCart, onViewProduct, favorites, onToggleFavorite, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const popularSearches = ['Bún chả', 'Kem Bia Đá', 'Trà sữa', 'Cơm gà', 'Soda'];

    const displayedItems = useMemo(() => {
        let items = [...foodItems];

        if (searchQuery.trim() !== '') {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            // Show popular items initially
            items.sort((a, b) => b.popularity - a.popularity);
            return items.slice(0, 8);
        }
        
        items.sort((a, b) => b.popularity - a.popularity);
        return items;

    }, [foodItems, searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        inputRef.current?.focus();
    };

    return (
        <div className="h-full flex flex-col bg-white font-sans">
            {/* Header with search input */}
            <header className="flex-shrink-0 p-3 border-b flex items-center gap-3 bg-white sticky top-0 z-10">
                <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors" aria-label="Quay lại">
                    <i className="fas fa-arrow-left text-xl text-gray-700"></i>
                </button>
                <div className="relative flex-grow">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-800 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500"
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    {searchQuery && (
                        <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Xóa tìm kiếm">
                            <i className="fas fa-times-circle"></i>
                        </button>
                    )}
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                 {searchQuery.trim() === '' && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-700 mb-3">Đề xuất tìm kiếm</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                        <hr className="my-6 border-gray-200" />
                         <h3 className="text-lg font-bold text-gray-700 mb-4">Món ăn phổ biến</h3>
                    </div>
                 )}

                 {/* Item Grid */}
                {displayedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedItems.map(item => (
                            <FoodItemCard 
                                key={item.id} 
                                item={item} 
                                onAddToCart={addToCart} 
                                onViewDetails={onViewProduct}
                                isFavorite={favorites.has(item.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <i className="fas fa-search-minus text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">
                           {`Không tìm thấy kết quả cho "${searchQuery}"`}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchView;
