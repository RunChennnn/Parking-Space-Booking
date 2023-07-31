import React from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

function OwnedList (props) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const navigate = useNavigate()

  const editBtnStyle = {
    margin: '20px calc(50% - 100px) 10px calc(50% - 100px)',
    width: '100px'
  }

  // const emptyRows = page > 0 ? Math.max(0, (1+page)*rowsPerPage - props.spots.length) : 0

  const handlePageChange = (e, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  return (
        <>
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
                        {(rowsPerPage > 0
                          ? props.spots.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : props.spots).map((spot) =>
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
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={props.spots.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                  inputProps: {
                                    'aria-label': 'rows per page',
                                  },
                                  native: true,
                                }}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
  )
}
export default OwnedList
