import SummaryAip from "../common";

const fetchAllProducts = async (status) => {
  const response = await fetch(SummaryAip.products_filter_status.url, {
    method: SummaryAip.products_filter_status.method,
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: status }),
  });
  const products = await response.json();
  return products.data || [];
};

export default fetchAllProducts;
