const displayCurrency = (num) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
  return formatter.format(num).replace("₫", "VND");
};

export default displayCurrency;
