import React, { useEffect, useState } from 'react'
import styles from '../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../helpers/helper';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import toasts, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [OTP, setOTP] = useState();
  const { email, name } = useSelector(state => state.user.email);
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(email, name).then((OTP) => {
      if (OTP) return toast.success("OTP đã được gửi tới email của bạn!");
      return toast.error("Sự cố khi tạo OTP!");
    });
  }, [email, name]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ email, code: OTP });
      if (status === 201) {
        toast.success("Xác minh thành công!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("OTP sai! Kiểm tra lại email nhé!");
    }
  }
  const resendOTP = () => {
    let sentPromise = generateOTP(email, name);

    toasts.promise(sentPromise, {
      loading: "Đang gửi...",
      success: <span>OTP đã được gửi tới email của bạn!</span>,
      error: <span>Không thể gửi!</span>,
    });


  }
  return (
    <div className='mt-14 bgRecovey'>
      <div className="max-w-screen-xl mx-auto">
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex justify-center items-center'>
          <div className={styles.glass}>
            <div className="title flex flex-col items-center mt-11">
              <h4 className='text-5xl'>Xác nhận</h4>
              <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Nhập OTP để khôi phục mật khẩu.
              </span>
            </div>

            <form className='pt-20' onSubmit={handleSubmit}>

              <div className="textbox flex flex-col items-center gap-6">

                <div className="input text-center">
                  <span className='py-4 text-sm text-left text-gray-500'>
                    Nhập OTP gồm 6 chữ số được gửi đến địa chỉ email của bạn.
                  </span>
                  <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP' />
                </div>

                <button className={styles.btn} type='submit'>Xác nhận</button>
              </div>
            </form>

            <div className="text-center py-4">
              <span className='text-gray-500'>Không thể nhận OTP? <button onClick={resendOTP} className='text-red-500 hover:text-red-600'>Gửi lại</button> </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword