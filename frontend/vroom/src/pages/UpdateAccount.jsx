import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import AuthPopup from '../components/AuthPopup'
import { Button, TextField, Typography } from '@mui/material'
import makeRequest from '../utilities/makeRequest'
import ImageFrame from '../components/ImageFrame'
import { fileToDataUrl } from '../utilities/readImage'
import { adminIsLoggedIn, doLogout } from '../utilities/admin'

function UpdateAccount () {
  const navigate = useNavigate();
  const params = useParams();
  const [image, setImage] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showUpdatePopup, setShowUpdatePopup] = React.useState(false);
  const [showDeletePopup, setShowDeletePopup] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const imageRef = React.useRef(null);

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  if (!localStorage.getItem('vroom-id')) { navigate('/login'); }

  const instructionStyle = {
    marginTop: '30px',
    marginLeft: 'calc(25vw - 30px)',
    color: '#888',
    width: 'calc(50vw + 60px)'
  };

  const inputStyle = {
    backgroundColor: '#fff',
    margin: '0',
    padding: '0'
  };

  const formStyle = {
    margin: '0',
    padding: '50px 10vw',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '25px',
  };

  const buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '0 auto',
  };

  const buttonStyle = {
    margin: '12px',
    width: '200px',
  };

  const imageButtonStyle = {
    width: '250px',
    margin: '0px calc(50% - 125px)'
  }

  function pressUpdate () {
    setShowUpdatePopup(true);
  }

  function pressDeleteAccount () {
    setShowDeletePopup(true);
  }

  function clickAddPicture () {
    imageRef.current.click()
  }

  function clickRemovePicture () {
    setImage('');
  }

  async function doAddImage (e) {
    const img = await fileToDataUrl(e.target.files[0]);
    setImage(img);
    e.target.value = null;
  }

  async function doUpdate () {
    const request = {}
    if (email !== '') {
      request.email = email;
    }
    if (password !== '' && password === confirmPassword) {
      request.password = password;
    }
    request.displayName = name;

    await makeRequest('PATCH', `user/${params.userID}/update`, request);
    await makeRequest('POST', `user/${params.userID}/image/set`, { image });
    if (adminIsLoggedIn()) {
      navigate('/users')
    } else {
      navigate(`/account/${params.userID}`)
    }
  }

  async function doDelete () {
    await makeRequest('DELETE', `user/${params.userID}/delete`);
    if (adminIsLoggedIn()) {
      navigate('/users')
    } else {
      doLogout();
      navigate('/')
    }
  }

  let emailSet = false;
  React.useEffect(() => {
    async function getData () {
      const response = await makeRequest('GET', `user/${params.userID}`, {});
      if (!emailSet) {
        setEmail(response.email);
        emailSet = true;
      }
      setPassword('');
      setConfirmPassword('');
      if (response.displayName) { setName(response.displayName) }
      const imgResponse = await makeRequest('GET', `user/${params.userID}/image`, {});
      console.log('Image response', imgResponse);
      if (imgResponse.image) {
        setImage(imgResponse.image);
      }
      setLoading(false);
    }

    getData();
  }, [])

  return (
    <>
      <NavigationBar loading={loading} />
      <Typography style={instructionStyle} align='center'>
        Fill in any fields you&apos;d like to change. If you leave the password section blank, it&apos;ll remain unchanged. You&apos;ll be prompted for your old password to make any changes.
      </Typography>
      <div style={formStyle}>
        <Button id='image-button' variant='outlined' style={imageButtonStyle} onClick={clickAddPicture}>
          Add Profile Picture
          <input ref={imageRef} type="file" accept="image/png, image/jpg, image/jpeg" onChange={doAddImage} hidden />
        </Button>
        <ImageFrame size={200} image={image} />
        {image !== '' && <Button id='delete-image-button' variant='outlined' color='error' style={imageButtonStyle} onClick={clickRemovePicture}>Remove Profile Picture</Button>}
        <TextField id='name-input' variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='Username' placeholder="Jane Citizen" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)}></TextField>
        <TextField id='email-input' variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='Email' placeholder="example@email.com" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
        <TextField id='password-input' variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='New Password' type='password' style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
        <TextField id='confirm-password-input' variant='outlined' disabled={showUpdatePopup || showDeletePopup} size='small' autoComplete="off" label='Confirm New Password' type='password' style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
      </div>
      <div style={buttonRowStyle}>
        <Button id='update-account-button' variant="contained" style={buttonStyle} onClick={pressUpdate}>Update</Button>
        <Button id='delete-account-button' variant="contained" color='error' style={buttonStyle} onClick={pressDeleteAccount}>Delete Account</Button>
      </div>
      <AuthPopup show={showUpdatePopup} onConfirm={doUpdate} onBack={() => setShowUpdatePopup(false)} />
      <AuthPopup show={showDeletePopup} onConfirm={doDelete} onBack={() => setShowDeletePopup(false)} />
    </>
  )
}

export default UpdateAccount
