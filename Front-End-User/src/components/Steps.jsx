import React from 'react';

const Steps = ({ totalAmount, data = [] }) => {
    const getStepAndShippingCost = (amount) => {
        if (amount < 1000000) {
            return { step: 1, shippingCost: 20000 };
        } else if (amount >= 1000000 && amount <= 10000000) {
            return { step: 2, shippingCost: 10000 };
        } else {
            return { step: 3, shippingCost: 0 };
        }
    };

    const { step } = getStepAndShippingCost(totalAmount);

    return (
        <div className="container mx-auto px-4 pt-4 pb-2 lg:block hidden">
            <div className="border-2 p-1 rounded-md shadow-md bg-white">
                <h1 className="text-center text-2xl">Phí Giao Hàng</h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-between">
                    {data.map(({ value, title, description }) => (
                        <React.Fragment key={value}>
                            <div className={`relative flex flex-col items-center m-2 ${value <= step ? 'text-green-500' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${value <= step ? 'bg-green-500 text-white border-green-500' : 'bg-gray-300 text-white border-gray-300'}`}>
                                    {value}
                                </div>
                                <div className="mt-2 w-28 text-center">
                                    {title}
                                </div>
                                <div className="mt-1 w-36 text-center text-black text-sm">
                                    {description}
                                </div>
                            </div>
                            {value < data.length && (
                                <div className={`flex-auto border-t-4 ${value < step ? 'border-green-500' : 'border-gray-300'}`} style={{ margin: '0 1rem' }}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Steps;
