import React from "react";
import { FaExchangeAlt, FaEye, FaHeart, FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import displayCurrency from "../helpers/displayCurrency";
import calculateDiscount from "../helpers/calculateDiscount";
import translatedCategory from "../helpers/translatedCategory";
import { Link } from "react-router-dom";

const ProductsListCards = ({ data, isFavorite, handleCompare, handleFavoriteClick }) => {
  return (
    <Link to={"/product/" + data?._id} className="border-2 group hover:border-red-500 p-4 w-full min-w-[200px] md:min-w-[243px] max-w-[200px] md:max-w-[243px] rounded-md shadow-lg relative hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full">
        <div className="h-48 p-4 pt-12 min-w-[100px] md:min-w-[145px] flex justify-center items-center">
          <img src={data?.productImage[0]} alt={data?.productName} className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply" />
        </div>

        {
          data?.isNew && <div className="absolute top-2 rounded-sm right-16 bg-red-500 border-2 border-red-500 text-white px-2 py-1 text-xs font-bold">
            NEW
          </div>
        }

        {
          calculateDiscount(data?.price || 0, data?.sellingPrice) !== 0 && <div className="absolute top-2 right-2 rounded-sm border-2 border-red-500 text-red-500 px-2 py-1 text-xs font-bold">
            -{calculateDiscount(data?.price || 0, data?.sellingPrice)}%
          </div>
        }
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 uppercase flex justify-center font-semibold">{translatedCategory(data?.category)}</p>
        <h3 className="text-lg font-bold text-center w-full truncate">{data?.productName}</h3>
        <div className="mt-2 flex flex-col-reverse">
          <span className="text-red-500 font-bold text-lg">{displayCurrency(data?.sellingPrice)}</span>
          {data?.price !== 0 && (
            <span className="text-gray-400 line-through text-base">{displayCurrency(data?.price)}</span>
          )}
        </div>
        <div className="mt-5 border-b-2 relative flex justify-center">
          <span className="absolute -bottom-2 bg-white px-2">
            <div className="flex gap-2 items-center">
              <span className="flex">
                {
                  data?.averageRating > 0 && (
                    <>
                      {[...Array(5)].map((_, index) => (
                        <FaStar key={index} className={`text-lg ${index < data?.averageRating?.toFixed(1) ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />
                      ))}
                    </>
                  )
                }
              </span>
            </div>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 mt-5 relative">
        <div className="flex justify-center space-x-4">
          <button
            onClick={(e) => handleFavoriteClick(e, data)}
            className={`p-2 relative rounded-full hover:bg-gray-200 ${isFavorite(data) ? "text-red-500 hover:text-black" : "hover:text-red-500"}  hover-icon`}
          >
            <span className="absolute text-nowrap -top-9 opacity-0 hover:opacity-100 -left-10 bg-black text-white p-2 uppercase text-xs">
              {isFavorite(data) ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
            </span>
            {isFavorite(data) ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button onClick={(e) => handleCompare(e, data)} className="p-2 relative rounded-full hover:bg-gray-200 hover:text-red-500 hover-icon">
            <span className="absolute text-nowrap -top-9 opacity-0 hover:opacity-100 -left-14 bg-black text-white p-2 uppercase text-xs">Thêm vào so sánh</span>
            <FaExchangeAlt />
          </button>
          <Link to={"/product/" + data?._id} className="p-2 relative rounded-full hover:bg-gray-200 hover:text-red-500 hover-icon">
            <span className="absolute text-nowrap -top-11 opacity-0 hover:opacity-100 -right-10 bg-black text-white p-3 px-8 uppercase text-xs">Xem nhanh</span>
            <FaEye />
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductsListCards;
