import React from 'react';
import displayCurrency from '../helpers/displayCurrency';
import { FaTimesCircle } from 'react-icons/fa';

const OrderDetailsModal = ({ isOpenModalOrderDetails, onClose, dataDetails }) => {
    if (!isOpenModalOrderDetails) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-lg">
                <div className="flex items-center justify-between md:mb-6 mb-3">
                    <h2 className="text-lg md:text-2xl  capitalize">Chi tiết đơn hàng</h2>
                    <FaTimesCircle
                        className="text-lg md:text-2xl text-gray-600 cursor-pointer hover:text-red-500"
                        onClick={() => onClose()}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-4 gap-2 mb-6">
                    <div className="bg-gray-100 p-2 md:p-4 rounded-lg">
                        <h3 className="font-bold mb-2 capitalize pb-1 border-b-2 border-black text-center">Địa chỉ người nhận</h3>
                        {dataDetails?.map((detail, index) => (
                            <div key={index}>
                                <p>{detail?.shippingDetails?.[0]?.shippingAddress?.fullName}</p>
                                <p>Địa chỉ: {detail?.shippingDetails?.[0]?.shippingAddress?.fullAddress}</p>
                                <p>Điện thoại: {detail?.shippingDetails?.[0]?.shippingAddress?.phone}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-100 p-2 md:p-4 rounded-lg">
                        <h3 className="font-bold mb-2 capitalize pb-1 border-b-2 border-black text-center">Hình thức giao hàng</h3>
                        {dataDetails?.map((detail, index) => (
                            <div key={index}>
                                <p className="font-semibold text-orange-600">{detail?.shippingDetails?.[0]?.shippingMethod}</p>
                                <p>Phí giao hàng: {displayCurrency(detail?.shippingDetails?.[0]?.shipping)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-100 p-2 md:p-4 rounded-lg">
                        <h3 className="font-bold mb-2 capitalize pb-1 border-b-2 border-black text-center">Hình thức thanh toán</h3>
                        <span>
                            {
                                dataDetails?.map((detail, index) => (
                                    <span key={index}>
                                        <p className='text-orange-600 capitalize'>{detail?.paymentDetails?.[0]?.card !== "no" ? "Bằng thẻ" : "Chưa thanh toán"}</p>
                                        <p className="">{detail?.status === "paid" ? 'Trả rồi' : 'Chưa trả'}</p>
                                    </span>
                                ))
                            }

                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-scroll lg:h-60 h-24">
                    <table className="min-w-full table-auto border-collapse ">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2">Sản phẩm</th>
                                <th className="px-4 py-2">Giá</th>
                                <th className="px-4 py-2">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataDetails?.map((detail, index) => (
                                detail?.productDetails?.map((product, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2 flex items-center space-x-4">
                                            <img
                                                src={product?.image[0]}
                                                alt={product?.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div>
                                                <p>{product?.name}</p>
                                                <p className="text-sm text-gray-600">{product?.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{product?.price} VND</td>
                                        <td className="px-4 py-2">{product?.quantity}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-right mt-4">
                    {dataDetails?.map((detail, index) => (
                        <div key={index}>
                            <p className="text-red-600">Giảm giá: {detail?.discount} VND</p>
                            <p>Phí vận chuyển: {displayCurrency(detail?.shippingDetails?.[0]?.shipping)}</p>
                            <p className="font-semibold">Tổng cộng: {displayCurrency(detail?.amount)}</p>
                        </div>
                    ))}
                </div>

                <div className="text-right mt-6">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => onClose()}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
