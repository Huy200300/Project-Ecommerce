import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProductCompareContext = createContext();

export const useProductCompare = () => useContext(ProductCompareContext);

export const ProductCompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isCompareVisible, setIsCompareVisible] = useState(false);

  useEffect(() => {
    const storedCompareList = JSON.parse(localStorage.getItem("compareList"));
    if (storedCompareList) {
      setCompareList(storedCompareList);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
  }, [compareList]);

  const closeCompareModal = () => {
    setIsCompareVisible(false);
  };

  const addToCompare = (product) => {
    const existingProduct = compareList?.find(
      (item) => item._id === product._id
    );
    if (existingProduct) {
      toast.error("Sản phẩm đã có trong sản phẩm so sánh");
      setIsCompareVisible(true);
    } else {
      const updatedCart = [...compareList, { ...product, amount: 1 }];
      setCompareList(updatedCart);
      localStorage.setItem("compareList", JSON.stringify(updatedCart));
      toast.success("Sản phẩm đã được thêm vào sản phẩm so sánh");
      setIsCompareVisible(true);
    }
  };

  const removeFromCompare = (productId) => {
    const updatedFavorites = compareList.filter(
      (item) => item._id !== productId
    );
    setCompareList(updatedFavorites);
    localStorage.setItem("compareList", JSON.stringify(updatedFavorites));
    toast.warning("Sản phẩm đã được xóa khỏi sản phẩm so sánh");
  };

  const clearCompareList = () => {
    setCompareList([]);
    localStorage.removeItem("compareList");
    toast.success("Đã xóa tất cả sản phẩm khỏi danh sách so sánh");
  };

  return (
    <ProductCompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        isCompareVisible,
        closeCompareModal,
      }}
    >
      {children}
    </ProductCompareContext.Provider>
  );
};
