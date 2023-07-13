import React from "react"
import NavigationBar from "./NavigationBar"
import { Button, Menu, MenuItem, Slider, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SpotSearch () {
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = React.useState(urlParams.get('search'));
  const navigate = useNavigate();

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
  const [vehicleType, setVehicleType] = React.useState('Select')
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
    function onClick () {
      setVehicleType(option);
      setAnchorVT(null);
    }
    vehicleTypeList.push((
      <MenuItem id={`vehicle-type-${option}`} key={`vehicle-type-${option}`} onClick={onClick}>{option}</MenuItem>
    ))
  }

  // Handle EV charging filter
  const [ev, setEv] = React.useState(false);

  // Handle disabled access
  const [disabledAccess, setDisabledAccess] = React.useState(false);

  // Handle clearance slider
  const [clearance, setClearance] = React.useState(0);
  const clearanceSliderStyle = {
    width: '400px',
    marginLeft: '50px',
    marginTop: '-3px',
  }

  // Handle price slider
  const [price, setPrice] = React.useState(100);
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
    let paramString = '';
    if (search.length > 0) { paramString += `search=${search}&` }
    if (vehicleType !== 'Select') { paramString += `vehicleType=${vehicleType}&` }
    paramString += `evCharging=${ev}&`
    paramString += `disabledAccess=${disabledAccess}&`
    if (clearance !== 0) { paramString += `minClearance=${clearance}&` }
    if (price !== 100) { paramString += `maxPrice=${price}&` }
    navigate(`/search?${paramString}`);
  }

  // TODO handle results
    
  return (
    <>
      <NavigationBar />
      <TextField id='search-input' variant='outlined' placeholder="Find a spot..." style={inputStyle} value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={filterBarStyle}>
        <div>
          <Button style={filterStyle} onClick={vehicleTypeClick} variant='outlined'>Vehicle type: {vehicleType}</Button>
          <Menu anchorEl={anchorVT} open={anchorVT !== null}>
            {vehicleTypeList}
          </Menu>
        </div>
        <Button style={filterStyle} onClick={() => setEv(!ev)} variant='outlined'>EV charging required: {ev ? 'Yes' : 'No'}</Button>
        <Button style={filterStyle} onClick={() => setDisabledAccess(!disabledAccess)} variant='outlined'>Disabled access required: {disabledAccess ? 'Yes' : 'No'}</Button>
      </div>
      <div style={divSliderStyle}>
        <Typography>Maximum hourly price: </Typography>
        <Slider style={priceSliderStyle} min={0} max={100} step={1} value={price} valueLabelDisplay='auto' valueLabelFormat={(value) => `\$${value}`} onChange={(e) => setPrice(e.target.value)}></Slider>
        <Typography>Minimum clearance: </Typography>
        <Slider style={clearanceSliderStyle} min={0} max={6} step={0.1} value={clearance} valueLabelDisplay='auto' valueLabelFormat={(value) => `${value}m`} onChange={(e) => setClearance(e.target.value)}></Slider>
      </div>
      <Button id='search-button' variant='contained' style={buttonStyle} onClick={doSearch}>Search</Button>
      
    </>
  )
}

export default SpotSearch