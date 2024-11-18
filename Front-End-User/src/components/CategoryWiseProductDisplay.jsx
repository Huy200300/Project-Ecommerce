import React, { useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import scrollTop from '../helpers/scrollTop';
import translatedCategory from '../helpers/translatedCategory';
import calculateDiscount from '../helpers/calculateDiscount';
import { useCart } from '../context/CartContext';

const CategoryWiseProductDisplay = ({ category, heading}) => {
    const [data, setdata] = useState([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(7).fill(null);

    const fetchData = async (category) => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);
        setdata(categoryProduct?.data || []);
    };

    const handleAddToCart = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();
        addToCart(product);
    };

    useEffect(() => {
        if (category) {
            fetchData(category);
        }
    }, [category]);

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl py-4 w-full font-bold uppercase flex items-center justify-center'>{heading}</h2>
            <div className='grid md:grid-cols-3 grid-cols-2 justify-between gap-6 overflow-x-scroll scrollbar-none transition-all'>
                {
                    loading ? (
                        loadingList?.map((_, index) => (
                            <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
                                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                                </div>
                                <div className='p-2 grid gap-3'>
                                    <p className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></p>
                                    <p className='capitalize text-slate-500 p-1 py-2 animate-pulse rounded-full bg-slate-200'></p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-600 font-medium p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                        <p className='text-slate-500 line-through p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                    </div>
                                    <button className='rounded-full px-3 text-white py-2 text-sm mt-0.5 animate-pulse bg-slate-200'></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        data?.map((product, index) => (
                            <Link to={`/product/${product?._id}`} key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow' onClick={() => scrollTop()}>
                                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                    <img src={product?.productImage[0]} alt={product?.category} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                </div>
                                <div className='p-2 grid gap-3'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                    {translatedCategory(product?.category)}
                                    <div className='flex gap-3'>
                                        <p className='text-red-600 font-medium'>{displayCurrency(product?.sellingPrice)}</p>
                                        <p className='text-slate-500 line-through'>{displayCurrency(product?.price)}</p>
                                        <span className='bg-red-100 px-1.5 text-red-400'>-{calculateDiscount(product?.price, product?.sellingPrice)}%</span>
                                    </div>
                                    {/* <button
                                        className={`bg-red-500 hover:bg-red-600 rounded-full px-3 text-white py-1 text-sm mt-0.5 ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.countInStock === 0}
                                    >
                                        {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                                    </button> */}
                                </div>
                            </Link>
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default CategoryWiseProductDisplay;
