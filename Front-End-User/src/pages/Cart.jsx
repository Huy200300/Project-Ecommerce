import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoTrashOutline } from "react-icons/io5";
import Steps from '../components/Steps';
import EmptyCart from '../components/EmptyCart';
import CartContent from '../components/CartContent ';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';
import GenericModal from '../components/GenericModal';
import { useFavorites } from '../context/FavoritesContext';
import { AiOutlineClose } from "react-icons/ai";
import { FaHeart, FaStar } from 'react-icons/fa';
import displayCurrency from '../helpers/displayCurrency';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';


const Cart = () => {
    const [cart, setCart] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const { updateCart, cartLength } = useCart();
    const loadingCart = new Array(cartLength).fill(null);
    const navigate = useNavigate();
    const { favorites, removeFavorite, addToCart } = useFavorites();
    const [visibleProducts, setVisibleProducts] = useState(4);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);


    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleDelete = useCallback((index) => {
        setProductToDelete(index);
        setShowModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        setLoading(true);
        const newCart = cart.filter((item) => item._id !== productToDelete);
        localStorage.setItem('cart', JSON.stringify(newCart));
        updateCart(newCart);
        setCart(newCart)
        setLoading(false);
        setShowModal(false);
        setProductToDelete(null);
    }, [cart, productToDelete, updateCart]);

    const handleAddCard = () => {
        const selectedItems = cart.filter(product => selectedProducts.includes(product._id));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedItems));
        navigate('/payment')
    };

    const handleDeleteAll = () => {
        setLoading(true);
        const emptyCart = [];
        localStorage.setItem('cart', JSON.stringify(emptyCart));
        updateCart(emptyCart);
        setCart(emptyCart);
        setLoading(false);
        setIsOpen(false)
        setProductToDelete(null);
    }

    const itemsDelivery = [
        { title: '40.000 VND', value: 1, description: 'Dưới 1.000.000 VND' },
        { title: '25.000 VND', value: 2, description: 'Từ 1.000.000 VND đến dưới 10.000.000 VND' },
        { title: 'Free ship', value: 3, description: 'Trên 10.000.000 VND' }
    ];

    const selectedProductsTotalPrice = selectedProducts.reduce((total, productId) => {
        const products = cart;
        const product = products.find(p => p._id === productId);
        if (product) {
            const quantity = product.amount || 1;
            const price = product.sellingPrice || 0;
            return total + (quantity * price);
        }
        return total;
    }, 0);

    const upQuantity = useCallback((productId, currentAmount, increment, max) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item._id === productId
                    ? { ...item, amount: increment ? Math.min(item.amount + 1, max) : Math.max(item.amount - 1, 1) }
                    : item
            );

            localStorage.setItem('cart', JSON.stringify(updatedCart));

            if (increment && currentAmount >= max) {
                toast.error("Số lượng không còn đủ");
            }

            return updatedCart;
        });
    }, []);


    const toggleProductSelection = useCallback((productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    }, []);

    const selectAllProducts = useCallback(() => {
        if (selectedProducts.length === cart.length) {
            setSelectedProducts([]);
        } else {
            const allProductIds = cart.map(item => item._id);
            setSelectedProducts(allProductIds);
        }
    }, [selectedProducts, cart]);

    const handleShowMore = () => {
        setVisibleProducts((prevCount) => prevCount + 4);
    };

    const handleAddToCart = (e, product) => {
        e?.stopPropagation();
        e?.preventDefault();
        addToCart(product);
    };

    const hasItems = cart?.length > 0;
    const isAllSelected = (selectedProducts?.length === cart?.length && cart?.length > 0);

    return (
        <div className='max-w-screen-xl mx-auto p-4'>
            <div className=''>
                {cart?.length > 0 && <div className='flex relative items-end gap-5 pb-6'>
                    <h1 className="text-2xl font-bold uppercase">Giỏ Hàng</h1>
                    <span className='font-medium'> <Link to={"/"} className='hover:text-red-500 capitalize cursor-pointer'>trang chủ</Link> / Giỏ Hàng</span>
                    <div className='absolute bottom-0 left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] h-0.5 bg-slate-200 z-10'></div>
                </div>
                }
                {cart?.length > 0 && (
                    <Steps totalAmount={selectedProductsTotalPrice} data={itemsDelivery} />
                )}
            </div>
            <div className='mt-5 p-4'>
                {
                    favorites?.length > 0 && (
                        <div className="p-4 border-2 rounded-lg">
                            <h1 className="text-2xl border-b-2 pb-2 border-black font-bold mb-4 flex items-center justify-between">
                                <div className='flex items-center '>
                                    <FaHeart size={28} className="mr-2" />
                                    Sản Phẩm Yêu Thích
                                </div>
                                <button onClick={handleToggleCollapse} className="flex items-center">
                                    {isCollapsed ? <FiChevronDown size={28} /> : <FiChevronUp size={28} />}
                                </button>
                            </h1>
                            {!isCollapsed &&
                                <>
                                    <div className="grid grid-cols-4 gap-4">
                                        {favorites?.slice(0, visibleProducts).map((product) => (
                                            <div key={product.id} className="cursor-pointer p-4 flex flex-col items-center border rounded-lg relative">
                                                <button
                                                    onClick={() => removeFavorite(product?._id)}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <AiOutlineClose size={20} />
                                                </button>

                                                <img
                                                    src={product.productImage[0]}
                                                    alt={product.productName}
                                                    className="w-full h-40 object-contain mb-4"
                                                />

                                                <a href={`/product/${product._id}`} className="text-blue-600 font-semibold line-clamp-2 hover:underline">
                                                    {product.productName}
                                                </a>

                                                <div className="flex items-center mt-2">
                                                    <span className="text-yellow-500 flex">
                                                        {
                                                            product?.averageRating > 0 && (
                                                                <>
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <FaStar key={index} className={`text-lg ${index < product?.averageRating?.toFixed(1) ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />
                                                                    ))}
                                                                </>
                                                            )
                                                        }
                                                    </span>
                                                    {product.reviewCount > 0 && <span className="ml-2 text-sm text-gray-600">({product.reviewCount})</span>}
                                                </div>

                                                <div className="flex items-center flex-col mt-2">
                                                    <div className="text-2xl font-bold">{displayCurrency(product.sellingPrice)}</div>
                                                    <div className="text-gray-500 line-through">{displayCurrency(product.price)}</div>
                                                </div>

                                                <button
                                                    className={`flex font-semibold items-center justify-center text-nowrap w-full uppercase p-3 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    disabled={product.countInStock === 0}
                                                >
                                                    {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào Giỏ hàng'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {visibleProducts < favorites.length && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={handleShowMore}
                                                className="text-blue-600 hover:underline font-semibold"
                                            >
                                                Xem thêm
                                            </button>
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    )
                }
            </div>
            {hasItems ? (
                <div className='flex flex-col mt-0 lg:flex-row min-h-[calc(100vh-205px)] gap-10 lg:justify-between p-6'>
                    <div className='w-full max-w-3xl flex flex-col gap-2'>
                        <div className='border-2 rounded-md px-2 py-1'>
                            <div className='flex justify-between font-semibold items-center'>
                                <div className='flex gap-1'>
                                    <input type="checkbox" name="" id="" className='' checked={isAllSelected}
                                        onChange={selectAllProducts} />
                                    <span>Tất cả {cart?.length} sản phẩm</span>
                                </div>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành Tiền</span>
                                <span>
                                    <button className='text-xl text-red-700 hover:text-red-500 cursor-pointer transition-all ease-in-out'
                                        onClick={() => setIsOpen(true)}
                                    >
                                        <IoTrashOutline className='text-xl' />
                                    </button>
                                </span>
                            </div>
                        </div>
                        {loading ? (
                            loadingCart.map((el, index) => (
                                <div key={index + "Add To Cart Loading" + el} className='rounded w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse'></div>
                            ))
                        ) : (
                            <CartContent
                                products={cart}
                                handleDelete={handleDelete}
                                updateQuantity={upQuantity}
                                toggleProductSelection={toggleProductSelection}
                                selectedProducts={selectedProducts}
                                selectAllProducts={selectAllProducts}
                            />
                        )}
                    </div>
                    {hasItems && (
                        <CartSummary
                            products={cart}
                            handlePayment={handleAddCard}
                            selectedProducts={selectedProducts}
                        />
                    )}
                </div>
            ) : (
                <EmptyCart />
            )}

            <GenericModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Xác nhận xóa"
                children="Bạn có muốn xóa tất sản phẩm này không?"
                footer={
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                        >
                            Có
                        </button>
                    </div>
                }
            />

            <GenericModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Xác nhận xóa"
                children="Bạn có muốn xóa sản phẩm này không?"
                footer={
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                        >
                            Có
                        </button>
                    </div>
                }
            />
        </div>
    );
}

export default Cart;
