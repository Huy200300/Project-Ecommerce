import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import success from "../assets/success.gif";
import cancel from "../assets/cancel.gif";
import { useCart } from '../context/CartContext';
import { useSelectedProducts } from '../context/SelectedProducts';

const PaymentResult = () => {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cart, removeFromCart } = useCart();
    const { selectedProducts, updateSelectedProducts } = useSelectedProducts()
    const [showOptions, setShowOptions] = useState(false);
    const orderedProductsRef = useRef([]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const resultCode = queryParams.get('resultCode');
        const resultStatus = parseInt(resultCode, 10);

        setStatus(resultStatus);
        setLoading(false);

        if (resultStatus === 0) {

            orderedProductsRef.current = selectedProducts;

            const idsToRemove = selectedProducts
                .filter(item => cart.some(cartItem => cartItem._id === item._id))
                .map(item => item._id);

            if (idsToRemove.length > 0) {
                removeFromCart(idsToRemove);
            }

            const updatedSelectedProducts = selectedProducts.filter(
                item => !idsToRemove.includes(item._id)
            );
            // console.log(updatedSelectedProducts)
            // updateSelectedProducts(updatedSelectedProducts)


            setTimeout(() => {
                setShowOptions(true);
            }, 100000);
        }
    }, [location.search, removeFromCart, cart, updateSelectedProducts, selectedProducts]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-xl md:text-2xl mb-6 text-center capitalize">Kết quả thanh toán</h1>

                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="spinner"></div>
                    </div>
                ) : status === 0 ? (
                    <>
                        {!showOptions ? (
                            <div className="text-center">
                                <img src={success} alt="Payment Success" className="mx-auto mb-4 w-32 md:w-48" />
                                <h2 className="text-lg md:text-xl text-green-600 font-semibold mb-4">Thanh Toán Thành Công</h2>
                                <p className="text-gray-700 font-semibold mb-6">Giao dịch của bạn đã thành công. Cảm ơn bạn đã mua hàng!</p>

                                {orderedProductsRef.current.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-semibold mb-4">Sản phẩm bạn đã đặt:</h3>
                                        <ul className="mb-6">
                                            {orderedProductsRef?.current?.map(product => (

                                                <li key={product._id} className="flex items-center mb-2">
                                                    {
                                                        console.log(product)
                                                    }
                                                    {
                                                        product?.colors.length > 0 ? <img src={product.selectedColorImage} alt={product.name} className="w-16 h-16 mr-4" /> :
                                                            <img src={product.productImage[0]} alt={product.name} className="w-16 h-16 mr-4" />
                                                    }
                                                    <div>
                                                        <p className="font-semibold">{product.productName}</p>
                                                        {
                                                            product?.colors.length > 0 ? <>
                                                                <p className="text-gray-500">Màu sắc: {product.selectedColor}</p>
                                                                
                                                            </> :
                                                                <></>
                                                        }

                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-lg md:text-xl text-green-600 mb-4">Bạn muốn làm gì tiếp theo?</h2>
                                <div className="flex flex-col gap-4">
                                    <Link
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 capitalize"
                                        to="/order"
                                    >
                                        Xem đơn hàng đã đặt
                                    </Link>
                                    <Link
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 capitalize"
                                        to="/"
                                    >
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <img src={cancel} alt="Payment Failed" className="mx-auto mb-4 w-32 md:w-48" />
                        <h2 className="text-lg md:text-xl text-red-600 mb-4">Thanh Toán Thất Bại</h2>
                        <p className="text-gray-700">Đã có lỗi xảy ra với giao dịch của bạn. Vui lòng thử lại.</p>
                        <Link
                            className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            to="/cart"
                        >
                            Về Giỏ Hàng
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
