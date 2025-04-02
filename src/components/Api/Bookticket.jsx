import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthWithExpiry } from "../../auth/manageToken";
import axiosInstance from "./axiosClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = getAuthWithExpiry("token"); // Lấy token từ localStorage

export const getSeatAvailable = async (flight) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/tickets/booked-seats/${flight.id}`
    );

    return response.data.result;
  } catch (error) {
    alert("có lỗi xảy ra: ", error);
  }
};

// Tạo seatClasses động dựa trên số lượng ghế cho từng hạng
export const seatClassesFunc = (totalTickets) => {
  const { firstSeats, businessSeats, economySeats } =
    calculateSeatDistribution(totalTickets);

  // Tạo các rows cho mỗi hạng ghế, đảm bảo không trùng nhau
  const firstRows = Array.from(
    { length: Math.floor(firstSeats / 6) },
    (_, i) => i + 1
  ); // Hạng First
  const businessRows = Array.from(
    { length: Math.floor(businessSeats / 6) },
    (_, i) => i + firstRows.length + 1
  ); // Hạng Business
  const economyRows = Array.from(
    { length: Math.floor(economySeats / 6) },
    (_, i) => i + firstRows.length + businessRows.length + 1
  ); // Hạng Economy

  const seatClasses = {
    first: {
      price: 300000,
      rows: firstRows,
      seatsPerRow: 6,
      color: "bg-purple-100",
      hoverColor: "hover:bg-purple-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
    business: {
      price: 150000,
      rows: businessRows,
      seatsPerRow: 6,
      color: "bg-blue-100",
      hoverColor: "hover:bg-blue-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
    economy: {
      price: 0,
      rows: economyRows,
      seatsPerRow: 6,
      color: "bg-gray-100",
      hoverColor: "hover:bg-gray-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
  };

  return seatClasses;
};

// Hàm tính toán số lượng ghế cho từng hạng theo tỷ lệ 1:3:10
const calculateSeatDistribution = (totalTickets) => {
  const totalParts = 20; // Tổng tỷ lệ 1:3:10

  // Tính số ghế cho từng hạng
  const firstSeats = Math.floor((totalTickets * 4) / totalParts);
  const businessSeats = Math.floor((totalTickets * 6) / totalParts);
  const economySeats = totalTickets - firstSeats - businessSeats; // Số ghế còn lại là của Economy

  return { firstSeats, businessSeats, economySeats };
};

// Giữ ghế
export const holdSeat = async (flightId, seatNumber) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/tickets/hold-seat`,
      {
        flightId: flightId,
        seatNumber: seatNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào header
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) {
      if (response.data.result)
        console.log(`Seat ${seatNumber} held successfully!`);
      else alert(response.data.message);
    } else {
      console.log("Failed to hold seat.");
    }
  } catch (error) {
    console.error("Error holding seat:", error);
  }
};

export const releaseSeat = async (flightId, seatNumber) => {
  try {
    await axiosInstance.post(
      `${API_BASE_URL}/tickets/delete-hold-seat`,
      {
        flightId: flightId,
        seatNumber: seatNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào header
          "Content-Type": "application/json",
        },
      }
    );

    console.log("xóa giữ chỗ thành công");
  } catch (error) {
    console.error("Lỗi khi hủy giữ chỗ ghế:", error);
  }
};

// Gia hạn giữ ghế
export const extendSeatHold = async (flightId, seatNumber) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/extend-hold-seat`,
      {
        flightId: flightId,
        seatNumber: seatNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào header
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) {
      console.log(`Seat ${seatNumber} hold extended!`);
    } else {
      console.log("Failed to extend seat hold.");
    }
  } catch (error) {
    console.error("Error extending seat hold:", error);
  }
};

// Xác nhận book vé
export const confirmPayment = async (flight, navigate) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/tickets/book`,
      {
        flightIdArrival: flight.departFlight.id,
        flightIdReturn: flight.returnFlight.id,
        seatNumberArrival: flight.seatNumberArrival,
        seatNumberReturn: flight.seatNumberReturn,
        isRoundTrip: Boolean(flight.isRoundTrip),
        totalPriceArrival:
          Number(flight.departFlight.basePrice) +
          Number(flight.luggageArrival) +
          Number(flight.seatPriceArrival),
        totalPriceReturn:
          Number(flight.returnFlight.basePrice) +
          Number(flight.luggageReturn) +
          Number(flight.seatPriceReturn),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào header
          "Content-Type": "application/json",
        },
      }
    );

    
    toast.success(response.data.message + "!");
    if (response.data) alert(response.data.message);
    if (response.data.code === 1000) navigate("/");
  } catch (error) {
    console.log(error);  
    toast.error(error.response?.data.message);
    console.error("Error confirming payment:", error);
  }
};
