import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
  departFlight: null,
  returnFlight: null,
  isRoundTrip: false, // Mặc định là một chiều
};

// Tạo slice Redux
const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setRoundTrip: (state, action) => {
      state.isRoundTrip = action.payload; // Cập nhật giá trị true / false từ radio button
      if (!action.payload) {
        state.returnFlight = null; // Reset chuyến bay về nếu đổi sang một chiều
      }
    },
    selectDepartFlight: (state, action) => {
      state.departFlight = action.payload;
    },
    selectReturnFlight: (state, action) => {
      state.returnFlight = action.payload;
    },
    resetFlights: (state) => {
      state.departFlight = null;
      state.returnFlight = null;
      state.isRoundTrip = false;
    },
  },
});

// Export actions để sử dụng trong component
export const {
  setRoundTrip,
  selectDepartFlight,
  selectReturnFlight,
  resetFlights,
} = tripSlice.actions;

// Export reducer để đưa vào store
export default tripSlice.reducer;
