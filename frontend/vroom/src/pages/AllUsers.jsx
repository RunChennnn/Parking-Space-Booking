import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useNavigate } from 'react-router-dom'
import makeRequest from '../utilities/makeRequest';
import { Typography } from '@mui/material';
import { adminIsLoggedIn } from '../utilities/admin';
import UserStub from '../components/UserStub';

function AllUsers () {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([])

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }
  if (!adminIsLoggedIn()) { navigate('/login'); }

  const spacerStyle = {
    height: '20px',
  }

  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', 'admin/users', {})

      const tmp = await Promise.all(response.userIDs.map(async (id) => {
        const user = await makeRequest('GET', `user/${id}/basic`);
        const props = {
          email: user.email,
          id,
          doView: () => navigate(`/account/${id}/update`)
        }
        return UserStub(props);
      }));
      setUsers(tmp);
      setLoading(false);
    }
    getData();
  }, [])

  return (
    <>
      <NavigationBar loading={loading} />
      <div style={spacerStyle} />
      {!loading && (users.length > 0) && (<Typography align='center' variant='h3'>All System Users</Typography>)}
      {!loading && (users.length === 0) && (<Typography align='center' variant='h6'>No users to show</Typography>)}
      {users}
    </>
  )
}

export default AllUsers
