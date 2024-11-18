import React, { useState } from 'react';
import CartItem from './CartItem';

const CartContent = ({ products, handleDelete, updateQuantity, toggleProductSelection, selectedProducts, selectAllProducts }) => {
    const [openProductId, setOpenProductId] = useState(null); 

    const toggleColors = (productId) => {
        setOpenProductId((prevId) => (prevId === productId ? null : productId));
    };

    return (
        <div className='w-full max-w-3xl'>
            {products?.map((product) => (
                <CartItem
                    key={product._id}
                    product={product}
                    handleDelete={() => handleDelete(product?._id)}
                    updateQuantity={updateQuantity}
                    toggleProductSelection={toggleProductSelection}
                    selectedProducts={selectedProducts}
                    selectAllProducts={selectAllProducts}
                    handleCheckboxChange={() => toggleProductSelection(product?._id)}
                    showColors={openProductId === product._id}
                    toggleColors={() => toggleColors(product._id)}
                />
            ))}
        </div>
    );
};

export default CartContent;
