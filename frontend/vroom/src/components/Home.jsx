import React from "react"
import NavigationBar from "./NavigationBar"
import { Button, TextField, Typography } from "@mui/material";
import makeRequest from "../utilities/makeRequest";
import SearchStub from "./SearchStub";
import { useNavigate } from "react-router-dom";

function Home () {

  const [search, setSearch] = React.useState('');
  const [recommended, setRecommended] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getData () {
      const request = {
        num: 31,
        alreadyReceived: [],
      };
      const response = await makeRequest("POST", `recommend/${localStorage.getItem('vroom-id')}`, request);

      const tmp = []
      for (const id of response.ids) {
        tmp.push(SearchStub({ spotID: id }));
      }
      setRecommended(tmp);
    }

    getData();
  }, [])

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '50px 50px 0 50px',
    width: 'calc(100% - 100px)',
    padding: '0'
  };

  const buttonStyle = {
    margin: '30px calc(50% - 75px)',
    width: '150px',
  };

  function doSearch () {
    navigate(`/search?search=${search}`);
  }
    
  return (
    <>
      <NavigationBar />
      <TextField id='search-input' variant='outlined' placeholder="Find a spot..." style={inputStyle} value={search} onChange={(e) => setSearch(e.target.value)} />
      <Button id='search-button' variant='contained' style={buttonStyle} onClick={doSearch}>Search</Button>
      <Typography align='center' variant='h2'>Recommended for you</Typography>
      {recommended}
    </>
  )
}

export default Home