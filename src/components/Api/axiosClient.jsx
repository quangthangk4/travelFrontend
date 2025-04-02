import axios from "axios";
import { getAuthWithExpiry, setAuthWithExpiry } from "../../auth/manageToken";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Biến lưu trạng thái refresh token và danh sách các request đang chờ
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const errorResponse = error.response.data;
    if (error.response && error.response.status === 401) {
      // Nếu refresh token hết hạn hoặc token không hợp lệ, logout
      if (errorResponse.code === 1020 || errorResponse.code === 1006) {
        localStorage.removeItem("token");
        window.location.href = "/sign-in";
        return Promise.reject(error);
      }

      // Nếu token hết hạn (code 1004) và request chưa được retry
      if (errorResponse.code === 1004 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // Nếu đang trong quá trình refresh token, đợi token mới trả về
          return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        isRefreshing = true;
        try {
          // Lấy token hiện tại từ localStorage thông qua hàm getAuthWithExpiry
          const currentToken = getAuthWithExpiry("token");

          // Gọi API refresh token, truyền token hiện tại trong body
          const response = await axios.post(
            `${API_BASE_URL}/auth/refreshToken`,
            { token: currentToken }
          );

          if (response.data.code === 1000) {
            const newAccessToken = response.data.result.token;

            // Lưu token mới với thời gian hết hạn (ví dụ: 5 giờ)
            setAuthWithExpiry("token", newAccessToken, 5 * 60 * 60 * 1000);

            // Cập nhật header Authorization cho instance và request gốc
            axiosInstance.defaults.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Gọi lại các request đang chờ token mới
            onRefreshed(newAccessToken);
            isRefreshing = false;
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          // Nếu lỗi trong quá trình refresh token, xoá token và chuyển hướng đăng nhập
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
          isRefreshing = false;
          return Promise.reject(err);
        }
      }
    }

    if (error.response && error.response.status === 409) {
      console.log("vào đây");
      if (errorResponse.code === 1005) {
        localStorage.removeItem("token");
        window.location.href = "/sign-in";
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
