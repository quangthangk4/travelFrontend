import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
  airports: [],
  flight: {
    departFlight: {},
    returnFlight: {},
    luggageArrival: 0,
    luggageReturn: 0,
    seatPriceArrival: 0,
    seatPriceReturn: 0,
    seatNumberArrival: "",
    seatNumberReturn: "",
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
      if (!state.flight.isRoundTrip && state.flight.returnFlight) {
        state.flight.returnFlight = {};
      }
    },
    resetFlight: (state) => {
      state.flight = {
        departFlight: {},
        returnFlight: {},
        luggageArrival: 0,
        luggageReturn: 0,
        seatPriceArrival: 0,
        seatPriceReturn: 0,
        seatNumberArrival: "",
        seatNumberReturn: "",
        isRoundTrip: false,
      };
    },
  },
});

// Export actions để sử dụng trong component
export const { updateFlight, setAirports, resetFlight } = tripSlice.actions;

// Export reducer để đưa vào store
export default tripSlice.reducer;
