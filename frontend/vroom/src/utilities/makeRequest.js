// Contains code for talking to the server
async function makeRequest (method, path, body) {
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
    },
  };
  if (localStorage.getItem('vroom-token')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('vroom-token')}`;
  }
  if (method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  const response = await fetch('http://localhost:3141/' + path, options);
  const data = await response.json()
  return data;
}

export default makeRequest;
