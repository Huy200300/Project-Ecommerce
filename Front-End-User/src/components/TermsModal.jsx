import React from "react";

const TermsModal = ({ onAccept }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-9/12 lg:w-7/12 h-5/6 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Điều khoản và Điều kiện</h2>
                <p className="mb-4">
                    Chào mừng quý khách đến với Shop! Chúng tôi xin chân thành cảm ơn sự tin tưởng và ủng hộ của quý khách khi mua hàng tại website của chúng tôi. Trước khi tiến hành thanh toán, quý khách vui lòng đọc kỹ các điều khoản và điều kiện dưới đây.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">1. Thông tin sản phẩm</h3>
                <p className="mb-4">
                    - Chúng tôi cam kết cung cấp thông tin sản phẩm chính xác nhất, bao gồm mô tả, hình ảnh, giá cả và các đặc tính kỹ thuật. Tuy nhiên, các sai sót trong quá trình nhập liệu có thể xảy ra và chúng tôi không chịu trách nhiệm về các sai sót không mong muốn này.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">2. Quy trình thanh toán</h3>
                <p className="mb-4">
                    - Quý khách có thể thanh toán bằng thẻ tín dụng, ví điện tử hoặc chuyển khoản ngân hàng. Tất cả các giao dịch thanh toán được thực hiện thông qua nền tảng bảo mật, đảm bảo an toàn tuyệt đối cho thông tin của quý khách.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">3. Chính sách vận chuyển</h3>
                <p className="mb-4">
                    - Sản phẩm sẽ được giao đến địa chỉ quý khách cung cấp trong thời gian từ 3-7 ngày làm việc tùy thuộc vào vị trí địa lý. Chúng tôi sẽ liên hệ với quý khách nếu có bất kỳ sự chậm trễ nào phát sinh trong quá trình giao hàng.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">4. Chính sách bảo hành</h3>
                <p className="mb-4">
                    - Tất cả các sản phẩm được mua tại Shop đều được bảo hành chính hãng. Quý khách có thể kiểm tra thông tin bảo hành trên phiếu bảo hành đi kèm với sản phẩm hoặc trên website của chúng tôi.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">5. Chính sách đổi trả</h3>
                <p className="mb-4">
                    - Trong vòng 7 ngày kể từ khi nhận được sản phẩm, quý khách có thể đổi hoặc trả hàng nếu sản phẩm chưa qua sử dụng và còn nguyên tem, nhãn mác, bao bì. Mọi chi phí vận chuyển trong quá trình đổi trả sẽ do quý khách chi trả.
                </p>
                <h3 className="text-2xl font-semibold mt-6 mb-4">6. Giới hạn trách nhiệm</h3>
                <p className="mb-4">
                    - Shop không chịu trách nhiệm cho bất kỳ tổn thất hoặc thiệt hại nào phát sinh từ việc sử dụng sản phẩm hoặc dịch vụ mà không tuân theo hướng dẫn sử dụng.
                </p>
                <p className="mb-6">
                    Vui lòng chấp nhận các điều khoản và điều kiện trước khi tiến hành thanh toán. Nếu quý khách không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ và liên hệ với chúng tôi để được hỗ trợ.
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onAccept}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                    >
                        Chấp nhận Điều khoản
                    </button>
                </div>
            </div>
        </div>
    );
};



export default TermsModal;
