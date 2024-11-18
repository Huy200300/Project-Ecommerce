import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import fetchReviewStats from "../helpers/fetchReviewStats";
import fetchAllProducts from "../helpers/fetchAllProducts";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const favoritesRef = useRef(favorites);

  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const updatedProducts = await fetchAllProducts("Completed");

        const updatedFavorites = favoritesRef.current.map((cartItem) => {
          const productFromDB = updatedProducts.find(
            (product) => product._id === cartItem._id
          );
          if (
            productFromDB &&
            new Date(productFromDB.updatedAt) > new Date(cartItem.updatedAt)
          ) {
            return { ...cartItem, ...productFromDB };
          }
          return cartItem;
        });

        if (
          JSON.stringify(updatedFavorites) !==
          JSON.stringify(favoritesRef.current)
        ) {
          setFavorites(updatedFavorites);
          localStorage.setItem("cart", JSON.stringify(updatedFavorites));
          favoritesRef.current = updatedFavorites;
        }
      } catch (error) {
        console.error("Error fetching updated products:", error);
      }
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const storedCart = JSON.parse(localStorage.getItem("favorites")) || [];
      const productsWithReviews = await Promise.all(
        storedCart?.map(async (product) => {
          const reviewStats = await fetchReviewStats(product._id);
          return { ...product, ...reviewStats };
        })
      );
      setFavorites(productsWithReviews);
    };
    fetch();
  }, []);

  const addFavorite = (product) => {
    const existingProduct = favorites.find((item) => item?._id === product._id);
    if (existingProduct) {
      toast.error("Sản phẩm đã có trong sản phẩm yêu thích");
      return;
    } else {
      const updatedFavorites = [...favorites, product];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success("Sản phẩm đã được thêm vào sản phẩm yêu thích");
    }
  };

  const removeFavorite = (productId) => {
    const updatedFavorites = favorites.filter((item) => item._id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    favoritesRef.current = updatedFavorites;
    toast.warning("Sản phẩm đã được xóa khỏi sản phẩm yêu thích");
  };

  const updateFavorite = (newFavorite) => {
    setFavorites(newFavorite);
    localStorage.setItem("favorites", JSON.stringify(newFavorite));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesLength: favorites.length,
        addFavorite,
        removeFavorite,
        updateFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
