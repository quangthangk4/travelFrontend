import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // Lưu vào sessionStorage
import tripReducer from "./tripSlice";
import { combineReducers } from "redux";

// Cấu hình persist
const persistConfig = {
  key: "root",
  storage: storageSession,
};

// Gộp reducer
const rootReducer = combineReducers({
  trip: persistReducer(persistConfig, tripReducer),
});

// Cấu hình Redux store, bỏ kiểm tra serializable
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ⚡ Thêm dòng này để bỏ cảnh báo
    }),
});

// Tạo persistor để khôi phục Redux từ sessionStorage
export const persistor = persistStore(store);

export default store;
