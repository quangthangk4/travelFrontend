import React from "react";

const InputLable = ({ lable, type, id, value, onChange }) => {
  return (
    <div className="w-full max-w-sm min-w-[200px]">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
        <label
          htmlFor={id}
          className={`absolute cursor-text bg-white px-1 left-2.5 text-slate-400 text-sm transition-all transform origin-left
            ${value ? "-top-2 left-2.5 text-xs scale-90" : "top-2.5"} 
            peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 
            peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90`}
        >
          {lable}
        </label>
      </div>
    </div>
  );
};

export default InputLable;
