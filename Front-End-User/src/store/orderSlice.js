import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItemsSelected: [],
  orderItems: [],
  selectedProducts: [],
  count: 1,
  id: "",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem?.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
        state.isSucessOrder = true;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    selectedOrder: (state, action) => {
      const { selectedProductsTotalPrice, selectedProducts } = action.payload;
      state.orderItemsSelected = selectedProductsTotalPrice;
      state.selectedProducts = selectedProducts;
    },
    qtyOrder: (state, action) => {
      const { newQty, id } = action.payload;
      state.count = newQty;
      state.id = id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addOrderProduct, selectedOrder, qtyOrder } = orderSlice.actions;

export default orderSlice.reducer;
