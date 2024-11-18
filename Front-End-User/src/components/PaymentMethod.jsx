import React from 'react';

const PaymentMethod = ({ paymentMethod, handlePaymentMethodChange }) => {

    return (
        <div className="mb-4">
            <h2 className="text-xl mb-4 text-gray-700">Phương thức thanh toán:</h2>
            <div className="space-y-2 border-2 border-blue-300 rounded-md bg-opacity-45 p-2 w-[40rem] bg-blue-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="payment-cash"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => handlePaymentMethodChange('cash')}
                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500 cursor-pointer"
                    />
                    <label htmlFor="payment-cash" className="text-gray-700">Thanh toán khi nhận hàng</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="payment-vnpay"
                        name="paymentMethod"
                        value="vnpay"
                        checked={paymentMethod === 'vnpay'}
                        onChange={() => handlePaymentMethodChange('vnpay',"")}
                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500 cursor-pointer"
                    />
                    <label htmlFor="payment-vnpay" className="text-gray-700">Thanh toán qua VNPay</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="payment-momo"
                        name="paymentMethod"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={() => handlePaymentMethodChange('momo')}
                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500 cursor-pointer"
                    />
                    <label htmlFor="payment-momo" className="text-gray-700">Thanh toán qua MoMo</label>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
