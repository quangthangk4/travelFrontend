import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bagImg from "../assets/images/Luggage.svg";
import { getAuthWithExpiry } from "../auth/manageToken";
import axiosInstance from "../components/Api/axiosClient";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Button from "../components/Button/Button";
import InputLable from "../components/Input/InputLable";
import { updateFlight } from "../store/tripSlice";

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
  const [luggage, setLuggage] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const flight = useSelector((state) => state.trip.flight);
  const [userInfo, setUserInfo] = useState(null);
  const [isSecond, setIsSecond] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const TARGET_PATH = "/passenger-infor";

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

  const handleReloadOnPath = () => {
    dispatch(
      updateFlight({
        luggageArrival: 0,
        luggageReturn: 0,
      })
    );
  };

  useEffect(() => {
    // Hàm kiểm tra và thực thi
    const checkAndRunOnReload = () => {
      if (window.performance && performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (
          navigationEntries.length > 0 &&
          navigationEntries[0].type === "reload"
        ) {
          if (window.location.pathname === TARGET_PATH) {
            handleReloadOnPath(); // Gọi hàm xử lý của bạn
          }
        }
      } else {
        console.warn("Performance Navigation Timing API not supported.");
      }
    };

    // Chạy kiểm tra khi component được mount
    checkAndRunOnReload();

    // Không cần cleanup listener ở đây vì chúng ta chỉ kiểm tra một lần khi tải trang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TARGET_PATH]);

  const handleNext = () => {
    if (
      !firstName ||
      !lastName ||
      !birthday ||
      !email ||
      !CCCD ||
      !phoneNumber
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin hành khách!");
      return;
    }

    // bay 1 chiều
    if (!flight.isRoundTrip) {
      dispatch(
        updateFlight({
          luggageArrival: luggage,
        })
      );
      navigate("/seat-map");
      return;
    } else {
      // bay 2 chiều, nhưng vé chuyến đi
      if (!isSecond) {
        dispatch(
          updateFlight({
            luggageArrival: luggage,
          })
        );
        setLuggage(0);
        setIsSecond(true); // Chuyển sang trạng thái chặng 2
        toast.success("Lưu thông tin chuyến đi thành công!");
        toast.info("Vui lòng chọn tiếp thông tin chuyến khứ hồi!");
      } else {
        dispatch(
          updateFlight({
            luggageReturn: luggage,
          })
        );
        navigate("/seat-map");
      }
    }
  };

  // Hàm kiểm tra và thực thi

  const fetchUserInfo = async () => {
    try {
      const token = getAuthWithExpiry("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axiosInstance.get(
        "http://localhost:8080/user/getMyInfo",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 1000) {
        setUserInfo(response.data.result);

        toast.success("lấy thông tin đăng nhập thành công!");
      } else {
        toast.error("Không thể lấy thông tin tài khoản!");
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
          value={luggage}
          onChange={(e) => setLuggage(e.target.value)}
        >
          <option
            className="text-gray-900 bg-white"
            value="0"
            selected
          >
            7kg xách tay (0 VND)
          </option>
          <option className="text-gray-900 bg-white" value="200000">
            7kg xách tay và 21kg kí gửi (200,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="230000">
            12kg xách tay và 21kg kí gửi (230,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="300000">
            7kg xách tay và 30kg kí gửi (300,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="350000">
            15kg xách tay và 30kg kí gửi (350,000 VND)
          </option>
          <option className="text-gray-900 bg-white" value="500000">
            15kg xách tay và 50kg kí gửi (500,000 VND)
          </option>
        </select>
      </div>

      <div className="">
        <BookingInfo
          flightFrom={flight.departFlight}
          flightTo={flight.returnFlight}
          isRoundTrip={flight.isRoundTrip}
          luggage={luggage}
          level={null}
          isSecond={isSecond}
        />
        <img className="pt-20" src={bagImg} alt="Luggage" />
      </div>

      <div className="py-[11px] fixed bottom-0 left-0 right-0 px-15 bg-white border-1 w-full z-8888 flex justify-end pe-50">
        <div className="pe-50">
          <p className="font-semibold">Tổng tiền</p>
          <p className="font-semibold italic text-2xl">
            {(
              (flight.departFlight?.basePrice || 0) +
              (flight.returnFlight?.basePrice || 0) +
              Number(luggage) +
              Number(flight.luggageArrival)
            ).toLocaleString("vi-VN")}{" "}
            VND
          </p>
        </div>
        <Button text={"Đi tiếp"} onClick={handleNext} />
      </div>
    </div>
  );
};

export default PassengerInfor;
