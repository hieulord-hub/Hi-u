import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FoodItem } from '../types';
import FoodItemCard from './FoodItemCard';

interface ProductDetailViewProps {
    item: FoodItem | null;
    onAddToCart: (item: FoodItem) => void;
    onBack: () => void;
    foodItems: FoodItem[];
    onViewProduct: (item: FoodItem) => void;
    favorites: Set<number>;
    onToggleFavorite: (itemId: number) => void;
}

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <i key={i} className={`fas fa-star ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
        ))}
    </div>
);

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ item, onAddToCart, onBack, foodItems, onViewProduct, favorites, onToggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<number | null>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset scroll and state when item changes
        mainContentRef.current?.scrollTo(0, 0);
        setCurrentIndex(0);
    }, [item]);


    const scrollToIndex = (index: number) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const itemWidth = carousel.offsetWidth;
            carousel.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = window.setTimeout(() => {
            if (carouselRef.current) {
                const itemWidth = carouselRef.current.offsetWidth;
                const newIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
                setCurrentIndex(newIndex);
            }
        }, 100);
    };

    const relatedItems = useMemo(() => {
        if (!item) return [];
        return foodItems.filter(food => food.category === item.category && food.id !== item.id);
    }, [item, foodItems]);

    if (!item) {
        return (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Không tìm thấy sản phẩm</h2>
                <button onClick={onBack} className="text-red-500 hover:underline">Quay lại trang chủ</button>
            </div>
        );
    }
    
    const isCurrentItemFavorite = favorites.has(item.id);

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div ref={mainContentRef} className="flex-grow overflow-y-auto scrollbar-hide">
                {/* Image Carousel Section */}
                <div className="relative w-full h-80 sm:h-96 bg-gray-100">
                    <div ref={carouselRef} onScroll={handleScroll} className="h-full flex overflow-x-auto scrollbar-hide carousel-container">
                        {item.imageUrls.map((url, index) => (
                            <div key={index} className="w-full h-full flex-shrink-0 carousel-item">
                                <img src={url} alt={`${item.name} ảnh ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-all z-10" aria-label="Quay lại">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    {item.imageUrls.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10">
                            {item.imageUrls.map((_, index) => (
                                <button key={index} onClick={() => scrollToIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/60'}`} aria-label={`Đi đến ảnh ${index + 1}`}></button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details Section */}
                <div className="p-5 bg-white">
                    <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                    <div className="flex items-center my-3 text-gray-600">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span className="font-bold text-lg">{item.rating.toFixed(1)}</span>
                        <span className="mx-2">·</span>
                        <span>{item.popularity} lượt mua</span>
                    </div>
                    <p className="text-4xl font-semibold text-red-600 my-4">{item.price.toLocaleString('vi-VN')}đ</p>
                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả</h2>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                </div>
                
                 {/* Reviews Section */}
                <div className="bg-gray-50 p-5 mt-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Đánh giá từ khách hàng</h2>
                    {item.reviews && item.reviews.length > 0 ? (
                        <div className="space-y-3">
                            {item.reviews.map(review => (
                                <div key={review.id} className="bg-white p-3 rounded-lg shadow">
                                    <div className="flex items-start">
                                        <img src={review.avatarUrl} alt={review.author} className="w-10 h-10 rounded-full mr-3" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-sm text-gray-800">{review.author}</h4>
                                                <StarDisplay rating={review.rating} />
                                            </div>
                                            <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-4">
                            <i className="fas fa-comment-slash text-3xl mb-2 text-gray-300"></i>
                            <p className="text-sm">Chưa có đánh giá nào.</p>
                        </div>
                    )}
                </div>

                {/* Related Items Section */}
                <div className="bg-gray-50 pt-6 p-5">
                     <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Có thể bạn cũng thích</h2>
                     {relatedItems.length > 0 ? (
                         <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 -mx-5 px-5">
                            {relatedItems.map(relatedItem => (
                                <div key={relatedItem.id} className="w-64 flex-shrink-0">
                                    <FoodItemCard 
                                        item={relatedItem} 
                                        onAddToCart={onAddToCart} 
                                        onViewDetails={onViewProduct}
                                        isFavorite={favorites.has(relatedItem.id)}
                                        onToggleFavorite={onToggleFavorite}
                                     />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
                            <i className="fas fa-utensils text-5xl mb-4 text-gray-300"></i>
                            <p>Không có món ăn nào tương tự.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky-like Footer */}
            <div className="flex-shrink-0 bg-white p-4 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex items-center gap-3">
                 <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="w-16 flex-shrink-0 h-14 border border-gray-300 rounded-xl flex items-center justify-center text-2xl hover:bg-red-50 transition-colors focus:outline-none"
                    aria-label={isCurrentItemFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                >
                    <i className={`${isCurrentItemFavorite ? 'fas text-red-500' : 'far text-gray-500'} fa-heart`}></i>
                </button>
                <button onClick={() => onAddToCart(item)} className="flex-grow bg-red-600 text-white font-bold h-14 rounded-xl hover:bg-red-700 transition-colors text-lg">
                    <i className="fas fa-cart-plus mr-2"></i>Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default ProductDetailView;