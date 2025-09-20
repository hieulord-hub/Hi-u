import React, { useState, useMemo, useEffect } from 'react';
import { FoodItem, Campaign } from '../types';
import FoodItemCard from './FoodItemCard';
import { sampleCampaigns } from '../constants';

interface HomeViewProps {
    foodItems: FoodItem[];
    addToCart: (item: FoodItem) => void;
    onViewProduct: (item: FoodItem) => void;
    onViewCampaign: (campaign: Campaign) => void;
    favorites: Set<number>;
    onToggleFavorite: (itemId: number) => void;
}

type SortByType = 'popularity' | 'rating' | 'price_asc' | 'price_desc';

const CampaignCard: React.FC<{ campaign: Campaign; onClick: () => void }> = ({ campaign, onClick }) => (
     <div onClick={onClick} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300">
        <img src={campaign.imgUrl} alt={campaign.title} className="w-full h-32 object-cover" />
        <div className="p-3">
            <h3 className="font-bold text-red-600 truncate">{campaign.title}</h3>
            <p className="text-sm text-gray-600 truncate">{campaign.description}</p>
        </div>
    </div>
);

const SuggestionCard: React.FC<{ item: FoodItem; onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
        <img src={item.imageUrls[0]} alt={item.name} className="w-14 h-14 rounded-md object-cover mr-4" />
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 truncate">{item.name}</p>
            <p className="text-sm text-red-600 font-medium">{item.price.toLocaleString('vi-VN')}đ</p>
        </div>
        <i className="fas fa-arrow-up-right-from-square text-gray-400"></i>
    </div>
);


const HomeView: React.FC<HomeViewProps> = ({ foodItems, addToCart, onViewProduct, onViewCampaign, favorites, onToggleFavorite }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('popularity');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    
    const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
    const [isSearching, setIsSearching] = useState(false);

    const categories = useMemo(() => {
        const specialCategories = ['FTU Signature', 'Thực đơn Cảm xúc'];
        const allCategories = new Set(foodItems.map(item => item.category));
        const regularCategories = [...allCategories].filter(c => !specialCategories.includes(c)).sort();
        
        const hasSpecial = foodItems.some(item => specialCategories.includes(item.category));
        
        const finalCategories = ['Tất cả', ...regularCategories];
        if (hasSpecial) {
            finalCategories.push('Đặc biệt');
        }
        return finalCategories;
    }, [foodItems]);


    const displayItems = useMemo(() => {
        let items = [...foodItems];

        if (activeCategory !== 'Tất cả') {
            if (activeCategory === 'Đặc biệt') {
                items = items.filter(item => item.category === 'FTU Signature' || item.category === 'Thực đơn Cảm xúc');
            } else {
                items = items.filter(item => item.category === activeCategory);
            }
        }

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
    }, [foodItems, activeCategory, sortBy]);

    const searchResults = useMemo(() => {
        if (searchQuery.trim() === '') return [];
        return foodItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, foodItems]);
    
    const recentItems = useMemo(() => foodItems.slice(3, 6), [foodItems]);
    const popularItems = useMemo(() => [...foodItems].sort((a, b) => b.popularity - a.popularity).slice(0, 4), [foodItems]);

    const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
    const paginatedItems = displayItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, sortBy]);
    
    useEffect(() => {
        if (isSearching) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isSearching]);
    
     const handleViewAndCloseSearch = (item: FoodItem) => {
        onViewProduct(item);
        setIsSearching(false);
        setSearchQuery('');
    };
    
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center items-center space-x-2 mt-8">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                {pageNumbers.map(number => (
                    <button 
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-4 py-2 border rounded-md font-semibold ${currentPage === number ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        {number}
                    </button>
                ))}
                 <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        )
    }
    
     if (isSearching) {
        return (
            <div className="fixed inset-0 bg-white z-[60] flex flex-col">
                <header className="p-4 flex items-center border-b">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-800 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500"
                            autoFocus
                        />
                         <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="ml-4 font-semibold text-gray-700 hover:text-red-600">
                        Hủy
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-4">
                    {searchQuery.trim() === '' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3">Món đã ăn gần đây</h3>
                                <div className="space-y-2">
                                    {recentItems.map(item => (
                                        <SuggestionCard key={`recent-${item.id}`} item={item} onClick={() => handleViewAndCloseSearch(item)} />
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-bold text-gray-800 mb-3">Món phổ biến</h3>
                                 <div className="space-y-2">
                                    {popularItems.map(item => (
                                        <SuggestionCard key={`popular-${item.id}`} item={item} onClick={() => handleViewAndCloseSearch(item)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div>
                            <h3 className="font-bold text-gray-800 mb-3">Kết quả tìm kiếm</h3>
                            {searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    {searchResults.map(item => (
                                        <SuggestionCard key={`search-${item.id}`} item={item} onClick={() => handleViewAndCloseSearch(item)} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Không tìm thấy kết quả nào.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        )
    }


    return (
        <div className="divide-y divide-gray-200">
             {/* Campaigns Section */}
            <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 px-4">Ưu đãi & Sự kiện</h2>
                <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 px-4">
                     {sampleCampaigns.map(campaign => (
                        <CampaignCard 
                            key={campaign.id}
                            campaign={campaign}
                            onClick={() => onViewCampaign(campaign)}
                        />
                    ))}
                </div>
            </div>

            {/* All Items Section */}
            <div className="p-4 pt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thực đơn FTU YUM</h2>
                <div className="relative mb-4">
                     <div
                        onClick={() => setIsSearching(true)}
                        className="w-full pl-10 pr-4 py-3 bg-white text-gray-500 border border-gray-300 rounded-full cursor-pointer flex items-center"
                    >
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <span>Tìm kiếm món ăn...</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                                    activeCategory === category
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-700">
                        {activeCategory === 'Tất cả' ? 'Món ăn nổi bật' : activeCategory}
                    </h3>
                    <select 
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortByType)}
                        className="px-3 py-2 border border-gray-300 rounded-full bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                        <option value="popularity">Phổ biến</option>
                        <option value="rating">Đánh giá</option>
                        <option value="price_asc">Giá tăng</option>
                        <option value="price_desc">Giá giảm</option>
                    </select>
                </div>

                {paginatedItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedItems.map(item => (
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
                        {renderPagination()}
                    </>
                ) : (
                    <div className="text-center py-10">
                        <i className="fas fa-utensils text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">Không có món ăn nào trong danh mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeView;