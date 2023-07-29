import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { Button, Menu, MenuItem, Slider, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../utilities/makeRequest';
import SearchStub from '../components/SearchStub';

function SpotSearch () {
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = React.useState(urlParams.get('search') ? urlParams.get('search') : '');
  const [recommended, setRecommended] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  function getParamString () {
    let paramString = '';
    console.log(`SEARCH: ${search}`)
    if (search !== '' && search !== null) { paramString += `search=${search}&` }
    if (vehicleType !== 'Select') { paramString += `vehicleType=${vehicleType}&` }
    paramString += `evCharging=${ev}&`
    paramString += `disabledAccess=${disabledAccess}&`
    if (clearance !== 0) { paramString += `minClearance=${clearance}&` }
    if (price !== 100) { paramString += `maxPrice=${price}&` }
    return paramString.slice(0, -1);
  }

  React.useEffect(() => {
    async function getData () {
      setLoading(true);
      const request = {
        num: 10,
        alreadyReceived: [],
      };

      if (search !== '' && search !== null) { request.search = search }
      if (vehicleType !== 'Select') { request.vehicleType = vehicleType }
      request.evCharging = ev;
      request.disabledAccess = disabledAccess;
      if (clearance !== 0) { request.minClearance = clearance }
      if (price !== 100) { request.maxPrice = price }

      const response = await makeRequest('POST', `recommend/${localStorage.getItem('vroom-id')}`, request);

      const tmp = []

      for (const id of response.ids) {
        const prop = await makeRequest('GET', `spot/${id}`, {});
        prop.data.id = id;
        prop.data.doView = () => navigate(`/spot/${id}`);
        tmp.push(SearchStub(prop.data));
      }
      setRecommended(tmp);
      setLoading(false);
    }

    getData();
  }, [])

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '20px 50px 0 50px',
    width: 'calc(100% - 100px)',
    padding: '0'
  };

  const buttonStyle = {
    margin: '30px calc(50% - 75px)',
    width: '150px',
  };

  const filterBarStyle = {
    margin: '20px 50px',
    display: 'flex',
    flexDirection: 'row',
  }

  const filterStyle = {
    marginRight: '20px',
  }

  // Handle vehicle type filter
  const [vehicleType, setVehicleType] = React.useState(urlParams.get('vehicleType') ? urlParams.get('vehicleType') : 'Select')
  const [anchorVT, setAnchorVT] = React.useState(null);
  const vehicleTypeOptions = ['Select', 'Motorbike', 'Sedan', '4WD', 'Van', 'Truck'];
  function vehicleTypeClick (e) {
    if (anchorVT === null) {
      setAnchorVT(e.currentTarget);
    } else {
      setAnchorVT(null);
    }
  }
  const vehicleTypeList = [];
  for (const option of vehicleTypeOptions) {
    vehicleTypeList.push((
      <MenuItem id={`vehicle-type-${option}`} key={`vehicle-type-${option}`} onClick={() => { setVehicleType(option); setAnchorVT(null); }}>{option}</MenuItem>
    ))
  }

  // Handle EV charging filter
  const [ev, setEv] = React.useState(urlParams.get('evCharging') ? urlParams.get('evCharging') === 'true' : false);

  // Handle disabled access
  const [disabledAccess, setDisabledAccess] = React.useState(urlParams.get('disabledAccess') ? urlParams.get('disabledAccess') === 'true' : false);

  // Handle clearance slider
  const [clearance, setClearance] = React.useState(urlParams.get('minClearance') ? parseInt(urlParams.get('minClearance')) : 0);
  const clearanceSliderStyle = {
    width: '400px',
    marginLeft: '50px',
    marginTop: '-3px',
  }

  // Handle price slider
  const [price, setPrice] = React.useState(urlParams.get('maxPrice') ? parseInt(urlParams.get('maxPrice')) : 100);
  const priceSliderStyle = {
    width: '400px',
    marginLeft: '50px',
    marginTop: '-3px',
  }

  const divSliderStyle = {
    margin: '20px 50px',
    display: 'grid',
    gridTemplateColumns: '200px 400px',
    rowGap: '10px'
  }

  // Handle text search
  function doSearch () {
    const paramString = getParamString();
    navigate(`/search?${paramString}`);
    window.location.reload(false);
  }

  function priceLabelFormat (price) {
    if (price === 100) {
      return 'No Maximum'
    } else {
      return `$${price}`
    }
  }

  function clearanceLabelFormat (clearance) {
    if (clearance === 0) {
      return 'No Minimum'
    } else {
      return `${clearance}m`
    }
  }

  return (
    <>
      <NavigationBar loading={loading} />
      <TextField id='search-input' variant='outlined' placeholder="Find a spot..." style={inputStyle} value={search} onChange={(e) => { setSearch(e.target.value) }} />
      <div style={filterBarStyle}>
        <div>
          <Button id='vehicle-type-button' style={filterStyle} onClick={vehicleTypeClick} variant='outlined'>Vehicle type: {vehicleType}</Button>
          <Menu id='vehicle-type-list' anchorEl={anchorVT} open={anchorVT !== null}>
            {vehicleTypeList}
          </Menu>
        </div>
        <Button id='ev-button' style={filterStyle} onClick={() => setEv(!ev)} variant='outlined'>EV charging required: {ev ? 'Yes' : 'No'}</Button>
        <Button id='disabled-button' style={filterStyle} onClick={() => setDisabledAccess(!disabledAccess)} variant='outlined'>Disabled access required: {disabledAccess ? 'Yes' : 'No'}</Button>
      </div>
      <div style={divSliderStyle}>
        <Typography>Maximum hourly price: </Typography>
        <Slider id='price-slider' style={priceSliderStyle} min={0} max={100} step={1} value={price} valueLabelDisplay='auto' valueLabelFormat={priceLabelFormat} onChange={(e) => setPrice(e.target.value)}></Slider>
        <Typography>Minimum clearance: </Typography>
        <Slider id='clearance-slider' style={clearanceSliderStyle} min={0} max={6} step={0.1} value={clearance} valueLabelDisplay='auto' valueLabelFormat={clearanceLabelFormat} onChange={(e) => setClearance(e.target.value)}></Slider>
      </div>
      <Button id='search-button' variant='contained' style={buttonStyle} onClick={doSearch}>Search</Button>
      {recommended}
    </>
  )
}

export default SpotSearch
