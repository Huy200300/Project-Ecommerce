import { MdDelete } from "react-icons/md";

export const displayProductImages = (
  productImages,
  setOpenFullScreenImage,
  setFullScreenImage,
  handleDeleteProductImage
) => {
  if (productImages.length > 0) {
    return (
      <div className="flex items-center gap-2">
        {productImages.map((imageUrl, index) => (
          <div className="relative group" key={index}>
            <img
              src={imageUrl}
              alt=""
              width={100}
              height={100}
              className="bg-slate-100 border cursor-pointer"
              onClick={() => {
                setOpenFullScreenImage(true);
                setFullScreenImage(imageUrl);
              }}
            />
            <div
              onClick={() => handleDeleteProductImage(index)}
              className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
            >
              <MdDelete />
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return <p className="text-red-600 text-xs">*Please Upload Product Image</p>;
  }
};
