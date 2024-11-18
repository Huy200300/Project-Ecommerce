import React, { useEffect, useState } from 'react';
import SummaryAip from '../common';
import translatedCategory from '../helpers/translatedCategory';
import displayCurrency from '../helpers/displayCurrency';
import { Link, useNavigate } from 'react-router-dom';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Sidebar = ({ category, selectedCategory, loading, brandCategoryMap, renderBrandCheckboxes, fetchDataFilter, selectedBrands, priceRange }) => {
    const [data, setData] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loadings, setLoading] = useState(loading);
    const [values, setValues] = useState(priceRange);
    const navigate = useNavigate();

    const fetchData = async (selectedCategory, limit = 3) => {
        setLoading(true);
        const res = await fetch(`${SummaryAip.filter_top_selling.url}?category=${selectedCategory}&limit=${limit}`, {
            method: SummaryAip.filter_top_selling.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
        });
        setLoading(false);
        const dataApi = await res.json();
        setData(dataApi?.data);
    };

    const fetchCountCategory = async () => {
        const res = await fetch(SummaryAip.count_category_product.url, {
            method: SummaryAip.count_category_product.method,
            credentials: "include"
        })
        const dataApi = await res.json();
        setCategoryCounts(dataApi?.data);
    }

    useEffect(() => {
        fetchData(category);
        fetchCountCategory()
    }, [category]);

    const handleCategoryChange = (e, selectedCategory) => {
        fetchDataFilter(selectedCategory, selectedBrands, values);
        navigate(`?category=${selectedCategory}`);
    };

    const handleAfterChange = (values) => {
        const [min, max] = values;
        setValues([min, max]);
        fetchDataFilter(category, selectedBrands, [min, max]);
    };

    const handleInputChange = (e, index) => {
        const newValue = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(newValue)) {
            const updatedValues = [...values];
            updatedValues[index] = newValue;
            setValues(updatedValues);
        }
    };

    return (
        !loadings &&
        <div className="md:w-1/4 w-full p-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Danh mục khác</h2>
                <ul className='font-medium'>
                    {/* chuyển đổi đối tượng categoryCounts thành một mảng chứa các cặp key-value  */}
                    {Object.entries(categoryCounts).map(([category, count]) => {
                        if (category === selectedCategory) return null;

                        return <li key={category}>
                            <label className='flex gap-2'>
                                <input type="checkbox" onChange={(e) => handleCategoryChange(e, category)} /> {translatedCategory(category)} ({count})
                            </label>
                        </li>
                    })}
                </ul>
            </div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Lọc theo Giá</h2>
                <label className="block text-gray-700 mb-2 text-nowrap font-semibold text-sm">
                    <span>Khoảng giá: </span>
                    <span>{values[0].toLocaleString()} - {displayCurrency(values[1]).toLocaleString()}</span>
                </label>
                <div className="mb-4">
                    <Slider
                        range
                        min={100000}
                        max={50000000}
                        value={values}
                        onChange={(values) => setValues(values)}
                        onAfterChange={handleAfterChange}
                        trackStyle={{ backgroundColor: "red" }}
                        handleStyle={[{ borderColor: "red" }, { borderColor: "red" }]}
                        railStyle={{ backgroundColor: "#ddd" }}
                    />
                </div>
                <div className="flex space-x-4 mb-4">
                    <div className="w-full">
                        <input
                            type="number"
                            value={values[0]}
                            min={100000}
                            max={values[1] - 1}
                            onChange={(e) => handleInputChange(e, 0)}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="w-full">
                        <input
                            type="number"
                            value={values[1]}
                            min={values[0] + 1}
                            max={50000000}
                            onChange={(e) => handleInputChange(e, 1)}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 uppercase">Hãng sản xuất</h2>
                {brandCategoryMap[category] && renderBrandCheckboxes(brandCategoryMap[category])}
            </div>
            <div className="mb-6 w-full">
                <h2 className="text-lg font-semibold mb-2">Bán chạy nhất</h2>
                <div className="space-y-4 w-full">
                    {
                        !loading && data?.map((product, i) =>
                            <Link to={"/product/" + product?._id} key={i} className="flex group items-center space-x-4 w-full cursor-pointer">
                                <img src={product?.productImage[0]} alt={product.productName} className="w-12 h-12 object-cover" />
                                <div className='w-full'>
                                    <p className="text-gray-500 text-xs">{translatedCategory(product.category)}</p>
                                    <p className="text-wrap text-xs group-hover:text-red-500 font-bold w-full text-ellipsis truncate-2-lines break-words overflow-hidden">
                                        {product?.productName}
                                    </p>
                                    <p className="text-red-500 group-hover:text-black text-sm font-bold">{displayCurrency(product.sellingPrice)} <span className="line-through text-gray-500">{displayCurrency(product.price)}</span></p>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
