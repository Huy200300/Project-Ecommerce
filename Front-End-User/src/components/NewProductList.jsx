import React, { useEffect, useRef, useState } from 'react'
import ProductsListCards from './ProductsListCards';
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import fetchReviewStats from '../helpers/fetchReviewStats';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProductCompare } from '../context/ProductCompareContext';


const NewProductList = () => {
    const [data, setData] = useState([])
    const scrollElement = useRef()
    const { addToCart } = useCart();
    const { addFavorite, favorites, removeFavorite } = useFavorites();
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(10).fill(null)
    const { closeCompareModal, addToCompare } = useProductCompare();

    const fetchData = async (limit = 10, days = 50) => {
        setLoading(true)
        const res = await fetch(SummaryAip.get_new_product.url, {
            method: SummaryAip.get_new_product.method,
            "credentials": "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ limit, days })
        })
        const dataApi = await res.json();

        if (dataApi?.success) {
            const products = dataApi?.data || [];
            const productsWithReviews = await Promise.all(products.map(async (product) => {
                const reviewStats = await fetchReviewStats(product._id);
                return { ...product, ...reviewStats };
            }));
            setLoading(false)
            setData(productsWithReviews)
        } else if (dataApi?.error) {
            setLoading(false)
            toast(dataApi?.message)
        }
    }

    useEffect(() => { fetchData() }, [])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 259.6
    }
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 259.6
    }
    const handleOnChange = async (value, limit = 10, days = 10) => {
        setLoading(true)
        const res = await fetch(SummaryAip.get_new_product_by_category.url, {
            method: SummaryAip.get_new_product_by_category.method,
            "credentials": "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ limit, days, category: value })
        })
        const dataApi = await res.json();
        if (dataApi?.success) {
            const products = dataApi?.data || [];
            const productsWithReviews = await Promise.all(products.map(async (product) => {
                const reviewStats = await fetchReviewStats(product._id);
                return { ...product, ...reviewStats };
            }));
            setLoading(false)
            setData(productsWithReviews)
        } else if (dataApi?.error) {
            setLoading(false)
            toast(dataApi?.message)
        }
    }

    const isFavorite = (data) => favorites?.some(item => item?._id === data?._id);

    const handleFavoriteClick = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();

        if (isFavorite(product)) {
            removeFavorite(product?._id)
        } else {
            addFavorite(product)
        }
    };

    const handleAddToCart = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();
        addToCart(product);
    };

    const handleCompare = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();
        closeCompareModal()
        addToCompare(product);
    }

    return (
        <div className="max-w-screen-xl mx-auto py-1 mt-9">
            <div className='flex items-center justify-between mb-6'>
                <h2 className="text-2xl font-bold uppercase">Sản phẩm mới</h2>
                <div className='flex items-center justify-center gap-3 text-sm font-semibold text-slate-500'>
                    <div className="relative group inline-block">
                        <button onClick={() => handleOnChange("laptop")} className="relative capitalize font-semibold text-current focus:outline-none after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#D10024] after:transition-all after:duration-200 group-hover:after:w-full focus:after:w-full">
                            laptops
                        </button>
                    </div>
                    <div className="relative group inline-block">
                        <button onClick={() => handleOnChange("mobiles")} className="relative font-semibold text-current focus:outline-none after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#D10024] after:transition-all after:duration-200 group-hover:after:w-full focus:after:w-full">
                            Smartphones
                        </button>
                    </div>
                    <div className="relative group inline-block">
                        <button onClick={() => handleOnChange("ipad")} className="relative font-semibold text-current focus:outline-none after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#D10024] after:transition-all after:duration-200 group-hover:after:w-full focus:after:w-full">
                            Ipad
                        </button>
                    </div>
                    <div className="relative group inline-block">
                        <button onClick={() => handleOnChange("televisions")} className="relative font-semibold text-current focus:outline-none after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#D10024] after:transition-all after:duration-200 group-hover:after:w-full focus:after:w-full">
                            Televisions
                        </button>
                    </div>
                </div>
            </div>
            {
                loading ? <div className='flex space-x-4 overflow-scroll scrollbar-none transition-all ease-in-out' ref={scrollElement}>
                    {
                        loadingList.map((_, index) => {
                            return (
                                <div key={index} className="border-2 group hover:border-red-500 p-4 w-full min-w-[203px] md:min-w-[243px] max-w-[203px] md:max-w-[243px] rounded-md shadow-lg relative hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative w-full">
                                        <div className="h-48 p-4 pt-12 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
                                        </div>

                                        <div className="absolute top-2 rounded-sm right-16 bg-red-500 border-2 border-red-500 text-white px-2 py-1 text-xs font-bold">

                                        </div>
                                        <div className="absolute top-2 right-2 rounded-sm border-2 border-red-500 text-red-500 px-2 py-1 text-xs font-bold">

                                        </div>


                                    </div>
                                    <div className="text-center mt-4">
                                        <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full"></p>
                                        <h3 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse rounded-full">{ }</h3>
                                        <div className="mt-2 flex flex-col gap-2 w-full">
                                            <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                            <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                        </div>
                                        <div className="mt-5 border-b-2 relative flex justify-center">
                                            <span className="absolute -bottom-2 bg-white px-2">
                                                <div className="flex gap-2 items-center">
                                                    <span className="flex text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full">

                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center space-y-4 mt-5 relative">
                                        <div className="flex justify-center space-x-4">
                                            <button

                                                className="p-2 text-white text-sm relative rounded-full bg-gray-200 animate-pulse"
                                            >

                                            </button>

                                            <button

                                                className="p-2 text-white text-sm relative rounded-full bg-gray-200 animate-pulse"
                                            >

                                            </button>
                                            <button

                                                className="p-2 text-white  text-sm relative rounded-full bg-gray-200 animate-pulse"
                                            >

                                            </button>
                                        </div>

                                        <button className=' rounded-full px-3 text-white py-1 text-sm mt-0.5 w-full bg-slate-200 animate-pulse'></button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> : <div className="flex space-x-4 overflow-scroll scrollbar-none transition-all ease-in-out" ref={scrollElement}>
                    {data?.map((product) => (
                        <ProductsListCards
                            key={product._id} handleCompare={handleCompare} isFavorite={isFavorite} data={product} handleAddToCart={handleAddToCart} handleFavoriteClick={handleFavoriteClick} />
                    ))}
                </div>
            }


            <div className='flex gap-2 items-center justify-end mt-1'>
                <button onClick={scrollLeft} className='bg-white shadow-md rounded-full p-1 text-center hover:bg-red-500 hover:text-white text-lg '><FaAngleLeft /></button>
                <button onClick={scrollRight} className='bg-white shadow-md rounded-full text-center hover:bg-red-500 hover:text-white p-1 text-lg '><FaAngleRight /></button>
            </div>
        </div>
    )
}

export default NewProductList