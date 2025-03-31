import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
  flight: {
    departFlight: {},
    returnFlight: {},
    luggage: 0,
    seatPrice: 0,
    isRoundTrip: false,
  },
};

// Tạo slice Redux
const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setAirports: (state, action) => {
      state.airports = action.payload;
    },
    updateFlight: (state, action) => {
      state.flight = { ...state.flight, ...action.payload };
    },
  },
  resetFlight: (state) => {
    state.flight = {
      departFlight: {},
      returnFlight: {},
      luggage: 0,
      seatPrice: 0,
      isRoundTrip: false,
    };
  },
});

// Export actions để sử dụng trong component
export const { updateFlight, setAirports, resetFlight } =
  tripSlice.actions;

// Export reducer để đưa vào store
export default tripSlice.reducer;
