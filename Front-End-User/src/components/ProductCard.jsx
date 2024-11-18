import React from 'react';
import { FaHeart, FaExchangeAlt, FaEye, FaRegHeart } from 'react-icons/fa';
import translatedCategory from '../helpers/translatedCategory';
import displayCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';

const ProductCard = ({ data, handleAddToCart, handleFavoriteClick, handleCompare, isFavorite, loading }) => {
    return (
        <>
            {!loading && data &&
                data?.map((product, index) => (
                    <div key={index} className="group cursor-pointer border-2 border-gray-200 p-4 rounded-lg relative overflow-hidden transition-shadow duration-300 max-w-full hover:shadow-2xl">
                        <img
                            src={product?.productImage[0] || product.productImage}
                            alt={product.productName}
                            className="w-full h-48 mb-4 object-scale-down transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col items-center gap-1 w-full">
                            <p className="text-sm font-semibold">{translatedCategory(product.category)}</p>
                            <p className="text-xl font-bold text-center w-full truncate-2-lines">{product.productName}</p>
                            <p className="text-lg font-semibold text-red-500">{displayCurrency(product.sellingPrice)}</p>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={(e) => handleFavoriteClick(e, product)}
                                    className={` icon-wrapper bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition ease-in-out ${isFavorite(product) ? "text-red-500 hover:text-black" : "hover:text-red-500 text-white "} `}
                                >
                                    {isFavorite(product) ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                                    <span className="tooltip capitalize">
                                        {isFavorite(product) ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                                    </span>
                                </button>
                                <button onClick={(e) => handleCompare(e, product)} className="text-white icon-wrapper bg-gray-700 p-2 rounded-full hover:bg-gray-600 hover:text-red-600 transition ease-in-out">
                                    <FaExchangeAlt size={24} />
                                    <span className="tooltip capitalize">Thêm vào so sánh</span>
                                </button>
                                <Link to={"/product/" + product?._id} className="text-white cursor-pointer icon-wrapper bg-gray-700 p-2 rounded-full hover:bg-gray-600 hover:text-red-600 transition ease-in-out">
                                    <FaEye size={24} />
                                    <span className="tooltip capitalize">Xem nhanh</span>
                                </Link>
                            </div>
                            {/* <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={product.countInStock === 0}
                                className={`bg-red-500 flex gap-2 items-center uppercase hover-btn text-white py-2 px-4 rounded-full font-semibold  duration-500 ease-in-out hover:bg-red-600 hover:border-white ${data.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <FaShoppingCart
                                    size={20}
                                    className="text-white mr-2 hover-icon transition-all duration-300 hidden"
                                />
                                {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                            </button> */}
                        </div>
                    </div>
                ))}
        </>
    );
};

export default ProductCard;
