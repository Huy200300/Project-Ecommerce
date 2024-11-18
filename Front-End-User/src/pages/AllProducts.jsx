import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryAip from '../common'
import { FiPlusCircle } from "react-icons/fi";
import displayCurrency from '../helpers/displayCurrency';
import translatedCategory from '../helpers/translatedCategory';
import { MdDeleteOutline } from 'react-icons/md';
import { FaCheck, FaRegEdit } from 'react-icons/fa';
import AdminEditProduct from '../components/AdminEditProduct';
import GenericModal from '../components/GenericModal';
import { toast } from 'react-toastify';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false)
  const [editProduct, setEditProduct] = useState(false)
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dataEdit, setDataEdit] = useState([]);

  const fetchProductsByStatus = async (filterStatus, page = 1, limit = 10) => {
    setLoading(true)
    const response = await fetch(SummaryAip.products_filter_status.url, {
      method: SummaryAip.products_filter_status.method,
      "credentials": "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ status: filterStatus, page, limit })
    });
    setLoading(false)
    const dataApi = await response.json();
    setAllProducts(dataApi?.data);
    setTotalPages(dataApi.totalPages);
    setCurrentPage(dataApi.currentPage);
  };

  const deleteProduct = async (id, status) => {
    setLoading(true)
    const response = await fetch(SummaryAip.delete_product.url, {
      method: SummaryAip.delete_product.method,
      "credentials": "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ _id: id })
    });
    setLoading(false)
    const dataApi = await response.json();
    if (dataApi?.success) {
      toast.success(dataApi?.message)
      fetchProductsByStatus(status)
    } else {
      toast.error(dataApi?.message)
    }
  }

  const handleStatusChange = (productId, newStatus) => {
    setSelectedProduct(productId);
    setActionType(newStatus);
    setConfirmModalIsOpen(true);
  };

  const confirmStatusChange = async () => {
    setLoading(true)
    await fetch(SummaryAip?.update_products_status.url,
      {
        method: SummaryAip.update_products_status.method,
        "credentials": "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          productId: selectedProduct,
          status: actionType,
        })
      }
    );
    setLoading(false)
    setFilterStatus(actionType);
    fetchProductsByStatus(actionType);
    setConfirmModalIsOpen(false);

  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const changePage = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (filterStatus) {
      fetchProductsByStatus(filterStatus, currentPage);
    }
    else {
      setAllProducts([]);
    }
  }, [filterStatus, currentPage]);

  const handleEditProduct = (product) => {
    setDataEdit(product)
    setEditProduct(true)
  }

  return (
    <div>
      <div className='bg-white mb-4 py-2 px-4 flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Tất cả sản phẩm</h2>
        <div className=" flex gap-4 items-center w-fit flex-nowrap">
          <label className="flex flex-nowrap text-lg font-semibold text-gray-700">
            Filter
          </label>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="border font-semibold border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option className='font-semibold' value="Pending">Chờ duyệt</option>
            <option className='font-semibold' value="Completed">Đã hoàn thành</option>
          </select>
        </div>
        <button onClick={() => setOpenUploadProduct(true)} className='border-2 font-semibold flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-600 transition-all hover:text-white py-2 px-4 rounded-full'>
          <span className='text-2xl'><FiPlusCircle /></span>
          Thêm sản phẩm</button>
      </div>
      <div>
        {

          !loading && <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className='uppercase'>
                <th>Sr. </th>
                <th>tên sản phẩm</th>
                <th>ảnh sản phẩm</th>
                <th>giá sản phẩm</th>
                <th>giá bán sản phảm</th>
                <th>số lượng trong kho</th>
                <th>danh mục</th>
                <th>hãng sản phẩm</th>
                <th>status</th>
                {
                  filterStatus === "Pending" && <th>Action</th>
                }

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                allProducts?.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td className='text-center'>{index + 1}</td>
                      <td className='text-center'>{el?.productName}</td>
                      <td className='text-center'>{el?.productImage && <img src={el?.productImage[0]} className='w-20 h-20' alt={el?.productName} />}</td>
                      <td className='text-center'>{displayCurrency(el?.price)}</td>
                      <td className='text-center'>{displayCurrency(el?.sellingPrice)}</td>
                      <td className='text-center'>{el?.countInStock}</td>
                      <td className='text-center'>{translatedCategory(el?.category, true)}</td>
                      <td className='text-center'>{el?.brandName}</td>
                      <td className="py-4 px-6 text-gray-800">{el?.status === "Completed" ?
                        <span
                          className='text-white text-nowrap px-3 py-1 rounded-full bg-green-500 shadow-lg uppercase'>
                          Hoàn thành
                        </span> : <span className='text-white text-nowrap px-3 py-1 rounded-full bg-red-500 shadow-lg uppercase'>Kiểm duyệt</span>}</td>
                      <td className='text-center'>
                        {el?.status === "Pending" && (
                          <div className='flex gap-3'>
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200 flex items-center group relative"
                              onClick={() => handleStatusChange(el?._id, "Completed")}
                            >
                              <FaCheck />
                              <span className="absolute text-nowrap left-1/2 -bottom-7 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Đánh dấu là đã hoàn thành
                              </span>
                            </button>

                            <button
                              onClick={() => deleteProduct(el?._id, el?.status)}
                              className="bg-red-500 px-4 py-2 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 flex items-center group relative">
                              <MdDeleteOutline />
                              <span className="absolute text-nowrap left-1/2 -bottom-7 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Xóa sản phẩm
                              </span>
                            </button>

                            <button onClick={() => handleEditProduct(el)} className="bg-blue-500 px-4 py-2 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center group relative ml-2">
                              <FaRegEdit />
                              <span className="absolute text-nowrap left-1/4 -bottom-7 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Sửa sản phẩm
                              </span>
                            </button>
                          </div>
                        )}
                        {el?.status === "Completed" && (
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
                            onClick={() =>
                              handleStatusChange(el?._id, "Pending")
                            }
                          >
                            Đánh dấu là chờ duyệt
                          </button>
                        )}
                      </td>
                      <td></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        }

        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => changePage(index + 1)}
              className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>

      {
        editProduct && (
          <AdminEditProduct dataProduct={dataEdit} onClose={() => setEditProduct(false)} reload={fetchProductsByStatus} />
        )
      }

      <GenericModal
        isOpen={confirmModalIsOpen}
        title="Xác nhận thay đổi trạng thái"
        onClose={() => setConfirmModalIsOpen(false)}
        children="Bạn có chắc chắn muốn thay đổi trạng thái của sản phẩm này không?"
        footer={
          <div className="flex justify-end gap-4">
            <button
              onClick={confirmStatusChange}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setConfirmModalIsOpen(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            >
              Hủy
            </button>
          </div>
        }
      />

      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} reload={fetchProductsByStatus} />
        )
      }

    </div>

  )
}

export default AllProducts