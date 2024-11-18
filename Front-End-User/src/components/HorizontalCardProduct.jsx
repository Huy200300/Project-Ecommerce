import React, { useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import calculateDiscount from '../helpers/calculateDiscount'
import fetchReviewStats from '../helpers/fetchReviewStats'
import { FaStar } from 'react-icons/fa'

const HorizontalCardProduct = ({ category, heading }) => {
  const navigate = useNavigate();
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingList = new Array(7).fill(null)
  const scrollElement = useRef()

  const fetchData = async (category) => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    const products = categoryProduct?.data || [];
    const productsWithReviews = await Promise.all(products.map(async (product) => {
      const reviewStats = await fetchReviewStats(product._id);
      return { ...product, ...reviewStats };
    }));
    setLoading(false);
    setdata(productsWithReviews);
  }

  const handleAddToCart = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();
    navigate(`/product/${product._id}`)
  };

  useEffect(() => {
    fetchData(category)
  }, [category])

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 350
  }
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 350
  }
  const handleShowMore = () => {
    navigate(`/product-category?category=${category}`)
  }

  return (
    <div className='max-w-screen-xl mx-auto px-4 mb-10 relative'>

      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold py-4'>{heading}</h2>
        <h2 onClick={handleShowMore} className='font-semibold text-blue-500 hover:underline hover:text-blue-600 cursor-pointer'>Xem thêm</h2>
      </div>
      <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all ease-in-out' ref={scrollElement}>
        <button onClick={scrollLeft} className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block'><FaAngleLeft /></button>
        <button onClick={scrollRight} className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block'><FaAngleRight /></button>
        {
          loading ? (
            loadingList?.map((product, index) => {
              return (
                <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
                  <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'>

                  </div>
                  <div className='p-4 grid w-full gap-2'>
                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse rounded-full'>{product?.productName}</h2>
                    <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
                    <div className='flex flex-col w-full'>
                      <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                      <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                    </div>
                    <button className=' rounded-full px-3 text-white py-1 text-sm mt-0.5 w-full bg-slate-200 animate-pulse'></button>
                  </div>
                </div>
              )
            })
          ) : (
            data?.map((product, index) => {
              return (
                <Link to={"product/" + product?._id} key={index} className='w-full min-w-[280px] md:min-w-[345px] max-w-[280px] md:max-w-[345px] h-44 bg-white rounded-sm shadow flex'>
                  <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                    <img src={product?.productImage[0]} alt={product?.category} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                  </div>
                  <div className='p-2 grid'>
                    <h2 className='font-semibold text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                    <div className='flex flex-col'>
                      <div className='flex gap-2 items-center'>
                        <p className='text-slate-500 font-semibold line-through text-sm'>{displayCurrency(product?.price)}</p>
                        <span className='bg-red-100 px-1.5 font-semibold text-red-400'>-{calculateDiscount(product?.price, product?.sellingPrice)}%</span>
                      </div>
                      <p className='text-red-600 font-semibold text-lg'>{displayCurrency(product?.sellingPrice)}</p>

                    </div>
                    <div className="flex items-center gap-5 px-1 text-sm text-gray-600 font-semibold mt-1">
                      {
                        product?.averageRating > 0 && <p className="text-yellow-500 flex items-center">
                          <span className="mr-1 flex gap-1 items-center"><FaStar /> {product?.averageRating || 0}</span>
                        </p>
                      }
                      {
                        product?.selled > 0 &&
                        <p>Đã bán: <span className="text-black">{product?.selled}</span></p>
                      }
                    </div>
                    <button
                      className={`bg-red-500 font-bold uppercase hover:bg-red-600 rounded-full px-3 text-white py-1 text-sm mt-0.5 ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.countInStock === 0}
                    >
                      Xem sản phẩm
                    </button>
                  </div>
                </Link>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default HorizontalCardProduct