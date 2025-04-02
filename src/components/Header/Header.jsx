import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../Button/Button";
import { getAuthWithExpiry } from "../../auth/manageToken";
import { toast } from "react-toastify";
import axiosInstance from "../Api/axiosClient";

const Header = ({ isLoggedIn, role }) => {
  const navigate = useNavigate();

  // Xử lý logout
  const handleLogout = async () => {
    const token = getAuthWithExpiry("token");

    if (!token) return;

    try {
      await axiosInstance.post("http://localhost:8080/auth/logout", { token });

      // Xóa token sau khi logout thành công
      localStorage.removeItem("token");
      alert("đăng xuất thành công!");
      navigate("/"); // Quay về trang chủ
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed: " + error.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div className="lg:px-15 px-5 flex justify-between items-center py-3 border-b-1 border-b-gray-200 fixed z-[9999] top-0 left-0 right-0 bg-white">
      <NavLink to="/" className="text-[#605dec] font-extrabold text-2xl">
        TRIPMA
      </NavLink>
      <div className="flex items-center">
        <NavLink to="/flight" className="mx-3 hover:text-blue-700">
          Flights
        </NavLink>

        {isLoggedIn && (
          <NavLink to="/ticket-history" className="mx-3 hover:text-blue-700">
            Ticket History
          </NavLink>
        )}

        {!isLoggedIn ? (
          <>
            <div className="mx-3">
              <Button text={"Sign In"} onClick={() => navigate("/sign-in")} />
            </div>
            <div className="ms-3">
              <Button text={"Sign Up"} onClick={() => navigate("/sign-up")} />
            </div>
          </>
        ) : (
          <>
            {role === "ROLE_ADMIN" && (
              <>
                <NavLink to="/airline" className="mx-3 hover:text-blue-700">
                  Airline
                </NavLink>
                <NavLink to="/aircraft" className="mx-3 hover:text-blue-700">
                  Aircraft
                </NavLink>
                <NavLink to="/flight-admin" className="mx-3 hover:text-blue-700">
                  Flight Control
                </NavLink>
              </>
            )}

            <div className="mx-3">
              <Button text={"Profile"} onClick={() => navigate("/profile")} />
            </div>
            <div className="ms-3">
              <Button text={"Logout"} onClick={handleLogout} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
