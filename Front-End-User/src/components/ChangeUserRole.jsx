import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoClose } from "react-icons/io5";
import SummaryAip from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({ name, email, role, onClose, userId,callFun }) => {
  const [userRole, setUserRole] = useState(role)
  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value)
  }
  const updateUserRole = async () => {
    const dataResponse = await fetch(SummaryAip.update_user.url, {
      method: SummaryAip.update_user.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId : userId,
        role : userRole
      })
    })
    const dataApi = await dataResponse.json()
    if (dataApi.success) {
      toast.success(dataApi.message)
      onClose()
      callFun()
    }
  }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-55'>
      <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
        <button className='block ml-auto' onClick={onClose}>
          <IoClose />
        </button>
        <h1>Change User Role</h1>
        <p>Name : {name}</p>
        <p>Email : {email}</p>
        <div className='flex items-center justify-between my-4'>
          <p>Role :</p>
          <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
            {
              Object.values(ROLE).map(el => {
                return (
                  <option value={el} key={el}>{el}</option>
                )
              })
            }
          </select>
        </div>
        <button onClick={updateUserRole} className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700'>Change Role</button>
      </div>
    </div>
  )
}

export default ChangeUserRole