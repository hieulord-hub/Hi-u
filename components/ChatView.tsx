import React, { useState, useEffect, useRef } from 'react';
import { Shipper } from '../types';

interface ChatViewProps {
    shipper: Shipper | undefined;
    onBack: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'shipper';
    timestamp: string;
}

const ChatView: React.FC<ChatViewProps> = ({ shipper, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (shipper) {
            setMessages([
                {
                    id: 1,
                    text: `Chào bạn, mình là ${shipper.name}. Mình đang trên đường giao hàng, bạn đợi chút nhé!`,
                    sender: 'shipper',
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [shipper]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate shipper response
        setTimeout(() => {
            const shipperResponse: Message = {
                id: Date.now() + 1,
                text: "Mình nhận được tin nhắn rồi, mình sẽ tới ngay!",
                sender: 'shipper',
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, shipperResponse]);
        }, 1500);
    };

    if (!shipper) {
        return (
            <div className="p-4 text-center">
                <p>Không tìm thấy thông tin shipper.</p>
                <button onClick={onBack} className="text-red-500 mt-4">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-white shadow-md flex items-center p-3">
                <button onClick={onBack} className="text-gray-600 hover:text-red-600 mr-3">
                    <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <img src={shipper.avatarUrl} alt={shipper.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <h2 className="font-bold text-gray-800">{shipper.name}</h2>
                    <p className="text-xs text-green-500">Đang hoạt động</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100 scrollbar-hide">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'shipper' && <img src={shipper.avatarUrl} className="w-6 h-6 rounded-full" />}
                             <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-red-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-red-100' : 'text-gray-400'}`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-2 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        autoComplete="off"
                    />
                    <button type="submit" className="w-12 h-12 bg-red-600 text-white rounded-full flex-shrink-0 flex items-center justify-center hover:bg-red-700 transition-colors">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;