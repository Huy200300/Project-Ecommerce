import React from 'react';
import { useProductCompare } from '../context/ProductCompareContext';
import { FaTimes } from 'react-icons/fa';

const CompareProductsModal = () => {
    const { isCompareVisible, closeCompareModal, compareList, removeFromCompare, clearCompareList } = useProductCompare();
    if (!isCompareVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-80 shadow-2xl z-50 p-4 border-t-4 border-gray-300 rounded-t-lg max-h-[30vh]">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h2 className="text-lg font-semibold">Danh sách sản phẩm so sánh</h2>
                <button onClick={clearCompareList} className="text-red-600 mb-4 hover:underline">Xóa tất cả</button>
                <button
                    onClick={closeCompareModal}
                    className="text-red-600 p-2 cursor-pointer rounded-full hover:bg-gray-200"
                    aria-label="Đóng"
                >
                    <FaTimes />
                </button>
            </div>

            <div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {compareList?.map((product) => (
                        <div key={product._id} className="border bg-white rounded-lg p-3 relative shadow-sm">
                            <button
                                onClick={() => removeFromCompare(product._id)}
                                className="absolute cursor-pointer z-50 top-2 right-2 text-white bg-gray-500 hover:bg-gray-700 p-2 rounded-full"
                                aria-label="Xóa"
                            >
                                <FaTimes size={12} />
                            </button>
                            <img
                                src={product.productImage[0]}
                                alt={product.productName}
                                className="w-full h-32 object-contain mb-1 mix-blend-multiply"
                            />
                            <h3 className="text-sm font-medium text-gray-700">{product.productName}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompareProductsModal;
