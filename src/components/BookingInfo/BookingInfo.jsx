import React from "react";
import { IoIosAirplane } from "react-icons/io";
import Button from "../Button/Button";
import { useSelector } from "react-redux";

const BookingInfo = ({ flight, flight2, button, isRoundTrip, luggage }) => {
  if (!flight) {
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
            <h2>Chuyến đi</h2>
            <p className="text-[#ec2029] font-bold">2,322,200 VND</p>
          </div>
          <div className="py-[13px] px-[21px]">
            <div className="flex justify-between items-center text-[18px] font-semibold">
              {flight.departureAirport}{" "}
              <IoIosAirplane className="text-[22px]" /> {flight.arrivalAirport}
            </div>
            <div>
              {new Date(flight.departureTime).toLocaleString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              |{" "}
              {new Date(flight.departureTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -
              {new Date(flight.arrivalTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              | {flight.flightNumber}
            </div>

            {luggage && <div className="">luggage price: {luggage}</div>}
          </div>
        </div>

        {/* Chuyến về (nếu là khứ hồi) */}
        {isRoundTrip && !flight2 && (
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

        {isRoundTrip && flight2 && (
          <div className="pb-5">
            <div className="flex justify-between text-[18px] bg-[#c9efff] py-[13px] px-[21px]">
              <h2>Chuyến về</h2>
              <p className="text-[#ec2029] font-bold">2,322,200 VND</p>
            </div>
            <div className="py-[13px] px-[21px]">
              <div className="flex justify-between items-center text-[18px] font-semibold">
                {flight2.departureAirport}{" "}
                <IoIosAirplane className="text-[22px]" />{" "}
                {flight2.arrivalAirport}
              </div>
              <div>
                {new Date(flight2.departureTime).toLocaleString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                |{" "}
                {new Date(flight2.departureTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {new Date(flight2.arrivalTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | {flight2.flightNumber}
              </div>
            </div>
          </div>
        )}

        {/* Tổng tiền */}
        <div className="py-[15px] px-[20px] bg-[#d91a21] text-white flex justify-between">
          <h2 className="text-[20px] font-semibold">Tổng tiền</h2>
          <p className="font-bold text-[22px] italic">3,942,400 VND</p>
        </div>
      </div>

      {/* Nút bấm */}
      <div className="float-end">
        <Button text={button} />
      </div>
    </div>
  );
};

export default BookingInfo;
