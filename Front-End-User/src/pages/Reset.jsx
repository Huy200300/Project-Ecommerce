import React, { useState } from 'react'
import { toast } from 'react-toastify';
import styles from '../styles/Username.module.css';
import SummaryAip from '../common';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Reset = () => {
    const { email, _id } = useSelector(state => state.user.email);
    const [data, setData] = useState({
        password: "",
        confirm_pwd: "",
    })
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data?.confirm_pwd === data?.password) {
            const dataResponse = await fetch(SummaryAip.reset_password.url, {
                method: SummaryAip.reset_password.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    _id: _id,
                    email: email,
                    password: data.password
                })
            })
            const dataApi = await dataResponse.json()
            if (dataApi?.success) {
                navigate("/login")
                toast.success(dataApi?.message)
            }
            else if (dataApi?.error) {
                toast.error(dataApi?.message)
            }
        } else {
            toast.error("Mật khẩu không trùng khớp")
            toast.error("Vui lòng nhập lại!!!")
        }

    }
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    return (
        <div className="bgRecovey">
            <div className="max-w-screen-xl mx-auto">
                <div className='flex justify-center items-center'>
                    <div className={styles.glass} style={{ width: "50%" }}>
                        <div className="title flex flex-col items-center mt-14">
                            <h4 className='text-5xl'>Thay đổi mật khẩu</h4>
                            <span className='py-2 text-xl w-2/3 text-center text-gray-500'>
                                Nhập mật khẩu mới.
                            </span>
                        </div>

                        <form className='py-16' onSubmit={handleSubmit}>
                            <div className="textbox flex flex-col items-center gap-6">
                                <input name='password' onChange={handleOnChange} value={data.password} className={styles.textbox} type="text" placeholder='Mật khẩu mới' />
                                <input name='confirm_pwd' onChange={handleOnChange} value={data.confirm_pwd} className={styles.textbox} type="text" placeholder='Xác nhận mật khẩu' />
                                <button className={styles.btn} type='submit'>Thay đổi</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reset