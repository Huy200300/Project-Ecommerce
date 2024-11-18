import { CiMobile3 } from "react-icons/ci";
import { MdOutlineLaptop } from "react-icons/md";
import { IoTabletLandscapeOutline } from "react-icons/io5";
import { PiTelevisionSimple } from "react-icons/pi";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { TbAirConditioning } from "react-icons/tb";
import { SlEarphones } from "react-icons/sl";
import { FaApple } from "react-icons/fa6";

const categoryHeader = [
  {
    id: 1,
    label: "Điện Thoại",
    value: "mobiles",
    icon: <CiMobile3 />,
  },
  {
    id: 2,
    label: "Laptop",
    value: "laptop",
    icon: <MdOutlineLaptop />,
  },
  {
    id: 3,
    label: "Ipad",
    value: "ipad",
    icon: <IoTabletLandscapeOutline />,
  },
  {
    id: 4,
    label: "Apple",
    value: "apple",
    icon:<FaApple/>
  },
  {
    id: 4,
    label: "Tivi",
    value: "televisions",
    icon: <PiTelevisionSimple />,
  },
  {
    id: 5,
    label: "Tủ Lạnh",
    value: "refrigerator",
    icon: <CgSmartHomeRefrigerator />,
  },
  {
    id: 6,
    label: "Điều Hòa",
    value: "air_conditioning",
    icon: <TbAirConditioning />,
  },
  {
    id: 7,
    label: "Phụ Kiện",
    value: "accessory",
    icon: <SlEarphones />,
  },
];

export default categoryHeader;
