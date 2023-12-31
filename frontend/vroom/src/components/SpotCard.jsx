import React from 'react';
import {
  Avatar, Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia, Collapse,
  IconButton, List, ListItem, ListItemText, Rating,
  Typography
} from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import img from '../static/spot1.jpg';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import StarIcon from '@mui/icons-material/Star';
import UpComingWeather from './UpComingWeather';

function SpotCard (props) {
  const [expand, setExpand] = React.useState(false)

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

  function formatPrice (price) {
    return `$${Number(price).toFixed(2)}`
  }

  return (
    <Card sx={{ maxWidth: 1200 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} src={props.cardInfo.image} aria-label="recipe" />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.cardInfo.name}
        subheader={props.cardInfo.email}
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
        <Typography paragraph>EV charging available: {props.cardInfo.evCharging ? 'Yes' : 'No'}</Typography>
        <Typography paragraph>Disabled Access: {props.cardInfo.disabledAccess ? 'Yes' : 'No'}</Typography>
        <Typography paragraph>Regular Price per hour: {formatPrice(props.cardInfo.basePrice)}</Typography>
        <Typography paragraph>Upcoming Weather(The next 7 days): </Typography>
        <UpComingWeather weathers={props.cardInfo.weathers}/>
        <Typography paragraph>Average rate: {props.cardInfo.averRate}/5</Typography>
        <Box sx={{
          width: 600,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Rating
            name="average rating"
            value={props.cardInfo.averRate}
            readOnly
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
          />
          {props.cardInfo.averRate !== null && (
            <Box sx={{ ml: 1 }}>{rateLabels[props.cardInfo.averRate]}</Box>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Typography variant="button" display="block" gutterBottom>Recent Reviews</Typography>
        <ExpandMore
          id='expand-reviews-button'
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
          <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
            {props.cardInfo.reviews.map((rev, index) =>
              <ListItem key={`review-${index}`} >
                <Rating size='small'
                  value={rev.rating} readOnly precision={0.5}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
                  style={{ marginRight: '15px' }}
                />
                <ListItemText primary={rev.review} />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default SpotCard
