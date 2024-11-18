import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const SelectedProducts = createContext();

export const SelectedProductsProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState(
    () => JSON.parse(localStorage.getItem("selectedProducts")) || []
  );
  const selectedProductsRef = useRef(selectedProducts);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("selectedProducts"));
    if (savedProducts) setSelectedProducts(savedProducts);
  }, []);

  const addToSelectedProducts = (product) => {
    if (selectedProducts.some((item) => item._id === product._id)) return;

    const updatedCart = [...product];
    setSelectedProducts(updatedCart);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedCart));
  };

  // Hàm để cập nhật selectedProducts và lưu vào localStorage
  const updateSelectedProducts = (updatedProducts) => {
    setSelectedProducts(updatedProducts);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
  };

  const removeFromSelectedProducts = (productIds) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => !productIds.includes(product._id)
    );
    setSelectedProducts(updatedSelectedProducts);
    localStorage.setItem(
      "selectedProducts",
      JSON.stringify(updatedSelectedProducts)
    );
    selectedProductsRef.current = updatedSelectedProducts;
  };

  return (
    <SelectedProducts.Provider
      value={{
        selectedProducts,
        updateSelectedProducts,
        removeFromSelectedProducts,
        addToSelectedProducts,
      }}
    >
      {children}
    </SelectedProducts.Provider>
  );
};

export const useSelectedProducts = () => useContext(SelectedProducts);
