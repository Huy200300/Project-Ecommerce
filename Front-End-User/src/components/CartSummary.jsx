import React, { useEffect } from 'react';
import displayCurrency from '../helpers/displayCurrency';
import { useDispatch } from 'react-redux';
import { selectedOrder } from '../store/orderSlice';

const CartSummary = ({ handlePayment, selectedProducts, products }) => {
    const dispatch = useDispatch();

    const selectedProductDetails = selectedProducts.map(productId => {
        const product = products.find(p => p._id === productId || p.productId?._id === productId);
        if (product) {
            const quantity = product.quantity || product.amount || 1;
            return { productId, quantity };
        }
        return null;
    }).filter(product => product !== null);

    const selectedProductsTotalQuantity = selectedProductDetails.reduce((total, product) => {
        return total + product.quantity;
    }, 0);

    const selectedProductsTotalPrice = selectedProductDetails.reduce((total, product) => {
        const prod = products.find(p => p._id === product.productId || p.productId?._id === product.productId);
        const price = prod.sellingPrice || prod.productId?.sellingPrice || 0;
        return total + (product.quantity * price);
    }, 0);

    const total = selectedProductsTotalPrice

    useEffect(() => {
        dispatch(selectedOrder({ selectedProductsTotalPrice, selectedProducts: selectedProductDetails }))
    }, [selectedProducts, selectedProductsTotalPrice]);

    return (
        <div className="bg-gray-100 p-6 rounded-md shadow-md h-fit w-96 relative">
            <h2 className="text-2xl mb-4 capitalize">Tổng thanh toán</h2>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Tổng số lượng sản phẩm:</span>
                <span className="text-gray-900 font-medium">{selectedProductsTotalQuantity}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Tổng giá trị sản phẩm:</span>
                <span className="text-gray-900 font-medium">{displayCurrency(selectedProductsTotalPrice)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                <span className="text-lg text-gray-900">Cần thanh toán:</span>
                <span className="text-lg text-gray-900">{displayCurrency(total)}</span>
            </div>
            <button
                disabled={selectedProducts.length === 0}
                onClick={handlePayment}
                className={`mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedProducts.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                Thanh toán
            </button>
            <div class="scallop bg-gray-100 w-full"></div>
        </div>
    );
};

export default CartSummary;
