import './App.css';
import React from 'react'
import makeRequest from './utilities/makeRequest';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

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
      <p>
        Hello world (can remove this text)
      </p>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Add more Routes as needed */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
