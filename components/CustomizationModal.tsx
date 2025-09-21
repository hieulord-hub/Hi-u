
import React, { useState, useMemo, useEffect } from 'react';
import { FoodItem, CustomizationOption, CustomizationChoice, SelectedOption } from '../types';

interface CustomizationModalProps {
    isOpen: boolean;
    item: FoodItem | null;
    onClose: () => void;
    onAddToCart: (item: FoodItem, quantity: number, selectedOptions: SelectedOption[]) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, item, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOption[]>>({});

    // Reset state when a new item is passed
    useEffect(() => {
        if (item) {
            setQuantity(1);
            // Pre-select required single-choice options
            const initialSelections: Record<string, SelectedOption[]> = {};
            item.options?.forEach(option => {
                if (option.required && option.type === 'single' && option.choices.length > 0) {
                    const firstChoice = option.choices[0];
                    initialSelections[option.title] = [{
                        optionTitle: option.title,
                        choiceName: firstChoice.name,
                        choicePrice: firstChoice.price,
                    }];
                } else {
                    initialSelections[option.title] = [];
                }
            });
            setSelectedOptions(initialSelections);
        }
    }, [item]);

    const handleOptionChange = (option: CustomizationOption, choice: CustomizationChoice) => {
        setSelectedOptions(prev => {
            const newSelections = { ...prev };
            const currentSelection = newSelections[option.title] || [];

            if (option.type === 'single') {
                newSelections[option.title] = [{
                    optionTitle: option.title,
                    choiceName: choice.name,
                    choicePrice: choice.price,
                }];
            } else { // multiple
                const existingIndex = currentSelection.findIndex(c => c.choiceName === choice.name);
                if (existingIndex > -1) {
                    // Deselect
                    newSelections[option.title] = currentSelection.filter(c => c.choiceName !== choice.name);
                } else {
                    // Select
                    newSelections[option.title] = [...currentSelection, {
                        optionTitle: option.title,
                        choiceName: choice.name,
                        choicePrice: choice.price,
                    }];
                }
            }
            return newSelections;
        });
    };

    const flatSelectedOptions = useMemo(() => {
        return Object.values(selectedOptions).flat();
    }, [selectedOptions]);

    const totalPrice = useMemo(() => {
        if (!item) return 0;
        const basePrice = item.price;
        const optionsPrice = flatSelectedOptions.reduce((sum, option) => sum + option.choicePrice, 0);
        return (basePrice + optionsPrice) * quantity;
    }, [item, quantity, flatSelectedOptions]);

    const isAddToCartDisabled = useMemo(() => {
        if (!item) return true;
        return item.options?.some(option => {
            if (!option.required) return false;
            const selection = selectedOptions[option.title];
            return !selection || selection.length === 0;
        }) ?? false;
    }, [item, selectedOptions]);

    const handleConfirm = () => {
        if (item && !isAddToCartDisabled) {
            onAddToCart(item, quantity, flatSelectedOptions);
        }
    };
    
    if (!isOpen || !item) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-end justify-center" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="customization-modal-title"
        >
            <div 
                className="bg-white w-full max-w-lg rounded-t-2xl transform transition-transform translate-y-0 flex flex-col" 
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b flex-shrink-0">
                    <div className="flex items-start">
                        <img src={item.imageUrls[0]} alt={item.name} className="w-20 h-20 rounded-lg object-cover mr-4"/>
                        <div>
                             <h2 id="customization-modal-title" className="text-xl font-bold text-gray-800">{item.name}</h2>
                             <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                         <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-800 flex-shrink-0" aria-label="Đóng">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>

                {/* Options */}
                <div className="p-5 overflow-y-auto scrollbar-hide flex-grow">
                    {item.options?.map(option => (
                        <div key={option.id} className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">{option.title} {option.required && <span className="text-red-500">*</span>}</h3>
                            <div className="space-y-3">
                                {option.choices.map(choice => {
                                    const isSelected = selectedOptions[option.title]?.some(c => c.choiceName === choice.name);
                                    return (
                                        <label key={choice.name} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
                                            <div className="flex-grow">
                                                <span className="font-medium text-gray-800">{choice.name}</span>
                                            </div>
                                            {choice.price > 0 && <span className="text-gray-600 mr-4">+{choice.price.toLocaleString('vi-VN')}đ</span>}
                                            <input
                                                type={option.type === 'single' ? 'radio' : 'checkbox'}
                                                name={option.id}
                                                checked={isSelected}
                                                onChange={() => handleOptionChange(option, choice)}
                                                className={`form-${option.type === 'single' ? 'radio' : 'checkbox'} h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300`}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white shadow-inner flex-shrink-0">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 border border-gray-200 rounded-full p-1 w-fit">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Giảm số lượng">
                                <i className="fas fa-minus"></i>
                            </button>
                            <span className="font-bold w-10 text-center text-gray-800 text-lg" aria-live="polite">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Tăng số lượng">
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
                     </div>
                     <button
                        onClick={handleConfirm}
                        disabled={isAddToCartDisabled}
                        className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                     >
                        Thêm vào giỏ hàng
                     </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;
