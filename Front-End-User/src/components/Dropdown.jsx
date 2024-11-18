import React, { useEffect, useState } from 'react';
import { MdShoppingCart } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosClose } from "react-icons/io";
import { FaArrowCircleRight } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import displayCurrency from '../helpers/displayCurrency';
import { useSelectedProducts } from '../context/SelectedProducts';

const Dropdown = ({ isOpen, toggleDropdown, closeAll }) => {
    const { cart, cartLength, removeFromCart, updateCart } = useCart();
    const { addToSelectedProducts } = useSelectedProducts()
    const [totalPrice, setTotalPrice] = useState(0);
    const naviagte = useNavigate()

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            updateCart(savedCart);
        }
    }, [updateCart]);

    useEffect(() => {
        const newTotalPrice = cart.reduce((total, product) => {
            const price = product?.sellingPrice || 0;
            return total + (product?.amount * price);
        }, 0);

        setTotalPrice(newTotalPrice);
    }, [cart]);

    const handleRemove = (productId) => {
        removeFromCart(productId);
        const updatedCart = cart.filter(item => item._id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCheckOut = (selected) => {
        addToSelectedProducts(selected)
        naviagte("/payment")
    }


    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={toggleDropdown}
                    className="flex flex-col relative items-center text-white w-20"
                >
                    <MdShoppingCart className='flex md:text-lg text-sm items-center md:w-7 w-5 h-5 md:h-7' />
                    <span className='text-sm font-medium'>Giỏ Hàng</span>

                    <div className="qty absolute right-3 -top-2.5 w-5 h-5 text-center leading-20px rounded-full text-xs text-white bg-red-600">
                        {cartLength}
                    </div>
                </button>
            </div>

            {isOpen && (
                <div onClick={closeAll} className="origin-top-right absolute z-50 right-0 mt-2 w-80 pt-3.5 pb-0 px-3.5 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1 max-h-44 overflow-y-scroll mb-4 flex flex-col gap-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {
                            cart?.length > 0 ? (
                                cart.map((product, index) => (
                                    <div key={index} className="product-widget relative">
                                        <div className="product-img absolute top-0 left-0 w-[60px]">
                                            {product?.productImage?.length > 0 ? (
                                                <img src={product?.productImage[0]} alt={product?.productName} className='w-full' />
                                            ) : (
                                                <img src="/path/to/default-image.jpg" alt="default" className='w-full' />
                                            )}
                                        </div>
                                        <div className="product-body pl-[75px] min-h-[60px]">
                                            <h3 className="product-name text-base capitalize"><Link to={"#"} className='font-bold hover:text-red-500'>{product?.productName}</Link></h3>
                                            <h4 className="product-price text-sm text-black font-bold"><span className="qty font-normal mr-2.5">{product?.amount}x</span>{displayCurrency(product?.sellingPrice)}</h4>
                                        </div>
                                        <button onClick={() => handleRemove(product._id)} className="delete hover:bg-red-500 absolute top-0 left-0 h-3.5 w-3.5 text-center textbase p-0 bg-black border-none text-white"><IoIosClose /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Giỏ hàng trống</p>
                            )
                        }
                    </div>
                    <div className="cart-summary border-t-2 py-3.5">
                        <small>{cartLength} Mục đã chọn</small>
                        <h5 className='font-bold'>TỔNG CỘNG: {displayCurrency(totalPrice)}</h5>
                    </div>
                    <div className="cart-btns -mx-4">
                        <Link to={"/cart"} className='inline-block w-1/2 p-3 bg-black text-white text-center font-bold transition-all -mr-1 hover:bg-slate-800'>Xem Chi Tiết</Link>
                        <button onClick={() => handleCheckOut(cart)} className='inline-flex items-center gap-2 justify-center w-1/2 p-3 bg-red-600 text-white text-center font-bold transition-all hover:bg-red-500 '>Thanh Toán  <FaArrowCircleRight /> </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
