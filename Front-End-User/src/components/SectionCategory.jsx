import React from 'react'
import shop01 from '../assets/img/shop01.png'
import shop02 from '../assets/img/product04.png'
import shop03 from '../assets/img/product10.png'
import { Link } from 'react-router-dom'
import { FaArrowCircleRight } from "react-icons/fa";

const SectionCategory = () => {
    return (
        <div className="py-7">
            <div className="md:max-w-screen-xl md:mx-auto mx-2 max-w-screen-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 item flex-1 gap-3">
                    <Link to={`/product-category?category=laptop`} className="w-full ">
                        <div className="shop group">
                            <div className="shop-img relative -z-10 bg-[#E4E7ED]">
                                <img src={shop01} alt="" className='overflow-hidden w-full h-[280px] object-scale-down mix-blend-multiply group-hover:scale-110 transition-all' />
                            </div>
                            <div className="shop-body absolute w-[75%] top-0 pt-16 px-8 z-10">
                                <h3 className='font-bold text-2xl text-white'>Bộ Sưu Tập<br />Laptops</h3>
                                <div className="cta-btn flex items-center gap-2 text-white uppercase">Mua ngay <FaArrowCircleRight /></div>
                            </div>
                        </div>
                    </Link>

                    <Link to={`/product-category?category=mobiles`} className="w-full">
                        <div className="shop group">
                            <div className="shop-img relative -z-10 bg-[#E4E7ED]">
                                <img src={shop03} alt="" className='overflow-hidden w-full h-[280px] object-scale-down mix-blend-multiply group-hover:scale-110 transition-all' />
                            </div>
                            <div className="shop-body absolute w-[75%] top-0 pt-16 px-8 z-10">
                                <h3 className='font-bold text-2xl text-white'>Bộ Sưu Tập<br />Điện Thoại</h3>
                                <div className="cta-btn flex items-center gap-2 text-white uppercase">Mua ngay <FaArrowCircleRight /></div>
                            </div>
                        </div>
                    </Link>

                    <Link to={`/product-category?category=ipad`} className="w-full">
                        <div className="shop group overflow-hidden">
                            <div className="shop-img relative -z-10 bg-[#E4E7ED] overflow-hidden">
                                <img src={shop02} alt="" className=' overflow-hidden w-full h-[280px] object-cover mix-blend-multiply group-hover:scale-110 transition-all' />
                            </div>
                            <div className="shop-body absolute w-[75%] top-0 pt-16 px-8 z-10">
                                <h3 className='font-bold text-2xl text-white'>Bộ Sưu Tập<br />Máy Tính Bảng</h3>
                                <div className="cta-btn flex items-center gap-2 text-white uppercase">Mua ngay <FaArrowCircleRight /></div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SectionCategory;