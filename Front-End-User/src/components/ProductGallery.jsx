import React, { useEffect, useState, useCallback } from "react";
import { FaAngleUp, FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ProductGallery = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState("");
    const [startIndex, setStartIndex] = useState(0);
    const [zoomImage, setZoomImage] = useState({ x: 0, y: 0 });
    const [zoomImageLoading, setZoomImageLoading] = useState(false);
    const [showNavButtons, setShowNavButtons] = useState(false);

    const itemsToShow = 3;

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
            setStartIndex(0);
        } else {
            setSelectedImage("");
        }
    }, [images]);

    const displayImages = () => {
        if (images.length === 0) return [];

        let indices = [];
        let index = startIndex;

        for (let i = 0; i < itemsToShow; i++) {
            indices.push(index);
            index = (index + 1) % images.length;
        }

        return indices.map(i => images[i]);
    };

    const handleScrollUp = () => {
        setStartIndex(prevIndex => {
            let newIndex = (prevIndex - 1 + images.length) % images.length;
            setSelectedImage(images[newIndex]);
            return newIndex;
        });
    };

    const handleScrollDown = () => {
        setStartIndex(prevIndex => {
            const newIndex = (prevIndex + 1) % images.length;
            setSelectedImage(images[newIndex]);
            return newIndex;
        });
    };

    const handleScrollLeft = () => handleScrollUp();
    const handleScrollRight = () => handleScrollDown();

    const handleZoomInProduct = useCallback((e) => {
        setZoomImageLoading(true);
        const { left, top, width, height } = e.target.getBoundingClientRect();
        setZoomImage({
            x: (e.clientX - left) / width,
            y: (e.clientY - top) / height,
        });
        setShowNavButtons(true);
    }, []);

    const handleLeaveImageZoom = () => {
        setZoomImageLoading(false);
        setShowNavButtons(false);
    };

    return (
        <div className="flex md:w-3/6 w-full md:flex-row flex-col-reverse">
            <div className="flex flex-col items-center md:mr-4 relative md:w-1/4 w-full">
                <button
                    className="text-gray-500 mb-2 md:block hidden"
                    onClick={handleScrollUp}
                    disabled={images.length <= 1}
                >
                    <FaAngleUp size={24} className="bg-white p-1 rounded-full shadow-md" />
                </button>

                <div className="flex md:flex-col flex-row w-full h-full md:mb-0 mb-6 justify-center gap-5 space-y-2">
                    {displayImages().map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`cursor-pointer flex justify-center items-center transition-all duration-300 ease-in-out ${selectedImage === img ? "border-2 border-red-600" : "border"}`}
                        >
                            <img src={img} alt={`colorImage-${index}`} className="w-24 h-24 object-cover" />
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 flex space-x-2 mt-4 md:hidden">
                    {displayImages().map((img, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full ${img === selectedImage ? 'bg-red-500' : 'bg-gray-300'}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>

                <button
                    className="text-gray-500 mt-2 md:block hidden"
                    onClick={handleScrollDown}
                    disabled={images.length <= 1}
                >
                    <FaAngleDown size={24} className="bg-white p-1 rounded-full shadow-md" />
                </button>
            </div>
            <div className="w-full flex justify-center items-center">
                <div
                    className="relative w-96 h-96 overflow-hidden"
                    onMouseMove={handleZoomInProduct}
                    onMouseLeave={handleLeaveImageZoom}
                >
                    <img
                        src={selectedImage}
                        alt="selected"
                        className={`w-full h-full object-cover transform transition-transform duration-300 ease-in-out ${zoomImageLoading ? "scale-150" : ""}`}
                        style={{
                            transformOrigin: `${zoomImage.x * 100}% ${zoomImage.y * 100}%`,
                        }}
                    />
                    {showNavButtons && (
                        <>
                            <button
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1"
                                onClick={handleScrollLeft}
                                aria-label="Previous image"
                            >
                                <FaAngleLeft size={24} />
                            </button>
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1"
                                onClick={handleScrollRight}
                                aria-label="Next image"
                            >
                                <FaAngleRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProductGallery;
