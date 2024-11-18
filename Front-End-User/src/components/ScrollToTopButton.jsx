// ScrollToTopButton.js
import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaPhone, FaTimes } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { FaFacebookMessenger } from 'react-icons/fa6';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const toggleContact = () => {
        setShowContact(!showContact);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const calculatePosition = (index, totalItems) => {
        const angle = (index / (totalItems - 1)) * Math.PI - Math.PI / 2;
        const radius = 3.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { x, y };
    };

    const items = [
        { icon: FaPhone, colorClass: 'bg-green-gradient', link: 'tel:+1234567890' },
        { icon: SiZalo, colorClass: 'bg-blue-gradient', link: 'mailto:example@example.com' },
        { icon: FaFacebookMessenger, colorClass: 'bg-indigo-gradient', link: '' },
    ];

    return (
        <div className="fixed bottom-24 right-3 flex flex-col items-end">
            {isVisible && !showContact && (
                <button
                    onClick={scrollToTop}
                    className="p-3 mb-2 bg-slate-500 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors"
                >
                    <FaArrowUp className="h-5 w-5" />
                </button>
            )}
            <div className="fixed bottom-10 right-3 flex flex-col items-center">
                {showContact && (
                    <div className="relative">
                        {items.map((item, index) => {
                            const { x, y } = calculatePosition(index, items.length);
                            return (
                                <a
                                    key={index}
                                    href={item.link}
                                    className={`absolute ${item.colorClass} text-white p-3 rounded-full shadow-lg transition-colors`}
                                    style={{
                                        top: `calc(50% - ${y}rem)`,
                                        right: `calc(50% + ${x}rem)`,
                                        transform: `translate(-50%, -50%)`,
                                    }}
                                >
                                    <item.icon className="h-5 w-5" />
                                </a>
                            );
                        })}
                    </div>
                )}
                <button
                    onClick={toggleContact}
                    className={`p-3 ${showContact ? 'bg-red-500' : 'bg-blue-gradient'} text-white rounded-full shadow-lg hover:${showContact ? 'bg-red-700' : 'bg-blue-700'} transition-transform transform hover:scale-110 mb-2`}
                    style={{ transition: 'all 0.3s ease' }}
                >
                    {showContact ? <FaTimes className="h-5 w-5" /> : <FaPhone className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

export default ScrollToTopButton;
