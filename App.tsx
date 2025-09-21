
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
    const [viewHistory, setViewHistory] = useState<View[]>([View.Login]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>(samplePastOrders);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [itemToCustomize, setItemToCustomize] = useState<FoodItem | null>(null);
    
    // --- Navigation State ---
    const [exitingView, setExitingView] = useState<{ view: View; key: string } | null>(null);
    const [navState, setNavState] = useState<'idle' | 'pushing' | 'popping' | 'tabbing'>('idle');
    const [tabDirection, setTabDirection] = useState<'left' | 'right'>('right');
    const [gesture, setGesture] = useState({ active: false, startX: 0, translateX: 0, completing: false });
    const mainRef = useRef<HTMLElement>(null);
    const tabOrder = useMemo(() => [View.Home, View.Offers, View.Favorites, View.Profile], []);

    const currentView = viewHistory[viewHistory.length - 1];

    const navigateTo = useCallback((view: View) => {
        if (view === viewHistory[viewHistory.length - 1]) return;
        setNavState('pushing');
        setViewHistory(prev => [...prev, view]);
    }, [viewHistory]);

    const handleBackNavigation = useCallback(() => {
        if (viewHistory.length > 1) {
            const viewToPop = viewHistory[viewHistory.length - 1];
            setExitingView({ view: viewToPop, key: `${viewToPop}-${Date.now()}` });
            setNavState('popping');
            setViewHistory(prev => prev.slice(0, -1));
            setTimeout(() => {
                setExitingView(null);
                setNavState('idle');
            }, 400);
        }
    }, [viewHistory]);

    const resetToView = useCallback((view: View) => {
        setNavState('idle');
        setViewHistory([view]);
    }, []);
    
    const handleTabNavigation = useCallback((view: View) => {
        const fromIndex = tabOrder.indexOf(currentView as View);
        const toIndex = tabOrder.indexOf(view);

        if (fromIndex === toIndex) return;

        // If navigating from a non-tab view, or indexes are invalid, just reset.
        if (fromIndex === -1 || toIndex === -1) {
             if (view === View.Home) resetToView(View.Home);
             else setViewHistory([View.Home, view]);
             return;
        }

        const direction = toIndex > fromIndex ? 'right' : 'left';
        setTabDirection(direction);
        setExitingView({ view: currentView, key: `${currentView}-${Date.now()}` });
        setNavState('tabbing');
        setViewHistory([view]); // Replace history with the new tab view

        setTimeout(() => {
            setExitingView(null);
            setNavState('idle');
        }, 350);
    }, [currentView, tabOrder, resetToView]);

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
        resetToView(View.Home);
        setToastMessage('Đăng nhập thành công!');
        setIsToastVisible(true);
    }, [resetToView]);
    
    const handleRegistrationSuccess = useCallback(() => {
        setToastMessage('Đăng ký thành công!');
        setIsToastVisible(true);
        resetToView(View.Login);
    }, [resetToView]);


    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCart([]);
        setCurrentOrder(null);
        resetToView(View.Login);
    }, [resetToView]);

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
        navigateTo(View.ProductDetail);
    }, [navigateTo]);
    
    const handleViewCampaign = useCallback((campaign: Campaign) => {
        setSelectedCampaign(campaign);
        navigateTo(View.OfferDetail);
    }, [navigateTo]);

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
        navigateTo(View.Cart);
    }, [navigateTo]);

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
        navigateTo(View.OrderStatus);
    }, [cart, clearCart, currentOrder, navigateTo]);

    const handleRatingSubmit = useCallback(() => {
        setToastMessage('Cảm ơn bạn đã đánh giá!');
        setIsToastVisible(true);
        resetToView(View.Home);
    }, [resetToView]);

    const handleUpdateUser = useCallback((updatedUser: User) => {
        setCurrentUser(updatedUser);
        handleBackNavigation();
        setToastMessage('Cập nhật thông tin thành công!');
        setIsToastVisible(true);
    }, [handleBackNavigation]);

    // Gesture Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (viewHistory.length <= 1 || gesture.active || navState !== 'idle') return;
        const startX = e.touches[0].clientX;
        if (startX > 40) return; // Only trigger on left edge

        setGesture({ active: true, startX: startX, translateX: 0, completing: false });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!gesture.active || gesture.completing) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - gesture.startX;
        if (deltaX >= 0) {
            setGesture(prev => ({ ...prev, translateX: deltaX }));
        }
    };

    const handleTouchEnd = () => {
        if (!gesture.active || gesture.completing) return;
        const screenWidth = mainRef.current?.offsetWidth || window.innerWidth;
        const shouldPop = gesture.translateX > screenWidth / 3;
        const finalTranslateX = shouldPop ? screenWidth : 0;
        setGesture(prev => ({ ...prev, translateX: finalTranslateX, completing: true }));
    };

    const handleTransitionEnd = () => {
        if (gesture.completing) {
            if (gesture.translateX > 0) { // Pop completed
                setViewHistory(prev => prev.slice(0, -1));
            }
            setGesture({ active: false, startX: 0, translateX: 0, completing: false });
        }
    };

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
            const timer = setTimeout(() => setIsToastVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    const renderView = (viewToRender: View) => {
        switch (viewToRender) {
            case View.Home:
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={navigateTo} />;
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
                return <CartView cartItems={cart} updateCartQuantity={updateCartQuantity} onCheckout={() => navigateTo(View.Payment)} onNavigate={navigateTo} />;
            case View.Payment:
                return <PaymentView
                    cartItems={cart}
                    placeOrder={placeOrder}
                    user={currentUser}
                    onBack={handleBackNavigation}
                />;
            case View.OrderStatus:
                return <OrderTrackingView order={currentOrder} onNewOrder={() => resetToView(View.Home)} onChat={() => navigateTo(View.Chat)} onRateOrder={() => navigateTo(View.Rating)} />;
            case View.Chat:
                return <ChatView shipper={currentOrder?.shipper} onBack={handleBackNavigation} />;
            case View.Rating:
                return <RatingView order={currentOrder} onSubmitRating={handleRatingSubmit} />;
            case View.Profile:
                return <ProfileView user={currentUser} onLogout={handleLogout} onNavigate={navigateTo} />;
            case View.EditProfile:
                return <EditProfileView user={currentUser} onSave={handleUpdateUser} onBack={handleBackNavigation} />;
            case View.Offers:
                return <OffersView onViewCampaign={handleViewCampaign} />;
            case View.OfferDetail:
                return <OfferDetailView 
                    campaign={selectedCampaign} 
                    onBack={handleBackNavigation} 
                    onNavigateToMenu={() => resetToView(View.Home)}
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
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={navigateTo} />;
        }
    };

    if (!isLoggedIn) {
        switch (currentView) {
            case View.Register: return <RegisterView onNavigate={navigateTo} />;
            case View.Verify: return <VerifyView onVerify={handleRegistrationSuccess} onBack={handleBackNavigation} />;
            case View.ResetPassword: return <ResetPasswordView onNavigate={navigateTo} />;
            case View.PasswordResetSent: return <PasswordResetSentView onNavigate={navigateTo} />;
            case View.Login: default: return <LoginView onLogin={handleLogin} onNavigate={navigateTo} />;
        }
    }

    const viewsWithChrome = [View.Home, View.Offers, View.Favorites, View.Profile, View.Cart, View.Notifications, View.Loyalty, View.PaymentMethods, View.FAQs, View.Feedback, View.OrderHistory];
    const showChrome = viewsWithChrome.includes(currentView);
    const isGesturing = gesture.active;

    // --- Screen rendering logic ---
    const getAnimationClass = () => {
        if (navState === 'popping') return 'animation-pop-enter';
        if (navState === 'pushing') return 'animation-push-enter';
        if (navState === 'tabbing') return tabDirection === 'right' ? 'animation-tab-enter-right' : 'animation-tab-enter-left';
        return '';
    };
    
    const getExitingAnimationClass = () => {
        if (navState === 'popping') return 'animation-pop-exit';
        if (navState === 'tabbing') return tabDirection === 'right' ? 'animation-tab-exit-left' : 'animation-tab-exit-right';
        return 'animation-push-exit';
    };
    
    const screenWidth = mainRef.current?.offsetWidth || 0;
    const gestureProgress = screenWidth > 0 ? Math.min(1, gesture.translateX / screenWidth) : 0;
    
    return (
        <div className="h-full flex flex-col bg-gray-100/90 font-sans">
            {showChrome && <Header cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)} onCartClick={() => navigateTo(View.Cart)} onHomeClick={() => resetToView(View.Home)} />}
            
            <main 
                ref={mainRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex-grow overflow-hidden relative ${showChrome ? 'pt-16 pb-16' : ''}`}
            >
                <div className="w-full h-full relative">
                    {/* Current Screen (Top) */}
                    <div
                        key={currentView}
                        className={`view-screen ${!isGesturing ? getAnimationClass() : ''}`}
                        style={{ 
                            zIndex: 10,
                            ...(isGesturing && { 
                                transform: `translateX(${gesture.translateX}px)`,
                                transition: gesture.completing ? 'transform 0.25s ease-out' : 'none'
                            })
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                         <div className="h-full overflow-y-auto scrollbar-hide">{renderView(currentView)}</div>
                    </div>

                    {/* Exiting Screen (Animating Out) */}
                    {exitingView && !isGesturing &&
                        <div
                            key={exitingView.key}
                            className={`view-screen ${getExitingAnimationClass()}`}
                            style={{ zIndex: 15 }}
                        >
                             <div className="h-full overflow-y-auto scrollbar-hide">{renderView(exitingView.view)}</div>
                        </div>
                    }
                    
                    {/* Screen underneath (Revealed on push/pop/gesture) */}
                    {viewHistory.length > 1 &&
                        <div
                            key={viewHistory[viewHistory.length - 2]}
                            className={`view-screen ${!isGesturing && navState === 'pushing' ? 'animation-push-exit' : ''}`}
                            style={{ 
                                zIndex: 5,
                                ...(isGesturing && {
                                    transform: `translateX(${-30 * (1 - gestureProgress)}%)`,
                                    opacity: 0.5 + (0.5 * gestureProgress),
                                    transition: gesture.completing ? 'transform 0.25s ease-out, opacity 0.25s ease-out' : 'none'
                                })
                            }}
                        >
                            <div className="h-full overflow-y-auto scrollbar-hide">
                                {renderView(viewHistory[viewHistory.length - 2])}
                            </div>
                        </div>
                    }
                </div>
            </main>

            {showChrome && <BottomNavBar currentView={currentView} onNavigate={handleTabNavigation} />}
            <CustomizationModal isOpen={!!itemToCustomize} item={itemToCustomize} onClose={() => setItemToCustomize(null)} onAddToCart={confirmAddToCart} />
            
            {isToastVisible && (
                <div role="alert" aria-live="assertive" className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg z-[100] flex items-center justify-between min-w-[340px] max-w-md toast-animate">
                    <div className="flex items-center">
                        <i className={`fas ${toastMessage.includes("yêu thích") ? 'fa-heart text-red-400' : 'fa-check-circle text-green-400'} mr-3`}></i>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                    {currentView !== View.Cart && toastMessage.includes("giỏ hàng") &&
                        <button onClick={() => { navigateTo(View.Cart); setIsToastVisible(false); }} className="ml-4 font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap" aria-label="Xem giỏ hàng">
                            Xem giỏ hàng
                        </button>
                    }
                </div>
            )}
        </div>
    );
};

export default App;