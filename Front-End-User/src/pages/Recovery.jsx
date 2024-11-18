import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import SummaryAip from '../common';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setEmailUser } from '../store/userSlice';
import styles from '../styles/Username.module.css';
import avatar from '../assets/profile.png';

const Recovery = () => {
    const [data, setData] = useState({
        email: ""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataResponse = await fetch(SummaryAip.authenticate.url, {
            method: SummaryAip.authenticate.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: data.email
            })
        })

        const dataApi = await dataResponse.json()
        if (dataApi?.error) {
            toast.error(dataApi.message)
        } else {
            dispatch(setEmailUser(dataApi?.data))
            toast.success(dataApi.message)
            navigate('/forgot-password')
        }

    }
    return (
        <div className="bgRecovey">
            <div className="max-w-screen-xl mx-auto">
                <div className='flex justify-center items-center'>
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center mt-9">
                            <h4 className='text-5xl'>Xin chào lần nữa!</h4>
                            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                                Khám phá thêm bằng cách kết nối với chúng tôi.
                            </span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='profile flex justify-center py-4'>
                                <img src={avatar} className={styles.profile_img} alt="avatar" />
                            </div>

                            <div className="textbox flex flex-col items-center gap-6">
                                <input name='email' value={data.email} onChange={handleOnChange} className={styles.textbox} type="email" placeholder='Email' />
                                <button className={styles.btn} type='submit'>Tìm kiếm</button>
                            </div>

                            <div className="text-center py-4">
                                <span className='text-gray-500'>Bạn chưa có tài khoản?<Link className='text-red-500 hover:text-red-600' to="/sign-up">Đăng ký</Link></span>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recovery