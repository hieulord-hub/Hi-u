
import React, { useState, useCallback, useEffect } from 'react';
import { View, FoodItem, CartItem, Order, User, OrderStatus, PaymentMethod, Campaign, SelectedOption } from './types';
import { sampleFoodItems, samplePastOrders } from './constants';
import Header from './components/Header';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import VerifyView from './components/VerifyView';
import HomeView from './components/HomeView';
import CartView from './components/CartView';
import PaymentView from './components/PaymentView';
import OrderTrackingView from './components/OrderTrackingView';
import ProfileView from './components/ProfileView';
import PaymentMethodsView from './components/PaymentMethodsView';
import LoyaltyView from './components/LoyaltyView';
import ChatView from './components/ChatView';
import RatingView from './components/RatingView';
import ProductDetailView from './components/ProductDetailView';
import BottomNavBar from './components/BottomNavBar';
import OffersView from './components/OffersView';
import OfferDetailView from './components/OfferDetailView';
import FoodItemCard from './components/FoodItemCard';
import OrderHistoryView from './components/OrderHistoryView';
import EditProfileView from './components/EditProfileView';
import ResetPasswordView from './components/ResetPasswordView';
import PasswordResetSentView from './components/PasswordResetSentView';
import SearchView from './components/SearchView';
import CustomizationModal from './components/CustomizationModal';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.Login);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>(samplePastOrders);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [itemToCustomize, setItemToCustomize] = useState<FoodItem | null>(null);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    const handleBackNavigation = useCallback(() => {
        const backMap: Partial<Record<View, View>> = {
            [View.Search]: View.Home,
            [View.ProductDetail]: View.Home,
            [View.Payment]: View.Cart,
            [View.Chat]: View.OrderStatus,
            [View.OfferDetail]: View.Offers,
            [View.EditProfile]: View.Profile,
            [View.Verify]: View.Register,
        };

        const backView = backMap[currentView];
        if (backView) {
            setCurrentView(backView);
        }
    }, [currentView]);

    const swipeBackEnabledViews: View[] = [
        View.Search, View.ProductDetail, View.Payment, View.Chat, View.OfferDetail, View.EditProfile, View.Verify
    ];
    const canSwipeBack = swipeBackEnabledViews.includes(currentView);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Gesture must start from the left edge (within 50px)
        if (!canSwipeBack || e.touches[0].clientX > 50) {
            setTouchStartX(null);
            setTouchStartY(null);
            return;
        }
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null || touchStartY === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Swipe to the right
        if (deltaX > 100 && Math.abs(deltaY) < 50) {
            handleBackNavigation();
        }

        setTouchStartX(null);
        setTouchStartY(null);
    };

    const toggleFavorite = useCallback((itemId: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(itemId)) {
                newFavorites.delete(itemId);
                setToastMessage('Đã xóa khỏi yêu thích');
            } else {
                newFavorites.add(itemId);
                setToastMessage('Đã thêm vào yêu thích');
            }
            setIsToastVisible(true);
            return newFavorites;
        });
    }, []);

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
        setCurrentUser({
            name: 'Sinh viên FTU',
            email: 'sinhvien@ftu.edu.vn',
            phone: '0123456789',
            paymentMethods: [
                { id: 'mc1', type: 'Mastercard', last4: '436', expiry: '08/28' }
            ],
            avatarUrl: `https://i.pravatar.cc/150?u=sinhvienftu`,
            studentId: '2112345678'
        });
        setCurrentView(View.Home);
        setToastMessage('Đăng nhập thành công!');
        setIsToastVisible(true);
    }, []);
    
    const handleRegistrationSuccess = useCallback(() => {
        setToastMessage('Đăng ký thành công!');
        setIsToastVisible(true);
        setCurrentView(View.Login);
    }, []);


    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCart([]);
        setCurrentOrder(null);
        setCurrentView(View.Login);
    }, []);

    const confirmAddToCart = useCallback((item: FoodItem, quantity: number, selectedOptions: SelectedOption[]) => {
        const optionsIdentifier = selectedOptions.map(o => `${o.optionTitle}:${o.choiceName}`).sort().join(',');

        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => {
                if (cartItem.id !== item.id) return false;
                const existingOptionsIdentifier = cartItem.selectedOptions.map(o => `${o.optionTitle}:${o.choiceName}`).sort().join(',');
                return optionsIdentifier === existingOptionsIdentifier;
            });

            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.cartItemId === existingItem.cartItemId ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
                );
            } else {
                const newItem: CartItem = {
                    ...item,
                    cartItemId: `${item.id}-${optionsIdentifier}-${Date.now()}`,
                    quantity,
                    selectedOptions,
                };
                return [...prevCart, newItem];
            }
        });

        setItemToCustomize(null);
        setToastMessage(`Đã thêm "${item.name}" vào giỏ hàng!`);
        setIsToastVisible(true);
    }, []);


    const handleRequestAddToCart = useCallback((item: FoodItem) => {
        if (item.options && item.options.length > 0) {
            setItemToCustomize(item);
        } else {
            confirmAddToCart(item, 1, []);
        }
    }, [confirmAddToCart]);

    const handleViewProduct = useCallback((item: FoodItem) => {
        setSelectedFoodItem(item);
        setCurrentView(View.ProductDetail);
    }, []);
    
    const handleViewCampaign = useCallback((campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setCurrentView(View.OfferDetail);
    }, []);

    const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.cartItemId !== cartItemId);
            }
            return prevCart.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item);
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);
    
    const handleReorder = useCallback((items: CartItem[]) => {
        setCart(items);
        setToastMessage('Đã thêm các món từ đơn hàng cũ vào giỏ hàng!');
        setIsToastVisible(true);
        setCurrentView(View.Cart);
    }, []);

    const placeOrder = useCallback((paymentMethod: string, note: string, total: number, discount: number, finalTotal: number) => {
        if (cart.length === 0) return;
        
        if (currentOrder && currentOrder.status === OrderStatus.Completed) {
             setOrderHistory(prev => [currentOrder, ...prev]);
        }
        
        const newOrder: Order = {
            id: `FTU${Date.now()}`,
            items: cart,
            total,
            discount,
            finalTotal,
            status: OrderStatus.Confirmed,
            paymentMethod,
            timestamp: new Date().toISOString(),
            note,
            shipper: {
                name: 'Shipper F đỏ',
                avatarUrl: `https://i.pravatar.cc/150?u=shipper${Date.now()}`,
                phone: '0987654321'
            }
        };
        setCurrentOrder(newOrder);
        clearCart();
        setCurrentView(View.OrderStatus);
    }, [cart, clearCart, currentOrder]);

    const handleRatingSubmit = useCallback(() => {
        setToastMessage('Cảm ơn bạn đã đánh giá!');
        setIsToastVisible(true);
        setCurrentView(View.Home);
    }, []);

    const handleUpdateUser = useCallback((updatedUser: User) => {
        setCurrentUser(updatedUser);
        setCurrentView(View.Profile);
        setToastMessage('Cập nhật thông tin thành công!');
        setIsToastVisible(true);
    }, []);

    useEffect(() => {
        if (!currentOrder || currentOrder.status === OrderStatus.Completed) return;

        const statusTransitions = {
            [OrderStatus.Confirmed]: { next: OrderStatus.Preparing, delay: 3000 },
            [OrderStatus.Preparing]: { next: OrderStatus.Delivering, delay: 5000 },
            [OrderStatus.Delivering]: { next: OrderStatus.Completed, delay: 7000 },
        };

        const transition = statusTransitions[currentOrder.status];

        if (transition) {
            const timer = setTimeout(() => {
                setCurrentOrder(prev => prev ? { ...prev, status: transition.next } : null);
            }, transition.delay);
            return () => clearTimeout(timer);
        }
    }, [currentOrder]);

    useEffect(() => {
        if (isToastVisible) {
            const timer = setTimeout(() => {
                setIsToastVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    const renderView = () => {
        switch (currentView) {
            case View.Home:
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={setCurrentView} />;
            case View.Search:
                return <SearchView 
                    foodItems={sampleFoodItems}
                    addToCart={handleRequestAddToCart}
                    onViewProduct={handleViewProduct}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onBack={handleBackNavigation}
                />;
            case View.ProductDetail:
                return <ProductDetailView
                    item={selectedFoodItem}
                    onAddToCart={handleRequestAddToCart}
                    onBack={handleBackNavigation}
                    foodItems={sampleFoodItems}
                    onViewProduct={handleViewProduct}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />;
            case View.Cart:
                return <CartView cartItems={cart} updateCartQuantity={updateCartQuantity} onCheckout={() => setCurrentView(View.Payment)} onNavigate={setCurrentView} />;
            case View.Payment:
                return <PaymentView
                    cartItems={cart}
                    placeOrder={placeOrder}
                    user={currentUser}
                    onBack={handleBackNavigation}
                />;
            case View.OrderStatus:
                return <OrderTrackingView order={currentOrder} onNewOrder={() => setCurrentView(View.Home)} onChat={() => setCurrentView(View.Chat)} onRateOrder={() => setCurrentView(View.Rating)} />;
            case View.Chat:
                return <ChatView shipper={currentOrder?.shipper} onBack={handleBackNavigation} />;
            case View.Rating:
                return <RatingView order={currentOrder} onSubmitRating={handleRatingSubmit} />;
            case View.Profile:
                return <ProfileView user={currentUser} onLogout={handleLogout} onNavigate={setCurrentView} />;
            case View.EditProfile:
                return <EditProfileView user={currentUser} onSave={handleUpdateUser} onBack={handleBackNavigation} />;
            case View.Offers:
                return <OffersView onViewCampaign={handleViewCampaign} />;
            case View.OfferDetail:
                return <OfferDetailView 
                    campaign={selectedCampaign} 
                    onBack={handleBackNavigation} 
                    onNavigateToMenu={() => setCurrentView(View.Home)}
                />;
            case View.OrderHistory:
                return <OrderHistoryView orders={orderHistory} onReorder={handleReorder} />;
            case View.PaymentMethods:
                return <PaymentMethodsView />;
            case View.Loyalty:
                return <LoyaltyView />;
            case View.Favorites:
                 const favoriteItems = sampleFoodItems.filter(item => favorites.has(item.id));
                return (
                    <div className="p-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Món ăn yêu thích</h2>
                        {favoriteItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoriteItems.map(item => (
                                    <FoodItemCard 
                                        key={item.id} 
                                        item={item} 
                                        onAddToCart={handleRequestAddToCart} 
                                        onViewDetails={handleViewProduct}
                                        isFavorite={favorites.has(item.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10">
                                <i className="far fa-heart text-6xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">Bạn chưa có món ăn yêu thích nào.</p>
                                <p className="text-sm text-gray-400 mt-2">Nhấn vào trái tim ở món ăn để thêm vào đây nhé!</p>
                            </div>
                        )}
                    </div>
                );
            case View.Notifications:
                return <div className="p-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Thông báo</h2>
                    <p className="text-gray-500">Bạn không có thông báo mới.</p>
                </div>;
            case View.FAQs:
                return <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Câu hỏi thường gặp (FAQs)</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-600">Làm sao để đặt hàng?</h3>
                            <p className="text-gray-500">Bạn chỉ cần chọn món, thêm vào giỏ hàng và tiến hành thanh toán.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Tôi có thể thanh toán bằng những hình thức nào?</h3>
                            <p className="text-gray-500">Hiện tại chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) và mô phỏng thanh toán online.</p>
                        </div>
                    </div>
                </div>;
            case View.Feedback:
                return (
                    <div className="p-4 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Góp ý</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã gửi góp ý!'); }}>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Bạn đánh giá dịch vụ của chúng tôi thế nào?</h3>
                                <div className="flex justify-center text-4xl text-gray-300 mb-6 space-x-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button type="button" key={star} className="focus:outline-none transition-transform transform hover:scale-125">
                                            <i className={`fas fa-star text-yellow-400`}></i>
                                        </button>
                                    ))}
                                </div>
                                <label htmlFor="feedback-text" className="text-lg font-semibold text-gray-700 mb-2 block">Ý kiến của bạn</label>
                                <textarea
                                    id="feedback-text"
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Hãy cho chúng tôi biết cảm nhận của bạn để cải thiện dịch vụ tốt hơn..."
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
                                >
                                    Gửi góp ý
                                </button>
                            </form>
                        </div>
                    </div>
                );
            default:
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={setCurrentView} />;
        }
    };

    if (!isLoggedIn) {
        switch (currentView) {
            case View.Register:
                return <RegisterView onNavigate={setCurrentView} />;
            case View.Verify:
                return <VerifyView onVerify={handleRegistrationSuccess} onBack={handleBackNavigation} />;
            case View.ResetPassword:
                return <ResetPasswordView onNavigate={setCurrentView} />;
            case View.PasswordResetSent:
                return <PasswordResetSentView onNavigate={setCurrentView} />;
            case View.Login:
            default:
                return <LoginView onLogin={handleLogin} onNavigate={setCurrentView} />;
        }
    }

    const viewsWithChrome: View[] = [
        View.Home, View.Offers, View.Favorites, View.Profile, View.Cart, 
        View.Notifications, View.Loyalty, View.PaymentMethods, View.FAQs, View.Feedback, View.OrderHistory,
        View.ProductDetail, View.OfferDetail
    ];
    const showChrome = viewsWithChrome.includes(currentView);


    return (
        <div 
            className="h-full flex flex-col bg-gray-100/90 font-sans"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {showChrome && <Header
                cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)}
                onCartClick={() => setCurrentView(View.Cart)}
                onHomeClick={() => setCurrentView(View.Home)}
            />}
            <main className={`flex-grow overflow-y-auto scrollbar-hide ${showChrome ? 'pt-16 pb-16' : ''}`}>
                {renderView()}
            </main>
            {showChrome && <BottomNavBar currentView={currentView} onNavigate={setCurrentView} />}
            <CustomizationModal
                isOpen={!!itemToCustomize}
                item={itemToCustomize}
                onClose={() => setItemToCustomize(null)}
                onAddToCart={confirmAddToCart}
            />
            {isToastVisible && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg z-[100] flex items-center justify-between min-w-[340px] max-w-md toast-animate"
                >
                    <div className="flex items-center">
                        <i className={`fas ${toastMessage.includes("yêu thích") ? 'fa-heart text-red-400' : 'fa-check-circle text-green-400'} mr-3`}></i>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                    {currentView !== View.Cart && toastMessage.includes("giỏ hàng") &&
                        <button
                            onClick={() => {
                                setCurrentView(View.Cart);
                                setIsToastVisible(false);
                            }}
                            className="ml-4 font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
                            aria-label="Xem giỏ hàng"
                        >
                            Xem giỏ hàng
                        </button>
                    }
                </div>
            )}
        </div>
    );
};

export default App;
