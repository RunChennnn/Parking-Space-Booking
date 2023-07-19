import React from "react";
import makeRequest from "../utilities/makeRequest";
import {
    Avatar, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Collapse,
    IconButton, List, ListItem, ListItemAvatar, ListItemText,
    Typography
} from "@mui/material";
import {red} from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import img from "../static/spot1.jpg";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {purple50} from "mui/source/styles/colors";


function SpotCard(props) {

    const [expand, setExpand] = React.useState(false)
    const [reviews, setReviews] = React.useState([])

    const handleExpandClick = () => {
        setExpand(!expand)
    }

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    function formatPrice(price) {
        return `$${Number(price).toFixed(2)}`
    }


    return (
        <Card sx={{maxWidth: 1200}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        P
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Perfect parking spot for you"
                subheader="Run Chen"
            />
            <CardMedia
                component="img"
                height="500"
                image={img}
                alt="Spot1"
            />
            <CardContent >
                <Typography paragraph>Description: {props.cardInfo.description}</Typography>
                <Typography paragraph>Address: {props.cardInfo.address}</Typography>
                <Typography paragraph>LargestVehicle: {props.cardInfo.largestVehicle}</Typography>
                <Typography paragraph>Clearance: {props.cardInfo.clearance}m</Typography>
                <Typography paragraph>EV charging available: {props.cardInfo.evCharging ? 'Yes': 'No'}</Typography>
                <Typography paragraph>Disabled Access: {props.cardInfo.disabledAccess ? 'Yes' : 'No'}</Typography>
                <Typography paragraph>Regular Price per hour: {formatPrice(props.cardInfo.basePrice)}</Typography>
            </CardContent>
            <CardActions>
                <Typography variant="button" display="block" gutterBottom>Recent Reviews</Typography>
                <ExpandMore
                    expand={expand}
                    onClick={handleExpandClick}
                    aria-expanded={expand}
                    aria-label="Recent reviews"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expand} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Average rate: {props.cardInfo.averRate}/5</Typography>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {props.cardInfo.reviews.map((rev) =>
                            <>
                            <div>{rev.rating}</div>
                            <div>{rev.review}</div>
                            <div>{rev.renterID}</div>
                            </>
                        )}
                    </List>
                </CardContent>
            </Collapse>
        </Card>
    )
}
export default SpotCard