import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      className="px-[20px] py-[8px] outline-1 outline-[#605dec] text-[#605dec] rounded-lg self-center
    hover:bg-[#605dec]  hover:text-white transition-all cursor-pointer active:opacity-75 hover:shadow-lg hover:shadow-blue-300
    "
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
