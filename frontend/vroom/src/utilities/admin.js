function adminIsLoggedIn () {
  return false;
  // return (localStorage.getItem('vroom-id') === 'admin');
}

export { adminIsLoggedIn }
