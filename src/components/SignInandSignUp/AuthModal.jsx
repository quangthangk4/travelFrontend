import React from 'react';
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose, isSignUp }) => {
    if (!isOpen) return null;
    

    const handleOutsideClick = (e) => {
        if (e.target.id === "modal-overlay") {
            onClose();
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 flex items-center justify-center  bg-black/50"
            onClick={handleOutsideClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {isSignUp ? "Sign up for Tripma" : "Sign in to Tripma"}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                    Tripma is totally free to use. Sign {isSignUp ? "up" : "in"} using your email
                    address or phone number below to get started.
                </p>
                <input
                    type="email"
                    placeholder="Email or phone number"
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded"
                />
                {isSignUp && (
                    <div className="flex items-start mb-2 ">
                        <input id='terms' type="checkbox" className="cursor-pointer mr-2 mt-1" />
                        <label htmlFor='terms' className="cursor-pointer text-sm text-gray-600">
                            I agree to the <a href="#" className="text-blue-500">terms and conditions</a>
                        </label>
                    </div>
                )}
                <button className="w-full bg-indigo-600 text-white p-2 rounded mt-2 cursor-pointer">
                    {isSignUp ? "Create account" : "Sign in"}
                </button>
                <div className="text-center my-4 text-gray-500">or</div>
                <button className="cursor-pointer w-full flex items-center justify-center border p-2 rounded mb-2">
                    <FaGoogle className="mr-2" /> Continue with Google
                </button>
                <button className="cursor-pointer w-full flex items-center justify-center border p-2 rounded mb-2">
                    <FaApple className="mr-2" /> Continue with Apple
                </button>
                <button className="cursor-pointer w-full flex items-center justify-center border p-2 rounded">
                    <FaFacebook className="mr-2 text-blue-600" /> Continue with Facebook
                </button>
                <button onClick={onClose} className="cursor-pointer w-full mt-2 text-red-500 text-sm">
                    Close
                </button>
            </div>
        </div>
    );
};

export default AuthModal