import './App.css'
import React from 'react'
import makeRequest from './utilities/makeRequest';
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


// https://www.geeksforgeeks.org/longest-common-substring-dp-29/
function longestCommonSubstring (a, b) {

  const aLen = a.length
  const bLen = b.length

  function doLCS (aIndex, bIndex, currentCount) {

    // Exit if we reached the end
    if (aIndex === 0 || bIndex === 0) { return currentCount; }

    // Keep going with this count if the characters are the same
    if (a[aIndex - 1] === b[bIndex - 1]) {
      currentCount = doLCS(aIndex - 1, bIndex - 1, currentCount + 1)
    }

    return Math.max(
      currentCount, Math.max(
        doLCS(aIndex, bIndex - 1, 0),
        doLCS(aIndex - 1, bIndex, 0)
      )
    )
  }

  return doLCS(a.length, b.length, 0);
}

// https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/
function longestCommonSubsequence (a, b) {

  a = a.toLowerCase();
  b = b.toLowerCase();

  // Dynamic programming setup
  let arr = new Array(a.length + 1)
  for (let i = 0; i < a.length + 1; i++) {
    arr[i] = new Array(b.length + 1).fill(-1);
  }

  function doLCS (aIndex, bIndex) {

    // Exit if we reached the end
    if (aIndex === 0 || bIndex === 0) { return 0; }

    // Case where characters match
    if (a[aIndex - 1] === b[bIndex - 1]) {
      arr[aIndex][bIndex] = 1 + doLCS(aIndex - 1, bIndex - 1);
      return arr[aIndex][bIndex];
    }

    if (arr[aIndex][bIndex] !== -1) {
      return arr[aIndex][bIndex];
    }

    return Math.max(doLCS(aIndex - 1, bIndex), doLCS(aIndex, bIndex - 1));

  }
  return doLCS(a.length, b.length);
}

const w1 = "kensington";
const w2 = "o3ensington"
console.log(longestCommonSubsequence(w1, w2))
console.log(longestCommonSubstring(w1, w2))

function App() {

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
