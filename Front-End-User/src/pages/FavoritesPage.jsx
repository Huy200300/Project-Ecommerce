import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaHeart, FaRegHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import displayCurrency from '../helpers/displayCurrency';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import { useRef } from 'react';
import { useEffect } from 'react';


const FavoritesPage = () => {
  const { favorites, removeFavorite, addFavorite } = useFavorites();
  const [compareList, setCompareList] = useState([]);
  const [showMoreLike, setShowMoreLike] = useState(null);
  const [dataShowMoreLike, setDataShowMoreLike] = useState([]);
  const navigate = useNavigate()
  const showMoreLikeRef = useRef(null);

  useEffect(() => {
    if (showMoreLike && showMoreLikeRef.current) {
      showMoreLikeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showMoreLike]);

  const handleCompare = (product, isChecked) => {
    if (isChecked) {
      setCompareList([...compareList, product]);
    } else {
      setCompareList(compareList.filter((p) => p._id !== product._id));
    }
  };

  const handleAddToCart = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();
    navigate(`/product/${product}`)
  };

  const handleSeeMoreLike = async (productId, category) => {
    if (showMoreLike === productId) {
      setShowMoreLike(null);
    } else {
      setShowMoreLike(productId);
      const fetchData = await fetchCategoryWiseProduct(category);
      setDataShowMoreLike(fetchData?.data);
    }
  };

  const isFavorite = (data) => favorites?.some(item => item?._id === data?._id);

  const handleFavoriteClick = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (isFavorite(product)) {
      removeFavorite(product?._id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className='flex relative items-center gap-5 pb-6'>
        <h1 className="text-2xl font-bold uppercase w-36">Sản phẩm yêu thích</h1>
        <span className='font-medium'>
          <Link to="/" className='hover:text-red-500 capitalize cursor-pointer'>Trang chủ</Link> / Sản Phẩm Yêu Thích
        </span>
        <div className='absolute bottom-0 left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] h-0.5 bg-slate-200 z-10'></div>
      </div>
      {
        favorites?.length > 0 ? (
          <div className="grid grid-cols-4 mt-10 gap-7">
            {favorites?.map((product) => (
              <div key={product._id} className={`relative ${showMoreLike === product._id ? "col-span-full" : "col-span-2"}"`}>
                <div className="cursor-pointer border-2 border-gray-200 p-4 rounded-lg relative transition-shadow duration-300 max-w-full hover:shadow-2xl">
                  <div className='flex items-end justify-end w-full'>
                    <button
                      onClick={() => removeFavorite(product?._id)}
                      className='p-2 group hover:bg-red-500 rounded-full'
                    >
                      <FaTimes className="text-red-500 group-hover:text-white" />
                    </button>
                  </div>
                  <img
                    src={product.productImage[0]}
                    alt="Product"
                    className="w-full h-48 mb-4 object-scale-down transition-transform duration-300"
                  />
                  <div className="mt-4 flex-grow">
                    <h2 className="text-xl font-bold text-center w-full line-clamp-1">{product.productName}</h2>
                    <div className="flex items-center justify-center my-2">
                      <span className="text-yellow-500 flex font-bold">
                        {product?.averageRating > 0 && (
                          <>
                            {[...Array(5)].map((_, index) => (
                              <FaStar key={index} className={`text-lg ${index < product?.averageRating?.toFixed(1) ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />
                            ))}
                          </>
                        )}
                      </span>
                      {product.reviewCount > 0 && <span className="ml-2 text-sm text-gray-600">({product.reviewCount})</span>}
                    </div>
                    <div className="flex items-center flex-col justify-center space-x-4 mt-2">
                      <div className="text-2xl font-bold">{displayCurrency(product.sellingPrice)}</div>
                      <div className="text-gray-500 line-through">{displayCurrency(product.price)}</div>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                      <div className="text-green-600 font-semibold text-xs">Nhận hàng hôm nay</div>
                      <div>
                        <button className="text-blue-600 font-bold hover:underline text-sm">Thêm ghi chú</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className={`flex font-semibold items-center justify-center text-nowrap w-full uppercase p-3 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => handleAddToCart(e, product._id)}
                      disabled={product.countInStock === 0}
                    >
                      Xem chi tiết
                    </button>
                    <div className='flex justify-between items-center mt-4'>
                      <div className=" flex items-center">
                        <label className="flex items-center text-gray-600">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={(e) => handleCompare(product, e.target.checked)}
                          />
                          <span className="ml-2 font-semibold">So sánh</span>
                        </label>
                      </div>
                      <div
                        onClick={() => handleSeeMoreLike(product._id, product.category)}
                        className=" text-blue-600 hover:underline cursor-pointer font-semibold flex gap-1 items-center"
                      >
                        Xem thêm
                        {showMoreLike === product._id ? <FiChevronUp className='text-xl text-black' /> : <FiChevronDown className='text-xl text-black' />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className='flex justify-center items-center h-96 w-full'>
            <div className="text-center">
              <p className='font-bold capitalize'>Có vẻ như bạn chưa lưu gì cả...</p>
              <p className='font-medium'>Khi bạn thấy nội dung nào đó mình thích, hãy nhấn "lưu" và chúng tôi sẽ theo dõi nội dung đó tại đây.</p>
              <p className='font-medium'>Bạn thậm chí có thể tạo danh sách để sắp xếp mọi thứ.</p>
            </div>
          </div>
        )
      }

      {showMoreLike && (
        <div
          ref={showMoreLikeRef}
          className="col-span-full mt-5 p-6 bg-white border-2 rounded-lg shadow-lg w-full relative">
          <button
            onClick={() => setShowMoreLike(null)}
            className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaTimes className="text-gray-500 hover:text-red-500" />
          </button>
          <h3 className="text-xl font-bold mb-4">Similar items</h3>
          <div className="relative">
            <button
              onClick={() => document.querySelector('.similar-items-scroll').scrollBy({ left: -200, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => document.querySelector('.similar-items-scroll').scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 z-10"
            >
              <FaChevronRight />
            </button>
            <div className="flex overflow-x-auto space-x-4 pb-4 similar-items-scroll w-full">
              {dataShowMoreLike?.map((pro) => (
                <div key={pro._id} className="flex-shrink-0 w-48 p-2 border rounded-md">
                  <button
                    onClick={(e) => handleFavoriteClick(e, pro)}
                    className={`p-2 flex justify-end w-full relative rounded-full hover:bg-gray-200 ${isFavorite(pro) ? "text-red-500 hover:text-black" : "hover:text-red-500"} hover-icon`}
                  >
                    {isFavorite(pro) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <img
                    src={pro.productImage[0]}
                    alt={pro.productName}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <div className="text-center text-sm line-clamp-2">{pro.productName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {compareList.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-bold mb-2">Products to Compare:</h3>
          <ul>
            {compareList?.map((p) => (
              <li key={p?._id}>{p.productName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
