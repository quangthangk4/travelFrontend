import React, { useEffect, useState } from "react";
import { IoIosAirplane } from "react-icons/io";
import { useSelector } from "react-redux";

const BookingInfo = ({ flightFrom, flightTo, isRoundTrip, luggage }) => {
  const [listAirports, setListAirports] = useState(
    useSelector((state) => state.trip.airports) || []
  ); // Lấy trạng danh sách airport từ Redux

  const [airportFrom, setAirportFrom] = useState(null);
  const [airportTo, setAirportTo] = useState(null);

  const getDuration = (dep, arr) => {
    const depTime = new Date(dep);
    const arrTime = new Date(arr);
    const diffMs = arrTime - depTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (flightFrom) {
      setAirportFrom(
        listAirports.find((ap) => ap.maIATA === flightFrom.departureAirport)
      );
      setAirportTo(
        listAirports.find((ap) => ap.maIATA === flightFrom.arrivalAirport)
      );
    }
  }, [flightFrom]);

  if (!flightFrom) {
    return (
      <div className="text-gray-500 pt-20 ps-20 text-2xl">
        Vui lòng chọn chuyến bay
      </div>
    );
  }

  return (
    <div>
      <div className="mt-5 bg-amber-300 rounded-t-2xl mb-5">
        {/* Chuyến đi */}
        <div className="pb-5">
          <div className="flex justify-between text-[18px] bg-[#c9efff] py-[13px] px-[21px] rounded-t-2xl">
            <h2>Chuyến bay đi</h2>
            <p className="text-[#ec2029] font-bold">
              {flightFrom.basePrice.toLocaleString("vi-VN")} VND
            </p>
          </div>
          <div className="pt-[13px] px-[21px]">
            <div className="flex justify-between items-center text-[15px] font-bold">
              {airportFrom?.tinhThanh} ({airportFrom?.maIATA}){" "}
              <IoIosAirplane className="text-[22px]" /> {airportTo?.tinhThanh} (
              {airportTo?.maIATA}){" "}
            </div>
            <div className="text-[13px] font-semibold text-gray-500 flex justify-between">
              {new Date(flightFrom.departureTime).toLocaleString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              <span>
                {getDuration(flightFrom.departureTime, flightFrom.arrivalTime)}
              </span>
              {new Date(flightFrom.arrivalTime).toLocaleString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {/* | {flightFrom.flightNumber} */}
            </div>
            <div className="relative text-[13px] font-semibold text-gray-500 flex justify-between items-center">
              <p>
                {new Date(flightFrom.departureTime).toLocaleTimeString(
                  "vi-VN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}{" "}
              </p>
              <div className="h-[2px] w-40 bg-gray-300"></div>
              <span className="absolute text-gray-500 bg-[#ffd230] left-[50%] -translate-x-1/2 px-2 text-center">
                Bay thẳng
              </span>
              <p>
                {new Date(flightFrom.arrivalTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="text-[15px] pt-1 font-semibold flex justify-between text-gray-700">
              <p>{flightFrom.airCraft.airline.name}</p>
              <p>{flightFrom.flightNumber}</p>
            </div>

          </div>
        </div>

        {/* Chuyến về (nếu là khứ hồi) */}
        {isRoundTrip && !flightTo && (
          <div>
            <div className="flex justify-between text-[18px] bg-[#c9efff] py-[13px] px-[21px]">
              <h2>Chuyến về</h2>
              <p className="text-[#ec2029] font-bold">___,___,___ VND</p>
            </div>
            <div className="py-[13px] px-[21px]">
              <div className="flex justify-between items-center text-[18px] font-semibold">
                --- <IoIosAirplane className="text-[22px]" /> ---
              </div>
              <div>__ _, __/__/____ | __:__ - __:__ | _____</div>
            </div>
          </div>
        )}

        {isRoundTrip && flightTo && (
          <div className="pb-5">
            <div className="flex justify-between text-[18px] bg-[#c9efff] py-[13px] px-[21px]">
              <h2>Chuyến bay về</h2>
              <p className="text-[#ec2029] font-bold">
                {flightTo.basePrice.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="py-[13px] px-[21px]">
              <div className="flex justify-between items-center text-[18px] font-semibold">
                {airportFrom?.tinhThanh} {airportFrom?.maIATA}{" "}
                <IoIosAirplane className="text-[22px]" />{" "}
                {flightTo.arrivalAirport}
              </div>
              <div>
                {new Date(flightTo.departureTime).toLocaleString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                |{" "}
                {new Date(flightTo.departureTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {new Date(flightTo.arrivalTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | {flightTo.flightNumber}
              </div>
            </div>
          </div>
        )}

        {/* Tổng tiền */}
        <div className="py-[15px] font-semibold px-[20px] bg-[#d91a21] text-white">
          <div className="flex text-[14px] justify-between">
            <p>Vé máy bay: </p>
            <p className="text-gray-200">
              {flightFrom.basePrice.toLocaleString("vi-VN")} VND
            </p>
          </div>
          {luggage && (
            <div className="flex text-[14px] justify-between">
              <p>Gói Hành lý: </p>
              <p className="text-gray-200">
                {Number(luggage).toLocaleString("vi-VN")} VND
              </p>
            </div>
          )}
          <div className="mt-3 flex justify-between border-t-1 border-gray-200">
            <h2 className="text-[20px]">Tổng tiền</h2>
            <p className="font-bold text-[22px] italic">
              {(
                flightFrom.basePrice +
                (flightTo?.basePrice || 0) +
                Number(luggage)
              ).toLocaleString("vi-VN")}{" "}
              VND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;
