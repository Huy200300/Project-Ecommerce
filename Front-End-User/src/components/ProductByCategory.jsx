import React, { useContext, useEffect, useState } from 'react'
import Context from '../context'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
import displayCurrency from '../helpers/displayCurrency'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import translatedCategory from '../helpers/translatedCategory'
import calculateDiscount from '../helpers/calculateDiscount'

const ProductByCategory = ({ reload, category, handleSortBy }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing saved cart from localStorage:", error);
            return [];
        }
    });
    const [data, setdata] = useState([])
    const user = useSelector(state => state.user.user);
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(data?.length).fill(null)
    const { fetchUserAddToCart } = useContext(Context)
    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setdata(categoryProduct?.data)
    }
    const handleAddToCart = async (e, id, product) => {
        if (product.countInStock === 0) {
            toast.error("Sản phẩm đã hết hàng");
            return;
        }
        if (user === null) {
            e?.stopPropagation();
            e?.preventDefault();
            if (cart.find(item => item._id === product._id)) {
                toast.error("Sản phẩm đã có trong giỏ hàng")
                return;
            }
            const newCart = [...cart, { ...product, amount: 1 }];
            localStorage.setItem("cart", JSON.stringify(newCart));
            setCart(newCart);
            toast.success("Sản phẩm đã được thêm vào giỏ hàng")
        } else {
            await addToCart(e, id)
            fetchUserAddToCart()
        }
    }
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className='grid lg:grid-cols-[repeat(auto-fit,minmax(260px,300px))] gap-5 grid-cols-2 lg:justify-between lg:gap-4 overflow-x-scroll scrollbar-none transition-all'>
            {
                reload && loading ? (
                    loadingList?.map((product, index) => {
                        return (
                            <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
                                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                                </div>
                                <div className='p-2 grid gap-3'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'>{product?.productName}</h2>
                                    <p className='capitalize text-slate-500 p-1 py-2 animate-pulse rounded-full bg-slate-200'></p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-600 font-medium p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                        <p className='text-slate-500 line-through p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                    </div>
                                    <button className='rounded-full px-3 text-white py-2 text-sm mt-0.5 animate-pulse bg-slate-200'></button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    data?.map((product, index) => {
                        return (
                            <Link to={"/product/" + product?._id} key={index} className='lg:w-full min-w-[280px] lg:min-w-[300px] max-w-[290px] lg:max-w-[310px] bg-white rounded-sm shadow' >
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
                                        onClick={(e) => handleAddToCart(e, product?._id, product)}
                                        disabled={product.countInStock === 0}
                                    >
                                        {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                                    </button> */}
                                </div>
                            </Link>
                        )
                    })
                )
            }
        </div>
    )
}

export default ProductByCategory