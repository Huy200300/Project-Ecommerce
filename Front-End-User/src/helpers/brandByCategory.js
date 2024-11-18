import bandMobile from "./bandProductCategoryMobile";
import brandLaptop from "./bandProductCategoryLaptop";
import brandTablet from "./bandProductCategoryTablet";
import brandWatch from "./bandProductCategoryWatch";
import brandTelevision from "./brandProductCategoryTelevision";
import brandEarphone from "./brandProductCategoryEarphone";
import brandRefrigerator from "./brandProductCategoryRefrigerator";
import brandAir from "./brandProductCategoryAir";

export const brandByCategory = (category) => {
  switch (category) {
    case "mobiles":
      return bandMobile;
    case "laptop":
      return brandLaptop;
    case "ipad":
      return brandTablet;
    case "watches":
      return brandWatch;
    case "televisions":
      return brandTelevision;
    case "earphones":
      return brandEarphone;
    case "refrigerator":
      return brandRefrigerator;
    case "air_conditioning":
      return brandAir;
    default:
      return [];
  }
};
