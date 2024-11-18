import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  email: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setEmailUser: (state, action) => {
      state.email = action.payload;
    },
    updateUser: (state, action) => {
      
      console.log(action.payload)
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUserDetails, setEmailUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
