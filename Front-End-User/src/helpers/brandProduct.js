import { CiMobile3 } from "react-icons/ci";
import { IoMdWatch } from "react-icons/io";
import { SlEarphones } from "react-icons/sl";
import { FaTabletAlt } from "react-icons/fa";
import { MdLaptop } from "react-icons/md";

const brandProduct = [
  {
    id: 1,
    label: "Điện Thoại",
    value: "mobiles",
    icon: <CiMobile3 />,
  },
  {
    id: 2,
    label: "Ipad",
    value: "ipad",
    icon: <FaTabletAlt />,
  },
  {
    id: 3,
    label: "Laptop",
    value: "laptop",
    icon: <MdLaptop />,
  },
  {
    id: 4,
    label: "Tai Nghe",
    value: "earphones",
    icon: <SlEarphones />,
  },
  {
    id: 5,
    label: "Đồng Hồ",
    value: "watches",
    icon: <IoMdWatch />,
  },
];

export default brandProduct;
