import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import bagImg from "../assets/images/Luggage.svg";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Button from "../components/Button/Button";
import InputLable from "../components/Input/InputLable";
import { resetFlights } from "../store/tripSlice";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FormInfor = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthday,
  setBirthday,
  email,
  setEmail,
  CCCD,
  setCCCD,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <form className="mt-5">
      <div className="grid grid-cols-2 gap-10">
        <InputLable
          lable={"First Name"}
          type={"text"}
          id={"firstName"}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <InputLable
          lable={"Last Name"}
          type={"text"}
          id={"lastName"}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <div
          className="w-full max-w-sm min-w-[200px] relative"
          onClick={() => document.getElementById("datePicker").showPicker()} // Kích hoạt lịch
        >
          <input
            id="datePicker"
            type="date"
            value={birthday}
            placeholder=" "
            onChange={(e) => setBirthday(e.target.value)}
            className="cursor-pointer peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          />
          <label
            htmlFor="datePicker"
            className={`absolute cursor-text bg-white px-1 left-2.5 text-slate-400 text-sm transition-all transform origin-left
            -top-3 scale-90
            peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 
            peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}
          >
            birthday
          </label>
        </div>

        <InputLable
          lable="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputLable
          lable="Căn cước công dân"
          type="number"
          id="CCCD"
          value={CCCD}
          onChange={(e) => setCCCD(e.target.value)}
        />

        <InputLable
          lable="Phone Number"
          type="tel"
          id="Phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
    </form>
  );
};

const PassengerInfor = () => {
  const [bag, setBag] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const selectedFlight1 = useSelector((state) => state.trip.departFlight);
  const selectedFlight2 = useSelector((state) => state.trip.returnFlight);
  const isRoundTrip = useSelector((state) => state.trip.isRoundTrip);
  const [userInfo, setUserInfo] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      const keepDataPages = ["/passenger-infor", "/flight"]; // Trang muốn giữ dữ liệu
      if (!keepDataPages.includes(location.pathname)) {
        dispatch(resetFlights()); // Xóa Redux khi rời khỏi các trang không trong danh sách
      }
    };
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (userInfo) {
      const formattedBirthday = userInfo.birthday
        ? `${userInfo.birthday[0]}-${String(userInfo.birthday[1]).padStart(
            2,
            "0"
          )}-${String(userInfo.birthday[2]).padStart(2, "0")}`
        : "";
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setBirthday(formattedBirthday);
      setEmail(userInfo.email);
      setCCCD(userInfo.cccd);
      setPhoneNumber(userInfo.phone);
    }
  }, [userInfo]);

  const handleNext = () => {
    if (
      !firstName ||
      !lastName ||
      !birthday ||
      !email ||
      !CCCD ||
      !phoneNumber
    ) {
      alert("Vui lòng nhập đầy đủ thông tin hành khách!");
      return;
    }
    navigate("/seat-map");
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.get("http://localhost:8080/user/getMyInfo", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        setUserInfo(response.data.result);

        alert("tự động điền thông tin thành công!");
      } else {
        alert("Không thể lấy thông tin tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      alert("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-x-10">
      <div className="col-span-2 mt-5">
        <h2 className="text-[#605dec] font-semibold text-[20px] mb-3">
          Passenger information
        </h2>
        <p className="text-gray-500">
          Enter the required information for each traveler and be sure that it
          exactly matches <br /> the government-issued ID presented at the
          airport.
        </p>
        <div className="flex items-center mt-10">
          <p className="text-gray-700 text-[18px] pe-5">Passenger 1 (Adult)</p>
          <Button
            text={"Lấy thông tin tài khoản của bạn"}
            onClick={fetchUserInfo}
          />
        </div>
        <FormInfor
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          birthday={birthday}
          setBirthday={setBirthday}
          email={email}
          setEmail={setEmail}
          CCCD={CCCD}
          setCCCD={setCCCD}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />

        <h2 className="text-[#605dec] font-semibold text-[20px] mt-20">
          Bag information
        </h2>

        <p className="text-gray-500 mt-3">
          Each passenger is allowed one free carry-on bag and one personal item.
          First checked bag for each passenger <br /> is also free. Second bag
          check fees are waived for loyalty program members. See the full bag
          policy.
        </p>

        <select
          className="mt-7 max-w-[500px] cursor-pointer border border-gray-300 text-sm block w-full p-2.5 
          dark:border-gray-600 transition-colors
           font-bold bg-[#605dec] text-white rounded-lg focus:rounded-lg
          "
          value={bag}
          onChange={(e) => setBag(e.target.value)}
        >
          <option
            className="text-gray-900 bg-white"
            value="7x"
            defaultValue={""}
          >
            7kg xách tay (0 VND)
          </option>
          <option className="text-gray-900 bg-white" value="7x21kg">
            7kg xách tay và 21kg kí gửi (200,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="12x21kg">
            12kg xách tay và 21kg kí gửi (230,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="7x30kg">
            7kg xách tay và 30kg kí gửi (300,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="15x30kg">
            15kg xách tay và 30kg kí gửi (350,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="15x50kg">
            15kg xách tay và 50kg kí gửi (500,000 VND)
          </option>
        </select>
      </div>

      <div className="">
        <BookingInfo
          button={"Chọn Ghế"}
          flight={selectedFlight1}
          flight2={selectedFlight2}
          isRoundTrip={isRoundTrip}
          luggage={null}
        />
        <img className="pt-20" src={bagImg} alt="Luggage" />
      </div>

      <div className="py-[11px] fixed bottom-0 left-0 right-0 px-15 bg-white border-1 w-full z-8888 flex justify-end pe-50">
        <div className="pe-50">
          <p className="font-semibold">Tổng tiền</p>
          <p className="font-semibold italic text-2xl">2,322,200 VND</p>
        </div>
        <Button text={"Đi tiếp"} onClick={handleNext} />
      </div>
    </div>
  );
};

export default PassengerInfor;
