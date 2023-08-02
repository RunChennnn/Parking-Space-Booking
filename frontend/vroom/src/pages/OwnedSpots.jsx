import React from 'react'
import { useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import NavigationBar from '../components/NavigationBar';
// import { adminIsLoggedIn } from '../utilities/admin';
import OwnedList from '../components/OwnedList';
import { Button } from '@mui/material';
import { adminIsLoggedIn } from '../utilities/admin';

function OwnedSpots () {
  const [spots, setSpots] = React.useState([])
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate()

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '200px'
  }

  React.useEffect(() => {
    async function loadingSpots () {
      const idRes = adminIsLoggedIn() ? await makeRequest('GET', 'admin/spots', {}) : await makeRequest('GET', `user/${localStorage.getItem('vroom-id')}`, {})
      const spotsID = adminIsLoggedIn() ? idRes.spotIDs : idRes.spots;
      console.log(idRes)
      // setSpotsID(idRes.spots)
      const tmp = await Promise.all(spotsID.map(async (spotID) => {
        const spot = await makeRequest('GET', `spot/${spotID}`, {})
        spot.data.demandPricing = `${spot.data.demandPricing}`
        return spot
      }))
      console.log(tmp)
      setSpots(tmp)
      setLoading(false);
    }
    loadingSpots();
  }, [])
  function toRegisterSpot () {
    navigate('/spots/new')
  }

  return (
        <>
            <div>
                <NavigationBar loading={loading} />
                <OwnedList spots={spots}/>
                <Button id='new-spot-button' variant="contained" style={buttonStyle} onClick={toRegisterSpot} >Register new spot</Button>
            </div>
        </>
  )
}
export default OwnedSpots;
