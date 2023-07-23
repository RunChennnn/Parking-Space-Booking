function adminIsLoggedIn () {
  return (localStorage.getItem('vroom-id') === 'admin');
}

export { adminIsLoggedIn }
