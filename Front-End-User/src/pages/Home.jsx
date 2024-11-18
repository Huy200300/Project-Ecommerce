import React from 'react'
import Banner from '../components/Banner'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import CategoryList from '../components/CategoryList'
import SectionCategory from '../components/SectionCategory'
import NewProductList from '../components/NewProductList'
import ProductBanner from '../components/ProductBanner'
import TopSellingProduct from '../components/TopSellingProduct'


const Home = () => {
  return (
    <div className="">
      <SectionCategory />
      <Banner />
      <CategoryList />
      <NewProductList />
      <HorizontalCardProduct category={"laptop"} heading={"Laptop Nổi Bật"} />
      <ProductBanner/>
      <HorizontalCardProduct category={"earphones"} heading={"Tai Nghe Phổ Biến"} />
      <VerticalCardProduct category={"mobiles"} heading={"Điện Thoại Nổi Bật"} />
      <TopSellingProduct/>
      <VerticalCardProduct category={"ipad"} heading={"Ipads Thịnh Hành"} />
      <VerticalCardProduct category={"watches"} heading={"Đồng Hồ Phổ Biến"} />
    </div>
  )
}

export default Home