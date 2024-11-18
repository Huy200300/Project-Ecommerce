import React from 'react'

const ShippingMethod = ({ shippingMethod, handleShippingMethodChange }) => (
    <div className="mt-4">
        <h2 className="text-xl mb-2 uppercase font-bold">Chọn phương thức giao hàng</h2>
        <div className="space-y-2  bg-blue-100 border  rounded-md p-2">
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="shippingMethod"
                    value="FAST"
                    checked={shippingMethod === 'FAST'}
                    onChange={() => handleShippingMethodChange('FAST')}
                    className="form-radio cursor-pointer accent-red-500"
                />
                <span className='cursor-pointer text-slate-700 font-bold'><span className='text-orange-600'>FAST</span> Giao hàng tiết kiệm</span>
            </label>
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="shippingMethod"
                    value="GO_JEK"
                    checked={shippingMethod === 'GO_JEK'}
                    onChange={() => handleShippingMethodChange('GO_JEK')}
                    className="form-radio cursor-pointer accent-red-500"
                />
                <span className='cursor-pointer text-slate-700 font-bold'><span className='text-orange-600'>GOJEK</span> Giao hàng tiết kiệm</span>
            </label>
        </div>
    </div>
);

export default ShippingMethod