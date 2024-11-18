const colorTranslations = {
  Trắng: "White",
  Đen: "Black",
  Đỏ: "Red",
  Xanh: "Blue",
};

export const translateColor = (colorName) => {
  return colorTranslations[colorName] || colorName;
};
