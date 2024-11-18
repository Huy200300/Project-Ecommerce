import React, { useEffect, useState } from "react";
import { FaHeart, FaExchangeAlt, FaFacebookF, FaTwitter, FaGooglePlusG, FaEnvelope, FaStar, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import displayCurrency from "../helpers/displayCurrency";
import { toast } from 'react-toastify';
import { useTabContext } from '../context/TabContext';
import { FaCheck } from 'react-icons/fa';
import translatedCategory from "../helpers/translatedCategory";
import SummaryAip from "../common";


const ProductInfo = ({ data, productId, handleCompare, handleAddToCart, handleFavoriteClick, isFavorite, updateQuantity, count, selectedColor, setSelectedColor }) => {
    const [loading, setLoading] = useState(false);
    const [totalReview, setTotalReview] = useState(0);
    const { setActiveTab, setScrollToReviews } = useTabContext();
    const [dataReview, setDataReview] = useState([])
    const [averageRating, setAverageRating] = useState(0);

    const [selectedStorage, setSelectedStorage] = useState("");
    const [availableColors, setAvailableColors] = useState([]);
    const [displayPrice, setDisplayPrice] = useState(data.sellingPrice);
    const [displayOriginalPrice, setDisplayOriginalPrice] = useState(data.price);

    const handleReviewClick = () => {
        setActiveTab("reviews");
        setScrollToReviews(true);
    };

    const fetchReviews = async (page = 1, limit = 3, productId) => {
        setLoading(true);
        const response = await fetch(
            `http://localhost:8080/api/get-reviews?page=${page}&limit=${limit}`,
            {
                method: SummaryAip.getReview.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ productId }),
            }
        );
        setLoading(false);
        const dataApi = await response.json();
        if (dataApi?.success) {
            setTotalReview(dataApi?.totalReview?.count);
            setDataReview(dataApi?.data)
        } else {
            toast.error(dataApi?.message);
        }
    };

    useEffect(() => {
        const sum = dataReview?.reduce((acc, curr) => acc + curr?.rating, 0);
        if (dataReview.length > 0) {
            setAverageRating(sum / dataReview?.length);
        } else {
            setAverageRating(0);
        }
    }, [dataReview]);

    useEffect(() => {
        fetchReviews(1, 3, productId);
    }, [productId]);

    useEffect(() => {
        if (data?.colors?.length > 0 && !selectedColor) {
            setSelectedColor(data.colors[0].colorName);
        }
    }, [data, selectedColor, setSelectedColor]);

    const handleColorChange = (colorName) => {
        setSelectedColor(colorName);
        updatePrice(selectedStorage, colorName);
    };

    const handleStorageChange = (size) => {
        setSelectedStorage(size);
        const filteredColors = data?.colors?.filter((color) => color.size === size);
        setAvailableColors(filteredColors);
        if (filteredColors.length > 0) {
            setSelectedColor(filteredColors[0].colorName);
            updatePrice(size, filteredColors[0].colorName);
        }
    };


    const updatePrice = (size, colorName) => {
        const selectedColorData = data?.colors?.find(
            (color) => color.size === size && color.colorName === colorName
        );

        if (selectedColorData && selectedColorData.price > 0 && selectedColorData.sellingPrice > 0) {
            setDisplayPrice(selectedColorData.sellingPrice);
            setDisplayOriginalPrice(selectedColorData.price);
        } else {
            setDisplayPrice(data.sellingPrice);
            setDisplayOriginalPrice(data.price);
        }
    };

    useEffect(() => {
        if (data?.colors?.length > 0) {
            const firstColor = data.colors[0];
            setSelectedStorage(firstColor.size);
            setAvailableColors(data.colors.filter((color) => color.size === firstColor.size));
            setSelectedColor(firstColor.colorName);
            updatePrice(firstColor.size, firstColor.colorName);
        }
    }, [data]);

    const selectedProductStock = (data) => {
        if (data?.colors.length > 0) {
            return data?.colors?.find(color => color.colorName === selectedColor)?.stock || 0;
        }
        return data?.countInStock
    }

    //loại bỏ các giá trị trùng lặp trong mảng đó, chỉ giữ lại các kích thước duy nhất.
    //chứa tất cả các kích thước không trùng lặp của các màu sắc có trong data.colors.
    const uniqueSizes = [...new Set(data?.colors?.map(color => color.size))];

    return (
        <>
            {
                !loading && (
                    <div key={data?._id} className="md:ml-10 md:flex-1 md:mt-0 mt-5">
                        <h1 className="text-2xl font-bold">{data?.productName}</h1>
                        <div className='flex items-center mt-2'>

                            <div className="flex items-center ">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`text-lg ${index <= averageRating?.toFixed(1) || 0 ? 'text-yellow-500' : 'text-gray-300'} mr-1`}
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>

                            <div
                                className="review-link cursor-pointer text-sm hover:text-red-500 font-semibold"
                                onClick={handleReviewClick}
                            >
                                {totalReview} Review(s) | Thêm đánh giá của bạn
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            <span className="text-red-500 text-2xl font-bold">{displayCurrency(displayPrice)}</span>
                            {displayOriginalPrice !== 0 && <span className="line-through text-gray-500 ml-4">{displayCurrency(displayOriginalPrice)}</span>}
                            <span className="text-green-500 ml-4">IN STOCK</span>
                        </div>
                        <p className="mt-4 text-gray-600 text-sm font-semibold">
                            {data?.description}
                        </p>

                        <div className="flex mt-4">
                            <div className="mr-4 flex flex-col gap-3">
                                {
                                    data?.colors.length > 0 && (
                                        <>
                                            {uniqueSizes.filter(size => size !== undefined && size !== null).length > 0 && (
                                                <div className="flex gap-3 items-center mt-2">
                                                    <label className="block text-sm font-semibold capitalize">Dung lượng</label>
                                                    <div className="flex gap-2">
                                                        {uniqueSizes
                                                            .filter(size => size !== undefined && size !== null)
                                                            .map(size => (
                                                                <button
                                                                    key={size}
                                                                    className={`px-4 py-2 border rounded ${selectedStorage === size ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                                                    onClick={() => handleStorageChange(size)}
                                                                >
                                                                    {size}
                                                                </button>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 items-center mt-2">
                                                <label className="block text-sm font-semibold capitalize">Màu sắc</label>
                                                <div className="grid grid-cols-2 gap-3 ml-8">
                                                    {availableColors.map((color, index) => (
                                                        <div
                                                            key={index}
                                                            className={`relative flex flex-row items-center cursor-pointer border-2 rounded-lg p-2 ${selectedColor === color.colorName ? 'border-red-500' : 'border-gray-300'
                                                                }`}
                                                            onClick={() => handleColorChange(color.colorName)}
                                                        >
                                                            {color.colorImages && color.colorImages.length > 0 ? (
                                                                <img
                                                                    src={color.colorImages[0]}
                                                                    alt={color.colorName}
                                                                    className="w-10 h-10 object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                                                                    <p className="text-gray-500 text-xs">No image</p>
                                                                </div>
                                                            )}

                                                            <span className="ml-2 text-sm font-medium">{color.colorName}</span>

                                                            {selectedColor === color.colorName && (
                                                                <div className="absolute top-0 right-0 bg-red-500 w-4 h-4 border-2 rounded-e-sm border-red-500 flex items-center justify-center">
                                                                    <FaCheck className="text-white w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </>
                                    )
                                }

                            </div>
                        </div>

                        <div className="flex items-center mt-4">
                            <div className="flex items-center border">
                                <button className="px-2 py-1" onClick={() => updateQuantity('decrease', count === 1)}>-</button>
                                <input
                                    type="text"
                                    value={count}
                                    className="w-8 text-center border-l border-r"
                                />
                                <button className="px-2 py-1" onClick={() => updateQuantity('increase', count === data?.countInStock)}>+</button>
                            </div>
                            <button className="bg-red-600 cursor-pointer hover:bg-white hover:text-red-600 border-white border-2 hover:border-red-600 text-white px-6 py-2 ml-4 relative group flex items-center rounded-full">
                                <FaShoppingCart
                                    size={20}
                                    className="text-white transition-all duration-300 hidden group-hover:block group-hover:text-red-600"
                                />
                                <button
                                    onClick={(e) => handleAddToCart(e, data, count)}
                                    disabled={selectedProductStock(data) === 0}
                                    className={`transition-all font-bold duration-300 group-hover:ml-4 ${selectedProductStock(data) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {selectedProductStock(data) === 0 ? 'Đã Hết hàng' : 'Thêm vào Giỏ hàng'}
                                </button>
                            </button>
                        </div>

                        <div className="flex mt-4 text-sm text-gray-500">
                            <button
                                onClick={(e) => handleFavoriteClick(e, data)}
                                className={`p-2 relative rounded-full font-semibold ${isFavorite(data) ? "text-red-500 hover:text-black" : "hover:text-red-500"}  hover-icon`}
                            >
                                {isFavorite(data) ? <div className="flex items-center gap-2 capitalize"><FaHeart /> Bỏ yêu thích</div> : <div className="flex items-center gap-2 capitalize"><FaRegHeart />Thêm vào yêu thích</div>}
                            </button>
                            <button onClick={(e) => handleCompare(e, data)} className="flex font-semibold items-center hover:text-red-600">
                                <FaExchangeAlt className="mr-2" /> So Sánh
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm flex items-center gap-2 font-semibold">Danh mục: {translatedCategory(data?.category, true)}</p>
                            <div className="flex items-center mt-2 gap-2">
                                <span className="text-sm font-semibold">SHARE:</span>
                                <FaFacebookF />
                                <FaTwitter />
                                <FaGooglePlusG />
                                <FaEnvelope />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ProductInfo;
