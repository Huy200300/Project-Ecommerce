import React from "react";
import {
  FaSnowflake,
  FaMobileAlt,
  FaLaptop,
  FaTabletAlt,
  FaTv,
  FaApple,
  FaHeadphones,
  FaWatch,
} from "react-icons/fa";
import { MdKitchen, MdDevicesOther } from "react-icons/md";
import { BsWatch } from "react-icons/bs";

const categoryTranslations = {
  air_conditioning: { label: "Điều Hòa" },
  mobiles: { label: "Điện Thoại" },
  laptop: { label: "Laptop" },
  ipad: { label: "Máy Tính Bảng" },
  televisions: { label: "Tivi" },
  refrigerator: { label: "Tủ Lạnh" },
  accessory: { label: "Phụ Kiện" },
  earphones: { label: "Tai Nghe" },
  watches: { label: "Đồng Hồ" },
  apple: { label: "Apple" },
};

const translatedCategory = (category, noShow = false) => {
  const getCategoryName = () => {
    return categoryTranslations[category] || {};
  };

  const { label, icon } = getCategoryName(category);
  return label ? (
    <span className="capitalize flex items-center gap-1">
      {noShow && icon} {label}
    </span>
  ) : null;
};

export default translatedCategory;
