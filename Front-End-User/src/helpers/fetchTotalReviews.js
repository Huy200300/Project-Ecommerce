import SummaryAip from "../common";

const fetchTotalReviews = async (page, limit, productId) => {
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
  return data;
};
export default fetchTotalReviews;
