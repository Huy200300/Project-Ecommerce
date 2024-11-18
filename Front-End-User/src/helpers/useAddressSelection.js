import { useState, useEffect } from "react";

const cities = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Bình Định",
];

const districtsByCity = {
  "An Giang": ["Huyện Chợ Mới", "Huyện Châu Thành"],
  "Bà Rịa - Vũng Tàu": ["Thành phố Vũng Tàu", "Huyện Xuyên Mộc"],
  "Bình Dương": ["Thành phố Thủ Dầu Một", "Huyện Dĩ An"],
  "Bình Phước": ["Thành phố Đồng Xoài", "Huyện Bù Đăng"],
  "Bình Thuận": ["Thành phố Phan Thiết", "Huyện Bắc Bình"],
  "Bình Định": ["Thành phố Quy Nhơn", "Huyện An Nhơn"],
};

const wardsByDistrict = {
  "Huyện Chợ Mới": ["Xã Mỹ Hội Đông", "Xã An Thạnh Trung"],
  "Huyện Châu Thành": ["Xã Bình Thạnh", "Xã Vĩnh Bình"],
  "Thành phố Vũng Tàu": ["Phường 1", "Phường 2"],
  "Huyện Xuyên Mộc": ["Xã Xuyên Mộc", "Xã Bông Trang"],
  "Thành phố Thủ Dầu Một": ["Phường Phú Hòa", "Phường Hiệp Thành"],
  "Huyện Dĩ An": ["Phường Dĩ An", "Phường An Bình"],
  "Thành phố Đồng Xoài": ["Phường Tân Bình", "Phường Tân Xuân"],
  "Huyện Bù Đăng": ["Xã Đức Liễu", "Xã Phước Sơn"],
  "Thành phố Phan Thiết": ["Phường Bình Hưng", "Phường Phú Thủy"],
  "Huyện Bắc Bình": ["Xã Phan Rí Thành", "Xã Hải Ninh"],
  "Thành phố Quy Nhơn": ["Phường Trần Phú", "Phường Ngô Mây"],
  "Huyện An Nhơn": ["Xã Nhơn Lộc", "Xã Nhơn Hòa"],
};

const useAddressSelection = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [selectedTab, setSelectedTab] = useState("city");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setFullAddress(`${selectedCity} ${selectedDistrict} ${selectedWard}`);
  }, [selectedCity, selectedDistrict, selectedWard]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    setSelectedWard("");
    setSelectedTab("district");
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedWard("");
    setSelectedTab("ward");
  };

  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
    setSelectedTab("");
    setDropdownVisible(false);
  };

  return {
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    selectedWard,
    setSelectedWard,
    fullAddress,
    selectedTab,
    setSelectedTab,
    handleCitySelect,
    handleDistrictSelect,
    handleWardSelect,
    setDropdownVisible,
    dropdownVisible,
    cities,
    districtsByCity,
    wardsByDistrict,
  };
};

export default useAddressSelection;
