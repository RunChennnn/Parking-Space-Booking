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

    const [page,setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    
    const buttonStyle = {
        margin: '20px 30% 0 30%'
    }

    // data tested for ui layout
    function initData(key, address, averPrice, demandDriven) {
        return {key, address, averPrice, demandDriven}
    }
    const testData = [
        initData(1, 'Tom', '49 Average Way', 26, 'no'),
        initData(2,'Jerry', '49 Wallabay Way', 29, 'no'),
        initData(3, 'Pat', 'Kelly Street', 21, 'no'),
        initData(4, 'Steven', 'Haymarket', 25, 'no'),
        initData(5, 'Thor', 'UNSW Anaze', 23, 'no'),
        initData(6, 'wwwww', 'Spiderman', 19, 'no'),
        initData(7, 'walali', 'sgsgsgs', 14, 'no')
    ]

    // the spots rows shown on the owned table
    const rows = []

    /**
     *  the function to load owned spots
     */
    async function loadingSpots() {
        //const response = await makeRequest('GET', `user/${params.userId}`, {})
       // const spotsId = response.spots
        const  spotsId = ["-NYv6sDOfDjYYihxKdTB"]

        spotsId.map(async (spot) => {
            const res = await makeRequest('GET', `spot/${spot}`, {})
            rows.push(res)
        })
    }

    /*React.useEffect(() => {
        loadingSpots()
    }, [])*/

    function toRegisterSpot() {
        //navigate('/spots/new')
        const spotsId = ["-NYv6sDOfDjYYihxKdTB"]
        spotsId.map(async (spot) => {
            const res = await makeRequest('GET', `spot/${spot}`, {})
            //rows.push(res)
            console.log(res)
        })
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
                                <TableCell align="center">Key</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Average Price per hour($)</TableCell>
                                <TableCell align="center">Demand-driven pricing</TableCell>
                                <TableCell align="center">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="center">
                                        {row.key}
                                    </TableCell>
                                    <TableCell align="center">{row.address}</TableCell>
                                    <TableCell align="center">{row.averPrice}</TableCell>
                                    <TableCell align="center">{row.demandDriven}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" style={buttonStyle} align="center"
                                                onClick={()=> {
                                                    navigate( `/spots/update/${row.key}`)
                                                }}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows.length}
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
              <Button variant="contained" style={buttonStyle} onClick={toRegisterSpot} >Register new spot</Button>
            </div>
        </>
    )
}

export default OwnedSpots