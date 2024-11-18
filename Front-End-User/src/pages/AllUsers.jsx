import React, { useEffect, useState } from 'react'
import SummaryAip from '../common'
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaRegEdit } from "react-icons/fa";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([])
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: "",
    })
    const fetchAllUsers = async () => {
        const dataResponse = await fetch(SummaryAip.all_users.url, {
            method: SummaryAip.all_users.method,
            credentials: "include"
        })
        const dataApi = await dataResponse.json()
        if (dataApi.success) {
            setAllUsers(dataApi.data)
        } else if (dataApi.error) {
            toast.error(dataApi.message)
        }

    }
    useEffect(() => {
        fetchAllUsers()
    }, [])
    return (
        <div>
            <table className='w-full userTable'>
                <thead className='bg-black text-white'>
                    <tr>
                        <th>Sr. </th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUsers.map((el, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{el?.name}</td>
                                    <td>{el?.phone}</td>
                                    <td>{el?.email}</td>
                                    <td className='flex justify-center'>{el?.avatar ? (<img src={el?.avatar} className='w-10 h-10' alt={el?.name} />) : (<></>)}</td>
                                    <td>{el?.role}</td>
                                    <td>{moment(el?.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <button className='bg-green-200 rounded-full p-2 cursor-pointer hover:bg-green-700 hover:text-white'
                                            onClick={() => {
                                                setOpenUpdateRole(true)
                                                setUpdateUserDetails(el)
                                            }} >
                                            <FaRegEdit />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                openUpdateRole && (
                    <ChangeUserRole
                        onClose={() => setOpenUpdateRole(false)}
                        name={updateUserDetails.name}
                        email={updateUserDetails.email}
                        role={updateUserDetails.role}
                        userId={updateUserDetails._id}
                        callFun={fetchAllUsers}
                    />
                )
            }

        </div>
    )
}

export default AllUsers