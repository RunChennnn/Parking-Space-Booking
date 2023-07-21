import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyAccount from './pages/MyAccount';
import UpdateAccount from './pages/UpdateAccount';
import OwnedSpots from './pages/OwnedSpots';
import NewSpot from './pages/NewSpot';
import UpdateSpot from './pages/UpdateSpot';
import UpcomingBooking from './pages/UpcomingBooking';
import SpotUseRenter from './pages/SpotUseRenter';
import SpotUseOwner from './pages/SpotUseOwner';
import SpotSearch from './pages/SpotSearch';
import SpotDetails from './pages/SpotDetails';
import RentSpot from './pages/RentSpot';
import BookingHistory from './pages/BookingHistory';

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
          <Route path="history/:userID" element={<BookingHistory />} />
          {/* Add more Routes as needed */}
          <Route path = "*" element={<>Page not found</>} /> {/* Catch all */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
