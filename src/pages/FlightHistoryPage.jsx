import React, { useState } from "react";
import { FaPlane, FaSearch, FaSort, FaFilter } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const FlightHistoryPage = () => {
  const [flights, setFlights] = useState([
    {
      id: 1,
      flightNumber: "BA2467",
      airline: "Bamboo Airlines",
      from: "JFK",
      to: "LAX",
      departureDate: "2024-02-20T10:30:00",
      status: "Completed",
      price: 549.99,
    },
    {
      id: 2,
      flightNumber: "UA1234",
      airline: "United Airlines",
      from: "SFO",
      to: "ORD",
      departureDate: "2024-02-25T08:15:00",
      status: "Upcoming",
      price: 423.5,
    },
    {
      id: 3,
      flightNumber: "DL5678",
      airline: "Delta Airlines",
      from: "LAX",
      to: "MIA",
      departureDate: "2024-03-05T14:20:00",
      status: "Cancelled",
      price: 632.75,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
      (flight) =>
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.to.toLowerCase().includes(searchTerm.toLowerCase())
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
                      onClick={() => handleSort("airline")}
                    >
                      <div className="flex items-center">
                        Airline
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("departureDate")}
                    >
                      <div className="flex items-center">
                        Date
                        <FaSort className="ml-2" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("from")}
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
                  {filteredAndSortedFlights.map((flight) => (
                    <tr
                      key={flight.id}
                      className="hover:bg-gray-50 cursor-pointer"
											onClick={() => navigate(`/ticket-detail`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaPlane className="text-blue-600 mr-2" />
                          {flight.flightNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.airline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(flight.departureDate), "dd-MM-yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.from} → {flight.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${flight.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            flight.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : flight.status === "Upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {flight.status}
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
