import React, { useEffect, useState } from 'react';
import { FaFire, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SummaryAip from '../common';
import displayCurrency from '../helpers/displayCurrency';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const HotDealPage = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchData = async (page = 1, limit = 8) => {
        const res = await fetch(`${SummaryAip.get_product_hot_deals.url}?page=${page}&limit=${limit}`,
            {
                method: SummaryAip.get_product_hot_deals.method,
                credentials: "include"
            }
        );
        const dataApi = await res.json();
        setData(dataApi.data);
        setTotalPages(dataApi.totalPages);
        setCurrentPage(dataApi.currentPage);
    }

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleDetails = (id) => {
        navigate(`/product/${id}`);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className='flex relative items-end gap-5 pb-6'>
                    <h1 className="text-2xl font-bold uppercase">Hot Deals</h1>
                    <span className='font-medium'>
                        <Link to={"/"} className='hover:text-red-500 capitalize cursor-pointer'>trang chủ</Link> / Hot Deals
                    </span>
                    <div className='absolute bottom-0 left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] h-0.5 bg-slate-200 z-10'></div>
                </div>
                <div className="text-center mb-8 mt-10">
                    <h1 className="text-4xl font-bold text-red-600 inline-flex items-center">
                        <FaFire className="mr-2" /> Hot Deals
                    </h1>
                    <p className="text-gray-500 mt-2 font-semibold">Đừng bỏ lỡ những ưu đãi có thời hạn này!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.map((deal) => (
                        <div key={deal.id} className="bg-white cursor-pointer p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img
                                src={deal.productImage[0]}
                                alt={deal.productName}
                                className="object-scale-down w-full h-48 hover:scale-110 transition-all mix-blend-multiply"
                            />
                            <h2 className="text-lg font-semibold line-clamp-2">{deal.productName}</h2>
                            <div className="flex flex-col items-center justify-between mt-2">
                                <span className="text-xl font-bold text-red-600">{displayCurrency(deal.sellingPrice)}</span>
                                {deal?.price !== 0 && <span className="text-gray-400 line-through">{displayCurrency(deal?.price)}</span>}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-green-500 font-semibold">{deal.hotDealDiscount}% OFF</span>
                                <button onClick={() => handleDetails(deal._id)} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center">
                                    <FaEye className="mr-2" /> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-2 mx-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
                    >
                        <BiChevronLeft size={24} />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'} rounded-md`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-2 mx-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
                    >
                        <BiChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotDealPage;
