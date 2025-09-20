import React from 'react';
import { View } from '../types';

interface NavItemProps {
    view: View;
    label: string;
    icon: string;
    isActive: boolean;
    onNavigate: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, isActive, onNavigate }) => (
    <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center w-1/4 h-full text-center transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-white/70 hover:text-white'
        }`}
    >
        <i className={`fas ${icon} text-xl`}></i>
        <span className={`mt-1 text-xs font-semibold ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

interface BottomNavBarProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onNavigate }) => {
    const navItems = [
        { view: View.Home, label: 'Trang chủ', icon: 'fa-home' },
        { view: View.Offers, label: 'Ưu đãi', icon: 'fa-tags' },
        { view: View.Favorites, label: 'Yêu thích', icon: 'fa-heart' },
        { view: View.Profile, label: 'Tài khoản', icon: 'fa-user' },
    ];

    return (
        <nav className="absolute bottom-0 left-0 right-0 h-16 z-40 flex bg-[linear-gradient(to_top,rgba(220,38,38,0.9),rgba(255,255,255,0.7))] backdrop-blur-sm">
            {navItems.map(item => (
                <NavItem
                    key={item.view}
                    {...item}
                    isActive={currentView === item.view}
                    onNavigate={onNavigate}
                />
            ))}
        </nav>
    );
};

export default BottomNavBar;