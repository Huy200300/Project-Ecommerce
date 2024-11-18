import React from 'react'
import { MdMailOutline } from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoMdMail } from "react-icons/io";
import { FaCcVisa, FaCreditCard, FaCcPaypal, FaCcMastercard, FaCcDiscover, FaCcAmex } from 'react-icons/fa';


const Footer = () => {
  return (

    <footer className="pb-5">
      <div className="">
        <div className="relative py-6 border-t-2 border-b-2 border-b-red-500 flex flex-col items-center gap-10 text-center">
          <div className="text-[200px] text-[#E4E7ED] absolute top-32 -translate-y-1/2 rotate-[15deg] -z-10 left-[21%]">
            <MdMailOutline />
          </div>

          <h2 className="text-3xl font-medium">
            Đăng Ký nhận <span className="text-red-500 font-bold">BẢN TIN</span>
          </h2>
          <div className="flex w-2/5 items-center text-center">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="p-3 border border-gray-300 font-semibold w-full rounded-l-full focus:outline-none"
            />
            <button className="bg-red-500 font-semibold text-nowrap flex gap-1 text-white p-3 rounded-r-full hover:bg-red-600 transition">
              <MdMailOutline />Đặt mua
            </button>
          </div>

          <div className="flex space-x-7">

            <Link to={'/'} className="border p-2 hover:text-red-600 hover:bg-slate-300">
              <FaFacebookF />
            </Link>
            <Link to={"/"} className="border p-2 hover:text-red-600 hover:bg-slate-300">
              <FaTwitter />
            </Link>
            <Link to={"/"} className="border p-2 hover:text-red-600 hover:bg-slate-300">
              <FaInstagram />
            </Link>
            <Link to={"/"} className="border p-2 hover:text-red-600 hover:bg-slate-300">
              <FaPinterestP />
            </Link>

          </div>
        </div>
        <div className='bg-black text-white py-10'>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ">
            <div className='flex flex-col gap-2 md:mx-0 mx-2'>
              <h3 className="font-bold text-lg mb-2">Về Chúng Tôi</h3>
              <p className="text-gray-400 text-sm">
                HTG Shop cung cấp các sản phẩm công nghệ chính hãng như điện thoại, máy tính .
                Chúng tôi cam kết mang đến chất lượng cao .
              </p>
              <ul className="mt-4 font-semibold text-gray-400 md:text-base text-sm space-y-4">
                <li className="flex items-center space-x-2 hover:text-red-500 cursor-pointer">
                  <FaMapMarkerAlt className='text-red-500' />
                  <span>1734 Stonecoal Road</span>
                </li>
                <li className="flex items-center space-x-2 hover:text-red-500 cursor-pointer">
                  <FaPhoneAlt className='text-red-500' />
                  <span>+096-688-53-18</span>
                </li>
                <li className="flex items-center space-x-2 hover:text-red-500 cursor-pointer">
                  <IoMdMail className='text-red-500' />
                  <span>taihuy200300@gmail.com</span>
                </li>
              </ul>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className="font-bold text-lg mb-2">Danh Mục</h3>
              <ul className="text-gray-400 space-y-5 md:text-base text-sm font-semibold">
                <li className='hover:text-red-500 cursor-pointer'>Hot deals</li>
                <li className='hover:text-red-500 cursor-pointer'>Laptops</li>
                <li className='hover:text-red-500 cursor-pointer'>Máy tính bảng</li>
                <li className='hover:text-red-500 cursor-pointer'>Điện thoại</li>
                <li className='hover:text-red-500 cursor-pointer'>Phụ Kiện</li>
              </ul>
            </div>

            <div className='flex flex-col gap-2 md:mx-0 mx-2'>
              <h3 className="font-bold text-lg mb-2">Thông Tin</h3>
              <ul className="text-gray-400 space-y-5 md:text-base text-sm font-semibold">
                <li className='hover:text-red-500 cursor-pointer'>Về Chúng Tôi</li>
                <li className='hover:text-red-500 cursor-pointer'>Liên Hệ Với Chúng Tôi</li>
                <li className='hover:text-red-500 cursor-pointer'>Chính Sách Bảop Mật</li>
                <li className='hover:text-red-500 cursor-pointer'>Đơn Hàng và Trả Lại</li>
                <li className='hover:text-red-500 cursor-pointer'>Điều Khoản và Điều Kiện</li>
              </ul>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className="font-bold text-lg mb-2">Dịch Vụ</h3>
              <ul className="text-gray-400 space-y-5 font-semibold md:text-base text-sm">
                <li className='hover:text-red-500 cursor-pointer'>Tài Khoản</li>
                <li className='hover:text-red-500 cursor-pointer'>Xem Giỏ Hàng</li>
                <li className='hover:text-red-500 cursor-pointer'>Sản Phẩm Yêu Thích</li>
                <li className='hover:text-red-500 cursor-pointer'>Theo Dõi Đơn Hàng</li>
                <li className='hover:text-red-500 cursor-pointer'>Giúp Đỡ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="section bg-slate-700 py-10 text-white">
          <div className="">
            <div className="">
              <div className="flex gap-5 flex-col justify-center items-center">
                <ul className="flex space-x-4 justify-center items-center">
                  <li><Link to={"/"} className="text-4xl"><FaCcVisa /></Link></li>
                  <li><Link to={"/"} className="text-4xl"><FaCreditCard /></Link></li>
                  <li><Link to={"/"} className="text-4xl"><FaCcPaypal /></Link></li>
                  <li><Link to={"/"} className="text-4xl"><FaCcMastercard /></Link></li>
                  <li><Link to={"/"} className="text-4xl"><FaCcDiscover /></Link></li>
                  <li><Link to={"/"} className="text-4xl"><FaCcAmex /></Link></li>
                </ul>

                <span className="copyright">
                  Copyright &copy;<span>{new Date().getFullYear()}</span> All rights reserved 
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

  )
}

export default Footer