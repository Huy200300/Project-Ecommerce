import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SummaryAip from '../common';
import calculateDiscount from '../helpers/calculateDiscount';
import displayCurrency from '../helpers/displayCurrency';


const SearchProduct = () => {
  const search = useLocation().search;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    price: '',
    category: '',
    inStock: false,
    onSale: false
  });

  const fetchData = async () => {
    setLoading(true);

    // Tạo query string từ các bộ lọc
    const filterQuery = new URLSearchParams();
  

    if (filters.price) {
      filterQuery.append('price', filters.price);
    }

    if (filters.category) {
      filterQuery.append('category', filters.category);
    }

    if (filters.inStock) {
      filterQuery.append('inStock', filters.inStock);
    }

    if (filters.onSale) {
      filterQuery.append('onSale', filters.onSale);
    }

    // Kết hợp các query lọc với query tìm kiếm
    const queryString = search + '&' + filterQuery.toString();

    // Gửi request với query đã bao gồm bộ lọc
    const dataResponse = await fetch(SummaryAip.search_product.url + queryString, {
      method: SummaryAip.search_product.method,
      credentials: "include",
    });

    setLoading(false);
    const dataApi = await dataResponse.json();
    setData(dataApi?.data);
  };


  useEffect(() => {
    fetchData();
  }, [search, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const URLSearch = new URLSearchParams(search);
  const searchQuery = URLSearch.getAll("q");

  const handleDetails = (e, id) => {
    e.preventDefault()
    navigate(`/product/${id}`)
  }

  return (
    <div className='max-w-screen-xl mx-auto p-4 mt-10'>
      {loading && <p className='text-lg text-center'>Loading...</p>}
      <p className='text-2xl my-3 font-semibold'>
        Kết quả tìm kiếm cho: <span className="text-blue-600">{searchQuery}</span> ({data?.length} sản phẩm)
      </p>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='col-span-1 bg-white p-4 shadow rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Bộ lọc tìm kiếm</h2>

          <div className='mb-4'>
            <label htmlFor='price' className='block font-medium mb-1'>Giá</label>
            <select
              name='price'
              id='price'
              value={filters.price}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-lg'>
              <option value=''>Tất cả</option>
              <option value='0-100000'>Dưới 100,000 VND</option>
              <option value='100000-500000'>100,000 - 500,000 VND</option>
              <option value='500000-1000000'>500,000 - 1,000,000 VND</option>
              <option value='1000000'>Trên 1,000,000 VND</option>
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='category' className='block font-medium mb-1'>Danh mục</label>
            <select
              name='category'
              id='category'
              value={filters.category}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-lg'>
              <option value=''>Tất cả</option>
              <option value='mobiles'>Điện thoại</option>
              <option value='laptops'>Máy tính xách tay</option>
              <option value='ipad'>Máy tính bảng</option>
              <option value='accessories'>Phụ kiện</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                name='inStock'
                checked={filters.inStock}
                onChange={handleFilterChange}
                className='form-checkbox'
              />
              <span className='ml-2'>Còn hàng</span>
            </label>
          </div>

          <div className='mb-4'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                name='onSale'
                checked={filters.onSale}
                onChange={handleFilterChange}
                className='form-checkbox'
              />
              <span className='ml-2'>Đang giảm giá</span>
            </label>
          </div>
        </div>

        <div className='col-span-3'>
          {data?.length === 0 && !loading && (
            <p className='bg-white text-lg text-center p-4'>Không tìm thấy sản phẩm nào...</p>
          )}
          {
            console.log(data)
          }
          {data?.length !== 0 && !loading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data.map(product => {
                return (
                  <div key={product._id} className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                    <img src={product.productImage[0]} alt={product.productName} className='object-scale-down h-28 w-full hover:scale-110 transition-all mix-blend-multiply' />
                    <h3 className='text-lg font-semibold mt-2'>{product.productName}</h3>
                    <>
                      <div className='flex items-center'>
                        <p className='text-red-600 font-bold'>
                          {displayCurrency(product?.sellingPrice)}
                        </p>
                        {calculateDiscount(product.price, product.sellingPrice) !== 0 && <p className='ml-2 text-sm text-green-600 font-semibold'>
                          (-{calculateDiscount(product.price, product.sellingPrice)}%)
                        </p>}
                      </div>
                      <p className='line-through text-gray-500'>
                        {displayCurrency(product?.price)}
                      </p>
                    </>
                    <button onClick={(e) => handleDetails(e,product._id)} className='mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300'>
                      Xem chi tiết
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
