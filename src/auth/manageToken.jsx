import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (token) => {
  try {
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded?.scope || null; // Giả sử role được lưu trong payload của token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export function setAuthWithExpiry(name, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(name, JSON.stringify(item));
}

// Lấy trạng thái đăng nhập và kiểm tra thời hạn
export function getAuthWithExpiry(name) {
  const itemStr = localStorage.getItem(name);
  if (!itemStr) return false;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(name); // Xóa nếu hết hạn
    alert("phiên làm việc đã hết hạn, vui lòng đăng nhập lại!");
    return false;
  }
  return item.value;
}
