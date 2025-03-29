import React from "react";

const Cart = ({ cart }) => {
  return (
    <>
      {cart.map((item, index) => {
        return (
          <div
            className={`${item.colSpan} shadow-lg border border-gray-200 rounded-2xl overflow-hidden cursor-pointer active:opacity-90`}
            key={index}
          >
            <div className="overflow-hidden h-[400px]">
              <img
                src={item.picture}
                alt="location"
                className="object-cover w-full transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="px-6 py-4">
              <div className="flex mb-1 justify-between text-[#6e7491] text-lg font-semibold">
                <p>{item.location}</p>
                <p>{item.price}</p>
              </div>
              <p className="text-[16px] text-[#7c8db0] font-medium">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Cart;
