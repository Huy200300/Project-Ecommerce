import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import brandMobile from "../helpers/bandProductCategoryMobile";
import brandLaptop from "../helpers/bandProductCategoryLaptop";
import brandIpad from "../helpers/bandProductCategoryTablet";
import brandTelevision from "../helpers/brandProductCategoryTelevision";
import brandRefrigerator from "../helpers/brandProductCategoryRefrigerator";
import brandAir from "../helpers/brandProductCategoryAir";
import brandEarphone from "../helpers/brandProductCategoryEarphone";
import brandWatch from "../helpers/bandProductCategoryWatch";
import SummaryAip from "../common";
import translatedCategory from "../helpers/translatedCategory";
import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useProductCompare } from "../context/ProductCompareContext";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Thêm selectedCategory
  const [sortBy, setSortBy] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([100000, 50000000]);

  const location = useLocation();
  const { addToCart } = useCart();
  const { addFavorite, favorites, removeFavorite } = useFavorites();
  const { closeCompareModal, addToCompare } = useProductCompare();

  const fetchDataFilter = async (category, brands, priceRange, page = 1, limit = 6) => {
    setLoading(true);
    const dataResponse = await fetch(SummaryAip.filter_product.url, {
      method: SummaryAip.filter_product.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ category, brands, priceRange, page, limit }),
    });
    const dataApi = await dataResponse.json();
    setLoading(false);
    setData(dataApi?.data || []);
    setTotalPages(dataApi?.totalPages || 1);
    setCurrentPage(dataApi?.currentPage || 1);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get("category") || "";
    const currentBrands = params.get("brand")
      ? decodeURIComponent(params.get("brand")).split("&")
      : [];

    setCategory(currentCategory);
    setSelectedCategory(currentCategory);
    setSelectedBrands(currentBrands);

    fetchDataFilter(currentCategory, currentBrands, priceRange, currentPage, limit);
  }, [location.search, currentPage, limit, priceRange]);

  const changePage = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCheckboxChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updatedBrands);

    const params = new URLSearchParams({ category });
    if (updatedBrands.length > 0) {
      params.set("brand", updatedBrands.join("&"));
    } else {
      params.delete("brand");
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    fetchDataFilter(category, updatedBrands, priceRange, currentPage, limit);
  };

  const handleSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    if (value === "asc") {
      setData((prev) =>
        [...prev].sort((a, b) => a?.sellingPrice - b?.sellingPrice)
      );
    } else if (value === "dsc") {
      setData((prev) =>
        [...prev].sort((a, b) => b?.sellingPrice - a?.sellingPrice)
      );
    } else {
      fetchDataFilter(category, selectedBrands, priceRange, currentPage, limit);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };

  const renderBrandCheckboxes = (brandList) => {
    return brandList.map((categoryName, index) => (
      <div key={index} className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="brandName"
          checked={selectedBrands.includes(categoryName?.value)}
          value={categoryName?.value}
          id={categoryName?.value}
          onChange={() => handleCheckboxChange(categoryName?.value)}
        />
        <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
      </div>
    ));
  };

  const brandCategoryMap = {
    mobiles: brandMobile,
    laptop: brandLaptop,
    ipad: brandIpad,
    televisions: brandTelevision,
    refrigerator: brandRefrigerator,
    air_conditioning: brandAir,
    earphones: brandEarphone,
    watches: brandWatch,
  };

  const isFavorite = (data) =>
    favorites?.some((item) => item?._id === data?._id);

  const handleFavoriteClick = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (isFavorite(product)) {
      removeFavorite(product?._id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();
    addToCart(product);
  };

  const handleCompare = (e, product) => {
    e?.stopPropagation();
    e?.preventDefault();
    closeCompareModal();
    addToCompare(product);
  };

  const handleRangeChange = (newRange) => {
    setPriceRange(newRange);
    fetchDataFilter(category, selectedBrands, newRange, currentPage, limit);
  };


  return (
    <div className="md:p-4 md:max-w-screen-xl md:mx-auto relative">
      <div className="mb-16 md:p-3 p-7 flex gap-1">
        <Link
          to={"/"}
          className="hover:underline transition-all font-bold uppercase text-blue-700 flex items-center"
        >
          Trang chủ
        </Link>
        <span className="text-slate-400"> / </span>
        <span className="font-semibold">
          {translatedCategory(category, true)}
        </span>
        <span className="uppercase font-semibold">
          ({data?.length} Results)
        </span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-0.5 bg-slate-200 top-20">
        <span></span>
      </div>
      <div className="flex md:flex-row flex-col">
        <Sidebar
          category={category}
          selectedCategory={selectedCategory} 
          loading={loading}
          brandCategoryMap={brandCategoryMap}
          renderBrandCheckboxes={renderBrandCheckboxes}
          onRangeChange={handleRangeChange}
          fetchDataFilter={fetchDataFilter}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
        />
        <ProductGrid
          data={data}
          handleSortBy={handleSortBy}
          sortBy={sortBy}
          changePage={changePage}
          currentPage={currentPage}
          totalPages={totalPages}
          handleLimitChange={handleLimitChange}
          limit={limit}
          handleAddToCart={handleAddToCart}
          isFavorite={isFavorite}
          handleFavoriteClick={handleFavoriteClick}
          loading={loading}
          handleCompare={handleCompare}
        />
      </div>
    </div>
  );
};

export default CategoryProduct;
