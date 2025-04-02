import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getAuthWithExpiry } from "../auth/manageToken";
import axiosInstance from "../components/Api/axiosClient";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    cccd: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8080/user/getMyInfo",
          {
            headers: {
              Authorization: `Bearer ${getAuthWithExpiry("token")}`,
            },
          }
        );

        const userData = response.data.result;
        setCurrentUser(userData);

        setEditedUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          birthday: userData.birthday
            ? format(new Date(userData.birthday), "yyyy-MM-dd")
            : "",
          cccd: userData.cccd || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      await axiosInstance.put("http://localhost:8080/user/update", editedUser, {
        headers: {
          Authorization: `Bearer ${getAuthWithExpiry("token")}`,
          "Content-Type": "application/json",
        },
      });

      alert("Chỉnh sửa thông tin thành công!");
      setCurrentUser((prev) => ({ ...prev, ...editedUser }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDeposit = () => {
    navigate("/deposit-money"); // Chuyển hướng sang trang nạp tiền
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Avatar & Actions */}
        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-8">
          <div className="text-center">
            <img
              src={
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" ||
                "/default-avatar.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {currentUser?.firstName || "Chưa cập nhật"}{" "}
              {currentUser?.lastName || ""}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentUser?.email}
            </p>
            <p className="text-green-500 font-semibold mt-2">
              Số dư: {currentUser?.accountBalance?.toLocaleString()} VNĐ
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vai trò: {currentUser?.roles?.[0]?.roleName || "USER"}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <FiEdit2 className="mr-2" />
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
            </button>
            <button
              onClick={handleDeposit}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Nạp tiền
            </button>
          </div>
        </div>

        {/* User Information */}
        <div className="md:w-2/3 p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Thông tin cá nhân
          </h3>
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex gap-x-4">
                  <div className="flex-1/2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editedUser.firstName}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex-1/2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editedUser.lastName}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="flex-1/2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editedUser.phone}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex-1/2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Căn cước công dân
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editedUser.cccd}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, cccd: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Birthday (mm/dd/yyy)
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={editedUser.birthday}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, birthday: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Lưu thay đổi
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 dark:text-gray-400">ID</label>
                  <p className="text-gray-800 dark:text-white">
                    {currentUser?.id}
                  </p>
                </div>

                <div className="flex">
                  <div className="flex-1/2">
                    <label className="text-gray-600 dark:text-gray-400">
                      Email
                    </label>
                    <p className="text-gray-800 dark:text-white">
                      {currentUser?.email}
                    </p>
                  </div>

                  <div className="flex-1/2">
                    <label className="text-gray-600 dark:text-gray-400">
                      Phone Number
                    </label>
                    <p className="text-gray-800 dark:text-white">
                      {currentUser?.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-1/2">
                    <label className="text-gray-600 dark:text-gray-400">
                      Căn cước công dân
                    </label>
                    <p className="text-gray-800 dark:text-white">
                      {currentUser?.cccd || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="flex-1/2">
                    <label className="text-gray-600 dark:text-gray-400">
                      Birthday (mm/dd/yyyy)
                    </label>
                    <p className="text-gray-800 dark:text-white">
                      {currentUser?.birthday
                        ? format(new Date(currentUser.birthday), "MM/dd/yyyy")
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
