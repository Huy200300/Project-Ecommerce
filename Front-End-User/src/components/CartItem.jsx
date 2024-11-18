import React, { useEffect, useState } from 'react';
import displayCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import { FaCheck, FaMinus, FaPlus } from 'react-icons/fa6';
import { IoTrashOutline } from "react-icons/io5";
import translatedCategory from '../helpers/translatedCategory';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSelectedProducts } from '../context/SelectedProducts';

const CartItem = ({
    product,
    handleDelete,
    showColors,
    toggleColors,
    updateQuantity,
    selectedProducts,
    handleCheckboxChange
}) => {
    const [selectedColor, setSelectedColor] = useState(product.selectedColor);
    const [selectedColorImage, setSelectedColorImage] = useState(product.selectedColorImage);
    const { cart, updateCart } = useCart();
    const { updateSelectedProducts } = useSelectedProducts()
    const productId = product?._id;
    const isChecked = selectedProducts.includes(productId);

    useEffect(() => {
        const selectedProductss = JSON.parse(localStorage.getItem("selectedProducts")) || [];
        const updatedSelectedProductst = selectedProductss.map(item =>
            item._id === productId
                ? { ...item, selectedColor, selectedColorImage }
                : item
        );
        updateSelectedProducts(updatedSelectedProductst)

        const updatedCart = cart.map(item =>
            item._id === productId
                ? { ...item, selectedColor, selectedColorImage }
                : item
        );
        updateCart(updatedCart);
    }, [selectedColor, selectedColorImage]);

    const handleColorClick = (colorName, colorImage) => {
        if (colorName !== selectedColor) {
            setSelectedColor(colorName);
            setSelectedColorImage(colorImage);
        }
        toggleColors();
    };

    return (
        <div className='relative flex mb-4 border-2 border-slate-300 justify-center items-center rounded-md'>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="m-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div className='rounded w-full bg-white h-full grid grid-cols-[128px,1fr]'>
                <div className='w-32 h-full rounded-md flex justify-center items-center'>
                    <div className='bg-slate-200 border-2 rounded-md p-1.5'>
                        <img src={selectedColorImage || product?.productImage?.[0]} alt={product?.productName} className='w-full h-24 object-scale-down mix-blend-multiply ' />
                    </div>
                </div>
                <div className='px-2 py-2 h-full w-full'>
                    <div className='flex w-full h-2/3'>
                        <div className='flex flex-col gap-1 w-full'>
                            <div className='flex w-full gap-7 justify-between items-center'>
                                <Link to={`/product/${product?._id}`} className='line-clamp-2 font-bold text-base text-gray-900'>{product?.productName}</Link>
                                <div className='relative'>
                                    {
                                        selectedColor && <button
                                            onClick={toggleColors}
                                            className='flex items-center h-12 gap-1 font-semibold bg-slate-200 bg-opacity-70 px-1 rounded-md border border-gray-300 shadow-sm'>
                                            <p>Màu: {selectedColor}</p>
                                            <button>
                                                {showColors ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                        </button>
                                    }

                                    {showColors && (
                                        <div className='absolute w-full mt-2 left-0 p-2 border border-gray-300 shadow-lg rounded-md bg-white z-50'>
                                            <div className='flex flex-wrap gap-2'>
                                                {product.colors.map((color) => (
                                                    <div
                                                        key={color.colorName}
                                                        className={`relative flex flex-row items-center cursor-pointer border-2 rounded-lg p-2 ${color.colorName === selectedColor ? 'border-2 border-red-500' : ''}`}
                                                        onClick={() => handleColorClick(color.colorName, color.colorImages?.[0])}
                                                    >
                                                        <p className={`mr-2 text-sm ${color.colorName === selectedColor ? 'font-bold' : ''}`}>{color.colorName}</p>
                                                        {color.colorImages?.[0] && (
                                                            <img src={color.colorImages[0]} alt={color.colorName} className="w-10 h-10 object-cover rounded-md" />
                                                        )}
                                                        {selectedColor === color.colorName && (
                                                            <div className="absolute top-0 right-0 bg-red-500 w-4 h-4 border-2 rounded-e-sm border-red-500 flex items-center justify-center">
                                                                <FaCheck className="text-white w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='font-medium'>{translatedCategory(product?.category)}</div>
                            <div className='text-red-500 flex items-center font-semibold justify-between text-lg'>
                                {displayCurrency(product?.sellingPrice)}
                                <p className='text-slate-600 text-lg'>Thành tiền: {displayCurrency(product?.sellingPrice * product?.amount)}</p>
                            </div>
                        </div>
                        <div className='w-10 h-10 justify-end flex items-center'>
                            <button onClick={handleDelete} className='text-xl text-red-700 hover:text-red-500 cursor-pointer transition-all ease-in-out'>
                                <IoTrashOutline className='text-xl' />
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 w-full h-1/3 mt-1'>
                        <div className='flex gap-3 justify-center items-center'>
                            <button
                                disabled={product?.amount === 1}
                                onClick={() => updateQuantity(product?._id, product?.amount, false, product?.countInStock)}
                                className='text-xl text-gray-500 hover:text-gray-900 cursor-pointer transition-all ease-in-out'>
                                <FaMinus className='text-lg' />
                            </button>
                            <div className='text-base border border-gray-300 font-semibold px-2 py-1 rounded'>
                                {product?.amount}
                            </div>
                            <button
                                onClick={() => updateQuantity(product?._id, product?.amount, true, product?.countInStock)}
                                className='text-xl text-gray-500 hover:text-gray-900 cursor-pointer transition-all ease-in-out'
                                disabled={product?.amount >= product?.countInStock}
                            >
                                <FaPlus className='text-lg' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
