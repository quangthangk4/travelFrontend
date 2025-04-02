import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaFilter, FaPlane, FaSearch, FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuthWithExpiry } from "../auth/manageToken";
import axios from "axios";
import axiosInstance from "../components/Api/axiosClient";

const FlightHistoryPage = () => {
  const [flights, setFlights] = useState([]);
  const token = getAuthWithExpiry("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // {
  //   id: 1,
  //   flightNumber: "BA2467",
  //   airline: "Bamboo Airlines",
  //   from: "JFK",
  //   to: "LAX",
  //   departureDate: "2024-02-20T10:30:00",
  //   status: "Completed",
  //   price: 549.99,
  // }

  useEffect(() => {
    const fetchMyFlights = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8080/tickets/getMyTickets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFlights(response.data.result);
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };

    fetchMyFlights();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedFlights = [...flights]
    .filter(
      (item) =>
        item.flight.flightNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.flight.airCraft.airline.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.flight.departureAirport
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.flight.arrivalAirport
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
      return 0;
    });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Flight History</h1>
          <p className="mt-2 text-gray-600">
            View and manage your past and upcoming flights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search flights..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFilter className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("flightNumber")}
                    >
                      <div className="flex items-center">
                        Flight Number
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Airline
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("departureTime")}
                    >
                      <div className="flex items-center">
                        Date
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("departureAirport")}
                    >
                      Route
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedFlights.map((item) => (
                    <tr
                      key={item.seatNumber}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        navigate(`/ticket-detail`, {
                          state: { flight: item },
                        })
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaPlane className="text-blue-600 mr-2" />
                          {item.flight.flightNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.flight.airCraft.airline.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(
                          new Date(item.flight.departureTime),
                          "dd-MM-yyyy"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.flight.departureAirport} →{" "}
                        {item.flight.arrivalAirport}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : item.status === "BOOKED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightHistoryPage;
