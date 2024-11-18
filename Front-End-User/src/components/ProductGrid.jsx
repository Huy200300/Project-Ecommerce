import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ totalPages, handleCompare, loading, isFavorite, handleAddToCart, handleFavoriteClick, currentPage, changePage, data, handleSortBy, sortBy, handleLimitChange, limit }) => {
    return (
        !loading &&
        <div className="md:w-3/4 w-full p-4">
            <div className="flex gap-10 items-center mb-4">
                <div className="flex items-center">
                    <label className="mr-2 text-gray-700 text-sm">Sort By:</label>
                    <select className="border p-1 outline-none" value={sortBy} onChange={handleSortBy}>
                        <option value="">Chọn</option>
                        <option value="asc">Giá: Từ Thấp đến Cao</option>
                        <option value="dsc">Giá: Từ Cao đến Thấp</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label className="mr-2 text-gray-700 text-sm">Hiển thị:</label>
                    <select className="border p-1 outline-none"
                        value={limit}
                        onChange={handleLimitChange}
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                    </select>
                </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                    <ProductCard handleCompare={handleCompare} data={data} isFavorite={isFavorite} loading={loading} handleAddToCart={handleAddToCart} handleFavoriteClick={handleFavoriteClick} />
            </div>

            <div className="mt-4 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => changePage(index + 1)}
                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
