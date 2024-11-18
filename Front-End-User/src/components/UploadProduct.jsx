import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import productCategory from '../helpers/productCategory'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import { brandByCategory } from '../helpers/brandByCategory';
import { displayProductImages } from '../helpers/displayProductImages';

const UploadProduct = ({ onClose, reload }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    countInStock: "",
    isNew: false,
    colors: []
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState('')

  const handleColorChange = (index, key, value) => {
    const updatedColors = [...data.colors];
    updatedColors[index] = {
      ...updatedColors[index],
      [key]: value
    };
    setData(prev => ({
      ...prev,
      colors: updatedColors
    }));
  };

  const handleAddColor = () => {
    setData(prev => ({
      ...prev,
      colors: [...prev.colors, { colorName: "", colorImages: [], stock: 0 }]
    }));
  };

  const handleColorImageUpload = async (e, index) => {
    const fileArray = Array.from(e.target.files);
    const newImageUrls = [];

    for (const file of fileArray) {
      const uploadResult = await uploadImage(file);
      newImageUrls.push(uploadResult.url);
    }

    const updatedColors = [...data.colors];
    const currentColor = updatedColors[index];

    updatedColors[index] = {
      ...currentColor,
      colorImages: [...currentColor.colorImages, ...newImageUrls]
    };

    setData(prev => ({
      ...prev,
      colors: updatedColors
    }));
  };

  const handleOnChange = (e) => {
    const { name, value, checked, type } = e.target
    setData((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
    })
  }

  const handleUploadProduct = async (e) => {
    const files = e.target.files;
    const urls = [];

    for (const file of files) {
      const uploadResult = await uploadImage(file);
      urls.push(uploadResult.url);
    }

    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, ...urls]
    }));
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)
    setData((prev) => {
      return {
        ...prev,
        productImage: [...newProductImage]
      }
    })
  }
  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    const dataResponse = await fetch(SummaryAip.create_product.url, {
      method: SummaryAip.create_product.method,
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const dataApi = await dataResponse.json()
    if (dataApi.success) {
      toast.success(dataApi.message)
      onClose()
      reload("Pending")
    } else if (dataApi.error) {
      toast.error(dataApi.message)
    }
  }

  const getAvailableColors = (category) => {
    const colorsByCategory = {
      mobiles: ["Black", "White", "Red"],
      laptop: ["Gray", "Silver", "Blue"],
      ipad: ["Silver", "Space Gray", "Gold"],
      watches: ["Black", "Brown", "Silver"],
      televisions: ["Black", "White"],
      earphones: ["Black", "White"],
      refrigerator: ["Silver", "White"],
      air_conditioning: ["White", "Gray"]
    };

    return colorsByCategory[category] || [];
  };

  const availableColors = getAvailableColors(data.category);


  const availableBrands = brandByCategory(data.category);

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-11 left-0 right-0 bottom-0 flex items-center justify-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex items-center pb-3'>
          <h2 className='text-lg'>Upload Product</h2>
          <div onClick={onClose} className='w-fit ml-auto text-2xl cursor-pointer hover:text-red-600'>
            <IoClose />
          </div>
        </div>
        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-4' onSubmit={handleSubmitProduct}>
          <label htmlFor="productName">Product Name :</label>
          <input required className='p-2 border bg-slate-100 rounded' type="text" name='productName' id='productName' placeholder='Enter Product Name' value={data.productName} onChange={handleOnChange} />
          <label htmlFor="category" className='mt-3'>Category :</label>
          <select required value={data.category} name='category' onChange={handleOnChange}  className='p-2 border bg-slate-100 rounded'>
            <option value="">Select Category</option>
            {
              productCategory.map((el, index) => {
                return (
                  <option value={el.value} key={el.value + index}>{el.label}</option>
                )
              })
            }
          </select>
          {availableBrands.length > 0 && (
            <>
              <label htmlFor="brandName" className='mt-3'>Brand Name :</label>
              <select required value={data.brandName} name='brandName' onChange={handleOnChange} className='p-2 border bg-slate-100 rounded'>
                <option value="">Select Brand Name</option>
                {availableBrands.map((el, index) => (
                  <option value={el.value} key={el.value + index}>{el.label}</option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="productImage" className='mt-3'>Product Image :</label>
          <label htmlFor="uploadImageInput">
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>
              <div className='text-slate-500 flex items-center justify-center flex-col gap-2 cursor-pointer'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Image</p>
                <input type="file" name="" id="uploadImageInput" className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>
          <div>
            {displayProductImages(data.productImage, setOpenFullScreenImage, setFullScreenImage, handleDeleteProductImage)}
          </div>
          <label htmlFor="price" className='mt-3'>Price :</label>
          <input required className='p-2 border bg-slate-100 rounded' type="number" name='price' id='price' placeholder='Enter Product Price' value={data.price} onChange={handleOnChange} />
          <label htmlFor="countInStock" className='mt-3'>Count In Stock :</label>
          <input required className='p-2 border bg-slate-100 rounded' type="number" name='countInStock' id='countInStock' placeholder='Enter Count In Stock' value={data.countInStock} onChange={handleOnChange} />
          <label htmlFor="sellingPrice" className='mt-3'>Selling Price :</label>
          <input required className='p-2 border bg-slate-100 rounded' type="number" name='sellingPrice' id='sellingPrice' placeholder='Enter Selling Price' value={data.sellingPrice} onChange={handleOnChange} />
          <label htmlFor="colors" className='mt-3'>Colors :</label>
          {
            !data.category ? (
              <p className="text-red-500">Please select a category to choose colors.</p>
            ) : (
              <>
                {
                  data.colors.map((color, index) => (
                    <div key={index} className="mb-4">
                      <label htmlFor={`colorName-${index}`} className='block'>Color Name:</label>
                      <select
                        id={`colorName-${index}`}
                        value={color.colorName}
                        onChange={(e) => handleColorChange(index, 'colorName', e.target.value)}
                        className='p-2 border bg-slate-100 rounded w-full'
                      >
                        <option value="">Select Color</option>
                        {availableColors.map((color, i) => (
                          <option value={color} key={i}>{color}</option>
                        ))}
                      </select>

                      <label htmlFor={`uploadImageColor-${index}`} className='mt-3 block'>Color Images:</label>
                      <label htmlFor={`uploadImageColor-${index}`}>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>
                          <div className='text-slate-500 flex items-center justify-center flex-col gap-2 cursor-pointer'>
                            <span className='text-4xl'><FaCloudUploadAlt /></span>
                            <p className='text-sm'>Upload Color Image</p>
                            <input
                              type="file"
                              id={`uploadImageColor-${index}`}
                              className='hidden'
                              multiple
                              onChange={(e) => handleColorImageUpload(e, index)}
                            />
                          </div>
                        </div>
                      </label>

                      <div className="mt-2 flex gap-2">
                        {color.colorImages.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt=""
                            className='w-20 h-20 object-cover border'
                          />
                        ))}
                      </div>

                      <label htmlFor={`colorStock-${index}`} className='block mt-3'>Stock:</label>
                      <input
                        type="number"
                        id={`colorStock-${index}`}
                        value={color.stock}
                        onChange={(e) => handleColorChange(index, 'stock', e.target.value)}
                        className='p-2 border bg-slate-100 rounded w-full'
                        placeholder='Enter Stock Quantity'
                        min="0"
                      />
                    </div>
                  ))
                }
                <button
                  type="button"
                  onClick={handleAddColor}
                  className='px-3 py-2 bg-blue-600 text-white mb-4 hover:bg-blue-700'
                >
                  Add Color
                </button>
              </>
            )
          }

          <label htmlFor="description" className='mt-3'>Description :</label>
          <textarea value={data.description} className='h-28 bg-slate-100 border resize-none p-1' rows={3} placeholder='Enter Product Description' name='description' onChange={handleOnChange}></textarea>
          <div className="flex justify-start items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name='isNew'
                checked={data?.isNew}
                onChange={handleOnChange}
                className="mr-2"
              />
              isNew
            </label>
          </div>
          <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
        </form>
      </div >
      {
        openFullScreenImage && (
          <DisplayImage onClose={() => setOpenFullScreenImage(false)} image={fullScreenImage} />
        )
      }

    </div >
  )
}

export default UploadProduct