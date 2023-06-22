import logo from './logo.svg';
import './App.css';
import React from 'react'
import makeRequest from './utilities/makeRequest';

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {"hi"}
        </p>
      </header>
    </div>
  );
}

export default App;
