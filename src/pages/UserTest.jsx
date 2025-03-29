import React, { useState, useContext, createContext, useEffect } from "react";
import { FiEye, FiEyeOff, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { format } from "date-fns";

const UserContext = createContext();

const initialUser = {
  email: "thang1@gmail.com",
  firstName: "Võ Quang",
  lastName: "Thắng",
  phone: "0399728845",
  cccd: "044204000525",
  birthday: "2004-02-03",
  profileImage:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
};

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([initialUser]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {currentPage === "login" && (
            <LoginPage setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "register" && (
            <RegisterPage setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "profile" && (
            <ProfilePage setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "deposit" && (
            <DepositPage setCurrentPage={setCurrentPage} />
          )}
        </div>
      </div>
    </UserProvider>
  );
};



const ProfilePage = ({ setCurrentPage }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(currentUser);

  const handleSave = () => {
    setCurrentUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-8">
          <div className="text-center">
            <img
              src={currentUser?.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentUser?.email}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <FiEdit2 className="mr-2" />
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
            <button
              onClick={() => setCurrentPage("deposit")}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Deposit Money
            </button>
          </div>
        </div>
        <div className="md:w-2/3 p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Profile Information
          </h3>
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={editedUser.firstName}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={editedUser.lastName}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={editedUser.phone}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {currentUser?.email}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Phone
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {currentUser?.phone}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Citizen ID
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {currentUser?.cccd}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Birthday
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {format(new Date(currentUser?.birthday), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DepositPage = ({ setCurrentPage }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactions] = useState([
    {
      id: 1,
      date: "2024-01-20",
      amount: 1000,
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-19",
      amount: 500,
      status: "completed",
    },
  ]);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (amount && method) {
      setShowConfirmation(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Deposit Money
        </h2>
        <form onSubmit={handleDeposit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="bank">Bank Transfer</option>
              <option value="card">Credit Card</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Deposit
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="text-gray-800 dark:text-white">
                  ${transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(transaction.date), "MMMM dd, yyyy")}
                </p>
              </div>
              <span className="px-3 py-1 text-sm text-white bg-green-500 rounded-full">
                {transaction.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Deposit
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to deposit ${amount} via {method}?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentPage("profile");
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
