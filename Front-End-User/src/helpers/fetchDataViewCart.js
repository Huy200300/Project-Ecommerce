import SummaryAip from "../common";

const fetchDataViewCart = async () => {
  const response = await fetch(SummaryAip.view_cart_product.url, {
    method: SummaryAip.view_cart_product.method,
    credentials: "include",
    headers: { "content-type": "application/json" },
  });
  const result = await response.json();
  return result;
};

export default fetchDataViewCart;
