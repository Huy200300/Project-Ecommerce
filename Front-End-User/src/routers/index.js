import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import ProfileUser from "../pages/ProfileUser";
import Recovery from "../pages/Recovery";
import Reset from "../pages/Reset";
import OrderPage from "../pages/OrderPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentResult from "../pages/PaymentResult";
import FavoritesPage from "../pages/FavoritesPage";
import PurchasePage from "../pages/PurchasePage";
import HotDealPage from "../pages/HotDealPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "payment-result",
        element: <PaymentResult />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "profile",
        element: <ProfileUser />,
      },
      {
        path: "recovery",
        element: <Recovery />,
      },
      {
        path: "reset",
        element: <Reset />,
      },
      {
        path: "hotdeal",
        element: <HotDealPage />,
      },
      {
        path: "purchase",
        element: <PurchasePage />,
      },
      // {
      //   path: "admin-panel",
      //   element: <AdminPanel />,
      //   children: [
      //     {
      //       path: "all-users",
      //       element: <AllUsers />,
      //     },
      //     {
      //       path: "all-products",
      //       element: <AllProducts />,
      //     },
      //   ],
      // },
    ],
  },
]);

export default router;
