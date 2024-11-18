import React, { useState, useRef, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import displayCurrency from '../helpers/displayCurrency';
import calculateDiscount from '../helpers/calculateDiscount';

const SearchDropdown = ({ suggestions, search, onSearchChange, onSearchSelect }) => {
    const [inputValue, setInputValue] = useState(search || '');
    const [isVisible, setIsVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchClick = (suggestion) => {
        setInputValue('');
        onSearchSelect(suggestion);
        setIsVisible(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const selectedSuggestion = suggestions?.some(s => s.productName.toLowerCase() === inputValue.toLowerCase());
            if (selectedSuggestion) {
                onSearchSelect(selectedSuggestion);
                navigate(`/search?q=${encodeURIComponent(selectedSuggestion.productName)}`);
            } else {
                navigate(`/search?q=${encodeURIComponent(inputValue)}`);
            }
            setIsVisible(false);
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onSearchChange(value);
        setIsVisible(value && suggestions.length > 0);
    };

    const handleFocus = () => {
        if (inputValue && suggestions.length > 0) {
            setIsVisible(true);
        }
    };

    return (
        <div className='relative w-full flex' ref={dropdownRef}>
            <input
                type='text'
                placeholder='Nhập tên điện thoại, máy tính, phụ kiện... cần tìm'
                className='w-full font-semibold outline-none pl-2 bg-white placeholder-black'
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
            />
            <div
                className='cursor-pointer text-2xl min-w-[50px] h-10 bg-red-600 flex items-center justify-center rounded-r-full text-white'
                onClick={() => {
                    const selectedSuggestion = suggestions.find(s => s.name.toLowerCase() === inputValue.toLowerCase());
                    if (selectedSuggestion) {
                        onSearchSelect(selectedSuggestion);
                    }
                }}
            >
                <IoIosSearch />
            </div>

            {isVisible && suggestions.length > 0 && (
                <ul className='absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-50'>
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion._id}
                            className='p-2 cursor-pointer hover:bg-gray-100 flex gap-2'
                            onClick={() => handleSearchClick(suggestion)}
                        >
                            <img src={suggestion.productImage[0]} alt={suggestion.productName} className='h-16 w-16' />
                            <div className='flex flex-col gap-1 font-semibold'>
                                <p>{suggestion.productName}</p>
                                <div className='flex flex-col text-sm'>
                                    <div className='flex gap-2 items-center'>
                                        <p className='text-red-600'>{displayCurrency(suggestion?.sellingPrice)}</p>
                                        {calculateDiscount(suggestion?.price, suggestion?.sellingPrice) !== 0 && <span className='bg-red-100 px-1.5 font-semibold text-red-400'>-{calculateDiscount(suggestion?.price, suggestion?.sellingPrice)}%</span>}   
                                    </div>
                                    <p className='line-through'>{displayCurrency(suggestion.price)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchDropdown;
