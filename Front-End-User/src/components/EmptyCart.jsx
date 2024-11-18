import React from 'react'
import { Link } from 'react-router-dom';
import img from "../assets/empty-cart.png";

const EmptyCart = () => (
    <div className='flex justify-center items-center text-lg my-3 lg:min-h-[calc(100vh-230px)] min-h-[calc(100vh-290px)]'>
        <div className='w-full'>
            <Link to={"/"} className='text-blue-600 capitalize font-semibold hover:text-red-600 text-base lg:block hidden'>
                {"<"} Tiếp tục mua sắm
            </Link>
            <div className='bg-white h-full font-bold capitalize lg:min-w-[700px] min-w-[500px] py-5 flex gap-3 flex-col justify-center items-center rounded'>
                <img src={img} alt="img" width={296} height={180} />
                <p className='text-red-600 text-xl'>Chưa có sản phẩm nào trong giỏ hàng</p>
                <p>Cùng mua sắm hàng ngàn sản phẩm tại Shop nhé!</p>
                <Link to={"/"} className='px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full text-white text-xl'>
                    Mua hàng
                </Link>
            </div>
        </div>
    </div>
);

export default EmptyCart