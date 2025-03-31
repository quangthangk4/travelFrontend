// 🟢 Lưu trạng thái đăng nhập với thời gian hết hạn
export function setAuthWithExpiry(name, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(name, JSON.stringify(item));
}

export function getTokenOnly(name) {
  const itemStr = localStorage.getItem(name);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    return item.value; // Chỉ trả về token
  } catch (error) {
    console.error("Lỗi khi parse JSON:", error);
    return null;
  }
}

// 🔵 Lấy trạng thái đăng nhập và kiểm tra thời hạn
export function getAuthWithExpiry(name) {
  const itemStr = localStorage.getItem(name);
  if (!itemStr) return false;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(name); // Xóa nếu hết hạn
    return false;
  }
  return item.value;
}
