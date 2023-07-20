import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import MyAccount from './components/MyAccount';
import UpdateAccount from './components/UpdateAccount';
import OwnedSpots from './components/OwnedSpots';
import NewSpot from './components/NewSpot';
import UpdateSpot from './components/UpdateSpot';
import UpcomingBooking from './components/UpcomingBooking';
import SpotUseRenter from './components/SpotUseRenter';
import SpotUseOwner from './components/SpotUseOwner';
import SpotSearch from './components/SpotSearch';
import SpotDetails from './components/SpotDetails';
import RentSpot from './components/RentSpot';

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="account/:userID" element={<MyAccount />} />
          <Route path="account/:userID/update" element={<UpdateAccount />} />
          <Route path="spots/:userID" element={<OwnedSpots />} />
          <Route path="spots/new" element={<NewSpot />} />
          <Route path="spots/update/:spotID" element={<UpdateSpot />} />
          <Route path="booking/upcoming/:bookingID" element={<UpcomingBooking />} />
          <Route path="booking/review/:bookingID" element={<SpotUseRenter />} />
          <Route path="booking/view/:bookingID" element={<SpotUseOwner />} />
          <Route path="search" element={<SpotSearch />} />
          <Route path="spot/:spotID" element={<SpotDetails />} />
          <Route path="spot/:spotID/rent" element={<RentSpot />} />
          {/* Add more Routes as needed */}
          <Route path = "*" element={<>Page not found</>} /> {/* Catch all */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
