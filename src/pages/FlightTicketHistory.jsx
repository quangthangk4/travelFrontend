import React from "react";
import {
  FaPlane,
  FaCalendarAlt,
  FaChair,
  FaQrcode,
  FaPrint,
  FaArrowLeft,
} from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const FlightTicketDetail = () => {
  const location = useLocation();
  const flight = location.state?.flight; // Lấy dữ liệu từ state
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/ticket-history`)}
            className="cursor-pointer flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Ticket History
          </button>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaPrint className="mr-2" />
            Print Ticket
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Ticket Details</h1>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">User Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {flight.user.firstName + " " + flight.user.lastName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {flight.user.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Birthday:</span>{" "}
                    {format(new Date(flight.user.birthday), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaPlane className="text-blue-600 mr-2" />
                    <span className="font-medium">
                      {flight.flight.flightNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">
                        {flight.flight.departureAirport}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(flight.flight.departureTime),
                          "h:mm a"
                        )}
                      </p>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-4 relative">
                      <FaPlane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {flight.flight.arrivalAirport}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(flight.flight.arrivalTime), "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Ticket Specifics</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaChair className="text-blue-600 mr-2" />
                    <span className="font-medium">
                      Seat: {flight.seatNumber}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-2" />
                    <span className="font-medium">
                      Booked:{" "}
                      {format(new Date(flight.bookingDate), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                      {flight.status}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {flight.price.toLocaleString("vi-VN") } VND
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                <div className="text-center">
                  <FaQrcode className="text-8xl mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Scan for mobile boarding pass
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightTicketDetail;
