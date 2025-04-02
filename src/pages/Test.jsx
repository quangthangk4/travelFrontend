import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  getSeatAvailable,
  seatClassesFunc,
} from "../components/Api/Bookticket";
import { useDispatch, useSelector } from "react-redux";
import { updateFlight } from "../store/tripSlice";

const Test = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]); // Danh sách ghế đã đặt
  const [seatClasses, setSeatClasses] = useState({}); // Thông tin về các hạng ghế
  const flight = useSelector((state) => state.trip.flight);
  const dispatch = useDispatch();

  // Lấy thông tin chuyến bay từ API khi component được mount
  useEffect(() => {
    const fetchSeats = async () => {
      const response = await axios.get(
        "http://localhost:8080/flight/0d8a341c-b376-414d-b573-3d751b96db18"
      );
      dispatch(
        updateFlight({
          departFlight: response.data.result,
        })
      );
    };
    fetchSeats();
  }, []); // Chỉ gọi khi component mount

  // Lấy danh sách ghế đã đặt mỗi khi `flight.departFlight.id` thay đổi
  useEffect(() => {
    if (flight?.departFlight?.id) {
      fetchOccupiedSeats();
    }
  }, [flight.departFlight.id]); // Chạy lại khi ID của chuyến bay thay đổi

  const fetchOccupiedSeats = async () => {
    try {
      const occupied = await getSeatAvailable(flight);
      setOccupiedSeats(occupied);
      const classes = seatClassesFunc(flight.departFlight.totalTickets); // Lấy thông tin hạng ghế
      setSeatClasses(classes);
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
    }
  };

  // useEffect theo dõi sự thay đổi của `seatClasses` và `occupiedSeats`
  useEffect(() => {
    console.log("seatClasses: ", seatClasses);
    console.log("occupiedSeats: ", occupiedSeats);
  }, [seatClasses, occupiedSeats]); // Sẽ log mỗi khi `seatClasses` hoặc `occupiedSeats` thay đổi

  return (
    <div>
      <h3>Seat Classes</h3>
      <pre>{JSON.stringify(seatClasses, null, 2)}</pre>
      <h3>Occupied Seats</h3>
      <pre>{JSON.stringify(occupiedSeats, null, 2)}</pre>
    </div>
  );
};

export default Test;
