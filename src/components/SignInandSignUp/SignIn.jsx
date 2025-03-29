import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import CryptoJS from "crypto-js";

const SignIn = () => {
  const navigate = useNavigate();

  const SECRET_KEY =
    "pt1z1UzcHGGe+fXQJzq+CxtkApvhq9wKoU3NZOwZWAUi0jmVDZzPZi82vAbmgx4o"; // Nên lưu vào biến môi trường

  const decryptPassword = (encryptedPassword) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return ""; // Nếu lỗi, trả về chuỗi rỗng
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Khi component load, lấy email & password đã lưu (nếu có)
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: decryptPassword(savedPassword),
        rememberMe: true,
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/authenticate",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.code === 1000) {
        const token = response.data.result.token;

        // 🔥 Mã hóa mật khẩu trước khi lưu
        const encryptedPassword = CryptoJS.AES.encrypt(
          formData.password,
          SECRET_KEY
        ).toString();

        // lưu token vào localStorage
        localStorage.setItem("token", token);

        // lưu tk,mk đã mã hóa và localStorage
        if (formData.rememberMe) {
          localStorage.setItem("savedEmail", formData.email);
          localStorage.setItem("savedPassword", encryptedPassword);
        }
        else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        localStorage.setItem("isAuthenticated", true);
        alert("Đăng nhập thành công!");

        // Chuyển hướng sang homepages
        navigate("/");
        window.location.reload();
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Đăng nhập thất bại.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border-t-1 border-t-gray-100 shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 ">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="relative">
          <label className="block text-gray-700 ">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FiEyeOff className="text-gray-500" />
            ) : (
              <FiEye className="text-gray-500" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <span className="text-sm text-gray-600 ">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 "
          >
            Forgot password?
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-600 ">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
