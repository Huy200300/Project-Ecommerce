
import SummaryAip from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id,count) => {
  e?.stopPropagation();
  e?.preventDefault();

  const dataResponse = await fetch(SummaryAip.add_to_cart.url, {
    method: SummaryAip.add_to_cart.method,
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      productId: id || null,
      count:count || 1
    }),
  });
  const dataApi = await dataResponse.json();

  if (dataApi?.success) {
    toast.success(dataApi?.message);
  } else if (dataApi?.error) {
    toast.error(dataApi?.message);
  }
  return dataApi;
};

export default addToCart;
