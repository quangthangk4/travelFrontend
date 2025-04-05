import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { getAuthWithExpiry } from "../../auth/manageToken";
import axiosInstance from "../../components/Api/axiosClient";

const Airline = () => {
  const token = getAuthWithExpiry("token"); // Lấy token từ localStorage

  const [airlines, setAirlines] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    foundedYear: "",
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAirlines = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/airline/getAllAirline`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAirlines(response.data.result);
    } catch (error) {
      toast.error("Error fetching get airline data");
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // create airlines
      const response = await axiosInstance.post(
        `${API_BASE_URL}/airline/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newAirlines = {
        ...formData,
      };

      setAirlines((prev) => [...prev, newAirlines]);
      setFormData({ name: "", description: "", country: "", foundedYear: "" });
      toast.success("tạo airline thành công!");
      fetchAirlines();
    } catch (error) {
      toast.error(
        "Lỗi khi tạo hãng: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/airline/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAirlines((prev) => prev.filter((airline) => airline.id !== id));
      setShowDeleteModal(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error deleting airline: " + error.response.data.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAirline = useMemo(() => {
    return airlines.filter((airline) =>
      Object.values(airline).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [airlines, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Airline Management
        </h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Airline</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {Object.keys(formData).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className={`rounded-md border ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={`Enter ${
                    field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")
                  }`}
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create Aircraft"}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Airline List</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search aircraft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Name",
                    "Description",
                    "Country",
                    "Founded Year",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAirline.map((airline, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {airline.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {airline.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {airline.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {airline.foundedYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedAirline(airline);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAirline.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No airline found
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete {selectedAirline?.name}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedAirline?.id)}
                  disabled={isLoading}
                  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airline;
