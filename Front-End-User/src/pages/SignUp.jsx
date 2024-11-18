import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa6";
import ImageToBase64 from '../helpers/ImageToBase64';
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import styles from "../styles/Username.module.css";
import avatar from "../assets/profile.png";



const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConFirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        avatar: "",
        phone: "",
    })
    const naviagte = useNavigate()
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

        if (data.password === data.confirmPassword) {
            const dataResponse = await fetch(SummaryAip.signUp.url, {
                method: SummaryAip.signUp.method,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const dataAPI = await dataResponse.json();
            if (dataAPI.success) {
                toast.success(dataAPI.message)
                naviagte("/login")
            } else if (dataAPI.error) {
                toast.error(dataAPI.message)
            }
        } else {
            toast.error("Please check password and confirm password")
        }


    }
    const handleUploadAvatar = async (event) => {
        const file = event.target.files[0];
        const avatar = await ImageToBase64(file)
        setData((preven) => {
            return {
                ...preven,
                avatar: avatar
            }
        })
    }
    return (
        <section id='signup' className='bgRecovey py-2'>
            <div className='mx-auto max-w-screen-xl '>
                <div className=' flex justify-center items-center'>
                    <div className={styles.glass} style={{ width: "50%", paddingBottom:"0px", paddingTop:"70px" }}>
                        <div className="title flex flex-col items-center">
                            <h4 className="text-5xl font-bold">Đăng ký tài khoản</h4>
                            <span className="py-4 text-xl w-2/3 text-center text-gray-500 font-semibold">
                                Rất vui khi tham gia cùng bạn!
                            </span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <label htmlFor="profile">
                                    <img
                                        src={data?.avatar || avatar}
                                        className={styles.profile_img}
                                        alt="avatar"
                                    />
                                </label>
                                <input
                                    onChange={handleUploadAvatar}
                                    type="file"
                                    id="profile"
                                    name="avatar"
                                />
                            </div>
                            <div className="textbox flex items-center flex-col gap-4">
                                <div className='name flex w-3/4 gap-10'>
                                    <input name="name" value={data.name} className={styles.textbox} onChange={handleOnChange} type="text" placeholder="Tên của bạn*" required />
                                    <input name="email" value={data.email} className={styles.textbox} onChange={handleOnChange} type="email" placeholder="Email của bạn*" required />
                                </div>
                                <div className='name flex w-3/4 gap-10'>
                                    <input name="phone" value={data.phone} className={styles.textbox} style={{width:"100%"}} onChange={handleOnChange} type="text" placeholder="Số điện thoại*" required />
                                </div>
                                <div className='name flex w-3/4 gap-10'>
                                    <div className=' relative'>
                                        <input name="password" value={data.password} className={styles.textbox} style={{width:"100%"}} onChange={handleOnChange} type={!showPassword ? "password" : "text"} placeholder="Mật khẩu*" required />
                                        <div className='cursor-pointer text-2xl absolute abPassword ' onClick={() => setShowPassword((preve) => !preve)}>
                                            <span>
                                                {
                                                    !showPassword
                                                        ?
                                                        (
                                                            <FaEyeSlash />
                                                        )
                                                        :
                                                        (
                                                            <FaEye />
                                                        )
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className='relative'>
                                        <input name="confirmPassword" value={data.confirmPassword} style={{ width: "100%" }} className={styles.textbox} onChange={handleOnChange} type={!showConFirmPassword ? "password" : "text"} placeholder="Xác nhận mật khẩu*" required />
                                        <div className='cursor-pointer text-2xl absolute abPassword' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                                            <span>
                                                {
                                                    !showConFirmPassword
                                                        ?
                                                        (
                                                            <FaEyeSlash />
                                                        )
                                                        :
                                                        (
                                                            <FaEye />
                                                        )
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.btn} style={{fontWeight:700}} type="submit">Đăng ký</button>
                            </div>
                            <div className="text-center py-4">
                                <span className="text-gray-500 font-semibold"> Bạn đã có tài khoản?{" "}
                                    <Link className="text-red-500 font-bold" to="/login">
                                        Đăng nhập
                                    </Link>
                                </span>
                            </div>


                        </form>
                    </div>
                </div>


            </div>
        </section>
    )
}

export default SignUp