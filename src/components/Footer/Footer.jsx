import React from 'react';
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import appstore from "../../assets/images/appstore.svg";
import ggplay from "../../assets/images/googleplay.svg";

const Footer = () => {
    return (
        <div className="">
            <div className='flex pb-15 border-b-1 border-b-[#cbd4e6]'>
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    href='#' className='px-16 text-[#605dec] font-extrabold text-2xl'>TRIPMA</a>

                <div className="grid grid-cols-2 lg:grid-cols-4 flex-1">
                    <div className="flex flex-col text-[#6e7491]">
                        <h2 className=' font-medium text-lg'>About</h2>
                        <Link to="/" className='font-normal mt-1'>About Tripma</Link>
                        <Link to="/" className='font-normal mt-1'>How it works</Link>
                        <Link to="/" className='font-normal mt-1'>Careers</Link>
                        <Link to="/" className='font-normal mt-1'>Press</Link>
                        <Link to="/" className='font-normal mt-1'>Blog</Link>
                        <Link to="/" className='font-normal mt-1'>Forum</Link>
                    </div>


                    <div className="flex flex-col text-[#6e7491]">
                        <h2 className=' font-medium text-lg'>Partner with us</h2>
                        <Link to="/" className='font-normal mt-1'>Partnership programs</Link>
                        <Link to="/" className='font-normal mt-1'>Affiliate program</Link>
                        <Link to="/" className='font-normal mt-1'>Connectivity partners</Link>
                        <Link to="/" className='font-normal mt-1'>Promotions and events</Link>
                        <Link to="/" className='font-normal mt-1'>Integrations</Link>
                        <Link to="/" className='font-normal mt-1'>Community</Link>
                        <Link to="/" className='font-normal mt-1'>Loyalty program</Link>
                    </div>

                    <div className="flex flex-col text-[#6e7491]">
                        <h2 className=' font-medium text-lg'>Support</h2>
                        <Link to="/" className='font-normal mt-1'>Help Center</Link>
                        <Link to="/" className='font-normal mt-1'>Contact us</Link>
                        <Link to="/" className='font-normal mt-1'>Privacy policy</Link>
                        <Link to="/" className='font-normal mt-1'>Terms of service</Link>
                        <Link to="/" className='font-normal mt-1'>Trust and safety</Link>
                        <Link to="/" className='font-normal mt-1'>Accessibility</Link>
                    </div>


                    <div className="flex flex-col text-[#6e7491]">
                        <h2 className=' font-medium text-lg'>Get the app</h2>
                        <Link to="/" className='font-normal mt-1'>Tripma for Android</Link>
                        <Link to="/" className='font-normal mt-1'>Tripma for iOS</Link>
                        <Link to="/" className='font-normal mt-1'>Mobile site</Link>
                        <Link to="/" className='font-normal mt-8'>
                            <img src={appstore} alt="sdfa" />
                        </Link>
                        <Link to="/" className='font-normal mt-5'>
                            <img src={ggplay} alt="asdf" />
                        </Link>
                    </div>
                </div>
            </div>


            <div className="flex pt-5 pb-7 items-center justify-between">
                <div className="icon flex cursor-pointer text-lg gap-x-3">
                    <FaTwitter />
                    <FaInstagram />
                    <FaFacebookSquare />
                </div>
                <p className='text-[#7c8db0]'>© 2025 Tripma incorporated</p>
            </div>
        </div>
    )
}

export default Footer