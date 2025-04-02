import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaRegCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAirports, updateFlight } from "../../store/tripSlice";

const SearchFlight = ({
  defaultFrom,
  defaultTo,
  defaultDepartDate,
  defaultReturnDate,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [departDate, setDepartDate] = useState(defaultDepartDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [departFrom, setDepartFrom] = useState(defaultFrom);
  const [returnFrom, setReturnFrom] = useState(defaultTo);
  const flight = useSelector((state) => state.trip.flight); // Lấy state từ Redux

  const dispatch = useDispatch(); // Lấy dispatch để cập nhật state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPassengerPopupOpen, setIsPassengerPopupOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [minors, setMinors] = useState(0);
  const [isRoundTripLocal, setIsRoundTripLocal] = useState(!!defaultReturnDate);

  const [airports, setAirport] = useState([]);

  const inputRef = useRef(null);
  const passengerRef = useRef(null);
  const navigate = useNavigate();


  const handleSearch = () => {
    if (
      !departFrom ||
      !returnFrom ||
      !departDate ||
      (isRoundTripLocal && !returnDate)
    ) {
      alert("Vui lòng nhập đầy đủ thông tin của chuyến bay!");
      return;
    }

    const query = new URLSearchParams({
      departFrom,
      returnFrom,
      departDate: departDate ? formatDate2(departDate) : "",
      returnDate: returnDate ? formatDate2(returnDate) : "",
    }).toString();

    dispatch(
      updateFlight({
        isRoundTrip: isRoundTripLocal,
      })
    );

    navigate(`/flight?${query}`);
  };

  useEffect(() => {
    if (defaultReturnDate) {
      setIsRoundTripLocal(true); // Nếu có returnDate => cập nhật isRoundTrip thành true
    } else {
      setIsRoundTripLocal(false); //// Không có returnDate => một chiều
    }
  }, [defaultReturnDate]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/airports/vietnam")
      .then((response) => {
        if (response.data && response.data.result) {
          setAirport(response.data.result);
          dispatch(setAirports(response.data.result));
        }
      })
      .catch((error) => console.error("Lỗi khi tải danh sách sân bay:", error));
  }, []);

  const formatDate = (date) => {
    return date instanceof Date ? date.toLocaleDateString("vi-VN") : "";
  };

  const formatDate2 = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsPopupOpen(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(e.target)) {
        setIsPassengerPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex rounded-lg  w-full ">
      <div className="flex flex-1">
        <label className="px-4 bg-gray-200  inline-flex items-center min-w-fit rounded-s-md border border-e-0 text-sm border-neutral-700 text-neutral-400">
          <FaPlaneDeparture />
        </label>
        <select
          className={`cursor-pointer border border-gray-300 text-sm block w-full p-2.5 
          dark:border-gray-600 focus:rounded-sm focus:ring-1 transition-colors 
          ${
            departFrom
              ? "text-gray-900 font-bold"
              : "text-[#7c7b7f] font-medium"
          }`}
          value={departFrom}
          onChange={(e) => setDepartFrom(e.target.value)}
        >
          <option className="text-gray-900" value="" defaultValue={""} hidden>
            From Where?
          </option>
          {airports.map((airport) => (
            <option
              className="text-gray-900"
              key={airport.maIATA}
              value={airport.maIATA}
            >
              {airport.maIATA} - {airport.tenSanBay} - {airport.tinhThanh}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1">
        <label className="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0  text-sm   border-neutral-700 text-neutral-400">
          <FaPlaneArrival />
        </label>
        <select
          className={`cursor-pointer border border-gray-300 text-sm block w-full p-2.5 
          dark:border-gray-600 focus:rounded-sm focus:ring-1 transition-colors 
          ${
            returnFrom
              ? "text-gray-900 font-bold"
              : "text-[#7c7b7f] font-medium"
          }`}
          value={returnFrom}
          onChange={(e) => setReturnFrom(e.target.value)}
        >
          <option className="" value="" defaultValue={""} hidden>
            Where to?
          </option>
          {airports.map((airport) => (
            <option
              className="text-gray-900"
              key={airport.maIATA}
              value={airport.maIATA}
            >
              {airport.maIATA} - {airport.tenSanBay} - {airport.tinhThanh}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 relative" ref={inputRef}>
        <label className="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0 text-sm border-neutral-700 text-neutral-400 ">
          <FaRegCalendarAlt />
        </label>
        <input
          type="text"
          readOnly
          value={
            isRoundTripLocal
              ? `${formatDate(departDate)} - ${formatDate(returnDate)}`
              : formatDate(departDate) || ""
          }
          className="px-4 py-2 border w-full cursor-pointer"
          onClick={() => setIsPopupOpen(true)}
          placeholder="Depart - Arrive"
        />

        {isPopupOpen && (
          <div className="absolute top-14 flex items-center justify-center">
            <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-2xl w-96">
              <h3 className="text-lg font-bold mb-4">Select Date</h3>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="tripType"
                    value="oneway"
                    checked={!isRoundTripLocal}
                    onChange={() => setIsRoundTripLocal(false)}
                  />
                  <span className="font-medium">One way</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="tripType"
                    value="roundtrip"
                    checked={isRoundTripLocal}
                    onChange={() => setIsRoundTripLocal(true)}
                  />
                  <span className="font-medium">Round trip</span>
                </label>
              </div>
              <div className="flex space-x-6 w-full mt-4">
                <div className="flex flex-col flex-1">
                  <label className="font-medium">Departure:</label>
                  <DatePicker
                    selected={departDate}
                    onChange={(date) => {
                      setDepartDate(date);
                      if (returnDate < date) {
                        setReturnDate(date);
                      }
                    }}
                    minDate={today}
                    dateFormat="dd/MM/yyyy"
                    className="border p-2 rounded-md w-full text-center"
                    placeholderText="Chọn ngày đi"
                  />
                </div>
                {isRoundTripLocal && (
                  <div className="flex flex-col flex-1">
                    <label className="font-medium">Arrival:</label>
                    <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      minDate={departDate}
                      dateFormat="dd/MM/yyyy"
                      className="border p-2 rounded-md w-full text-center"
                      placeholderText="Chọn ngày về"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 relative " ref={passengerRef}>
        <label className="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0 border-gray-200 text-sm text-gray-500  dark:border-neutral-700 dark:text-neutral-400">
          <FaUser />
        </label>

        <input
          type="text"
          readOnly
          value={`${adults} Adult${adults > 1 ? "s" : ""},${minors} Minor${
            minors > 1 ? "s" : ""
          } `}
          className="px-4 py-2 border border-e-0 w-full cursor-pointer"
          onClick={() => setIsPassengerPopupOpen(true)}
        />

        {isPassengerPopupOpen && (
          <div className="absolute top-12 left-0 mt-2 border-1 border-gray-300 bg-white p-4 rounded-lg shadow-lg w-64 z-10">
            <div className="flex justify-between items-center mb-2">
              <span>Adults:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="px-2 cursor-pointer py-1 border rounded"
                >
                  -
                </button>
                <span>{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="px-2 cursor-pointer py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Minors:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMinors(Math.max(0, minors - 1))}
                  className="px-2 cursor-pointer py-1 border rounded"
                >
                  -
                </button>
                <span>{minors}</span>
                <button
                  onClick={() => setMinors(minors + 1)}
                  className="px-2 cursor-pointer py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        <button
          onClick={handleSearch}
          className="cursor-pointer h-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchFlight;
