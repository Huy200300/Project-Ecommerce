import SummaryAip from "../common";

const fetchCategoryWiseProduct = async (category) => {
  const data = await fetch(SummaryAip.category_wiseProduct.url, {
    method: SummaryAip.category_wiseProduct.method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      category: category,
    }),
  });

  const dataApi = await data.json();

  return dataApi;
};

export default fetchCategoryWiseProduct;
