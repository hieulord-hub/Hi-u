import React from 'react';
import { FTU_LOGO_URL } from '../constants';

interface HeaderProps {
    cartItemCount: number;
    onCartClick: () => void;
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onHomeClick }) => {
    return (
        <header className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 bg-[linear-gradient(to_top,rgba(220,38,38,0.9),rgba(255,255,255,0.7))] backdrop-blur-sm">
            <button onClick={onHomeClick} className="flex items-center space-x-3 text-left">
                <img src={FTU_LOGO_URL} alt="FTU Logo" className="h-12 w-12 object-cover rounded-full"/>
                <h1 className="text-xl font-bold text-white">FTU YUM</h1>
            </button>
            <div className="relative">
                <button id="cart-icon" onClick={onCartClick} className="text-white/80 hover:text-white p-2 rounded-full transition-colors">
                    <i className="fas fa-shopping-cart text-2xl"></i>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white/80">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;