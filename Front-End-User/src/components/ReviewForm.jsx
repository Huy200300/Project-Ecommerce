import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import SummaryAip from "../common";
import { toast } from 'react-toastify';
import ReviewList from "./ReviewList";


const ReviewForm = ({ productId, user }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

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

    return (
        <div>
            <div className="mt-4 border-2 rounded-md p-2">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col items-center w-1/7">
                        {user && (
                            <>
                                <img src={user?.avatar} alt={user?.name} width={100} height={100} className="rounded-full" />
                                <h2 className="text-xl">{user?.name}</h2>
                            </>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg mb-2">Bạn đã dùng sản phẩm này? Hãy đánh giá sản phẩm</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                {[...Array(5)].map((_, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`text-lg ${index < (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'} mr-1`}
                                        onClick={() => setRating(index + 1)}
                                        onMouseEnter={() => setHoverRating(index + 1)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                            <div className="mb-4">
                                <textarea
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Nhận xét của bạn về sản phẩm..."
                                    rows={4}
                                    className="w-full border px-2 py-1 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Gửi..." : "Gửi đánh giá"}
                            </button>
                        </form>
                    </div>
                </div>
                {user && <h2 className="text-lg mt-10 container ml-24">Đánh giá sản phẩm</h2>}
                {loading ? <div className="text-center">Loading...</div> : <ReviewList productId={productId} loading={loading} user={user} />}
            </div>
        </div>
    );
};

export default ReviewForm;
