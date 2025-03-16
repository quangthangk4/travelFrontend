import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

const layout = () => {
    return (
        <div className='scroll-smooth'>
            <Header />
            <section className='mt-25 content lg:mx-15 sm:mx-5'>
                <Outlet />
            </section>

            <div className="mt-64 lg:mx-15 sm:mx-5" >
                <Footer />
            </div>
        </div>
    )
}

export default layout