import React, { useEffect, useState, useCallback } from 'react';
import image1 from '../assets/a1.webp';
import image2 from '../assets/a2.webp';
import image3 from '../assets/a3.webp';
import image4 from '../assets/a4.webp';
import image5 from '../assets/a5.webp';
import image6 from '../assets/a6.webp';
import image7 from '../assets/a7.webp';
import image8 from '../assets/silder1.jpg';
import image9 from '../assets/silder2.jpg';
import image10 from '../assets/silder3.jpg';
import image11 from '../assets/silder4.jpg';
import image12 from '../assets/silder5.jpg';
import left from '../assets/left-1.webp';
import left1 from '../assets/left-2.webp';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';

const Banner = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const desktopImage = [image1, image2, image3, image4, image5, image6, image7];
    const title = ['iPhone 15 Pro Max', 'Galaxy S23 Utra', 'Laptop', 'Điều Hòa', 'Máy Lọc Nước', 'Điện Thoại', 'Mạng di động'];
    const mobileImage = [image8, image9, image10, image11, image12, image4, image7];

    const nextImage = useCallback(() => {
        setCurrentImage((prev) => (desktopImage.length - 1 > prev ? prev + 1 : 0));
    }, [desktopImage.length]);

    const prevImage = useCallback(() => {
        setCurrentImage((prev) => (prev !== 0 ? prev - 1 : desktopImage.length - 1));
    }, [desktopImage.length]);

    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [nextImage]);

    const handleTitleClick = (index) => {
        setCurrentImage(index);
    };

    return (
        <div className="max-w-screen-xl mx-auto rounded-md border-2">
            <div className='h-60 md:h-96 w-full bg-slate-200 relative'>
                <div className='absolute z-20 h-full p-4 w-3/4 hidden md:flex items-center'>
                    <div className='flex justify-between w-full text-3xl'>
                        <button
                            onClick={prevImage}
                            className='bg-white shadow-md rounded-full p-1 opacity-40 hover:opacity-100 transition-all'
                            aria-label='Previous Image'
                        >
                            <FaAngleLeft />
                        </button>
                        <button
                            onClick={nextImage}
                            className='bg-white shadow-md rounded-full p-1 opacity-40 hover:opacity-100 transition-all'
                            aria-label='Next Image'
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
                <div className='hidden md:flex gap-2 h-full rounded-md p-1.5 border-2'>
                    <div className='hidden md:flex w-3/4 h-full overflow-hidden flex-col'>
                        <div className='h-5/6 w-full overflow-hidden relative'>
                            {desktopImage.map((imageURL, index) => (
                                <div
                                    className={`w-full h-full absolute transition-opacity duration-700 ease-in-out transform ${currentImage === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                                        }`}
                                    key={index}
                                >
                                    <img src={imageURL} alt={`Banner ${index + 1}`} className='w-full h-full rounded-lg object-cover' />
                                </div>
                            ))}
                        </div>
                        <div className='flex h-1/6 justify-between p-3 z-50'>
                            {title.map((titleText, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer font-semibold p-2 border-2 border-slate-300 rounded-md transition-all hover:bg-blue-600 hover:text-white`}
                                    onClick={() => handleTitleClick(index)}
                                >
                                    <p>{titleText}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-1/4'>
                        <div className='flex flex-col gap-2'>
                            <img src={left} alt='Promotion 1' className='w-full h-full' />
                            <img src={left1} alt='Promotion 2' className='w-full h-full' />
                            <h1 className='text-slate-500'>Tin khuyến mãi</h1>
                        </div>
                    </div>
                </div>
                <div className='flex w-full h-full overflow-hidden md:hidden relative' >
                    {mobileImage.map((imageURL, index) => (
                        <div
                            className={`w-full h-full absolute transition-opacity duration-700 ease-in-out transform ${currentImage === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                                }`}
                            key={imageURL}

                        >
                            <img src={imageURL} alt={`Mobile Banner ${index + 1}`} className='w-full h-full object-cover' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;
