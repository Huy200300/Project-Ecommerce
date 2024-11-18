import React from "react";
import { useEffect } from "react";
import { FaTruck, FaBoxOpen, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import SummaryAip from "../common";
import { useState } from "react";

const PurchasePage = () => {
    const [statusHistory, setStatusHistory] = useState("");

    useEffect(() => {
        // Gọi API để lấy trạng thái đơn hàng
        const fetchOrderStatus = async (id) => {
            try {
                const response = await fetch(SummaryAip.get_order_status.url, {
                    method: SummaryAip.get_new_product.method,
                    credentials: "include",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ orderId: id })
                });
                const dataApi = await response.json()
                if (dataApi.success) {
                    setStatusHistory(dataApi.data);
                }
            } catch (error) {
                console.error('Error fetching order status:', error);
            }
        };

        fetchOrderStatus();
    }, []);

    const renderStep = (status) => {
        switch (status) {
            case 'Pending':
                return <div className="step bg-yellow-100 text-yellow-600">Đang chờ</div>;
            case 'Processing':
                return <div className="step bg-blue-100 text-blue-600">Đang xử lý</div>;
            case 'Shipped':
                return <div className="step bg-purple-100 text-purple-600">Đang giao hàng</div>;
            case 'Delivered':
                return <div className="step bg-green-100 text-green-600">Đã giao hàng</div>;
            case 'Cancelled':
                return <div className="step bg-red-100 text-red-600">Đã hủy</div>;
            default:
                return <div className="step bg-gray-100 text-gray-600">Không rõ</div>;
        }
    };

    const orders = [
        {
            id: 1,
            productName: "Điện thoại XYZ",
            status: "Đang giao",
            quantity: 1,
            price: "12,000,000₫",
            imageUrl: "https://via.placeholder.com/100",
            orderDate: "22/09/2024",
        },
        {
            id: 2,
            productName: "Tai nghe ABC",
            status: "Đã giao",
            quantity: 2,
            price: "1,200,000₫",
            imageUrl: "https://via.placeholder.com/100",
            orderDate: "20/09/2024",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                    Đơn hàng của bạn
                </h1>

                <div className="flex justify-between mb-6">
                    <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50">
                        <FaBoxOpen />
                        <span>Tất cả</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50">
                        <FaTruck />
                        <span>Đang giao</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50">
                        <FaCheckCircle />
                        <span>Đã giao</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50">
                        <FaCreditCard />
                        <span>Chờ thanh toán</span>
                    </button>
                </div>

                <div className="order-status">
                    <h3>Trạng thái đơn hàng</h3>
                    <div className="steps">
                        {statusHistory.map((status, index) => (
                            <div key={index} className="step-item">
                                {renderStep(status.orderStatus)}
                                <div className="step-date text-gray-500">{new Date(status.updatedAt).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border-b pb-4 mb-4">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={order.imageUrl}
                                    alt={order.productName}
                                    className="w-20 h-20 object-cover rounded-md"
                                />

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{order.productName}</h3>
                                    <p className="text-gray-600">
                                        Số lượng: {order.quantity} - Giá: {order.price}
                                    </p>
                                    <p className="text-gray-500">Ngày đặt hàng: {order.orderDate}</p>
                                    <p
                                        className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === "Đã giao"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-yellow-100 text-yellow-600"
                                            }`}
                                    >
                                        {order.status}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end space-y-2">
                                    <button className="text-blue-500 hover:underline">
                                        Xem chi tiết
                                    </button>
                                    <button className="text-red-500 hover:underline">Hủy đơn</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;
