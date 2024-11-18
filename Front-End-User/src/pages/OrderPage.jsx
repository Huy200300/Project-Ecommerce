import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Context from '../context';
import displayCurrency from '../helpers/displayCurrency';
import img from "../assets/empty_state.png";
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import { FaRegEye } from 'react-icons/fa';
import GenericModal from '../components/GenericModal';
import InvoiceContent from '../components/InvoiceContent';
import { FaTimes } from "react-icons/fa";


const OrderPage = () => {
  const { dataUser } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [dataDetails, setDataDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenModalOrderDetails, setIsOpenModalOrderDetails] = useState(false);
  const [statusHistories, setStatusHistories] = useState({});
  const invoiceRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;

    const printContents = invoiceRef.current.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
  };


  const fetchOrder = async (id, page = 1, limit, status, startDate, endDate) => {
    // setLoading(true);
    const response = await fetch(`http://localhost:8080/api/orders/user/${id}?page=${page}&limit=${limit}&status=${status}&startDate=${startDate}&endDate=${endDate}`);
    const dataApi = await response.json();
    // setLoading(false);

    const fetchedOrders = dataApi?.data || [];
    setCurrentPage(dataApi.currentPage);
    setTotalPages(dataApi.totalPages);
    setOrders(fetchedOrders);

    fetchedOrders.forEach(order => {
      fetchStatusHistory(order._id);
    });
  };

  const handleOrderDetails = async (e, orderId) => {
    e.preventDefault();
    const response = await fetch(SummaryAip.order_details.url, {
      method: SummaryAip.order_details.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId })
    });
    const dataApi = await response.json();
    if (dataApi?.success) {
      setDataDetails(dataApi?.data || []);
      setIsOpenModalOrderDetails(true);
    } else {
      if (dataApi?.error) {
        toast.error(dataApi?.message);
      }
    }
  };

  const fetchStatusHistory = async (orderId) => {
    const response = await fetch(`http://localhost:8080/api/orders/staff/${orderId}`, {
      method: "GET",
    });
    const dataApi = await response.json();
    if (dataApi?.success) {
      setStatusHistories(prev => ({
        ...prev,
        [orderId]: dataApi.data,
      }));
    } else {
      toast.error(dataApi?.message || "Failed to fetch order status history");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    const cleanedQuery = searchQuery.replace('#', '').trim();
    setLoading(true);
    const response = await fetch(`http://localhost:8080/api/orders/search?query=${cleanedQuery}&page=${currentPage}&limit=${limit}`, {
      method: 'GET',
      credentials: "include"
    });

    setLoading(false);
    const dataApi = await response.json();
    setOrders(dataApi.data);
    setCurrentPage(dataApi.currentPage);
    setTotalPages(dataApi.totalPages);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchOrder(dataUser._id, currentPage, limit, statusFilter, startDate, endDate);
  };

  useEffect(() => {
    if (dataUser && dataUser._id) {

      fetchOrder(dataUser._id, currentPage, limit, statusFilter, startDate, endDate);

    }
  }, [dataUser, currentPage, limit, statusFilter, startDate, endDate]);

  const handleRefresh = () => {
    setStartDate("");
    setEndDate(new Date().toISOString().split("T")[0]);
    fetchOrder(dataUser._id, currentPage, limit, statusFilter);
  };


  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const getCurrentStatus = (order) => order.slice(-1)[0]?.orderStatus;

  const renderSteps = (orderId) => {
    const statusHistory = statusHistories[orderId] || {};
    const currentStatus = getCurrentStatus(statusHistory.statusHistory || []);

    const hasDelivered = statusHistory.statusHistory?.some(s => s.orderStatus === 'Delivered');

    return (
      <div className="flex items-center justify-center border-2 rounded-lg shadow-sm mb-4 space-x-4">
        {steps.map((step, index) => {
          if (hasDelivered && step.status === 'Cancelled') return null;
          const isCancelled = currentStatus === 'Cancelled';

          const isActive = currentStatus === step.status;
          const isCompleted = statusHistory.statusHistory?.findIndex(s => s.orderStatus === step.status) !== -1;

          const nextVisibleStep = steps
            .slice(index + 1)
            .find(nextStep => !(hasDelivered && nextStep.status === 'Cancelled'));

          const stepColor = isCancelled
            ? 'bg-red-500 text-white'
            : isCompleted
              ? 'bg-green-500 text-white'
              : isActive
                ? step.bgColor
                : 'bg-gray-200 text-gray-500';



          return (
            <div key={index} className="flex items-center justify-center px-1 py-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={`step w-10 h-10 flex items-center justify-center rounded-full ${stepColor}`}
                >
                  {index + 1}
                </div>
                <div className={`ml-2 text-nowrap text-sm font-semibold ${isCancelled ? "text-red-600" : isCompleted ? 'text-green-600' : (isActive ? step.textColor : 'text-gray-500')}`}>
                  {step.label}
                </div>

                {step.status !== 'Pending' && (
                  <div className="mt-2">
                    {statusHistory.statusHistory?.some(s => s.orderStatus === step.status) && (
                      <>
                        {/* <div className={`text-sm font-semibold ${isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          Nhân viên: {statusHistory.statusHistory.find(s => s.orderStatus === step.status)?.createdBy?.name || 'Không'}
                        </div> */}
                        <div className={`text-xs font-semibold ${isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          Ngày cập nhật: {new Date(statusHistory.statusHistory.find(s => s.orderStatus === step.status)?.updatedAt).toLocaleString() || 'Không có dữ liệu'}
                        </div>
                        {step.status === 'Cancelled' && statusHistory.statusHistory.find(s => s.orderStatus === step.status)?.reason && (
                          <div className={`text-xs font-semibold text-red-500`}>
                            Lý do: {statusHistory.statusHistory.find(s => s.orderStatus === step.status).reason}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {nextVisibleStep && (
                <div
                  className={`flex-1 border-t-2 mx-2 
                ${isCompleted ? 'border-green-500' : (isActive ? 'border-blue-500' : 'border-gray-300')}`}
                  style={{ height: '2px', width: '60px' }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };


  const steps = [
    { label: 'Chờ xác nhận', status: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { label: 'Đang xử lý', status: 'Processing', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { label: 'Vận chuyển', status: 'Shipping', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
    { label: 'Chờ giao', status: 'Shipped', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { label: 'Hoàn thành', status: 'Delivered', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { label: 'Đã hủy', status: 'Cancelled', bgColor: 'bg-red-100', textColor: 'text-red-600' }
  ];

  return (
    <div>
      <div className="p-4 max-w-screen-xl mx-auto min-h-[calc(100vh-195px)]">

        <div className='flex relative items-center gap-5 pb-6'>
          <h1 className="text-2xl font-bold uppercase w-36">Đơn hàng của bạn</h1>
          <span className='font-medium'>
            <Link to="/" className='hover:text-red-500 capitalize cursor-pointer'>Trang chủ</Link> / Đơn Hàng Của Bạn
          </span>
          <div className='absolute bottom-0 left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] h-0.5 bg-slate-200 z-10'></div>
        </div>

        <div className="flex flex-wrap gap-2 my-5 justify-around bg-slate-100">
          {[
            { key: "", label: "Tất cả" },
            { key: "Pending", label: "Chờ xác nhận" },
            { key: "Processing", label: "Đang xử lý" },
            { key: "Shipping", label: "Vận chuyển" },
            { key: "Shipped", label: "Chờ giao hàng" },
            { key: "Delivered", label: "Hoàn thành" },
            { key: "Cancelled", label: "Đã hủy" },
          ].map((status) => (
            <div key={status.key} className="relative group py-5 text-current">
              <button
                onClick={() => {
                  setStatusFilter(status.key);
                  setCurrentPage(1);
                }}
                className={`hover:text-[#D10024] font-semibold relative focus:outline-none ${statusFilter === status.key ? "text-[#D10024]" : ""}`}
              >
                {status.label}
              </button>
              <span className={`absolute left-0 bottom-0 w-0 h-[2px] bg-[#D10024] transition-all duration-200 ${statusFilter === status.key ? "w-full" : "group-hover:w-full"}`}></span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 bg-gray-50 p-6 rounded-lg shadow-lg font-semibold">
          <div className="flex items-center">
            <label htmlFor="start-date" className="mr-2 text-base text-gray-700">Từ ngày:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="end-date" className="mr-2 text-base text-gray-700">Đến ngày:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Làm mới
          </button>

          <div className="flex gap-4 items-center relative">
            <label htmlFor="search-order" className="mr-2 text-base text-gray-700">Tìm kiếm:</label>
            <input
              type="text"
              id="search-order"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-2 border-gray-300 w-80 px-3 py-2 outline-none rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập mã đơn hàng, Tên Sản Phẩm"
            />

            {searchQuery && (
              <span
                onClick={handleClearSearch}
                className="absolute right-[22%] transform text-lg font-semibold text-gray-500 cursor-pointer hover:text-red-600 transition duration-200"
              >
                <FaTimes/>
              </span>
            )}

            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Tìm kiếm
            </button>
          </div>
        </div>


        <div>
          {!orders?.length ? (
            <div className='flex items-center mt-20 justify-center flex-col gap-2'>
              <img src={img} alt="img" width={296} height={180} />
              <p className="text-center font-bold capitalize text-lg">Bạn chưa có đơn hàng nào</p>
              <p className="text-center font-semibold text-gray-500">Cùng khám phá hàng ngàn sản phẩm tại Shop nhé!</p>
              <Link to={"/"} className='px-4 font-bold uppercase py-2 bg-red-600 hover:bg-red-700 rounded-full text-white text-lg'>
                Khám phá ngay
              </Link>
            </div>
          ) : (
            <>
              {
                orders?.map((item) => (
                  <div key={item._id} className="mb-8">
                    <div className="border-2 border-slate-300 rounded-md p-4 bg-white shadow-xl overflow-x-auto">
                      <div className="flex justify-between items-center mb-4 p-4 border-2 rounded-lg shadow-sm bg-white">
                        <div className='font-semibold'>
                          <p className="md:text-xl text-base text-gray-800">
                            Ngày {moment(item.createdAt).format('DD / MM / YYYY [lúc] HH:mm:ss')}
                          </p>
                          <p className="mb-2 md:text-lg text-base text-gray-600">Mã giao dịch: {item?.transactionId}</p>
                        </div>
                        <div className="flex gap-4 font-bold text-base items-center">
                          {!(item?.statusHistory?.length > 0 && item?.statusHistory[item?.statusHistory.length - 1]?.orderStatus === 'Cancelled') && (
                            <button
                              className="flex capitalize items-center gap-2 border border-blue-500 bg-blue-500 text-white hover:text-blue-500 rounded-full px-4 py-2 hover:bg-white transition-colors duration-200"
                              onClick={(e) => handleOrderDetails(e, item?.orderId)}
                            >
                              <FaRegEye className='md:block hidden' />
                              Xem hóa đơn
                            </button>
                          )}
                        </div>
                      </div>

                      {renderSteps(item._id)}

                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-gray-200 font-bold">
                            <td className="p-2 text-center border border-gray-300">STT</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Tên sản phẩm</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Màu sản phẩm</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Ảnh sản phẩm</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Số lượng</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Giá sản phẩm</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Phương thức thanh toán</td>
                            <td className="p-2 text-center border border-gray-300 capitalize">Tình Trạng thanh toán</td>
                          </tr>
                        </thead>
                        <tbody className='font-bold'>
                          {item?.productDetails && item.productDetails.length > 0 && item.productDetails.map((product, productIndex) => (
                            <tr key={product.id} className="border-t">
                              <td className="p-2 text-center border border-gray-300">{productIndex + 1}</td>
                              <td className="p-2 text-sm max-w-xs break-words text-center border border-gray-300">
                                <div className="line-clamp-2">{product.productName}</div>
                              </td>
                              <td className='text-center'>{product?.color}</td>
                              <td className="p-2 text-center border border-gray-300">
                                {
                                  !product.color ?
                                    <img
                                      src={product.colorImage[0]}
                                      alt={product.productName}
                                      className="w-24 h-24 object-contain mx-auto"
                                    />
                                    :
                                    <img
                                      src={product.colorImage}
                                      alt={product.productName}
                                      className="w-24 h-24 object-contain mx-auto"
                                    />
                                }
                              </td>
                              <td className="p-2 text-center border border-gray-300">{product.quantity}</td>
                              <td className="p-2 text-center border border-gray-300">{displayCurrency(product.sellingPrice)}</td>
                              {productIndex === 0 && (
                                <>
                                  <td className="p-2 text-center border border-gray-300" rowSpan={item.productDetails.length}>
                                    <div className="">
                                      <div className="flex flex-col items-center justify-center border-gray-300 p-2 h-full">
                                        <span>
                                          {item.paymentDetails && item.paymentDetails.some(i => i.card !== "không") ? "Bằng thẻ" : "Chưa thanh toán"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-2 text-center border border-gray-300" rowSpan={item.productDetails.length}>
                                    {item.status === "paid" ? 'Trả rồi' : 'Chưa trả'}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}

                          <tr className="text-xl text-gray-800">
                            <td className="p-2 text-center border border-gray-300" colSpan={4}>Phí Vận chuyển:</td>
                            <td className="p-2 text-center border border-gray-300" ></td>
                            <td className="p-2 text-center border border-gray-300">
                              <span>
                                {item.shippingDetails && item.shippingDetails.length > 0 && displayCurrency(item.shippingDetails.map(i => i.shipping))}
                              </span>
                            </td>
                            <td className="p-2 text-center border border-gray-300" colSpan={2}>
                              Phương Thức Vận chuyển : {item.shippingDetails && item.shippingDetails.map(i => i.shippingMethod)}
                            </td>
                          </tr>

                          <tr className="text-xl text-gray-800">
                            <td className="p-2 text-center border border-gray-300" colSpan={4}>Tổng cộng:</td>
                            <td className="p-2 text-center border border-gray-300">
                              {item.productDetails && item.productDetails.reduce((acc, product) => acc + product.quantity, 0)}
                            </td>
                            <td className="p-2 text-center border border-gray-300">{displayCurrency(item.amount)}</td>
                            <td className="p-2 text-center border border-gray-300" colSpan={2}>
                              Thanh toán qua : {item.paymentDetails && item.paymentDetails.map(i => i.bank === "không" ? "khi nhận hàng" : i.bank)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              }
              <div className="flex justify-center items-center space-x-2">
                <button
                  className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded ${currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div >

      <GenericModal
        isOpen={isOpenModalOrderDetails}
        onClose={() => setIsOpenModalOrderDetails(false)}
        isTitle={false}
        footer={
          <div className="text-right mt-6">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              onClick={handlePrint}
            >
              In hóa đơn
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsOpenModalOrderDetails(false)}
            >
              Đóng
            </button>
          </div>
        }
        children={
          <div ref={invoiceRef} id="invoice-content">
            <InvoiceContent dataDetails={dataDetails} displayCurrency={displayCurrency} />
          </div>
        }
      />

    </div >
  );
};

export default OrderPage;
