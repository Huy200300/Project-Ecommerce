import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SummaryAip from '../common';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import translatedCategory from '../helpers/translatedCategory';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabs';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import productCategory from '../helpers/productCategory';
import { useProductCompare } from '../context/ProductCompareContext';

const ProductDetail = () => {
    const { addToCart } = useCart();
    const { closeCompareModal, addToCompare } = useProductCompare();
    const { addFavorite, favorites, removeFavorite } = useFavorites();
    const params = useParams();
    const user = useSelector((state) => state?.user?.user);
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        productName: '',
        brandName: '',
        category: '',
        productImage: [],
        description: '',
        price: '',
        sellingPrice: '',
        colors: []
    });
    const [dataSpec, setDataSpec] = useState({})
    const [selectedColor, setSelectedColor] = useState(data?.colors?.[0]?.colorName);

    const fetchProductDetail = async (id) => {
        setLoading(true);
        const response = await fetch(SummaryAip.product_detail.url, {
            method: SummaryAip.product_detail.method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id }),
        });
        setLoading(false);
        const result = await response.json();
        setData(result.data);
        setSelectedColor(result.data.colors?.[0]?.colorName)
    };

    const fetchProductSpec = async (id) => {
        const res = await fetch(`${SummaryAip.specifications_by_id.url}/${id}`, {
            method: SummaryAip.specifications_by_id.method,
            credentials: "include"
        })
        const dataApi = await res.json()
        setDataSpec(dataApi.data)
    }

    const isFavorite = (data) => favorites?.some(item => item?._id === data?._id);

    const handleFavoriteClick = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();

        if (isFavorite(product)) {
            removeFavorite(product?._id);
        } else {
            addFavorite(product);
        }
    };

    useEffect(() => {
        fetchProductDetail(params.id);
        fetchProductSpec(params.id)
    }, [params]);
    const handleAddToCart = (e, product, count) => {
        e?.stopPropagation();
        e?.preventDefault();
        const colorData = product.colors.find(color => color.colorName === selectedColor);
        const productWithColor = {
            ...product,
            selectedColor,
            selectedColorImage: colorData?.colorImages?.[0]
        };
        addToCart(productWithColor, count);
    };


    const updateQuantity = (type, max) => {
        if (type === 'increase') {
            if (!max) {
                setCount(count + 1);
            }
        } else {
            if (!max) {
                setCount(count - 1);
            }
        }
    };

    const getSpecialCategoryValues = () => {
        return productCategory.map(category => category.value);
    };
    const isSpecialCategory = getSpecialCategoryValues().includes(data.category);
    const imagesToDisplay = isSpecialCategory && selectedColor ?
        data?.colors?.find(color => color.colorName === selectedColor)?.colorImages || [] :
        data.productImage;

    const handleBrandClick = (brand) => {
        const params = new URLSearchParams({ category: data.category });

        params.set('brand', brand);

        navigate(`/product-category?${params.toString()}`);
    };

    const handleCompare = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();
        closeCompareModal()
        addToCompare(product);
    }

    return (
        <div className='max-w-screen-xl mx-auto p-4 flex flex-col gap-4'>
            {
                !loading && (
                    <>
                        <div className='md:text-base text-xs text-slate-500 capitalize flex gap-3'>
                            <Link to='/' className='hover:text-red-500 transition-all flex items-center font-semibold cursor-pointer'>
                                Trang chủ
                            </Link>
                            <span className='text-slate-400'> / </span>

                            <Link to={`/product-category?category=${data.category}`} className='hover:text-red-500 cursor-pointer transition-all font-semibold'>
                                <span>{translatedCategory(data.category, true)}</span>
                            </Link>
                            <span className='text-slate-400'> / </span>
                            <button
                                onClick={() => handleBrandClick(data.brandName)}
                                className='hover:text-red-500 cursor-pointer transition-all font-semibold'
                            >
                                <span>{data.brandName}</span>
                            </button>
                            <span className='text-slate-400'> / </span>
                            <span className='text-slate-900 font-bold'>{data.productName}</span>
                        </div>
                        <div className="max-w-screen-xl mx-auto my-10 flex md:flex-row flex-col w-full">
                            <ProductGallery images={imagesToDisplay} selectedColor={selectedColor} />
                            <ProductInfo handleCompare={handleCompare} isFavorite={isFavorite} handleFavoriteClick={handleFavoriteClick} setSelectedColor={setSelectedColor} selectedColor={selectedColor} data={data} productId={data?._id} handleAddToCart={handleAddToCart} updateQuantity={updateQuantity} count={count} />
                        </div>
                        <div>
                            <ProductTabs dataSpec={dataSpec} productId={data._id} product={data} user={user} />
                        </div>

                        {data.category && <CategoryWiseProductDisplay category={data.category} heading='Sản phẩm đề xuất' />}
                    </>
                )
            }
        </div>
    );
};

export default ProductDetail;
