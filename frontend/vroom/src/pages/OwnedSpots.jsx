import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination, TableFooter
} from '@mui/material'
import Paper from '@mui/material/Paper'
import makeRequest from '../utilities/makeRequest';
import NavigationBar from '../components/NavigationBar';
import { adminIsLoggedIn } from '../utilities/admin';

function OwnedSpots () {
  const [spots, setSpots] = useState([])
  const [spotList, setSpotList] = useState([]);

  // const params = useParams()

  const navigate = useNavigate()

  const buttonStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '200px'
  }

  const editBtnStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  async function loadingSpotInfo (spotId) {
    const spot = await makeRequest('GET', `spot/${spotId}`, {})
    console.log(spot)
    return spot
  }

  React.useEffect(() => {
    loadingSpots()
  }, [])

  function toRegisterSpot () {
    navigate('/spots/new')
  }

  /**
     *  The function to generate table row for each spot
     * @param spotId
     * @returns {JSX.Element}
     */
  async function generateTableRow (spotId) {
    const spot = await loadingSpotInfo(spotId)
    spot.data.demandPricing = `${spot.data.demandPricing}`

    const ret = (
            <TableRow
                key={spot.id}
                sx={{ '&:last-child td, &:last-child `qth': { border: 0 } }}
            >
                <TableCell component="th" scope="row" align="center">
                    {spot.data.description}
                </TableCell>
                <TableCell align="center">{spot.data.streetNumber} {spot.data.streetName} {spot.data.suburb}</TableCell>
                <TableCell align="center">{spot.data.basePrice}</TableCell>
                <TableCell align="center">{spot.data.demandPricing}</TableCell>
                <TableCell align="center">
                    <Button variant="contained" style={editBtnStyle} align="center" id={`${spot.id}-edit-button`}
                            onClick={() => {
                              navigate(`/spots/update/${spot.id}`)
                            }}>Edit</Button>
                </TableCell>
            </TableRow>
    )
    return ret;
  }

  async function loadingSpots () {
    var spotsId = null;
    if (adminIsLoggedIn()) {
      const response = await makeRequest('GET', 'admin/spots', {});
      spotsId = response.spotIDs;
    } else {
      const userRes = await makeRequest('GET', `user/${localStorage.getItem('vroom-id')}`, {});
      spotsId = userRes.spots;
    }
    console.log(spotsId);
    // const userRes = await makeRequest('GET', `user/${localStorage.getItem('vroom-id')}`, {})
    // const spotsId = userRes.spots
    // const spotsId = ["-NYzaGK84xgqAtpbZpTC", "-NYzaM8nAZoyWJxiFVTx", "-NYzaNqMKptGsNcmt8OR", "-NYzaS2A29F0qpuyadUs"]
    setSpots(spotsId)

    const newSpotList = await Promise.all(spotsId.map(async (spot) => {
      return await generateTableRow(spot);
    }))
    // console.log(newSpotList);
    setSpotList([...newSpotList]);
  }

  /**
     *  the definition of Owned List
     */
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
        <>
            <div>
                <NavigationBar />
                <Typography align="center" variant="h4">Owned Spots</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Average Price per hour($)</TableCell>
                                <TableCell align="center">Demand-driven pricing</TableCell>
                                <TableCell align="center">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spotList}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={spots.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                      inputProps: {
                                        'aria-label': 'rows per page',
                                      },
                                      native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <Button id='new-spot-button' variant="contained" style={buttonStyle} onClick={toRegisterSpot} >Register new spot</Button>
            </div>
        </>
  )
}
export default OwnedSpots;
