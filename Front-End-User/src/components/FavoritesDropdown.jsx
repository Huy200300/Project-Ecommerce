import React, { useEffect } from 'react';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoIosClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import displayCurrency from '../helpers/displayCurrency';

const FavoritesDropdown = ({ isOpen, toggleDropdown, closeAll }) => {
    const { favorites, favoritesLength, removeFavorite, updateFavorite } = useFavorites();

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
        if (savedFavorites) {
            updateFavorite(savedFavorites);
        }
    }, [updateFavorite]);

    const handleRemove = (productId) => {
        removeFavorite(productId);
        const updatedFavorites = favorites.filter(item => item._id !== productId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    };

    return (
        <div className="relative mt-5 ml-3 inline-block text-left">
            <div>
                <button
                    onClick={toggleDropdown}
                    className="flex flex-col relative items-center text-white w-20"
                >
                    <IoIosHeartEmpty className='flex md:text-lg text-sm items-center md:w-7 w-5 h-5 md:h-7' />
                    <span className='text-sm font-medium'>Sản phẩm yêu thích</span>

                    <div className="absolute right-3 -top-2.5 w-5 h-5 text-center leading-20px rounded-full text-xs text-white bg-red-600">
                        {favoritesLength}
                    </div>
                </button>
            </div>

            {isOpen && (
                <div onClick={closeAll} className="origin-top-right absolute z-50 md:-right-[100%] right-0  mt-2 md:w-[400px] w-96 pt-3.5 pb-0 px-3.5 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1 max-h-44 overflow-y-scroll mb-4 flex flex-col gap-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {
                            favorites?.length > 0 ? (
                                <>
                                    {favorites.map((product, index) => (
                                        <div key={index} className="product-widget relative">
                                            <div className="product-img absolute top-0 left-0 w-[60px]">
                                                <img src={product?.productImage[0]} alt={product?.productName} className='w-full' />
                                            </div>
                                            <div className="product-body pl-[75px] min-h-[60px]">
                                                <h3 className="product-name text-base capitalize">
                                                    <Link to={"#"} className='font-bold hover:text-red-500'>{product?.productName}</Link>
                                                </h3>
                                                <h4 className="product-price text-sm text-black font-bold"><span className="qty font-normal mr-2.5">{product?.amount}x</span>{displayCurrency(product?.sellingPrice)}</h4>
                                            </div>
                                            <button onClick={() => handleRemove(product._id)} className="delete hover:bg-red-500 absolute top-0 left-0 h-3.5 w-3.5 text-center textbase p-0 bg-black border-none text-white">
                                                <IoIosClose />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="cart-summary border-t-2 py-3.5">
                                        <small>{favoritesLength} Mục đã chọn</small>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className='font-bold capitalize'>Có vẻ như bạn chưa lưu gì cả...</p>
                                    <p className='font-medium'>Khi bạn thấy nội dung nào đó mình thích, hãy nhấn "lưu" và chúng tôi sẽ theo dõi nội dung đó tại đây.</p>
                                    <p className='font-medium'>Bạn thậm chí có thể tạo danh sách để sắp xếp mọi thứ.</p>
                                </div>
                            )
                        }
                    </div>

                    <div className="cart-btns -mx-4">
                        <Link to={"/favorites"} className='inline-block w-full p-3 bg-black text-white text-center font-bold transition-all hover:bg-slate-800'>Xem chi tiết</Link>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default FavoritesDropdown;
