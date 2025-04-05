import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    cccd: "",
    birthday: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    // else if (formData.password.length < 8)
    //   newErrors.password = "Password must be at least 8 characters";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.cccd) newErrors.cccd = "Citizen ID is required";
    if (!formData.birthday) newErrors.birthday = "Birthday is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/create`,
        formData
      );
      alert("Registration successful! Redirecting to login...");
      // xóa mật khẩu tk đã lưu trước đó, rồi chuyển hướng tới login
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      navigate("/sign-in"); // Điều hướng đến trang đăng nhập
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border-t-gray-100 border-t-1 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 ">
        Register
      </h2>
      {errors.api && (
        <p className="text-red-500 text-center mb-4">{errors.api}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-gray-700  mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <label className="block text-gray-700  mb-2">Password</label>
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
            className="absolute right-3 top-11 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FiEyeOff className="text-gray-500" />
            ) : (
              <FiEye className="text-gray-500" />
            )}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700  mb-2">First Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700  mb-2">Last Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700  mb-2">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700  mb-2">Citizen ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.cccd}
            onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
          />
          {errors.cccd && (
            <p className="text-red-500 text-sm mt-1">{errors.cccd}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700  mb-2">Birthday</label>
          <input
            type="date"
            className="w-full px-4 py-2 rounded-lg border "
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
          />
          {errors.birthday && (
            <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <div className="md:col-span-2 text-center">
          <p className="text-gray-600 ">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/sign-in")}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
