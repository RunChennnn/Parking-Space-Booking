import './App.css';
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

function App() {

  async function test () {
    console.log("starting");
    const result = await makeRequest("GET", "test", {});
    console.log(result)
    console.log("ending");
  }

  React.useState(() => {
    test();
  })

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
          {/* Add more Routes as needed */}
          <Route path = "*" element={<>Page not found</>} /> {/* Catch all */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
