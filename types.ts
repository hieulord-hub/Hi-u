
export interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
    avatarUrl: string;
}

export interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    category: string;
    popularity: number;
    rating: number;
    reviews?: Review[];
}

export interface CartItem extends FoodItem {
    quantity: number;
}

export enum OrderStatus {
    Confirmed = 'Đã xác nhận',
    Preparing = 'Đang chuẩn bị',
    Delivering = 'Đang giao',
    Completed = 'Đã hoàn thành',
    Cancelled = 'Đã hủy',
}

export interface Shipper {
    name: string;
    avatarUrl: string;
    phone: string;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    timestamp: string;
    shipper?: Shipper;
    note?: string;
    discount?: number;
    finalTotal?: number;
}

export interface PaymentMethod {
    id: string;
    type: 'Mastercard' | 'Visa';
    last4: string;
    expiry: string;
}

export interface User {
    name: string;
    email: string;
    phone: string;
    paymentMethods?: PaymentMethod[];
    avatarUrl?: string;
    studentId?: string;
}

export enum View {
    Home = 'home',
    Cart = 'cart',
    Payment = 'payment',
    OrderStatus = 'orderStatus',
    Profile = 'profile',
    Favorites = 'favorites',
    Notifications = 'notifications',
    PaymentMethods = 'paymentMethods',
    FAQs = 'faqs',
    Feedback = 'feedback',
    Loyalty = 'loyalty',
    Chat = 'chat',
    Rating = 'rating',
    ProductDetail = 'productDetail',
    Login = 'login',
    Register = 'register',
    Verify = 'verify',
    Offers = 'offers',
    OrderHistory = 'orderHistory',
    OfferDetail = 'offerDetail',
    EditProfile = 'editProfile',
}

export interface Voucher {
    id: string;
    code: string;
    description: string;
    type: 'freeship' | 'percentage' | 'fixed';
    value: number; // percentage value or fixed amount
    minOrder?: number;
    applicableItemId?: number; // ID for item-specific vouchers
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    details: string;
    imgUrl: string;
}
