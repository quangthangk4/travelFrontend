import { format } from "date-fns"; // Removed parseISO, not strictly needed for input
import React, { useEffect, useState } from "react";
// import "react-datepicker/dist/react-datepicker.css"; // Remove if not using DatePicker component elsewhere
import { FaEye, FaTimes } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthWithExpiry } from "../../auth/manageToken";
// Assuming axiosInstance is configured with a baseURL like http://localhost:8080/
import axiosInstance from "../../components/Api/axiosClient";

// Initial Form State structure
const initialFormData = {
  flightNumber: "",
  departureAirport: "",
  arrivalAirport: "",
  // Use empty strings for datetime-local inputs
  departureTime: "",
  arrivalTime: "",
  status: "Scheduled",
  aircraftId: "",
  basePrice: "", // Use empty string for controlled number input
};

// --- Helper function for safe date formatting (can be outside component) ---
const formatDateSafe = (dateString, formatString = "dd/MM/yyyy HH:mm") => {
  if (!dateString) return "N/A";
  try {
    // Assuming dateString from API is ISO 8601 compatible or parsable by Date
    const date = new Date(dateString);
    // Check if date is valid before formatting
    if (isNaN(date.getTime())) {
      console.warn("Invalid date encountered:", dateString);
      return "Invalid Date";
    }
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

// --- FlightModal Component ---
const FlightModal = ({ flight, onClose }) => {
  if (!flight) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Flight Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Flight Number:</p>
            <p className="text-gray-900">{flight.flightNumber || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Aircraft ID:</p>
            {/* Adjust based on your actual data structure */}
            <p className="text-gray-900">
              {flight.airCraft?.id || flight.aircraftId || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Departure Airport:</p>
            <p className="text-gray-900">{flight.departureAirport || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Arrival Airport:</p>
            <p className="text-gray-900">{flight.arrivalAirport || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Airline:</p>
            {/* Adjust based on your actual data structure */}
            <p className="text-gray-900">
              {flight.airCraft?.airline?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Status:</p>
            <p
              className={`font-semibold ${
                flight.status === "Cancelled"
                  ? "text-red-600"
                  : flight.status === "Delayed"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {flight.status || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Base Price:</p>
            <p className="text-gray-900">
              {typeof flight.basePrice === "number"
                ? flight.basePrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) // Example currency formatting
                : flight.basePrice ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-600">
              Tickets Sold / Capacity:
            </p>
            {/* Ensure totalTickets exists or fallback to capacity */}
            <p className="text-gray-900">
              {flight.soldTickets ?? "N/A"} /{" "}
              {flight.totalTickets ?? flight.airCraft?.capacity ?? "N/A"}
            </p>
          </div>
          <div className="sm:col-span-2 mt-2">
            {" "}
            {/* Span across columns */}
            <p className="font-medium text-gray-600">Departure Time:</p>
            <p className="text-gray-900">
              {formatDateSafe(
                flight.departureTime,
                "EEEE, dd MMMM yyyy 'at' HH:mm"
              )}{" "}
              {/* Example detailed format */}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="font-medium text-gray-600">Arrival Time:</p>
            <p className="text-gray-900">
              {formatDateSafe(
                flight.arrivalTime,
                "EEEE, dd MMMM yyyy 'at' HH:mm"
              )}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main FlightAdmin Component ---
const FlightAdmin = () => {
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for clarity
  const [isDeleting, setIsDeleting] = useState(false); // Specific loading state for delete

  const token = getAuthWithExpiry("token");
  const airports = useSelector((state) => state.trip.airports || []);
  const statuses = ["Scheduled", "Delayed", "Cancelled"];

  // --- Data Fetching ---
  const fetchFlights = async () => {
    if (!token) {
      toast.warn("Authentication token missing. Unable to fetch flights.");
      return;
    }
    try {
      const response = await axiosInstance.get("/flight/getAllFlight", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(
        Array.isArray(response.data?.result) ? response.data.result : []
      );
    } catch (error) {
      console.error("Error fetching flights:", error);
      toast.error(
        `Error fetching flights: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Assuming token changes trigger re-fetch

  // --- Form Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.departureTime || !formData.arrivalTime) {
      toast.error("Please select both departure and arrival times.");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.departureAirport &&
      formData.departureAirport === formData.arrivalAirport
    ) {
      toast.error("Departure and arrival airports cannot be the same.");
      setIsSubmitting(false);
      return;
    }
    // Price validation (ensure it's a positive number)
    const basePriceNum = parseFloat(formData.basePrice);
    if (isNaN(basePriceNum) || basePriceNum <= 0) {
      toast.error("Base price must be a positive number.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Compare Dates correctly
      const departureDate = new Date(formData.departureTime);
      const arrivalDate = new Date(formData.arrivalTime);

      if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
        toast.error("Invalid date format selected.");
        setIsSubmitting(false);
        return;
      }

      if (arrivalDate <= departureDate) {
        toast.error("Arrival time must be strictly after departure time.");
        setIsSubmitting(false);
        return;
      }

      // Send data (datetime-local format is usually fine for Spring Boot LocalDateTime)
      const payload = {
        ...formData,
        basePrice: basePriceNum, // Send as number
      };
      const response = await axiosInstance.post("/flight/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data.message || "Flight created successfully!");
      resetForm();
      await fetchFlights(); // Re-fetch the updated list
    } catch (error) {
      console.error("Error creating flight:", error);
      toast.error(
        `Error creating flight: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Deletion Handling ---
  const handleDeleteClick = (flight) => {
    setSelectedFlight(flight);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedFlight) return;
    setIsDeleting(true);

    try {
      const response = await axiosInstance.delete(
        `/flight/delete/${selectedFlight.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFlights((prev) =>
        prev.filter((flight) => flight.id !== selectedFlight.id)
      );
      setShowDeleteModal(false);
      setSelectedFlight(null);
      toast.success(response.data.message || "Flight deleted successfully!");
    } catch (error) {
      console.error("Error deleting flight:", error);
      toast.error(
        `Error deleting flight: ${
          error.response?.data?.message || error.message
        }`
      );
      setShowDeleteModal(false); // Close modal even on error
    } finally {
      setIsDeleting(false);
    }
  };

  // --- View Details Handling ---
  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFlight(null); // Clear selection when closing
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {" "}
      {/* Use gray-50 for lighter bg */}
      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Flight Management
          </h1>

          {/* Flight Creation Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">
              Create New Flight
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"
            >
              {/* Flight Number */}
              <div>
                <label
                  htmlFor="flightNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Flight Number
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber" // Add name attribute
                  required
                  pattern="^[A-Z]{2}\d{3,4}$" // Example pattern (2 letters, 3-4 digits)
                  title="Format: XX123 or XX1234"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={formData.flightNumber}
                  onChange={handleInputChange} // Use generic handler
                />
              </div>

              {/* Departure Airport */}
              <div>
                <label
                  htmlFor="departureAirport"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Airport
                </label>
                <select
                  id="departureAirport"
                  name="departureAirport" // Add name attribute
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  value={formData.departureAirport}
                  onChange={handleInputChange} // Use generic handler
                >
                  <option value="">Select Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.maIATA} value={airport.maIATA}>
                      {airport.maIATA} - {airport.tenSanBay} (
                      {airport.tinhThanh})
                    </option>
                  ))}
                </select>
              </div>

              {/* Arrival Airport */}
              <div>
                <label
                  htmlFor="arrivalAirport"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Arrival Airport
                </label>
                <select
                  id="arrivalAirport"
                  name="arrivalAirport" // Add name attribute
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  value={formData.arrivalAirport}
                  onChange={handleInputChange} // Use generic handler
                >
                  <option value="">Select Airport</option>
                  {airports
                    .filter((ap) => ap.maIATA !== formData.departureAirport) // Optionally filter out departure airport
                    .map((airport) => (
                      <option key={airport.maIATA} value={airport.maIATA}>
                        {airport.maIATA} - {airport.tenSanBay} (
                        {airport.tinhThanh})
                      </option>
                    ))}
                </select>
              </div>

              {/* Departure Time */}
              <div>
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime" // Add name attribute
                  required
                  value={formData.departureTime}
                  onChange={handleInputChange} // Use generic handler
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Arrival Time */}
              <div>
                <label
                  htmlFor="arrivalTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  name="arrivalTime" // Add name attribute
                  required
                  value={formData.arrivalTime}
                  onChange={handleInputChange} // Use generic handler
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  // Set min based on departure time if selected
                  min={formData.departureTime || ""}
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status" // Add name attribute
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  value={formData.status}
                  onChange={handleInputChange} // Use generic handler
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aircraft ID */}
              <div>
                <label
                  htmlFor="aircraftId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Aircraft ID
                </label>
                <input
                  type="text" // Or maybe a dropdown if you fetch aircrafts
                  id="aircraftId"
                  name="aircraftId" // Add name attribute
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={formData.aircraftId}
                  onChange={handleInputChange} // Use generic handler
                />
              </div>

              {/* Base Price */}
              <div>
                <label
                  htmlFor="basePrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Base Price (VND)
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice" // Add name attribute
                  required
                  min="1" // Prevent non-positive prices
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={formData.basePrice}
                  onChange={handleInputChange} // Use generic handler
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 lg:col-span-3 mt-4">
                {" "}
                {/* Span across columns */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 py-2 rounded text-white font-medium transition-colors duration-150 ease-in-out ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Create Flight"}
                </button>
                <button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="ml-3 w-full sm:w-auto px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Flight List Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">
              Flight List ({flights.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 font-medium">
                    <th className="p-3">Flight No.</th>
                    <th className="p-3">Departure Time</th>
                    <th className="p-3">Route</th>
                    {/* <th className="p-3 text-left">Arrival</th> */}
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Base Price</th>
                    <th className="p-3 text-center">Tickets</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flights.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-6 text-gray-500">
                        No flights found.
                      </td>
                    </tr>
                  ) : (
                    flights.map((flight) => (
                      <tr
                        key={flight.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {flight.flightNumber}
                        </td>
                        <td className="p-3 text-gray-700">
                          {formatDateSafe(
                            flight.departureTime,
                            "dd/MM/yy HH:mm"
                          )}{" "}
                          {/* Shorter format */}
                        </td>
                        <td className="p-3 text-gray-700">
                          <span className="font-medium">
                            {flight.departureAirport}
                          </span>{" "}
                          →{" "}
                          <span className="font-medium">
                            {flight.arrivalAirport}
                          </span>
                        </td>
                        {/* <td className="p-3">{flight.arrivalAirport}</td> */}
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
                              flight.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : flight.status === "Delayed"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {flight.status}
                          </span>
                        </td>
                        <td className="p-3 text-right text-gray-700">
                          {typeof flight.basePrice === "number"
                            ? flight.basePrice.toLocaleString("vi-VN") + " VND"
                            : flight.basePrice ?? "N/A"}
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {flight.soldTickets ?? "?"}/
                          {flight.totalTickets ??
                            flight.airCraft?.capacity ??
                            "?"}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleViewDetails(flight)}
                            className="mr-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors p-1"
                            title="View Details"
                            aria-label={`View details for flight ${flight.flightNumber}`}
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(flight)}
                            className="text-red-600 hover:text-red-800 cursor-pointer transition-colors p-1"
                            title="Delete Flight"
                            aria-label={`Delete flight ${flight.flightNumber}`}
                            disabled={
                              isDeleting && selectedFlight?.id === flight.id
                            } // Disable only the one being deleted
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFlight && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete flight{" "}
              <strong className="text-gray-900">
                {selectedFlight.flightNumber}
              </strong>{" "}
              from{" "}
              <strong className="text-gray-900">
                {selectedFlight.departureAirport}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-900">
                {selectedFlight.arrivalAirport}
              </strong>
              ?
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Flight Details Modal */}
      {showModal && selectedFlight && (
        <FlightModal flight={selectedFlight} onClose={closeModal} />
      )}
    </div>
  );
};

export default FlightAdmin;
