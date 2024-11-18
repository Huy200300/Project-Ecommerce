import React, { useContext, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa6";
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import styles from '../styles/Username.module.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const location = useLocation();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)
    const handleOnChange = (event) => {
        const { name, value } = event.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataReponse = await fetch(SummaryAip.signIn.url, {
            method: SummaryAip.signIn.method,
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const dataApi = await dataReponse.json()
        if (dataApi?.success) {
            toast.success(dataApi?.message)
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }
            fetchUserDetails()
            fetchUserAddToCart()
        } else if (dataApi?.error) {
            toast.error(dataApi?.message)
        }
    }
    return (
        <section className='bgRecovey flex justify-center items-center'>
            <div className='mx-auto max-w-screen-xl py-14 h-full'>
                <div className='flex justify-center items-center h-full'>
                    <div className={styles.glass} style={{ width: "50%" }}>
                        <div className="title flex flex-col items-center h-full">
                            <h4 className='text-4xl font-bold'>Chào mừng bạn đến với Shop</h4>
                            <span className='py-4 text-xl w-2/3 text-center text-gray-500 font-semibold'>
                                Đăng nhập vào tài khoản của bạn.
                            </span>
                        </div>
                        <form onSubmit={handleSubmit} className='py-0'>
                            <div className="textbox flex flex-col items-center gap-6 relative">
                                <input name='email' onChange={handleOnChange} value={data.email} className={styles.textbox} type="email" placeholder='Email ' />
                                <input name='password' value={data.password} onChange={handleOnChange} className={styles.textbox} type={!showPassword ? "password" : "text"} placeholder='Mật Khẩu' />
                                <div className='cursor-pointer text-2xl absolute ab-password' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword
                                                ?
                                                (
                                                    <FaEye />
                                                )
                                                :
                                                (
                                                    <FaEyeSlash />
                                                )
                                        }
                                    </span>

                                </div>
                                <div className="w-full flex justify-center items-center flex-col gap-2">
                                    <Link to="/recovery" className='text-gray-500 ml-auto mr-20 hover:text-red- font-bold'>Quên mật khẩu</Link>
                                    <button className={styles.btn} style={{ width: "75%",fontWeight:700 }} type='submit'>Đăng nhập</button>
                                </div>
                                <div>
                                    <div className='text-gray-500 font-semibold'><p>Bạn chưa có tài khoản? <Link to={'/sign-up'} className='text-red-500 hover:text-red-600 font-bold'>Đăng ký</Link></p></div>
                                </div>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        </section>
    )
}

export default Login