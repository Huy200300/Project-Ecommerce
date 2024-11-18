import "./App.css";
import "normalize.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback, useEffect, useState } from "react";
import SummaryAip from "./common";
import Context from "./context";
import { TabProvider } from "./context/TabContext";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SelectedProductsProvider } from "./context/SelectedProducts";
import { ProductCompareProvider } from "./context/ProductCompareContext";
import CompareProductsModal from "./components/CompareProductsModal";

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const [dataUser, setDataUser] = useState([]);

  const fetchUserDetails = async () => {
    const dataReponse = await fetch(SummaryAip.current_user.url, {
      method: SummaryAip.method,
      credentials: "include",
    });
    const dataApi = await dataReponse.json();

    if (dataApi?.success) {
      setDataUser(dataApi?.data);
      dispatch(setUserDetails(dataApi?.data));
    }
  };

  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryAip.count_add_to_cart.url, {
      method: SummaryAip.count_add_to_cart.method,
      credentials: "include",
    });
    const dataApi = await dataResponse.json();
    setCartProductCount(dataApi?.data?.count);
  };

  const updateCartProductCount = useCallback(async () => {
    await fetchUserAddToCart();
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails,
          cartProductCount,
          dataUser,
          fetchUserAddToCart,
          updateCartProductCount,
        }}
      >
        <TabProvider>
          <ToastContainer position="top-right" />
          <ProductCompareProvider>
            <FavoritesProvider>
              <SelectedProductsProvider>
                <CartProvider>
                  <Header />
                  <main id="main-content" className="min-h-[calc(100vh-140px)]">
                    <Outlet />
                  </main>
                  <CompareProductsModal />
                  <Footer />
                </CartProvider>
              </SelectedProductsProvider>
            </FavoritesProvider>
          </ProductCompareProvider>
          <ScrollToTopButton />
        </TabProvider>
      </Context.Provider>
    </>
  );
}

export default App;
