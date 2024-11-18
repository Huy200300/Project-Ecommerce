import React, { useContext, useEffect, useState } from 'react'
import brandProduct from '../helpers/brandProduct'
import { FaMedal } from 'react-icons/fa'
import SummaryAip from '../common'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import displayCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import translatedCategory from '../helpers/translatedCategory'
import calculateDiscount from '../helpers/calculateDiscount'

const BrandByProducts = ({ category }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing saved cart from localStorage:", error);
            return [];
        }
    });
    const [data, setData] = useState([])
    const user = useSelector(state => state.user.user);
    const [dataBrand, setDataBrand] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState(false)
    const navigate = useNavigate()
    const [filterCategory, setFilterCategory] = useState([])
    const loadingList = new Array(dataBrand?.length).fill(null)
    const { fetchUserAddToCart } = useContext(Context)
    const location = useLocation()
    const URLSearch = new URLSearchParams(location?.search)
    const URLCategoryListArray = URLSearch.getAll("category")
    const URLCategoryListObject = {}
    URLCategoryListArray.forEach(el => {
        URLCategoryListObject[el] = true
    })
    const [selectCategory, setSelectCategory] = useState(URLCategoryListObject)

    const fetchDataByBrand = async () => {
        setLoading(true)
        const dataResponse = await fetch(SummaryAip.filter_by_brand.url, {
            method: SummaryAip.filter_by_brand.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                category: filterCategory
            })
        })
        const dataApi = await dataResponse.json()
        setData(dataApi?.data || [])
        setLoading(false)
    }


    const fetchData = async () => {
        setLoadingText(true)
        const dataResponse = await fetch(SummaryAip.get_brand_apple.url, {
            method: SummaryAip.get_brand_apple.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                apple: category
            })
        })
        const dataApi = await dataResponse.json()
        setDataBrand(dataApi?.data)
        setLoadingText(false)
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
        fetchDataByBrand()
    }, [filterCategory])

    useEffect(() => {
        fetchData()
    }, [])

    const handleBrand = async (e) => {
        const { value, checked } = e.target
        setSelectCategory((prev) => {
            return {
                ...prev,
                [value]: checked
            }
        })
    }

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).map(categoryName => {
            if (selectCategory[categoryName]) {
                return categoryName
            }
            return null
        }).filter(el => el)
        setFilterCategory(arrayOfCategory)
        const urlFormat = arrayOfCategory.map((categoryName, index) => {
            if ((arrayOfCategory.length - 1) === index) {
                return `category=${categoryName}`
            }
            return `category=${categoryName}&&`
        })
        navigate("/product-category?" + urlFormat.join(""))
    }, [selectCategory])


    return (
        <div className='w-full'>
            <div className='border-2 rounded-md bg-white p-4 w-full'>
                <h1 className='uppercase text-center text-2xl'>sản phẩm apple</h1>
                <div className='flex sm:flex-wrap'>
                    <div className='flex gap-5 sm:flex-wrap'>
                        <div className='md:flex items-center flex-col justify-center hidden cursor-pointer'>
                            <div className='text-5xl border-2 p-5 rounded-full bg-yellow-200'>
                                <FaMedal />
                            </div>
                            <div className="text-base text-red-600 capitalize">
                                Sản phẩm nội bật
                            </div>
                        </div>
                        {
                            brandProduct?.map((data) => {
                                return (
                                    <div key={data?.id} className='flex items-center flex-col-reverse group sm:flex-wrap'>
                                        <label className='group-hover:text-red-600 uppercase relative'>{data?.label}</label>
                                        <form className='text-5xl border-2 p-5 rounded-full hover:bg-yellow-200 cursor-pointer relative'>
                                            <div>
                                                <input type="checkbox" checked={selectCategory[data?.value]} name={data?.value} value={data?.value} id={data?.value} className='hidden' onChange={handleBrand} />
                                                <label htmlFor={data?.value}  >
                                                    {data?.icon}
                                                </label>
                                            </div>
                                        </form>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='mt-2 border-2 rounded-md bg-white grid lg:grid-cols-5 grid-cols-2'>
                {
                    data?.length !== 0 && !loading ? (
                        data?.map((el) => {
                            return (
                                <div key={el._id} className='border'>
                                    {
                                        (
                                            <Link to={"/product/" + el?._id} key={el?._id} className='rounded-sm shadow ' >
                                                <div className='h-48 p-4 flex justify-center items-center'>
                                                    <img src={el?.productImage[0]} alt={el?.category} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                                </div>
                                                <div className='p-2 grid gap-3'>
                                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{el?.productName}</h2>
                                                    <p className='capitalize text-slate-500'>{el?.category}</p>
                                                    <div className='flex gap-3'>
                                                        <p className='text-red-600 font-medium'>{displayCurrency(el?.sellingPrice)}</p>
                                                        <p className='text-slate-500 line-through'>{displayCurrency(el?.price)}</p>
                                                    </div>
                                                    <button className='bg-red-500 hover:bg-red-600 rounded-full px-3 text-white py-1 text-sm mt-0.5' onClick={(e) => handleAddToCart(e, el?._id)}>Thêm vào Giỏ hàng</button>
                                                </div>
                                            </Link>
                                        )
                                    }
                                </div>
                            )
                        })
                    ) : (
                        loadingText ? (
                            loadingList?.map((el, index) => {
                                return (
                                    <div key={index} className='w-full bg-white rounded-sm shadow'>
                                        <div className='rounded-sm shadow ' >
                                            <div className='h-48 p-4 flex justify-center items-center bg-slate-200 animate-pulse'>

                                            </div>
                                            <div className='p-2 grid gap-3'>
                                                <p className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></p>
                                                <p className='capitalize text-slate-500 p-1 py-2 animate-pulse rounded-full bg-slate-200'></p>
                                                <div className='flex gap-3'>
                                                    <p className='text-red-600 font-medium p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                                    <p className='text-slate-500 line-through p-1 py-2 animate-pulse rounded-full bg-slate-200 w-full'></p>
                                                </div>
                                                <button className='rounded-full px-3 text-white py-2 text-sm mt-0.5 animate-pulse bg-slate-200' ></button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            dataBrand?.map((el) => {
                                return (
                                    <div key={el._id} className='border'>
                                        {
                                            (
                                                <Link to={"/product/" + el?._id} key={el?._id} className='rounded-sm shadow ' >
                                                    <div className='h-48 p-4 flex justify-center items-center'>
                                                        <img src={el?.productImage[0]} alt={el?.category} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                                    </div>
                                                    <div className='p-2 grid gap-3'>
                                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{el?.productName}</h2>
                                                        {translatedCategory(el?.category)}
                                                        <div className='flex gap-3'>
                                                            <p className='text-red-600 font-medium'>{displayCurrency(el?.sellingPrice)}</p>
                                                            <p className='text-slate-500 line-through'>{displayCurrency(el?.price)}</p>
                                                            <span className='bg-red-100 px-1.5 text-red-400'>-{calculateDiscount(el?.price, el?.sellingPrice)}%</span>
                                                        </div>
                                                        {/* <button
                                                            className={`bg-red-500 hover:bg-red-600 rounded-full px-3 text-white py-1 text-sm mt-0.5 ${el.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={(e) => handleAddToCart(e, el?._id, el)}
                                                            disabled={el.countInStock === 0}
                                                        >
                                                            {el.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                                                        </button> */}
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    </div>
                                )
                            })
                        )
                    )
                }
            </div>
        </div >
    )
}

export default BrandByProducts