import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import WorldMap from "../assets/images/WorldMap.svg";
import picture2 from "../assets/images/image-1.png";
import picture3 from "../assets/images/image-2.png";
import picture4 from "../assets/images/image-3.png";
import picture1 from "../assets/images/image.png";

import picture5 from "../assets/images/image-4.png";
import picture6 from "../assets/images/image-5.png";
import picture7 from "../assets/images/image-6.png";

import avatar1 from "../assets/images/avatar-1.svg";
import avatar2 from "../assets/images/avatar-2.svg";
import avatar from "../assets/images/avatar.svg";

import { FaRegStar, FaStar } from "react-icons/fa";
import SearchFlight from "../components/SearchFlight/SearchFlight";
import Cart from "../components/Cart/Cart";
import Button from "../components/Button/Button";

const RatingStars = ({ rating, maxStars = 5 }) => {
  const numericRating = parseInt(rating) || 0;
  return (
    <div className="flex">
      {[...Array(maxStars)].map((_, index) =>
        index < numericRating ? (
          <FaStar key={index} className="text-yellow-400 text-xl" />
        ) : (
          <FaRegStar key={index} className="text-gray-400 text-xl" />
        )
      )}
    </div>
  );
};

const ContentHomePage = () => {
  const pictures1 = [
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
    {
      location: "Tsavo East National Park, Kenya",
      price: "$1,248",
      picture: picture4,
      description:
        "Named after the Tsavo River, and opened in April 1984, Tsavo East National Park is one of the oldest parks in Kenya. It is located in the semi-arid Taru Desert.",
      colSpan: "col-span-3",
    },
  ];

  const pictures2 = [
    {
      location: "Stay among the atolls in Maldives",
      price: "",
      picture: picture5,
      description:
        "From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages.",
      colSpan: "",
    },
    {
      location: "Experience the Ourika Valley in Morocco",
      price: "",
      picture: picture6,
      description:
        "Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East.",
      colSpan: "",
    },
    {
      location: "Live traditionally in Mongolia",
      price: "",
      picture: picture7,
      description:
        "Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel.",
      colSpan: "",
    },
  ];

  const ratings = [
    {
      avatar: avatar,
      name: "Yifei Chen",
      location: "Seoul, South Korea",
      time: "April 2019",
      star: "5",
      content:
        "What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me",
    },
    {
      avatar: avatar1,
      name: "Kaori Yamaguchi",
      location: "Honolulu, Hawaii",
      time: "February 2017",
      star: "4",
      content:
        "My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommened to us by a long time friend, and I’m so glad we tried it out! The process was easy and",
    },
    {
      avatar: avatar2,
      name: "Anthony Lewis",
      location: "Berlin, Germany",
      time: "April 2019",
      star: "5",
      content:
        "When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I’d give it a try. It was my first time using Tripma, but I’d definitely recommend it to a friend and use it for",
    },
  ];

  return (
    <div className="">
      <p className="text-2xl font-bold text-[#6e7491] mb-6">
        Find your next adventure with these flight deals
      </p>

      <div className="grid grid-cols-3 gap-10">
        <Cart cart={pictures1} />
      </div>

      <p className="text-2xl font-bold text-[#6e7491] mt-30 mb-6">
        Find your next adventure with these flight deals
      </p>
      <div className="grid grid-cols-3 gap-10">
        <Cart cart={pictures2} />
      </div>

      <div className="flex justify-center mt-15">
        <Button text={"Explore more stays"} />
      </div>

      <div className="rating mt-20">
        <p className="text-[#547db1] text-lg mb-10 font-medium text-[20px] text-center ">
          What <span className="text-[#4b6cf0]">Tripma</span> users are saying
        </p>

        <div className="grid grid-cols-3 gap-10">
          {ratings.map((item, index) => {
            return (
              <div className="flex items-start" key={index}>
                <img src={item.avatar} alt="avatar" className="px-4" />
                <div className="">
                  <div className="text-[#6e7491] mb-2">
                    <p className="font-medium">{item.name}</p>
                    <p>
                      {item.location} | {item.time}
                    </p>
                  </div>

                  <RatingStars rating={item.star} />

                  <p className="mt-5">
                    {item.content}{" "}
                    <span className="text-[#605dec]">read more...</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="">
      <div
        style={{ backgroundImage: `url(${WorldMap})` }}
        className="bg-no-repeat bg-contain h-screen w-full"
      >
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-center pt-8">
          It’s more than <br /> just a trip
        </h1>

        <div className="mt-30">
          <SearchFlight />
        </div>
      </div>

      <ContentHomePage />
    </div>
  );
};

export default HomePage;
