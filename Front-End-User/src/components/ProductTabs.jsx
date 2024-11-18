import React, { useEffect, useRef, useState } from "react";
import SummaryAip from "../common";
import { toast } from 'react-toastify';
import { FaCheck, FaReply, FaStar, FaThumbsUp, FaTimes } from "react-icons/fa";
import moment from 'moment';
import { Link } from "react-router-dom";
import { useTabContext } from '../context/TabContext';


const ProductTabs = ({ productId, product, user, dataSpec }) => {
    const { activeTab, setActiveTab, scrollToReviews, setScrollToReviews } = useTabContext();
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReview, setTotalReview] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [showReplyForm, setShowReplyForm] = useState({});
    const [replyContent, setReplyContent] = useState({});
    const reviewsRef = useRef(null);

    useEffect(() => {
        if (scrollToReviews && activeTab === "reviews") {
            reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
            setScrollToReviews(false);
        }
    }, [activeTab, scrollToReviews, setScrollToReviews]);


    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const reset = () => {
        setComment("");
        setRating(0);
        setHoverRating(0);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(SummaryAip.newReview.url, {
            method: SummaryAip.newReview.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId,
                rating,
                comment,
            })
        });
        setLoading(false)
        const dataApi = await response.json();
        if (dataApi?.success) {
            toast.success(dataApi?.message);
            reset();
        } else {
            toast.error(dataApi?.message);
            reset();
        }
    };

    const fetchReviews = async (page = 1, limit = 3) => {
        setLoading(true);
        const response = await fetch(
            `http://localhost:8080/api/get-reviews?page=${page}&limit=${limit}`,
            {
                method: SummaryAip.getReview.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ productId }),
            }
        );
        const data = await response.json();
        setLoading(false);
        if (data?.success) {
            setReviews(data?.data);
            setTotalPages(data.totalPages);
            setTotalReview(data?.totalReview?.count);
            if (currentPage !== data.currentPage) {
                setCurrentPage(data.currentPage);
            }
        } else {
            toast.error(data?.message)
        }
    };

    const changePage = (page) => {
        if (page !== currentPage && page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        const sum = reviews?.reduce((acc, curr) => acc + curr?.rating, 0);
        if (reviews.length > 0) {
            setAverageRating(sum / reviews?.length);
        } else {
            setAverageRating(0);
        }
    }, [reviews]);


    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage, productId]);

    const handleReplyChange = (reviewId, value) => {
        setReplyContent({ ...replyContent, [reviewId]: value });
    };

    const toggleReplyForm = (reviewId) => {
        setShowReplyForm({
            ...showReplyForm,
            [reviewId]: !showReplyForm[reviewId],
        });
    };

    const handleLikeReview = async (reviewId, userId) => {
        const response = await fetch(SummaryAip.reviews_like.url, {
            method: SummaryAip.reviews_like.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reviewId: reviewId,
                userId: userId
            })
        });

        const json = await response.json();

        if (json?.error) {
            toast.error(json?.message);
        } else if (json?.success) {
            setReviews(reviews.map(review =>
                review._id === reviewId
                    ? {
                        ...review,
                        likedBy: review.likedBy.includes(userId)
                            ? review.likedBy
                            : [...review.likedBy, userId],
                        likes: review.likedBy.includes(userId)
                            ? review.likes
                            : review.likes + 1
                    }
                    : review
            ));
        }
    };

    const handleReplySubmit = async (reviewId, userId, userName, avatar) => {
        const comment = replyContent[reviewId];
        if (!comment) return;
        const response = await fetch(SummaryAip.reviews_replies.url, {
            method: SummaryAip.reviews_replies.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reviewId: reviewId,
                comment: comment,
                userId: userId,
                userName: userName,
                avatar: avatar
            })
        })
        const reply = await response.json();
        if (reply?.success) {
            const updatedReviews = reviews?.map((review) =>
                review?._id === reviewId ? { ...review, replies: [...review?.replies, reply?.data?.replies.pop()] } : review
            );
            setReviews(updatedReviews);
            setReplyContent({ ...replyContent, [reviewId]: "" });
            setShowReplyForm({ ...showReplyForm, [reviewId]: false });
        } else {
            toast.error(reply?.message);
        }
    };

    const isLiked = (likedBy, userId) => likedBy?.includes(userId);

    const renderContent = () => {
        switch (activeTab) {
            case "description":
                return <p>{product?.description}</p>;

            case "details":
                return (
                    <div className="flex justify-center">
                        {dataSpec && (
                            <div className="w-full max-w-4xl">
                                <div className="flex flex-wrap justify-center">
                                    {Object.entries(dataSpec?.specificationsRef || {})
                                        .filter(([key]) => key !== "_id" && key !== "__v")
                                        .map(([key, value]) => {
                                           
                                            const vietnameseLabels = {
                                                screenSize: "Kích thước màn hình",
                                                resolution: "Độ phân giải màn hình",
                                                battery: "Dung lượng pin",
                                                processor: "Bộ vi xử lý",
                                                storage: "Dung lượng lưu trữ",
                                                connectivity: "Kết nối",
                                                weight: "Khối lượng",
                                            };

                                            // Kiểm tra nếu specificationsModel là "mobiles" và key tồn tại trong dictionary
                                            const label =
                                                dataSpec?.specificationsModel === "mobiles" && vietnameseLabels[key]
                                                    ? vietnameseLabels[key]
                                                    : key.replace(/([A-Z])/g, " $1");

                                            return (
                                                <div
                                                    key={key}
                                                    className="flex flex-col items-center w-1/2 md:w-1/3 lg:w-1/4 p-2"
                                                >
                                                    <span className="font-semibold capitalize text-gray-600">
                                                        {label}:
                                                    </span>
                                                    <span className="text-gray-800">{value}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "reviews":
                return (
                    <div className="flex md:flex-row flex-col gap-10">
                        <div className="flex flex-col md:w-1/4 w-full items-center justify-center">
                            <div className="flex gap-2 items-center">
                                <span className="flex">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar key={index} className={`text-lg ${index < averageRating.toFixed(1) ? 'text-red-500' : 'text-gray-300'} mr-1`} />
                                    ))}
                                </span>
                                <span className="ml-2 text-lg">{averageRating.toFixed(1)}</span>
                            </div>

                            <div className="space-y-2 mt-2">
                                {[
                                    { stars: 5, percent: "w-[70%]", count: 3 },
                                    { stars: 4, percent: "w-[50%]", count: 2 },
                                    { stars: 3, percent: "w-[0%]", count: 0 },
                                    { stars: 2, percent: "w-[0%]", count: 0 },
                                    { stars: 1, percent: "w-[0%]", count: 0 },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            {[...Array(item.stars)].map((_, i) => (
                                                <span key={i} className="text-red-500 text-sm">★</span>
                                            ))}
                                            {[...Array(5 - item.stars)].map((_, i) => (
                                                <span key={i} className="text-gray-300 text-sm">★</span>
                                            ))}
                                        </div>
                                        <div className="bg-gray-300 h-2 rounded-full flex-1 relative">
                                            <div className={`bg-red-500 h-2 rounded-full ${item.percent}`} />
                                        </div>
                                        <div className="text-gray-500 text-sm">{item.count}</div>
                                    </div>
                                ))}
                            </div>

                        </div>


                        <div className="space-y-4 mt-3  md:w-3/4 w-full">
                            <div className="flex gap-5 flex-col">
                                {
                                    reviews?.length > 0 ?
                                        reviews?.map((review, index) => (
                                            <>
                                                <div key={index} className="flex items-center gap-8">
                                                    <div>
                                                        <p className="font-semibold">{review?.userId?.name}</p>
                                                        <p className="text-xs">Ngày {moment(review?.createAt).format('DD/MM/YYYY')}</p>
                                                        <div className="flex items-center mb-2">
                                                            {[...Array(5)].map((_, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`text-lg ${index < review?.rating ? 'text-red-500' : 'text-gray-300'} mr-1`}
                                                                >
                                                                    <FaStar />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600">
                                                        {review?.comment}
                                                    </p>

                                                </div>
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex items-center gap-5">
                                                        <button
                                                            onClick={() => toggleReplyForm(review?._id)}
                                                            className="text-gray-500 hover:underline flex items-center"
                                                        >
                                                            <FaReply className="mr-1" /> Trả lời
                                                        </button>
                                                        <button
                                                            onClick={() => handleLikeReview(review?._id, user?._id)}
                                                            className={`flex items-center ${isLiked(review?.likedBy, user?._id) ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                                                        >
                                                            <FaThumbsUp className="mr-1" /> {review?.likes} Thích
                                                        </button>
                                                    </div>
                                                    {showReplyForm[review?._id] && (
                                                        <div className="mt-2 ml-4">
                                                            <textarea
                                                                value={replyContent[review?._id] || ""}
                                                                onChange={(e) =>
                                                                    handleReplyChange(review?._id, e.target.value)
                                                                }
                                                                placeholder="Trả lời đánh giá này..."
                                                                rows={2}
                                                                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 mb-2"
                                                            />
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleReplySubmit(review?._id, user?._id, user?.name, user?.avatar)}
                                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2 flex items-center"
                                                                >
                                                                    <FaCheck className="mr-1" /> Gửi trả lời
                                                                </button>
                                                                <button
                                                                    onClick={() => toggleReplyForm(review?._id)}
                                                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center"
                                                                >
                                                                    <FaTimes className="mr-1" /> Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ))
                                        : (<><h2 className='text-2xl flex justify-center items-center'>Sản phẩm chưa có đánh giá nào</h2></>)
                                }
                            </div>
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


                        <form className="space-y-4 md:w-1/3 w-full" onSubmit={handleSubmit}>
                            <p className="capitalize font-bold">Vui lòng <Link className="text-red-500 hover:text-red-600" to={"/login"}>đăng nhập</Link> hoặc <Link className="text-red-500 hover:text-red-600" to={"/sign-up"}>đăng ký</Link> để gửi đánh giá của bạn.</p>
                            <textarea
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Nhận xét của bạn về sản phẩm..."
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <div className="flex items-center space-x-2">
                                <span>Đánh giá:</span>
                                <div className="">
                                    {[...Array(5)].map((_, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`text-lg ${index < (hoverRating || rating) ? 'text-red-500' : 'text-gray-300'} mr-1`}
                                            onClick={() => setRating(index + 1)}
                                            onMouseEnter={() => setHoverRating(index + 1)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            <FaStar />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-red-500 font-semibold capitalize text-white py-2 px-4 rounded hover:bg-red-600"
                                disabled={loading}
                            >
                                Gửi đánh giá
                            </button>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="w-full p-4">
            <div className="border-b border-2 border-gray-200 relative">
                <nav className="-mb-px flex justify-center items-center space-x-8 absolute -top-3 left-1/3 px-1 transition-all ease-in-out" aria-label="Tabs">
                    <button
                        className={`bg-white font-semibold ${activeTab === "description" ? "border-red-500 text-red-600" : "border-transparent text-gray-500"} w-1/3 px-2 text-center border-b-2 font-medium text-sm`}
                        onClick={() => setActiveTab("description")}
                    >
                        Mô tả
                    </button>
                    <button
                        className={`bg-white font-semibold text-nowrap ${activeTab === "details" ? "border-red-500 text-red-600" : "border-transparent text-gray-500"} w-1/3 px-2 text-center border-b-2 font-medium text-sm`}
                        onClick={() => setActiveTab("details")}
                    >
                        Chi tiết
                    </button>
                    <button
                        className={`bg-white font-semibold text-nowrap ${activeTab === "reviews" ? "border-red-500 text-red-600" : "border-transparent text-gray-500"} w-1/3 px-2 text-center border-b-2 font-medium text-sm`}
                        onClick={() => setActiveTab("reviews")}
                    >
                        Đánh giá({totalReview})
                    </button>
                </nav>
            </div>
            <div className="mt-9">
                {activeTab === "description" && (
                    <div>
                        {renderContent()}
                    </div>
                )}
                {activeTab === "details" && (
                    <div>
                        {renderContent()}
                    </div>
                )}
                {activeTab === "reviews" && (
                    <div ref={reviewsRef}>
                        {renderContent()}
                    </div>
                )}
            </div>


        </div>
    );
};

export default ProductTabs;
