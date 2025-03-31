import axios from "axios";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import avatarAir from "../assets/images/avatarAir.svg";
import picture2 from "../assets/images/image-1.png";
import picture3 from "../assets/images/image-2.png";
import picture1 from "../assets/images/image.png";
import place1 from "../assets/images/place1.png";
import place2 from "../assets/images/place2.png";
import place3 from "../assets/images/place3.png";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Button from "../components/Button/Button";
import Cart from "../components/Cart/Cart";
import SearchFlight from "../components/SearchFlight/SearchFlight";
import { resetFlight, updateFlight } from "../store/tripSlice";

const FlightMap = ({ from, to }) => {
  const [coordinates, setCoordinates] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:8080/airports/vietnam")
      .then((response) => {
        if (response.data.code == "1000" && response.data.result) {
          setCoordinates(
            response.data.result.reduce((acc, airport) => {
              acc[airport.maIATA] = [airport.viDo, airport.kinhDo];
              return acc;
            }, {})
          );
        }
      })
      .catch((error) => console.error("Lỗi khi tải danh sách sân bay:", error));
  }, []);

  // const coordinates = {
  //   NRT: [35.68, 139.76], // Tokyo Narita Airport
  //   SFO: [37.62, -122.38], // San Francisco Airport
  //   JFK: [40.64, -73.78], // New York JFK
  //   LHR: [51.47, -0.45], // London Heathrow
  //   SGN: [10.82, 106.66], // Tân Sơn Nhất Airport (Vietnam)
  //   HAN: [21.22, 105.8], // Nội Bài Airport (Vietnam)
  // };

  // Trạng thái vị trí máy bay
  const [planePosition, setPlanePosition] = useState(null);
  const [bearing, setBearing] = useState(0);
  const stepRef = useRef(0); // Dùng useRef để giữ step mà không trigger re-render
  const hasFitted = useRef(false); // Biến kiểm tra đã fit chưa

  useEffect(() => {
    if (!coordinates[from] || !coordinates[to]) return; // Tránh lỗi nếu chưa có dữ liệu
    setPlanePosition(coordinates[from]);

    const start = coordinates[from];
    const end = coordinates[to];
    setBearing(getRotationAngle(start, end));

    const steps = 100;
    stepRef.current = 0;

    const interval = setInterval(() => {
      if (stepRef.current >= steps) {
        stepRef.current = 0;
        setPlanePosition(start);
      } else {
        const lat = start[0] + ((end[0] - start[0]) * stepRef.current) / steps;
        const lon = start[1] + ((end[1] - start[1]) * stepRef.current) / steps;
        setPlanePosition([lat, lon]);
        stepRef.current += 1;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [from, to, coordinates]); // Thêm coordinates vào dependency để chạy lại khi dữ liệu được fetch

  const getRotationAngle = (to, from) => {
    const dy = to[1] - from[1];
    const dx = to[0] - from[0];
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI; // Sửa lại từ 1800 thành 180
    return angle + 130; // Cộng thêm 90 độ để phù hợp với icon máy bay
  };

  // Icon máy bay (xoay theo hướng bay)
  const planeIcon = L.divIcon({
    className: "custom-plane-icon",
    html: `<div style="
      font-size: 24px;
      color: red;
      transform: rotate(${bearing}deg);
    ">✈️</div>`, // Sử dụng emoji hoặc có thể thay đổi bằng HTML/CSS
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const FitBounds = ({ from, to }) => {
    const map = useMap();

    useEffect(() => {
      if (!hasFitted.current) {
        // Chỉ fit lần đầu tiên
        const bounds = [coordinates[from], coordinates[to]];
        map.fitBounds(bounds, { padding: [50, 50] });
        hasFitted.current = true;
      }
    }, [from, to]); // Chỉ chạy khi đổi điểm đến

    return null;
  };

  if (!coordinates[from] || !coordinates[to]) {
    return <p className="text-center text-red-500">Invalid airport codes</p>;
  }

  const center = [
    (coordinates[from][0] + coordinates[to][0]) / 2, // vĩ độ (latitude)
    (coordinates[from][1] + coordinates[to][1]) / 2, // kinh độ (longitude)
  ];

  return (
    <div className="w-full flex justify-center items-center mt-30">
      <p>
        {from} và {to}
      </p>
      <MapContainer
        center={center}
        zoom={5}
        bounds={<FitBounds />}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates[from]}>
          <Popup>Sân bay đi: {from}</Popup>
        </Marker>
        <Marker position={coordinates[to]}>
          <Popup>Sân bay đáp: {to}</Popup>
        </Marker>
        <Polyline
          positions={[coordinates[from], coordinates[to]]}
          color="blue"
        />

        {/* Máy bay di chuyển */}
        <Marker position={planePosition} icon={planeIcon}>
          <Popup>Máy bay đang bay</Popup>
        </Marker>

        <FitBounds from={from} to={to} />
      </MapContainer>
    </div>
  );
};

const CategoryFilters = ({ handleData, flightsData }) => {
  const [sortSelect, setSortSelect] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");

  const handleSortChange = (event) => {
    const sortType = event.target.value;
    setSortSelect(sortType);

    const sortedData = [...filteredFlights].sort((a, b) => {
      if (sortSelect === "price-asc") return a.price - b.price;
      if (sortSelect === "price-desc") return b.price - a.price;
      if (sortSelect === "time-asc") return new Date(a.time) - new Date(b.time);
      if (sortSelect === "time-desc")
        return new Date(b.time) - new Date(a.time);
      return 0;
    });

    handleData(sortedData);
  };

  const handleAirlineChange = (event) => {
    const airline = event.target.value;
    setSelectedAirline(airline);

    const filteredData = airline
      ? flightsData.filter((flight) => flight.airline === airline)
      : flightsData;

    handleData(filteredData);
  };

  return (
    <div className="mt-5 ">
      <select
        onChange={handleSortChange}
        value={sortSelect}
        className="rounded-lg  me-5 cursor-pointer border border-gray-400 text-sm p-2.5 focus:rounded-sm focus:ring-1 transition-colors"
      >
        <option value="">Sort by...</option>
        <option value="price-asc">Sort by Price: Low to High</option>
        <option value="price-desc">Sort by Price: High to Low</option>
        <option value="time-asc">Sort by Time: Earliest First</option>
        <option value="time-desc">Sort by Time: Latest First</option>
      </select>

      <select
        onChange={handleAirlineChange}
        value={selectedAirline}
        className="rounded-lg cursor-pointer border border-gray-400 text-sm p-2.5 focus:rounded-sm focus:ring-1 transition-colors"
      >
        <option value="">Filter by Airline...</option>
        {[...new Set(flightsData.map((flight) => flight.airline))].map(
          (airline, index) => (
            <option key={`${airline}-${index}`} value={airline}>
              {airline}
            </option>
          )
        )}
      </select>
    </div>
  );
};

const FlightItem = ({ flight, isLast, onSelect }) => {
  const getFlightDuration = (departureTime, arrivalTime) => {
    const depTime = new Date(departureTime);
    const arrTime = new Date(arrivalTime);

    const diffMs = arrTime - depTime; // Chênh lệch tính theo milliseconds
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Chuyển đổi sang phút
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`; // Định dạng hh:mm
  };

  // const formatTimeRange = (departureTime, arrivalTime) => {
  //   const depTime = new Date(departureTime);
  //   const arrTime = new Date(arrivalTime);

  //   return `${formatTime(depTime)} - ${formatTime(arrTime)}`;
  // };
  const formatTime = (date) => {
    date = new Date(date);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div
      onClick={onSelect}
      className={`flex py-5 cursor-pointer hover:bg-[#f6f6fe] active:opacity-70 mx-5 px-3 ${
        !isLast ? "border-b border-gray-300" : ""
      }`}
    >
      <img src={avatarAir} alt={flight.airline} />
      <div className="flex-1 flex px-4 justify-between">
        <div className="flex-1">
          <p className="text-gray-500">
            {getFlightDuration(flight.departureTime, flight.arrivalTime)}
          </p>
          <p className="font-semibold text-sm">
            {flight.airCraft.airline.name}
          </p>
        </div>

        <div className="flex-1 text-start">
          <p className="font-semibold">
            {formatTime(flight.departureTime)} -{" "}
            {formatTime(flight.arrivalTime)}
          </p>
          <p>
            {flight.departureAirport} - {flight.arrivalAirport}
          </p>
        </div>

        {/* <div className="flex-1 text-end">
          <p>{flight.arrivalAirport}</p>
          <p>{flight.arrivalTime}</p>
        </div> */}

        <div className="flex-1 text-center">
          <p>Bay thẳng</p>
        </div>

        <div className="flex-1 text-end">
          <p className="text-lg font-semibold">{flight?.basePrice.toLocaleString("vi-VN")} VND</p>
        </div>
      </div>
    </div>
  );
};

const Places = () => {
  const listPlace = [
    {
      location: "Hotel Kaneyamaen and Bessho SASA",
      price: "",
      picture: place1,
      description:
        "Located at the base of Mount Fuji, Hotel Kaneyamaen is a traitional japanese ryokan with a modern twist. Enjoy a private onsen bath and a private multi-course kaiseki dinner.",
      colSpan: "",
    },
    {
      location: "HOTEL THE FLAG 大阪市",
      price: "",
      picture: place2,
      description:
        "Make a stop in Osaka and stay at HOTEL THE FLAG, just a few minutes walk to experience the food culture surrounding Dontonbori. Just one minute away is the Shinsaibashi shopping street.",
      colSpan: "",
    },
    {
      location: "9 Hours Shinjuku",
      price: "$633",
      picture: place3,
      description:
        "Experience a truly unique stay in an authentic Japanese capsule hotel. 9 Hours Shinjuku is minutes from one of Japan’s busiest train stations. Just take the NEX train from Narita airport!",
      colSpan: "",
    },
  ];

  return (
    <div className="pt-20">
      <p className="text-2xl font-bold text-[#6e7491] mb-6">
        Find <span className="text-[#605dec]">places to stay</span> in Japan
      </p>
      <div className="grid grid-cols-3 gap-10">
        <Cart cart={listPlace} />
      </div>
    </div>
  );
};

const Travels = () => {
  const listTravel = [
    {
      location: "The Bund, Shanghai",
      price: "$598",
      picture: picture1,
      description: "China’s most international city",
      colSpan: "",
    },
    {
      location: "Sydney Opera House, Sydney",
      price: "$981",
      picture: picture2,
      description: "Take a stroll along the famous harbor",
      colSpan: "",
    },
    {
      location: "Kōdaiji Temple, Kyoto",
      price: "$633",
      picture: picture3,
      description: "Step back in time in the Gion district",
      colSpan: "",
    },
  ];

  return (
    <div className="pt-20">
      <p className="text-2xl font-bold text-[#6e7491] mb-6">
        Find <span className="text-[#605dec]">places to stay</span> in Japan
      </p>
      <div className="grid grid-cols-3 gap-10">
        <Cart cart={listTravel} />
      </div>
    </div>
  );
};

const Flight = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("departFrom") || "";
  const to = searchParams.get("returnFrom") || "";
  const departDateString = searchParams.get("departDate") || "";
  const returnDateString = searchParams.get("returnDate") || "";
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedFlight2, setSelectedFlight2] = useState(null);
  const flight = useSelector((state) => state.trip.flight);

  const [isSecond, setIsSecond] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          "http://localhost:8080/flight/search",
          {
            departureAirport: from,
            arrivalAirport: to,
            departureDate: departDateString,
          }
        );

        setFilteredFlights(response.data.result);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    if (from && to && departDateString) {
      fetchFlights();
    }
  }, [from, to, departDateString]); // Thêm dependency để gọi lại API khi thay đổi
  // Chuyển đổi thành Date (nếu hợp lệ)
  const [departDate, setDepartDate] = useState(
    departDateString ? new Date(departDateString) : null
  );
  const [returnDate, setReturnDate] = useState(
    returnDateString && returnDateString !== "undefined"
      ? new Date(returnDateString)
      : null
  );

  const filteredFlightsHandle = (data) => {
    setFilteredFlights(data);
  };

  const handleSelectFlight = (flightLocal) => {
    if (!isSecond) {
      setSelectedFlight(flightLocal);
    } else if (flight.isRoundTrip && isSecond) {
      setSelectedFlight2(flightLocal);
    }
  };

  useEffect(() => {
    return () => {
      const keepDataPages = ["/passenger-infor", "/flight"]; // Trang muốn giữ dữ liệu
      if (!keepDataPages.includes(location.pathname)) {
        dispatch(resetFlight()); // Xóa Redux khi rời khỏi các trang không trong danh sách
        console.log("resetFlight");
      }
    };
  }, [location.pathname, dispatch]);

  const handleContinue = () => {
    if (!selectedFlight && !selectedFlight2) {
      alert("Quý khách chưa chọn vé!");

      return;
    }

    if (!flight.isRoundTrip && selectedFlight) {
      // dispatch(updateFlight(selectedFlight));
      dispatch(
        updateFlight({
          departFlight: selectedFlight,
        })
      );
      console.log("cập nhật flight");
      navigate("/passenger-infor");
      return;
    }

    if (flight.isRoundTrip) {
      if (!isSecond) {
        dispatch(
          updateFlight({
            departFlight: selectedFlight,
          })
        );
        setIsSecond(true); // Chuyển sang trạng thái chặng 2
      } else if (selectedFlight2) {
        dispatch(
          updateFlight({
            returnFlight: selectedFlight2,
          })
        );
        navigate("/passenger-infor");
      } else {
        alert("Quý khách chưa chọn vé khứ hồi!");
      }
    }
  };

  return (
    <div className="">
      <div className="p-4">
        <SearchFlight
          defaultFrom={from}
          defaultTo={to}
          defaultDepartDate={departDate}
          defaultReturnDate={returnDate}
        />
        <CategoryFilters
          handleData={filteredFlightsHandle}
          flightsData={filteredFlights}
        />
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-2 mt-5"></div>
        <div className=""></div>
      </div>
      <div className="grid grid-cols-3 gap-x-10 mt-12">
        <div className="col-span-2">
          <p className="text-[#6e7491] font-medium">
            Choose a <span className="text-[#605dec] ">departing</span> flight
          </p>

          {error && (
            <div className="text-center p-5 text-red-500 bg-red-100 border border-red-400 rounded-md">
              Lỗi: {error}
            </div>
          )}

          {loading ? (
            <div className="text-center p-5 text-gray-600">
              Đang tải dữ liệu chuyến bay...
            </div>
          ) : (
            <div className="mt-5 h-[500px] border border-gray-300 rounded-2xl overflow-auto">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => (
                  <FlightItem
                    key={flight.id}
                    flight={flight}
                    isLast={index === filteredFlights.length - 1}
                    onSelect={() => handleSelectFlight(flight)}
                  />
                ))
              ) : (
                <div className="text-center p-5 text-gray-600">
                  Không tìm thấy chuyến bay nào.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="">
          <p className="text-[#6e7491] font-medium">
            Booking <span className="text-[#605dec] ">information</span>
          </p>
          <BookingInfo
            flightFrom={selectedFlight}
            flightTo={selectedFlight2}
            isRoundTrip={flight.isRoundTrip}
            luggage={null}
          />
        </div>
      </div>
      {from && to && <FlightMap from={from} to={to} />}

      <Places />
      <Travels />

      <div className="py-[11px] fixed bottom-0 left-0 right-0 px-15 bg-white border-1 w-full z-[8888] flex justify-end pe-50">
        <div className="pe-50">
          <p className="font-semibold">Tổng tiền</p>
          <p className="font-semibold italic text-2xl">
            {(
              (selectedFlight?.basePrice || 0) +
              (selectedFlight2?.basePrice || 0) +
              Number(0)
            ).toLocaleString("vi-VN")}{" "}
            VND
          </p>
        </div>
        <Button onClick={handleContinue} text={"Đi tiếp"} />
      </div>
    </div>
  );
};

export default Flight;
