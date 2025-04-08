import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthWithExpiry } from "../auth/manageToken";
import axiosInstance from "../components/Api/axiosClient";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const token = getAuthWithExpiry("token");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [recentDeposits, setRecentDeposits] = useState([
    
  ]);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/user/getMyInfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const quickAmounts = [100000, 500000, 1000000];

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const validateForm = () => {
    if (!amount || parseInt(amount) < 10000) {
      toast.error("Minimum deposit amount is 1,000");
      return false;
    }
    if (parseInt(amount) > 1000000000) {
      toast.error("Maximum deposit amount is 1,000,000,000");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/user/deposit/${amount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Deposit successful!");
      setAmount("");
      // Update recent deposits
      setRecentDeposits([
        {
          id: Date.now(),
          amount: parseInt(amount),
          date: new Date().toISOString().split("T")[0],
          status: "success",
        },
        ...recentDeposits.slice(0, 2),
      ]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Deposit failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Deposit Money
          </h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Current Balance</p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(userData.accountBalance)} VND
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Deposit Amount
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="amount"
                  value={amount ? formatNumber(amount) : ""}
                  onChange={handleAmountChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter deposit amount"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  {formatNumber(quickAmount)}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Nạp Tiền"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Deposits
          </h3>
          <div className="space-y-4">
            {recentDeposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(deposit.amount)} VND
                  </p>
                  <p className="text-sm text-gray-500">{deposit.date}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  {deposit.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
