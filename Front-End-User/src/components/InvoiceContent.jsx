import React from "react";
import moment from "moment";


const InvoiceContent = React.forwardRef(({ dataDetails, displayCurrency }) => (
    <div id="invoice-content" className="p-1 bg-white rounded-lg shadow-lg print:shadow-none font-semibold">
        <h2 className="text-2xl font-bold text-center mb-4">HÓA ĐƠN MUA HÀNG</h2>
        <div className="w-full flex gap-3 items-center">
            <div className="mb-6 w-1/2 shadow-xl p-2 rounded-lg print:shadow-none border-2">
                <h3 className="text-xl text-center font-bold capitalize mb-2">Thông tin đơn hàng</h3>
                {
                    dataDetails.map((i, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            <div>
                                <p><span className="font-bold text-lg">Ngày tạo:</span> {moment(i.createdAt).format('DD / MM / YYYY')}</p>
                                <p><span className="font-bold text-lg">Mã đơn hàng:</span> #{i.orderId}</p>
                            </div>
                            <div className="">
                                <p><span className="font-bold text-lg">Tên người nhận:</span> {i.shippingDetails[0].shippingAddress.fullName}</p>
                                <p><span className="font-bold text-lg">Số điện thoại:</span> {i.shippingDetails[0].shippingAddress.phone}</p>
                                <p><span className="font-bold text-lg">Địa chỉ:</span>  {i.shippingDetails[0].shippingAddress.fullAddress}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="flex flex-col gap-1 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg shadow-xl print:shadow-none border-2">
                    <h3 className="font-bold text-center text-xl capitalize">Thông tin giao hàng</h3>
                    {
                        dataDetails.map((i, index) => (
                            <div key={index}>
                                <p><span className="font-bold text-lg">Hình thức giao hàng:</span> Giao tới {i.shippingDetails[0].shippingAddress.addressType}</p>
                                <p><span className="font-bold text-lg">Phương thức vận chuyển:</span> {i.shippingDetails[0].shippingMethod}</p>
                            </div>
                        ))
                    }
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-xl print:shadow-none border-2">
                    <h3 className="font-bold text-center text-xl capitalize">Thông tin thanh toán</h3>
                    {
                        dataDetails.map((i, index) => (
                            <div key={index}>
                                <p><span className="font-bold text-lg">Thanh toán qua:</span> {i.paymentDetails && i.paymentDetails.map(i => i.bank === "không" ? "Khi nhận hàng" : i.bank)}</p>
                                <p><span className="font-bold text-lg">Trạng thái thanh toán:</span> {i.status === "paid" ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

        <div className="overflow-y-auto max-h-60 print:max-h-none print:overflow-visible mb-6">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-center sticky top-0 z-10">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Sản phẩm</th>
                        <th className="px-4 py-2">Số lượng</th>
                        <th className="px-4 py-2">Màu sắc</th>
                        <th className="px-4 py-2">Đơn giá (VND)	</th>
                        <th className="px-4 py-2">Thành tiền (VND)</th>
                    </tr>
                </thead>
                <tbody>
                    {dataDetails?.map((detail) => (
                        detail?.productDetails?.map((product, index) => (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2 flex items-center space-x-4">
                                    {
                                        product?.color ? <img
                                            src={product?.colorImage}
                                            alt={product?.productName}
                                            className="w-16 h-16 object-cover rounded-md print:hidden"
                                        />
                                            :
                                            <img
                                                src={product?.colorImage[0]}
                                                alt={product?.productName}
                                                className="w-16 h-16 object-cover rounded-md print:hidden"
                                            />
                                    }
                                    <div>
                                        <p className="line-clamp-2 print:inline">{product?.productName}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-center">{product?.quantity}</td>
                                <td className='px-4 py-2 text-center'>{product?.color}</td>
                                <td className="px-4 py-2 text-center">{product.sellingPrice.toLocaleString('vi-VN')}</td>
                                <td className="px-4 py- text-center">{(product.sellingPrice * product.quantity).toLocaleString('vi-VN')}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
        <div className="text-right">
            {dataDetails?.map((detail, idx) => (
                <div key={idx}>
                    <p><span className="font-bold text-lg">Phí vận chuyển:</span> {displayCurrency(detail?.shippingDetails?.[0]?.shipping)}</p>
                    <p className="font-semibold"><span className="font-bold text-lg">Tổng cộng:</span> {displayCurrency(detail?.amount)}</p>
                </div>
            ))}
        </div>
    </div>
));

export default InvoiceContent;
