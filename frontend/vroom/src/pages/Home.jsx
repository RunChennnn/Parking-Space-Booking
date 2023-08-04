import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { Button, TextField, Typography } from '@mui/material';
import makeRequest from '../utilities/makeRequest';
import SearchStub from '../components/SearchStub';
import { useNavigate } from 'react-router-dom';
import { adminIsLoggedIn, userIsLoggedIn } from '../utilities/admin';

function Home () {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState('');
  const [recommended, setRecommended] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getData () {
      if (!adminIsLoggedIn() && userIsLoggedIn()) {
        const request = {
          num: 5,
          alreadyReceived: [],
        };
        const response = await makeRequest('POST', `recommend/${localStorage.getItem('vroom-id')}`, request);
        const tmp = []
        for (const id of response.ids) {
          const prop = await makeRequest('GET', `spot/${id}`, {});
          prop.data.id = id;
          prop.data.doView = () => navigate(`/spot/${id}`);
          tmp.push(SearchStub(prop.data));
        }
        setRecommended(tmp);
      }
      setLoading(false);
    }

    getData();
  }, [navigate])

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
      <NavigationBar loading={loading} />
      <TextField id='search-input' variant='outlined' placeholder="Find a spot..." style={inputStyle} value={search} onChange={(e) => setSearch(e.target.value)} />
      <Button id='search-button' variant='contained' style={buttonStyle} onClick={doSearch}>Search</Button>
      {adminIsLoggedIn()
        ? (
        <Typography variant='h6' align='center'>You are logged in as a system administrator.</Typography>
          )
        : (
        <>
          {userIsLoggedIn() && <Typography align='center' variant='h2'>Recommended for you</Typography>}
          {recommended}
        </>
          )
      }
    </>
  )
}

export default Home
