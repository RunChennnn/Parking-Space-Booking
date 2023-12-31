import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import { Typography } from '@mui/material';
import Notification from '../components/Notification';

function Notifications () {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState([])

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const spacerStyle = {
    height: '20px',
  }

  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', `user/${localStorage.getItem('vroom-id')}/notifications`, {})

      const tmp = await Promise.all(response.ids.map(async (id, index) => {
        const notification = await makeRequest('GET', `notification/${id}`, {});
        const props = {
          text: notification.text,
          timestamp: notification.time,
          id,
          viewed: notification.viewed,
          doView: async () => {
            await makeRequest('POST', `notification/${id}/view`, {})
            window.location.reload(false);
          }
        }
        return Notification(props);
      }));
      setNotifications(tmp);
      setLoading(false);
    }
    getData();
  }, [])

  return (
    <>
      <NavigationBar loading={loading} />
      <div style={spacerStyle} />
      {!loading && (notifications.length === 0) && (<Typography align='center' variant='h6'>No notifications to show</Typography>)}
      {notifications}
    </>
  )
}

export default Notifications
