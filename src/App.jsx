import { useState } from 'react'
import './App.css'

import { Route, Routes } from 'react-router-dom'

import Home from './Components/Home.jsx'
import EventDetails from './Components/EventDetails.jsx'
import Favorites from './Components/Favorites.jsx'
import Registration from './Components/Registration.jsx'
import NotFound from './Components/NotFound.jsx'
import Events from './Components/Event.jsx'
import RegistrationPage from './Components/RegistrationPage.jsx'

import Footer from "./SubComponents/Footer.jsx"
import NavBar from "./SubComponents/NavBar.jsx"

function EventHub() {
  

  return (
    <div /* className='min-h-screen bg-white dark:bg-slate-900 dark:text-white transition-colors' */>
    <NavBar />

    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path ="/events" element={<Events />}></Route>
      <Route path="/event/:id" element={<EventDetails />}></Route>
      <Route path="/favorites" element={<Favorites />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="/register/:id" element={<RegistrationPage />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>

    <Footer />

   </div>
  )
}

export default EventHub