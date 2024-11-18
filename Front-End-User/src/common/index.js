const backendDomain = process.env.REACT_APP_SERVER_DOMAIN;

const SummaryAip = {
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "POST",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "GET",
  },
  logout_user: {
    url: `${backendDomain}/api/logout`,
    method: "GET",
  },
  all_users: {
    url: `${backendDomain}/api/all-users`,
    method: "GET",
  },
  update_user: {
    url: `${backendDomain}/api/update-user`,
    method: "POST",
  },
  update_users: {
    url: `${backendDomain}/api/update-user`,
    method: "PUT",
  },
  create_product: {
    url: `${backendDomain}/api/create-product`,
    method: "POST",
  },
  all_products: {
    url: `${backendDomain}/api/all-products`,
    method: "GET",
  },
  update_product: {
    url: `${backendDomain}/api/update-product`,
    method: "POST",
  },
  category_product: {
    url: `${backendDomain}/api/get-category`,
    method: "GET",
  },
  category_wiseProduct: {
    url: `${backendDomain}/api/category-products`,
    method: "POST",
  },
  product_detail: {
    url: `${backendDomain}/api/product-detail`,
    method: "POST",
  },
  add_to_cart: {
    url: `${backendDomain}/api/add-to-cart`,
    method: "POST",
  },
  count_add_to_cart: {
    url: `${backendDomain}/api/count-add-to-cart`,
    method: "GET",
  },
  view_cart_product: {
    url: `${backendDomain}/api/view-cart-product`,
    method: "GET",
  },
  update_cart_product: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "POST",
  },
  delete_cart_product: {
    url: `${backendDomain}/api/delete-cart-product`,
    method: "POST",
  },
  search_product: {
    url: `${backendDomain}/api/search-product`,
    method: "GET",
  },
  filter_product: {
    url: `${backendDomain}/api/filter-product`,
    method: "POST",
  },
  delete_product: {
    url: `${backendDomain}/api/delete-product`,
    method: "POST",
  },
  get_product_by_category: {
    url: `${backendDomain}/api/get-product-by-category`,
    method: "GET",
  },
  get_brand_apple: {
    url: `${backendDomain}/api/get-brand-apple`,
    method: "POST",
  },
  filter_top_selling: {
    url: `${backendDomain}/api/top-selling-product`,
    method: "GET",
  },
  authenticate: {
    url: `${backendDomain}/api/verify-email`,
    method: "POST",
  },
  generateOTP: {
    url: `${backendDomain}/api/generateOTP`,
    method: "GET",
  },
  reset_password: {
    url: `${backendDomain}/api/resetPassword`,
    method: "PUT",
  },
  payment: {
    url: `${backendDomain}/api/checkout`,
    method: "POST",
  },
  getOrder: {
    url: `${backendDomain}/api/order-list`,
    method: "GET",
  },
  newReview: {
    url: `${backendDomain}/api/reviews`,
    method: "POST",
  },
  getReview: {
    url: `${backendDomain}/api/get-reviews`,
    method: "POST",
  },
  delete_all_cart_product: {
    url: `${backendDomain}/api/delete-all-cart-product`,
    method: "POST",
  },
  order_details: {
    url: `${backendDomain}/api/orders-detail`,
    method: "POST",
  },
  payment_vnpay: {
    url: `${backendDomain}/api/create_payment_url`,
    method: "POST",
  },
  reviews_like: {
    url: `${backendDomain}/api/reviews/like`,
    method: "POST",
  },
  payment_momo: {
    url: `${backendDomain}/api/payment_momo`,
    method: "POST",
  },
  payment_COD: {
    url: `${backendDomain}/api/payment_cast_on_delivery`,
    method: "POST",
  },
  reviews_replies: {
    url: `${backendDomain}/api/reviews/replies`,
    method: "POST",
  },
  update_products_status: {
    url: `${backendDomain}/api/products-status`,
    method: "POST",
  },
  products_filter_status: {
    url: `${backendDomain}/api/products-filter-status`,
    method: "POST",
  },
  get_new_product: {
    url: `${backendDomain}/api/get-new-product`,
    method: "POST",
  },
  get_new_product_by_category: {
    url: `${backendDomain}/api/get-new-product-by-category`,
    method: "POST",
  },
  add_new_address: {
    url: `${backendDomain}/api/addNewAddress`,
    method: "POST",
  },
  get_top_selling_product: {
    url: `${backendDomain}/api/get-top-selling-product`,
    method: "POST",
  },
  get_order_status: {
    url: `${backendDomain}/api/get-order-status`,
    method: "POST",
  },
  updateUserRole: {
    url: `${backendDomain}/api/update-user-role`,
    method: "POST",
  },
  get_product_hot_deals: {
    url: `${backendDomain}/api/get-product-hot-deals`,
    method: "GET",
  },
  count_category_product: {
    url: `${backendDomain}/api/count-category-product`,
    method: "GET",
  },
  specifications_by_id: {
    url: `${backendDomain}/api/specifications-by-id`,
    method: "GET",
  },
};

export default SummaryAip;
