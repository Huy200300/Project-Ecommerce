import React, { useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useSelector } from "react-redux"
import { Link, Outlet, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'
import { SlUser } from "react-icons/sl";
import { AiOutlineProduct } from "react-icons/ai";

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/")
        }
    },[user])

    return (
        <div className='min-h-[calc(100vh-160px)] md:flex hidden mt-14'>
            <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer flex justify-center'>
                        {
                            user?.avatar ? (
                                <img src={user?.avatar} alt={user?.name} className='w-20 h-20 rounded-full' />
                            ) : (
                                <FaUserCircle />
                            )
                        }
                    </div>
                    <p className='capitalize text-lg '>{user?.name}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>
                <div>
                    <nav className='p-4 grid'>
                        <Link to={"all-users"} className='px-2 py-1 flex gap-2 items-center rounded-md hover:bg-slate-100'>
                            <span className='text-xl'><SlUser /></span> 
                            Tài khoản người dùng</Link>
                        <Link to={"all-products"} className='px-2 py-1 flex gap-2 items-center rounded-md hover:bg-slate-100'>
                            <span className='text-2xl'><AiOutlineProduct /></span>
                            Sản phẩm bán</Link>
                    </nav>
                </div>
            </aside>
            <main className='w-full h-full p-2'>
                <Outlet/>
            </main>
        </div>
    )
}

export default AdminPanel