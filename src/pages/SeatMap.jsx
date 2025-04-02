import React, { useEffect, useState } from "react";
import { FaPlane } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plane from "../assets/images/plane.png";
import {
  confirmPayment,
  getSeatAvailable,
  holdSeat,
  releaseSeat,
  seatClassesFunc,
} from "../components/Api/Bookticket";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Button from "../components/Button/Button";
import { updateFlight } from "../store/tripSlice";
import { set } from "date-fns";

const SeatMap = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [seatLevelPrice, setSeatLevelPrice] = useState(0);
  const [seatClasses, setSeatClasses] = useState(null);
  const flight = useSelector((state) => state.trip.flight);
  const windowSeat = 50000;
  const [isSecond, setIsSecond] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const TARGET_PATH = "/seat-map";

  const NearByWindowSeat = (seat) => {
    if (seat === null) return 0;
    const windowSeats = ["A", "F"];
    if (windowSeats.includes(seat.charAt(seat.length - 1))) {
      return windowSeat;
    } else {
      return 0; // It's not a window seat
    }
  };

  const location = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const handleUnload = () => {
      if (selectedSeat && location.pathname === "/seat-map") {
        releaseSeat(flight.departFlight.id, selectedSeat);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [location.pathname]);

  const handleReloadOnPath = () => {
    dispatch(
      updateFlight({
        seatPriceArrival: 0,
        seatPriceReturn: 0,
        seatNumberArrival: "",
        seatNumberReturn: "",
      })
    );
    setSeatLevelPrice(0);
    setIsSecond(false);
    setSelectedSeat(null);
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
          handleReloadOnPath(); // Gọi hàm xử lý của bạn
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

  useEffect(() => {
    fetchOccupiedSeats();
  }, [isSecond]);

  const handleBookedTicket = () => {
    // vé 1 chiều
    if (!flight.isRoundTrip) {
      dispatch(
        updateFlight({
          seatPriceArrival:
            Number(seatLevelPrice) + Number(NearByWindowSeat(selectedSeat)),
          seatNumberArrival: selectedSeat,
        })
      );
      confirmPayment(flight, navigate);
      return;
    } else {
      // vé khứ hồi, nhưng thông tin vé đi
      if (!isSecond) {
        dispatch(
          updateFlight({
            seatPriceArrival:
              Number(seatLevelPrice) + Number(NearByWindowSeat(selectedSeat)),
            seatNumberArrival: selectedSeat,
          })
        );
        setSeatLevelPrice(0);
        setSelectedSeat(null);
        setIsSecond(true); // Chuyển sang trạng thái chặng 2
        toast.success("Lưu thông tin ghế ngồi chuyến đi thành công!");
        toast.info("Vui lòng chọn ghế chuyến về!");
      } else {
        dispatch(
          updateFlight({
            seatPriceReturn:
              Number(seatLevelPrice) + Number(NearByWindowSeat(selectedSeat)),
            seatNumberReturn: selectedSeat,
          })
        );

        const newFlight = { ...flight, seatNumberReturn: selectedSeat };

        confirmPayment(newFlight, navigate);
      }
    }
  };

  const fetchOccupiedSeats = async () => {
    let occupied;
    let classes;
    if (!isSecond) {
      occupied = await getSeatAvailable(flight.departFlight);
      classes = seatClassesFunc(flight.departFlight.totalTickets);
    } else {
      occupied = await getSeatAvailable(flight.returnFlight);
      classes = seatClassesFunc(flight.returnFlight.totalTickets); // Lấy thông tin hạng ghế
    }
    setOccupiedSeats(occupied);
    setSeatClasses(classes);
  };

  const isWindow = (seat) => {
    if (!seat) return false;
    return !!(NearByWindowSeat(seat) !== 0);
  };

  const handleSeatSelect = async (seat, classType) => {
    // If the user selects the same seat again, release the seat
    if (selectedSeat === seat) {
      try {
        // Release the selected seat
        isSecond
          ? await releaseSeat(flight.returnFlight.id, selectedSeat)
          : await releaseSeat(flight.departFlight.id, selectedSeat);
        setSelectedSeat(null); // Reset selected seat when the user unselects it
        setSeatLevelPrice(0); // Set total price)
      } catch (error) {
        console.error("Error releasing seat:", error);
        toast.error("Có lỗi khi hủy giữ ghế. Vui lòng thử lại!");
      }
    } else {
      if (selectedSeat) {
        try {
          // If there's a selected seat, release the old one before holding the new one
          isSecond
            ? await releaseSeat(flight.returnFlight.id, selectedSeat)
            : await releaseSeat(flight.departFlight.id, selectedSeat);
        } catch (error) {
          console.error("Error releasing seat:", error);
          toast.error("Có lỗi khi hủy giữ ghế. Vui lòng thử lại!");
          return; // If error occurs during release, stop further action
        }
      }
      setSeatLevelPrice(classType.price);

      try {
        // Hold the new selected seat
        isSecond
          ? await holdSeat(flight.returnFlight.id, seat)
          : await holdSeat(flight.departFlight.id, seat);
        setSelectedSeat(seat); // Update the selected seat
      } catch (error) {
        console.error("Error holding seat:", error);
        toast.error("Ghế đã có người giữ hoặc có lỗi xảy ra!");
      }
    }
  };

  const getSeatStatus = (seatId, classType) => {
    if (occupiedSeats.some((seat) => seat === seatId)) {
      return "bg-gray-400 cursor-not-allowed";
    }
    if (selectedSeat && selectedSeat === seatId) {
      return seatClasses[classType].selectedColor;
    }
    return `${seatClasses[classType].color} ${seatClasses[classType].hoverColor} cursor-pointer`;
  };

  const renderSeats = () => {
    return (
      <div className="relative bg-cover bg-center p-8 rounded-lg mt-[550px]">
        {seatClasses &&
          Object.entries(seatClasses).map(([classType, config]) => (
            <div key={classType} className="mb-8 bg-opacity-70 p-4 rounded-lg">
              <h3 className="text-xl text-center font-semibold mb-4 capitalize">
                {classType} Class: {config.price.toLocaleString("vi-VN")} VNĐ
              </h3>
              <div className="px-[200px]">
                <div className="space-y-3 py-3 rounded-2xl bg-white">
                  {config.rows.map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: config.seatsPerRow }).map(
                          (_, index) => {
                            const seatLetter = String.fromCharCode(65 + index);
                            const seatId = `${row}${seatLetter}`;
                            return (
                              <React.Fragment key={seatId}>
                                {index === config.seatsPerRow / 2 && (
                                  <div className="w-8 text-center z-50">
                                    <span className="text-center">{row}</span>
                                  </div>
                                )}
                                <button
                                  className={`w-10 h-12 rounded-sm flex items-center justify-center transform transition-all duration-200 ${getSeatStatus(
                                    seatId,
                                    classType
                                  )}`}
                                  onClick={() =>
                                    handleSeatSelect(seatId, config)
                                  }
                                  disabled={occupiedSeats.includes(seatId)}
                                >
                                  <span className="text-sm">{seatLetter}</span>
                                </button>
                              </React.Fragment>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <FaPlane className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Select Your Seats
          </h1>
          <p className="mt-2 text-gray-600">
            Total Capacity: {flight?.departFlight.totalTickets} Seats
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-x-hidden overflow-y-scroll max-h-[800px] relative">
            <img
              src={plane}
              alt="plane"
              className="absolute object-cover scale-[470%] scale top-[1530px]"
            />
            <div className="">{renderSeats()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Selected Seats</h2>
            <div className="flex justify-center mb-3">
              <div className="flex space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-400 rounded" />
                  <span>Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between font-semibold px-3">
              <p>Giá ghế A,F (gần cửa sổ): </p>
              <p>{Number(50000).toLocaleString("vi-VN")} VND </p>
            </div>
            {selectedSeat && selectedSeat.length > 0 ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <MdEventSeat className="text-blue-500" />
                    <span className="font-semibold">
                      Seat {selectedSeat} (
                      {Object.entries(seatClasses).find(([name, classType]) =>
                        classType.rows.includes(
                          Number(selectedSeat.slice(0, -1))
                        )
                      )?.[0] || "Không xác định"}
                      )
                    </span>
                  </div>
                  <span className="font-semibold">
                    {/* lấy giá tiền */}
                    {Object.values(seatClasses)
                      .find((classType) =>
                        classType.rows.includes(
                          Number(selectedSeat.slice(0, -1))
                        )
                      )
                      .price.toLocaleString("vi-VN")}{" "}
                    VND
                  </span>
                </div>
                {NearByWindowSeat(selectedSeat) !== 0 && (
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="flex justify-between space-x-2">
                      <p>Ghế A,F (cạnh cửa sổ): </p>
                      <p className="font-bold italic">
                        {windowSeat.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No seats selected</p>
            )}
            <BookingInfo
              flightFrom={flight.departFlight}
              flightTo={flight.returnFlight}
              isRoundTrip={flight.isRoundTrip}
              luggage={0}
              level={
                Number(seatLevelPrice) + Number(NearByWindowSeat(selectedSeat))
              }
              isSecond={isSecond}
            />
          </div>
        </div>
      </div>
      <div className="py-[11px] fixed bottom-0 left-0 right-0 px-15 bg-white border-1 w-full z-[8888] flex justify-end pe-50">
        <div className="pe-50">
          <p className="font-semibold">Tổng tiền</p>
          <p className="font-semibold italic text-2xl">
            {(
              (flight.departFlight?.basePrice || 0) +
                (flight.returnFlight?.basePrice || 0) +
                Number(flight.luggageArrival) +
                Number(flight.luggageReturn) +
                Number(flight.seatPriceArrival) +
                Number(
                  Number(seatLevelPrice) +
                    Number(NearByWindowSeat(selectedSeat))
                ) || Number(flight.seatPriceReturn)
            ).toLocaleString("vi-VN")}{" "}
            VND
          </p>
        </div>
        <Button
          text={
            flight.isRoundTrip
              ? isSecond
                ? "Thanh toán"
                : "Đi tiếp"
              : "Thanh toán"
          }
          onClick={handleBookedTicket}
        />
      </div>
    </div>
  );
};

export default SeatMap;
