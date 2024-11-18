import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCloudUploadAlt } from "react-icons/fa";
import CryptoJS from 'crypto-js';
import uploadImage from '../helpers/uploadImage';
import Context from '../context';
import SummaryAip from '../common';
import { toast } from 'react-toastify';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const ProfileUser = () => {
    const { dataUser, fetchUserDetails } = useContext(Context);

    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
    });

    useEffect(() => {
        fetchUserDetails()
        const encryptedData = localStorage.getItem('userData');
        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                setData(decryptedData || dataUser);
            } catch (error) {
                console.error('Error decrypting data:', error);
                setData(dataUser);
            }
        } else {
            setData(dataUser);
        }
    }, [dataUser, fetchUserDetails]);

    useEffect(() => {
        try {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
            localStorage.setItem('userData', encryptedData);
        } catch (error) {
            console.error('Error encrypting data:', error);
        }
    }, [data]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);
        setData((prev) => ({
            ...prev,
            avatar: uploadImageCloudinary.url,
        }));
    };

    const handleUpdate = async (field) => {
        const dataResponse = await fetch(SummaryAip.update_user.url, {
            method: SummaryAip.update_user.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: data?._id,
                [field]: data[field]
            })
        })
        const dataApi = await dataResponse.json();
        if (dataApi?.success) {
            toast.success(dataApi?.message)
        } else {
            if (dataApi?.error) {
                toast.error(dataApi?.message)
            }
        }
        fetchUserDetails();
    };

    return (
        <div>
            <div className='min-h-[calc(100vh-200px)] max-w-screen-xl mx-auto flex flex-col gap-4'>
                <div className='flex relative items-center gap-5 pb-6'>
                    <h1 className="text-2xl font-bold uppercase w-36">Thông Tin Tài Khoản</h1>
                    <span className='font-medium'> <Link to={"/"} className='hover:text-red-500 capitalize cursor-pointer'>trang chủ</Link> / Thông Tin Tài Khoản</span>
                    <div className='absolute bottom-0 left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] h-0.5 bg-slate-200 z-10'></div>
                </div>

                <div className='border-2 h-auto w-[800px] flex flex-col mx-auto rounded-md p-4 shadow-lg'>
                    <h1 className='flex justify-center items-center p-2 text-2xl border-b-2 border-black'>
                        Thông tin cá nhân
                    </h1>
                    {[
                        { label: 'Tên tài khoản:', name: 'name', type: 'text' },
                        { label: 'Email:', name: 'email', type: 'email' },
                        { label: 'Điện thoại:', name: 'phone', type: 'text' }
                    ].map((field) => (
                        <div key={field.name} className='flex gap-5 p-2 items-center'>
                            <label htmlFor={field.name} className='w-1/4 font-medium'>{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={data[field.name]}
                                id={field.name}
                                onChange={handleOnChange}
                                className='outline-none bg-gray-100 border border-gray-300 rounded-md p-2 w-full'
                            />
                            <button
                                onClick={() => handleUpdate(field.name)}
                                className='px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition'
                            >
                                Cập nhật
                            </button>
                        </div>
                    ))}
                    <div className='flex gap-5 p-2 items-center'>
                        <label htmlFor='avatar' className='w-1/4 font-medium'>Avatar:</label>
                        <label htmlFor='avatar' className='cursor-pointer w-96'>
                            <div className='p-2 bg-gray-100 border border-gray-300 rounded-md flex justify-center items-center'>
                                <div className='text-gray-500 flex items-center justify-center flex-col gap-2'>
                                    <span className='text-4xl'><FaCloudUploadAlt /></span>
                                    <input type='file' name='avatar' id='avatar' className='hidden' onChange={handleUploadProduct} multiple />
                                    <span>Chọn hình ảnh</span>
                                </div>
                            </div>
                        </label>
                        <div className='text-3xl flex items-center'>
                            {data?.avatar && (
                                <img src={data?.avatar} alt={data?.name} className='w-16 h-16 rounded-full' />
                            )}
                        </div>
                        <button onClick={() => handleUpdate('avatar')} className='px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition'>
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
