import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlaneArrival, FaPlaneDeparture, FaRegCalendarAlt } from "react-icons/fa";
import WorldMap from '../assets/images/WorldMap.svg';
import picture1 from '../assets/images/image.png';
import picture2 from '../assets/images/image-1.png';
import picture3 from '../assets/images/image-2.png';
import picture4 from '../assets/images/image-3.png';

import picture5 from '../assets/images/image-4.png';
import picture6 from '../assets/images/image-5.png';
import picture7 from '../assets/images/image-6.png';

import avatar from '../assets/images/avatar.svg';
import avatar1 from '../assets/images/avatar-1.svg';
import avatar2 from '../assets/images/avatar-2.svg';
import { FaUser } from "react-icons/fa";

import { FaStar, FaRegStar } from "react-icons/fa";


const CartHomePage = ({ cart }) => {
  return (
    <>
      {
        cart.map((item, index) => {
          return (
            <div className={`${item.colSpan} shadow-lg border border-gray-200 rounded-2xl overflow-hidden`} key={index}>
              <img src={item.picture} alt="location" className='object-cover w-full' />
              <div className='px-6 py-4'>
                <div className="flex mb-1 justify-between text-[#6e7491] text-lg font-semibold">
                  <p>{item.location}</p>
                  <p>{item.price}</p>
                </div>
                <p className='text-[16px] text-[#7c8db0] font-medium'>{item.description}</p>
              </div>
            </div>
          );
        })
      }
    </>
  );
}

const RatingStars = ({ rating, maxStars = 5 }) => {
  const numericRating = parseInt(rating) || 0;
  return (
    <div className="flex">
      {[...Array(maxStars)].map((_, index) => (
        index < numericRating ? (
          <FaStar key={index} className="text-yellow-400 text-xl" />
        ) : (
          <FaRegStar key={index} className="text-gray-400 text-xl" />
        )
      ))}
    </div>
  );
};



const ContentHomePage = () => {
  const pictures1 = [
    { location: "The Bund, Shanghai", price: "$598", picture: picture1, description: "China’s most international city", colSpan: "" },
    { location: "Sydney Opera House, Sydney", price: "$981", picture: picture2, description: "Take a stroll along the famous harbor", colSpan: "" },
    { location: "Kōdaiji Temple, Kyoto", price: "$633", picture: picture3, description: "Step back in time in the Gion district", colSpan: "" },
    { location: "Tsavo East National Park, Kenya", price: "$1,248", picture: picture4, description: "Named after the Tsavo River, and opened in April 1984, Tsavo East National Park is one of the oldest parks in Kenya. It is located in the semi-arid Taru Desert.", colSpan: "col-span-3" },
  ];

  const pictures2 = [
    { location: "Stay among the atolls in Maldives", price: "", picture: picture5, description: "From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages.", colSpan: "" },
    { location: "Experience the Ourika Valley in Morocco", price: "", picture: picture6, description: "Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East.", colSpan: "" },
    { location: "Live traditionally in Mongolia", price: "", picture: picture7, description: "Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel.", colSpan: "" },
  ];

  const ratings = [
    { avatar: avatar, name: "Yifei Chen", location: "Seoul, South Korea", time: "April 2019", star: "5", content: "What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me" },
    { avatar: avatar1, name: "Kaori Yamaguchi", location: "Honolulu, Hawaii", time: "February 2017", star: "4", content: "My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommened to us by a long time friend, and I’m so glad we tried it out! The process was easy and" },
    { avatar: avatar2, name: "Anthony Lewis", location: "Berlin, Germany", time: "April 2019", star: "5", content: "When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I’d give it a try. It was my first time using Tripma, but I’d definitely recommend it to a friend and use it for" },

  ];

  return (
    <div className="">
      <p className='text-2xl font-bold text-[#6e7491] mb-6'>Find your next adventure with these flight deals</p>

      <div className="grid grid-cols-3 gap-10">
        <CartHomePage cart={pictures1} />
      </div>

      <p className='text-2xl font-bold text-[#6e7491] mt-30 mb-6'>Find your next adventure with these flight deals</p>
      <div className="grid grid-cols-3 gap-10">
        <CartHomePage cart={pictures2} />
      </div>

      <div className="flex justify-center mt-15">
        <button className='cursor-pointer h-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
          Explore more stays
        </button>
      </div>

      <div className="rating mt-20">
        <p className='text-[#547db1] text-lg mb-10 font-medium text-[20px] text-center '>What <span className='text-[#4b6cf0]'>Tripma</span> users are saying</p>

        <div className="grid grid-cols-3 gap-10">
          {ratings.map((item, index) => {
            return (
              <div className="flex items-start" key={index}>
                <img src={item.avatar} alt="avatar" className='px-4' />
                <div className="">
                  <div className="text-[#6e7491] mb-2">
                    <p className='font-medium'>{item.name}</p>
                    <p>{item.location} | {item.time}</p>
                  </div>

                  <RatingStars rating={item.star} />

                  <p className='mt-5'>{item.content} <span className='text-[#605dec]'>read more...</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>


  );
}

const HomePage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [departDate, setDepartDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPassengerPopupOpen, setIsPassengerPopupOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [minors, setMinors] = useState(0);
  const inputRef = useRef(null);
  const passengerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsPopupOpen(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(e.target)) {
        setIsPassengerPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    return date instanceof Date ? date.toLocaleDateString("vi-VN") : "";
  };

  return (
    <div className="">
      <div style={{ backgroundImage: `url(${WorldMap})` }} className='bg-no-repeat bg-contain h-screen w-full'>
        <h1 className='text-8xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-center pt-8'>It’s more than <br /> just a trip</h1>

        <div class="flex rounded-lg  mt-30 w-full ">
          <div className="flex flex-1">
            <span class="px-4 bg-gray-200 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 text-sm text-gray-500  dark:border-neutral-700 dark:text-neutral-400">
              <FaPlaneDeparture />
            </span>
            <select id="countries" class="cursor-pointer border border-gray-300 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option className='' disabled selected>From Where?</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>

          </div>


          <div className="flex flex-1">
            <label class="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0 border-gray-200 text-sm text-gray-500  dark:border-neutral-700 dark:text-neutral-400">
              <FaPlaneArrival />
            </label>
            <select id="countries" class="cursor-pointer border border-gray-300 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option className='' disabled selected>Where to?</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>

          </div>

          <div className="flex flex-1 relative" ref={inputRef}>
            <span class="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0 border-gray-200 text-sm text-gray-500  dark:border-neutral-700 dark:text-neutral-400">
              <FaRegCalendarAlt />
            </span>
            <input
              type='text'
              readOnly
              value={
                isRoundTrip
                  ? `${formatDate(departDate)} - ${formatDate(returnDate)}`
                  : formatDate(departDate)
              }
              className="px-4 py-2 border w-full cursor-pointer"
              onClick={() => setIsPopupOpen(true)} placeholder='Depart - Arrive'
            />

            {isPopupOpen && (
              <div
                className="absolute top-12 flex items-center justify-center"
              >
                <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-2xl w-96">
                  <h3 className="text-lg font-bold mb-4">Select Date</h3>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={!isRoundTrip}
                        onChange={() => setIsRoundTrip(false)}
                      />
                      <span className="font-medium">One way</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={isRoundTrip}
                        onChange={() => setIsRoundTrip(true)}
                      />
                      <span className="font-medium">Round trip</span>
                    </label>
                  </div>
                  <div className="flex space-x-6 w-full mt-4">
                    <div className="flex flex-col flex-1">
                      <label className="font-medium">Departure:</label>
                      <DatePicker
                        selected={departDate}
                        onChange={(date) => {
                          setDepartDate(date);
                          if (returnDate < date) {
                            setReturnDate(date);
                          }
                        }}
                        minDate={today}
                        dateFormat="dd/MM/yyyy"
                        className="border p-2 rounded-md w-full text-center"
                        placeholderText="Chọn ngày đi"
                      />
                    </div>
                    {isRoundTrip && (
                      <div className="flex flex-col flex-1">
                        <label className="font-medium">Arrival:</label>
                        <DatePicker
                          selected={returnDate}
                          onChange={(date) => setReturnDate(date)}
                          minDate={departDate}
                          dateFormat="dd/MM/yyyy"
                          className="border p-2 rounded-md w-full text-center"
                          placeholderText="Chọn ngày về"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="cursor-pointer px-4 py-2 bg-[#605dec] text-white rounded-md hover:bg-[#423ff5]"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>



          <div className="flex flex-1 relative " ref={passengerRef}>
            <span class="px-4 bg-gray-200 inline-flex items-center min-w-fit border border-e-0 border-gray-200 text-sm text-gray-500  dark:border-neutral-700 dark:text-neutral-400">
              <FaUser />
            </span>

            <input
              type='text'
              readOnly
              value={
                `${adults} Adult${adults > 1 ? "s" : ""},${minors} Minor${minors > 1 ? "s" : ""} `
              }
              className="px-4 py-2 border border-e-0 w-full cursor-pointer"
              onClick={() => setIsPassengerPopupOpen(true)}
            />

            {isPassengerPopupOpen && (
              <div className="absolute top-12 left-0 mt-2 bg-white p-4 rounded-lg shadow-lg w-64 z-10">
                <div className="flex justify-between items-center mb-2">
                  <span>Adults:</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-2 cursor-pointer py-1 border rounded">-</button>
                    <span>{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="px-2 cursor-pointer py-1 border rounded">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Minors:</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setMinors(Math.max(0, minors - 1))} className="px-2 cursor-pointer py-1 border rounded">-</button>
                    <span>{minors}</span>
                    <button onClick={() => setMinors(minors + 1)} className="px-2 cursor-pointer py-1 border rounded">+</button>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="flex">
            <button className='cursor-pointer h-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
              Search
            </button>
          </div>
        </div>
      </div>


      <ContentHomePage />
    </div>
  )
}

export default HomePage