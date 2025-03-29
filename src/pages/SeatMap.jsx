import React, { useState, useEffect } from "react";
import { FaPlane, FaWheelchair, FaChild } from "react-icons/fa";
import { MdAirlineSeatReclineExtra, MdEventSeat } from "react-icons/md";
import plane from "../assets/images/plane.png";
import Button from "../components/Button/Button";

const SeatMap = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const seatClasses = {
    first: {
      price: 1200,
      rows: [1, 2, 3, 4, 5, 6, 7, 8],
      seatsPerRow: 6,
      color: "bg-purple-100",
      hoverColor: "hover:bg-purple-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
    business: {
      price: 800,
      rows: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      seatsPerRow: 6,
      color: "bg-blue-100",
      hoverColor: "hover:bg-blue-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
    economy: {
      price: 400,
      rows: [
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 40,
      ],
      seatsPerRow: 6,
      color: "bg-gray-100",
      hoverColor: "hover:bg-gray-200",
      selectedColor: "bg-[#2b7fff] text-white font-semibold cursor-pointer",
    },
  };

  const occupiedSeats = [
    "1A",
    "2C",
    "3F",
    "5D",
    "7B",
    "8E",
    "11C",
    "13F",
    "15A",
    "17D",
    "19B",
    "22E",
    "25C",
    "28F",
    "31A",
    "34D",
    "37B",
    "40E",
  ];
  const exitRows = [10, 20, 30];

  const handleSeatSelect = (seatId, price) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
      setTotalPrice(totalPrice - price);
    } else if (selectedSeats.length < passengerCount) {
      setSelectedSeats([...selectedSeats, seatId]);
      setTotalPrice(totalPrice + price);
    }
  };

  const getSeatStatus = (seatId, classType) => {
    if (occupiedSeats.includes(seatId)) {
      return "bg-gray-400 cursor-not-allowed";
    }
    if (selectedSeats.includes(seatId)) {
      return seatClasses[classType].selectedColor;
    }
    return `${seatClasses[classType].color} ${seatClasses[classType].hoverColor} cursor-pointer`;
  };

  const renderSeats = () => {
    return (
      <div
        className="relative bg-cover bg-center p-8 rounded-lg mt-[550px]"
        // style={{
        //   backgroundImage: `url(${plane})`,
        //   backgroundSize: "150%", // Phóng to hình nền hơn bình thường
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center",
        //   // transform: "scale(1.2)", // Phóng to toàn bộ vùng chứa ghế và nền
        // }}
      >
        {Object.entries(seatClasses).map(([classType, config]) => (
          <div key={classType} className="mb-8 bg-opacity-70 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {classType} Class
            </h3>
            <div className="px-[200px]">
              <div className="space-y-3 py-3 rounded-2xl bg-white">
                {config.rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center justify-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: config.seatsPerRow }).map(
                        (_, index) => {
                          const seatLetter = String.fromCharCode(65 + index);
                          const seatId = `${row}${seatLetter}`;
                          const isExitRow = exitRows.includes(row);
                          return (
                            <React.Fragment key={seatId}>
                              {index === config.seatsPerRow / 2 && (
                                <div className="w-8 text-center z-50">
                                  <span className="text-center">{row}</span>
                                </div>
                              )}
                              <button
                                className={`w-10 h-12 rounded-sm flex items-center justify-center transform transition-all duration-200 ${getSeatStatus(
                                  seatId,
                                  classType
                                )}`}
                                onClick={() =>
                                  handleSeatSelect(seatId, config.price)
                                }
                                disabled={occupiedSeats.includes(seatId)}
                                title={`Seat ${seatId}${
                                  isExitRow ? " - Exit Row" : ""
                                }`}
                              >
                                <span className="text-sm">{seatLetter}</span>
                              </button>
                            </React.Fragment>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <FaPlane className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Select Your Seats
          </h1>
          <p className="mt-2 text-gray-600">Total Capacity: 240 Seats</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-x-hidden overflow-y-scroll max-h-[800px] relative">
            <img
              src={plane}
              alt="plane"
              className="absolute object-cover scale-[470%] scale top-[1530px]"
            />
            <div className="">{renderSeats()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Selected Seats</h2>
            {/* <div className="flex justify-between mb-6">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <span>Passengers:</span>
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="form-select rounded border-gray-300"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div> */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-400 rounded" />
                  <span>Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
            {selectedSeats.length > 0 ? (
              <div className="space-y-4">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <MdEventSeat className="text-blue-500" />
                      <span>Seat {seat}</span>
                    </div>
                    <span className="font-semibold">
                      $
                      {
                        Object.values(seatClasses).find((classType) =>
                          classType.rows.includes(Number(seat.slice(0, -1)))
                        ).price
                      }
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => alert("Proceeding to booking...")}
                >
                  Thanh Toán
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No seats selected</p>
            )}
          </div>
        </div>
      </div>
      <div className="py-[11px] fixed bottom-0 left-0 right-0 px-15 bg-white border-1 w-full z-[8888] flex justify-end pe-50">
        <div className="pe-50">
          <p className="font-semibold">Tổng tiền</p>
          <p className="font-semibold italic text-2xl">2,322,200 VND</p>
        </div>
        <Button text="Thanh Toán" />
      </div>
    </div>
  );
};

export default SeatMap;
