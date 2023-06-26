import React from "react"
import {useNavigate, useParams} from 'react-router-dom'
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
import SpotNavigationBar from './SpotNavigationBar'
import makeRequest from "../utilities/makeRequest";


function OwnedSpots () {

    const params = useParams()

    const navigate = useNavigate()
    
    const buttonStyle = {
        margin: '20px 30% 0 30%'
    }

    // data tested for ui layout
    function initData() {

    }
    const testData = [

    ]
    const rows = testData

    function toUpdateSpot() {

    }


    function toRegisterSpot() {
        navigate('/spots/new')
    }
    
    return (
        <>  
            <div>
              <SpotNavigationBar />
              <Typography align="center" variant="h4">Owned Spots</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Average Price per hour</TableCell>
                                <TableCell align="center">Demand-driven pricing</TableCell>
                                <TableCell align="center">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.address}</TableCell>
                                    <TableCell align="right">{row.averagePrice}</TableCell>
                                    <TableCell align="right">{row.demandDriven}</TableCell>
                                    <TableCell align="right"><Button variant="contained">Edit</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows.length}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
              <Button variant="contained" style={buttonStyle} onClick={toRegisterSpot}>Register new spot</Button>
            </div>
        </>
    )
}

export default OwnedSpots