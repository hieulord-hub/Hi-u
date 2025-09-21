import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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

type NavigationStacks = {
    [key in View]?: View[];
};

const TAB_ROOT_VIEWS = [View.Home, View.Offers, View.Favorites, View.Profile];

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginView, setLoginView] = useState<View>(View.Login);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    const [activeTab, setActiveTab] = useState<View>(View.Home);
    const [navStacks, setNavStacks] = useState<NavigationStacks>({
        [View.Home]: [View.Home],
        [View.Offers]: [View.Offers],
        [View.Favorites]: [View.Favorites],
        [View.Profile]: [View.Profile],
    });
    const [exitingViews, setExitingViews] = useState<Record<string, { view: View; key: string }>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeTranslateX, setSwipeTranslateX] = useState(0);
    const transitionTimer = useRef<number | null>(null);
    
    const activeStack = navStacks[activeTab] || [activeTab];
    const currentView = activeStack[activeStack.length - 1];
    
    const setTransitioning = useCallback((duration: number) => {
        setIsTransitioning(true);
        if (transitionTimer.current) clearTimeout(transitionTimer.current);
        transitionTimer.current = window.setTimeout(() => {
            setIsTransitioning(false);
            setExitingViews({});
        }, duration);
    }, []);
    
    const push = useCallback((view: View) => {
        if (isTransitioning) return;
        setTransitioning(300);
        setNavStacks(prev => ({
            ...prev,
            [activeTab]: [...(prev[activeTab] || []), view],
        }));
    }, [activeTab, isTransitioning, setTransitioning]);

    const pop = useCallback(() => {
        if (isTransitioning || (navStacks[activeTab] || []).length <= 1) return;
        setTransitioning(300);
        const stack = navStacks[activeTab] || [];
        const viewToPop = stack[stack.length - 1];
        setExitingViews(prev => ({ ...prev, [activeTab]: { view: viewToPop, key: `${viewToPop}-${Date.now()}` } }));
        setNavStacks(prev => ({
            ...prev,
            [activeTab]: stack.slice(0, -1)
        }));
    }, [activeTab, navStacks, isTransitioning, setTransitioning]);
    
    const switchTab = useCallback((view: View) => {
        if (isTransitioning) return;
        setActiveTab(view);
    }, [isTransitioning]);

    const resetToLogin = useCallback(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCart([]);
        setCurrentOrder(null);
        setNavStacks({
            [View.Home]: [View.Home],
            [View.Offers]: [View.Offers],
            [View.Favorites]: [View.Favorites],
            [View.Profile]: [View.Profile],
        });
        setActiveTab(View.Home);
        setLoginView(View.Login);
    }, []);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (activeStack.length <= 1 || isTransitioning) return;
        const touch = e.touches[0];
        if (touch.clientX < 40) { // Only trigger swipe if starting from the left edge
            setIsSwiping(true);
        }
    };
    
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) return;
        const touch = e.touches[0];
        const translateX = touch.clientX;
        // Prevent swiping back past the origin
        if (translateX >= 0) {
            setSwipeTranslateX(translateX);
        }
    };
    
    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) return;
    
        const screenWidth = window.innerWidth;
        const releaseThreshold = screenWidth * 0.4; // Must swipe 40% of the screen to pop
    
        const topScreen = e.currentTarget;
        const screenBelow = topScreen.previousElementSibling as HTMLElement | null;
    
        const completePop = () => {
            if (screenBelow) {
                screenBelow.style.transition = 'transform 300ms ease-in-out';
                screenBelow.style.transform = 'translateX(0)';
            }
            topScreen.style.transition = 'transform 300ms ease-in-out';
            topScreen.style.transform = `translateX(${screenWidth}px)`;
            
            topScreen.addEventListener('transitionend', () => {
                 pop();
                 setIsSwiping(false);
                 setSwipeTranslateX(0);
                 if (screenBelow) {
                    screenBelow.style.transition = '';
                    screenBelow.style.transform = '';
                 }
                 topScreen.style.transition = '';
                 topScreen.style.transform = '';
            }, { once: true });
        };
    
        const snapBack = () => {
            if (screenBelow) {
                screenBelow.style.transition = 'transform 300ms ease-in-out';
                screenBelow.style.transform = 'translateX(-30%)';
            }
            topScreen.style.transition = 'transform 300ms ease-in-out';
            topScreen.style.transform = 'translateX(0)';
    
             topScreen.addEventListener('transitionend', () => {
                 setIsSwiping(false);
                 setSwipeTranslateX(0);
                 if (screenBelow) {
                    screenBelow.style.transition = '';
                    screenBelow.style.transform = '';
                 }
                 topScreen.style.transition = '';
                 topScreen.style.transform = '';
            }, { once: true });
        };
    
        if (swipeTranslateX > releaseThreshold) {
            completePop();
        } else {
            snapBack();
        }
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
        setToastMessage('Đăng nhập thành công!');
        setIsToastVisible(true);
    }, []);
    
    const handleRegistrationSuccess = useCallback(() => {
        setToastMessage('Đăng ký thành công!');
        setIsToastVisible(true);
        setLoginView(View.Login);
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
        push(View.ProductDetail);
    }, [push]);
    
    const handleViewCampaign = useCallback((campaign: Campaign) => {
        setSelectedCampaign(campaign);
        push(View.OfferDetail);
    }, [push]);

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
        push(View.Cart);
    }, [push]);

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
        push(View.OrderStatus);
    }, [cart, clearCart, currentOrder, push]);

    const handleRatingSubmit = useCallback(() => {
        setToastMessage('Cảm ơn bạn đã đánh giá!');
        setIsToastVisible(true);
        switchTab(View.Home);
        setNavStacks(prev => ({...prev, [activeTab]: [activeTab]}));
    }, [switchTab, activeTab]);

    const handleUpdateUser = useCallback((updatedUser: User) => {
        setCurrentUser(updatedUser);
        pop();
        setToastMessage('Cập nhật thông tin thành công!');
        setIsToastVisible(true);
    }, [pop]);
    
    const resetToHome = useCallback(() => {
        switchTab(View.Home);
        setNavStacks(prev => ({ ...prev, [View.Home]: [View.Home]}));
    }, [switchTab]);

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
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={push} />;
            case View.Search:
                return <SearchView 
                    foodItems={sampleFoodItems}
                    addToCart={handleRequestAddToCart}
                    onViewProduct={handleViewProduct}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onBack={pop}
                />;
            case View.ProductDetail:
                return <ProductDetailView
                    item={selectedFoodItem}
                    onAddToCart={handleRequestAddToCart}
                    onBack={pop}
                    foodItems={sampleFoodItems}
                    onViewProduct={handleViewProduct}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />;
            case View.Cart:
                return <CartView cartItems={cart} updateCartQuantity={updateCartQuantity} onCheckout={() => push(View.Payment)} onNavigate={push} />;
            case View.Payment:
                return <PaymentView
                    cartItems={cart}
                    placeOrder={placeOrder}
                    user={currentUser}
                    onBack={pop}
                />;
            case View.OrderStatus:
                return <OrderTrackingView order={currentOrder} onNewOrder={resetToHome} onChat={() => push(View.Chat)} onRateOrder={() => push(View.Rating)} />;
            case View.Chat:
                return <ChatView shipper={currentOrder?.shipper} onBack={pop} />;
            case View.Rating:
                return <RatingView order={currentOrder} onSubmitRating={handleRatingSubmit} />;
            case View.Profile:
                return <ProfileView user={currentUser} onLogout={resetToLogin} onNavigate={push} />;
            case View.EditProfile:
                return <EditProfileView user={currentUser} onSave={handleUpdateUser} onBack={pop} />;
            case View.Offers:
                return <OffersView onViewCampaign={handleViewCampaign} />;
            case View.OfferDetail:
                return <OfferDetailView 
                    campaign={selectedCampaign} 
                    onBack={pop} 
                    onNavigateToMenu={resetToHome}
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
                return <HomeView foodItems={sampleFoodItems} addToCart={handleRequestAddToCart} onViewProduct={handleViewProduct} onViewCampaign={handleViewCampaign} favorites={favorites} onToggleFavorite={toggleFavorite} onNavigate={push} />;
        }
    };

    if (!isLoggedIn) {
        switch (loginView) {
            case View.Register: return <RegisterView onNavigate={setLoginView} />;
            case View.Verify: return <VerifyView onVerify={handleRegistrationSuccess} onBack={() => setLoginView(View.Register)} />;
            case View.ResetPassword: return <ResetPasswordView onNavigate={setLoginView} />;
            case View.PasswordResetSent: return <PasswordResetSentView onNavigate={setLoginView} />;
            case View.Login: default: return <LoginView onLogin={handleLogin} onNavigate={setLoginView} />;
        }
    }
    
    const showHeader = TAB_ROOT_VIEWS.includes(currentView) || currentView === View.Cart;

    const renderStack = (tab: View) => {
        const stack = navStacks[tab] || [];
        if (stack.length === 0) return null;

        const exitingViewData = exitingViews[tab];
        
        return (
            <>
                {stack.map((view, index) => {
                    const isTop = index === stack.length - 1;
                    const isPopping = exitingViewData?.view === view;
                    const isPushing = isTop && stack.length > 1 && !isTransitioning;
                    
                    let animationClass = '';
                    const zIndex = index * 5;
                    let style: React.CSSProperties = { zIndex };
                    
                    if (isSwiping && isTop) {
                         style.transform = `translateX(${swipeTranslateX}px)`;
                         style.transition = 'none';
                    }
                     if (isSwiping && index === stack.length - 2) {
                        const parallax = -30 + (swipeTranslateX / window.innerWidth) * 30;
                        style.transform = `translateX(${parallax}%)`;
                        style.transition = 'none';
                    }

                    return (
                        <div
                            key={`${tab}-${view}-${index}`}
                            className="view-screen"
                            style={style}
                            onTouchStart={isTop ? handleTouchStart : undefined}
                            onTouchMove={isTop ? handleTouchMove : undefined}
                            onTouchEnd={isTop ? handleTouchEnd : undefined}
                        >
                            <div className="h-full overflow-y-auto scrollbar-hide">{renderView(view)}</div>
                        </div>
                    );
                })}

                {exitingViewData && (
                    <div
                        key={exitingViewData.key}
                        className="view-screen animation-pop-exit"
                        style={{ zIndex: stack.length * 5 }}
                    >
                        <div className="h-full overflow-y-auto scrollbar-hide">{renderView(exitingViewData.view)}</div>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="h-full flex flex-col bg-gray-100/90 font-sans">
            {showHeader && <Header cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)} onCartClick={() => push(View.Cart)} onHomeClick={resetToHome} />}
            
            <main className={`flex-grow overflow-hidden relative ${showHeader ? 'pt-16' : ''} pb-16`}>
                 {TAB_ROOT_VIEWS.map(tab => (
                    <div key={tab} className="w-full h-full" style={{ display: tab === activeTab ? 'block' : 'none'}}>
                        {renderStack(tab)}
                    </div>
                ))}
            </main>

            <BottomNavBar currentView={activeTab} onNavigate={switchTab} />
            <CustomizationModal isOpen={!!itemToCustomize} item={itemToCustomize} onClose={() => setItemToCustomize(null)} onAddToCart={confirmAddToCart} />
            
            {isToastVisible && (
                <div role="alert" aria-live="assertive" className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg z-[100] flex items-center justify-between min-w-[340px] max-w-md toast-animate">
                    <div className="flex items-center">
                        <i className={`fas ${toastMessage.includes("yêu thích") ? 'fa-heart text-red-400' : 'fa-check-circle text-green-400'} mr-3`}></i>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                    {currentView !== View.Cart && toastMessage.includes("giỏ hàng") &&
                        <button onClick={() => { push(View.Cart); setIsToastVisible(false); }} className="ml-4 font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap" aria-label="Xem giỏ hàng">
                            Xem giỏ hàng
                        </button>
                    }
                </div>
            )}
        </div>
    );
};

export default App;