import React, { useEffect, useState } from "react";
import SummaryAip from "../common";
import { Link } from "react-router-dom";
import icon from "../assets/img-icon-apple.webp"
import translatedCategory from "../helpers/translatedCategory";
const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const categoryLoading = new Array(12).fill(null)

    const fetchCategoryProduct = async () => {
        setLoading(true);
        const dataResponse = await fetch(SummaryAip.category_product.url, {
            method: SummaryAip.category_product.method,
            credentials: "include"
        });
        setLoading(false);
        const dataApi = await dataResponse.json();
        setCategoryProduct(dataApi?.data || []);
    };
    useEffect(() => {
        fetchCategoryProduct();
    }, []);
    return (
        <div className="mt-5">
            <div className="max-w-screen-xl mx-auto">
                <div className="w-full flex items-center border-2 flex-wrap ">
                    {loading ? (
                        categoryLoading?.map((el, index) => {
                            return (
                                <div key={el + "categoryLoading" + index} className="cursor-pointer border p-7 flex lg:w-[calc(100%/6)] w-[calc(100%/4)] gap-4 flex-col justify-center items-center hover:shadow-xl">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex justify-center items-center animate-pulse"></div>
                                    <p className="flex justify-center items-center rounded-full w-full h-full px-3 py-1 bg-slate-200 animate-pulse"></p>
                                </div>
                            )
                        })

                    ) : (
                        <>
                            {categoryProduct?.map((product, index) => {

                                const productImageSrc = product?.products?.[0]?.productImage?.[0] || icon;
                                return (
                                    <Link
                                        key={`category-${index}`}
                                        to={`/product-category?category=${product?.category}`}
                                        className="cursor-pointer border p-7 flex lg:w-[calc(100%/6)] w-[calc(100%/4)] gap-4 flex-col justify-center items-center hover:shadow-xl"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex justify-center items-center">
                                            <img
                                                loading="lazy"
                                                src={productImageSrc}
                                                alt={product?.category}
                                                className="h-full object-scale-down mix-blend-multiply flex justify-center items-center"
                                            />
                                        </div>
                                        <p className="flex text-sm md:text-base font-semibold capitalize">
                                            {translatedCategory(product?.category)}
                                        </p>
                                    </Link>
                                );
                            })}

                            <Link to={"/product-category?category=apple"} className="cursor-pointer border-2 gap-4 p-7 flex flex-col lg:w-[214px] w-[160px] lg:h-44 justify-center items-center hover:shadow-xl">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex justify-center items-center">
                                    <img
                                        src={icon}
                                        alt={"category"}
                                        className="h-full object-scale-down mix-blend-multiply  flex justify-center items-center"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="flex  text-sm md:text-base font-semibold capitalize">
                                    apple
                                </p>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
