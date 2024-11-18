import React, { useEffect, useState } from 'react';
import shop01 from '../assets/img/product08.png'
import shop02 from '../assets/img/product02.png'

const ProductBanner = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 10,
        minutes: 34,
        seconds: 60,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                let { days, hours, minutes, seconds } = prevTime;

                if (seconds > 0) {
                    seconds -= 1;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes -= 1;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours -= 1;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days -= 1;
                            }
                        }
                    }
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-screen bg-gray-200 flex justify-between items-center mb-9 p-10 mx-0">
            <div className="w-1/3">
                <img src={shop01} alt="Product" className="w-full" />
            </div>

            <div className="text-center">
                <div className="flex space-x-4 justify-center">
                    <div className="bg-red-600 text-white p-4 rounded-full">
                        <p className="text-2xl">{timeLeft.days.toString().padStart(2, '0')}</p>
                        <p>DAYS</p>
                    </div>
                    <div className="bg-red-600 text-white p-4 rounded-full">
                        <p className="text-2xl">{timeLeft.hours.toString().padStart(2, '0')}</p>
                        <p>HOURS</p>
                    </div>
                    <div className="bg-red-600 text-white p-4 rounded-full">
                        <p className="text-2xl">{timeLeft.minutes.toString().padStart(2, '0')}</p>
                        <p>MINUTES</p>
                    </div>
                    <div className="bg-red-600 text-white p-4 rounded-full">
                        <p className="text-2xl">{timeLeft.seconds.toString().padStart(2, '0')}</p>
                        <p>SECONDS</p>
                    </div>
                </div>
                <h1 className="text-4xl font-bold my-4">ƯU ĐÃI HOT TUẦN NÀY</h1>
                <p className="text-xl text-gray-600">BỘ SƯU TẬP MỚI GIẢM GIÁ LÊN ĐẾN 50%</p>
                <button className="bg-red-600 text-white px-6 py-3 mt-4 rounded-full">
                    MUA NGAY
                </button>
            </div>

            <div className="w-1/3">
                <img src={shop02} alt="Product 2" className="w-full" />
            </div>
        </div>
    );
};

export default ProductBanner;
