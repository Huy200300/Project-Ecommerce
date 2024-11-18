import React, { useContext, useEffect, useState } from 'react';
import scrollTop from '../helpers/scrollTop';
import displayCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import translatedCategory from '../helpers/translatedCategory';
import calculateDiscount from '../helpers/calculateDiscount';

const VerticalCart = ({ loading, data = [] }) => {
    const productList = Array.isArray(data) ? data : [];

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing saved cart from localStorage:", error);
            return [];
        }
    });

    const loadingList = new Array(6).fill(null);
    const { fetchUserAddToCart } = useContext(Context);
    const user = useSelector(state => state.user.user);

    const handleAddToCart = async (e, id, product) => {
        if (product.countInStock === 0) {
            toast.error("Sản phẩm đã hết hàng");
            return;
        }
        if (user === null) {
            e?.stopPropagation();
            e?.preventDefault();
            if (cart.find(item => item._id === product._id)) {
                toast.error("Sản phẩm đã có trong giỏ hàng");
                return;
            }
            const newCart = [...cart, { ...product, amount: 1 }];
            localStorage.setItem("cart", JSON.stringify(newCart));
            setCart(newCart);
            toast.success("Sản phẩm đã được thêm vào giỏ hàng");
        } else {
            await addToCart(e, id);
            fetchUserAddToCart();
        }
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <div className='flex flex-wrap justify-center gap-6'>
            {loading ? (
                loadingList?.map((_, index) => (
                    <div key={index} className='w-60 bg-white rounded-lg shadow-lg animate-pulse'>
                        <div className='bg-gray-200 h-40 w-full rounded-t-lg'></div>
                        <div className='p-4 space-y-3'>
                            <div className='h-4 bg-gray-200 rounded'></div>
                            <div className='h-3 bg-gray-200 rounded'></div>
                            <div className='flex justify-between items-center'>
                                <div className='h-4 bg-gray-200 rounded w-24'></div>
                                <div className='h-4 bg-gray-200 rounded w-12'></div>
                            </div>
                            <button className='w-full py-2 bg-gray-200 rounded'></button>
                        </div>
                    </div>
                ))
            ) : (
                productList?.map((product, index) => (
                    <div key={index} className='w-60 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                        <Link to={`/product/${product?._id}`} onClick={scrollTop}>
                            <div className='relative bg-gray-100 h-40 rounded-t-lg overflow-hidden'>
                                <img src={product?.productImage[0]} alt={product?.category} className='object-cover w-full h-full transform hover:scale-105 transition-transform duration-300' />
                                {product.countInStock === 0 && (
                                    <span className='absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded'>Hết hàng</span>
                                )}
                            </div>
                        </Link>
                        <div className='p-4 space-y-2'>
                            <Link to={`/product/${product?._id}`} onClick={scrollTop}>
                                <h2 className='text-lg font-semibold line-clamp-2'>{product?.productName}</h2>
                            </Link>
                            <p className='text-sm text-gray-500'>{translatedCategory(product?.category)}</p>
                            <div className='flex justify-between items-center'>
                                <p className='text-red-600 font-bold'>{displayCurrency(product?.sellingPrice)}</p>
                                {product?.price > product?.sellingPrice && (
                                    <p className='text-gray-400 line-through'>{displayCurrency(product?.price)}</p>
                                )}
                            </div>
                            {product?.price > product?.sellingPrice && (
                                <p className='text-sm text-red-500'>Giảm {calculateDiscount(product?.price, product?.sellingPrice)}%</p>
                            )}
                            {/* <button
                                className={`w-full py-2 mt-3 rounded text-white ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                                onClick={(e) => handleAddToCart(e, product?._id, product)}
                                disabled={product.countInStock === 0}
                            >
                                {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                            </button> */}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default VerticalCart;
