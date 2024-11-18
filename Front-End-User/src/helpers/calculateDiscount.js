const calculateDiscount = (originalPrice, discountedPrice) => {
  
  if (originalPrice === 0) {
    return 0;
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  // Làm tròn đến 1 chữ số thập phân trước
  const roundedToOneDecimal = Math.round(discount * 10) / 10;
  // Làm tròn lên số nguyên nếu chữ số thập phân thứ nhất >= 5
  const finalDiscount = Math.ceil(roundedToOneDecimal);

  return finalDiscount;
};

export default calculateDiscount;
