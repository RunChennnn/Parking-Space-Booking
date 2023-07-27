import makeRequest from '../utilities/makeRequest'

async function doLogin (userID, token) {
  localStorage.setItem('vroom-id', userID);
  localStorage.setItem('vroom-token', token);
  await doCheckLogin();
}

function doLogout () {
  localStorage.removeItem('vroom-id');
  localStorage.removeItem('vroom-token');
  localStorage.removeItem('vroom-admin');
}

async function doCheckLogin () {
  const response = await makeRequest('GET', `admin/${localStorage.getItem('vroom-id')}/check`);
  localStorage.setItem('vroom-admin', response.isAdmin);
}

function adminIsLoggedIn () {
  return (localStorage.getItem('vroom-admin') === 'true');
}

function userIsLoggedIn () {
  return (localStorage.getItem('vroom-id') !== null)
}

export { adminIsLoggedIn, doCheckLogin, doLogin, doLogout, userIsLoggedIn }
