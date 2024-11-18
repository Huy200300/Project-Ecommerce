import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import { FaStar, FaReply, FaThumbsUp, FaCheck, FaTimes, FaRegClock } from 'react-icons/fa';



const ReviewList = ({ productId, loading, user }) => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReview, setTotalReview] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [showReplyForm, setShowReplyForm] = useState({});
    const [replyContent, setReplyContent] = useState({});


    useEffect(() => {
        fetchReviews(currentPage);
    }, [productId, currentPage]);

    useEffect(() => {
        const sum = reviews?.reduce((acc, curr) => acc + curr?.rating, 0);
        if (reviews.length > 0) {
            setAverageRating(sum / reviews?.length);
        } else {
            setAverageRating(0);
        }
    }, [reviews]);

    const fetchReviews = async (page = 1, limit = 3) => {
        const response = await fetch(`http://localhost:8080/api/get-reviews?page=${page}&limit=${limit}`, {
            method: SummaryAip.getReview.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (data?.success) {
            setReviews(data?.data);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotalReview(data?.totalReview?.count)
        } else {
            toast.error(data?.message)
        }
    };

    const changePage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
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


    const handleReplyChange = (reviewId, value) => {
        setReplyContent({ ...replyContent, [reviewId]: value });
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

    return (
        <div>
            {
                totalReview > 0 && (
                    <div className="flex items-center mb-2 flex-col">
                        <p>Đánh giá trung bình</p>
                        <span className="flex">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className={`text-lg ${index < averageRating.toFixed(1) ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />
                            ))}
                        </span>
                        <span className="ml-2 text-lg">{averageRating.toFixed(1)}</span>
                        <span className='mb-2 text-slate-600'>Đã có {totalReview} đánh giá</span>
                    </div>
                )
            }

            {
                loading ? <>loading</> : (
                    reviews?.length === 0 ? (<div className='text-center'>
                        <h2 className='text-2xl'>Sản phẩm chưa có đánh giá nào</h2>
                        <h3 className='text-xl text-slate-400'>Hãy là người đánh giá đầu tiên!!!</h3>
                    </div>) :
                        <div className="flex gap-4 w-full">

                            <div className="flex-1">
                                <ul>
                                    {
                                        reviews?.map((review, index) => (
                                            <li key={index} className="mb-2 p-4 border border-gray-200 rounded-lg shadow-md flex flex-col justify-center">
                                                <div className="flex items-start">
                                                    <img src={review?.userId?.avatar} alt={review?.userId?.name} width={60} height={60} className="rounded-full mr-5" />
                                                    <div className="flex-grow">
                                                        <h2 className="text-xl text-gray-700">{review?.userId?.name}</h2>
                                                        <div className="flex items-center mb-2">
                                                            {[...Array(5)].map((_, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`text-lg ${index < review?.rating ? 'text-yellow-500' : 'text-gray-300'} mr-1`}
                                                                >
                                                                    <FaStar />
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-gray-600">{review?.comment}</p>
                                                        <div className='flex items-center gap-4'>
                                                            <span className='text-slate-400'>Ngày {moment(review?.createAt).format('DD/MM/YYYY')}</span>
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
                                                        {review?.replies?.length > 0 && (
                                                            <div className="ml-4 mt-4">
                                                                <h3 className="text-gray-700 font-semibold mb-3">Các trả lời:</h3>
                                                                <ul className="space-y-4">
                                                                    {review?.replies?.map((reply) => (
                                                                        <li key={reply?._id} className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm">
                                                                            <img
                                                                                src={reply?.avatar}
                                                                                alt={reply?.userName}
                                                                                className="w-10 h-10 rounded-full mr-4"
                                                                            />
                                                                            <div className="flex-grow">
                                                                                <div className="flex items-center mb-1">
                                                                                    <h4 className="text-gray-800 font-medium">{reply?.userName}</h4>
                                                                                </div>
                                                                                <p className="text-gray-800 text-base leading-6">{reply?.comment}</p>
                                                                                <span className="text-sm text-gray-500">
                                                                                    Ngày {moment(reply?.createdAt).format('DD/MM/YYYY')}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                       
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
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
                        </div>)
            }

        </div>
    );
};

export default ReviewList;
