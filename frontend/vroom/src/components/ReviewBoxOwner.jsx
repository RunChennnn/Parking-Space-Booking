import {Box, Rating} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import React from "react";

function ReviewBoxOwner(props) {

    const rateLabels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    }

    return (
        <>

            <Box sx={{
                width: 200,
                display: 'flex',
                alignItems: 'center'
            }}>
                <Rating
                    name="spot use rating"
                    value={props.rating}
                    readOnly
                    precision={0.5}
                    emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                />
                <Box sx={{ml: 2}}>{rateLabels[props.rating]}</Box>
            </Box>
        </>
    )
}
export default ReviewBoxOwner