import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './firebaseConfig.js';
import { registerNewAccount, signInAccount, deleteAccount, signOutAccount, authAccountwithPassword } from './account.js';
import { createNewSpot, patchSpot, deleteSpot, getSpot, getRating, getReviews } from './spot.js';
import { getUser, getUserBasic, patchUser } from './user.js'
import { recommendSpot } from './search.js'
import { confirmNewBooking, getPriceForBooking, getBooking, updateReview, deleteBooking, getUpcomingBooking, getHistoryBooking, getAllBooking } from './booking.js'
import { getAdminUpcomingBooking, getAdminHistoryBooking, getUsersForAdmin, getSpotsForAdmin, checkAdminAccountID } from './admin.js'
import { getNotificationsForUser, getNotification, viewNotification } from './notification.js'
import { getWeather } from './weather.js'

const port = 3141
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  console.log(req.body);
  console.log('responted to /test');
  return res.status(200).json({ id: 2 });
});

app.get('/testDB', async (req, res) => {
  const snapshot = await db.collection('testCollection').get()
  let respond;
  console.log(snapshot);
  if (!snapshot.empty) {
    const documents = []
    snapshot.forEach(doc => documents.push(doc.data()))
    respond = documents
  } else {
    respond = 'Nothing in the database'
  }
  console.log('All information retrieved from Database')
  return res.status(200).json({ respond });
});

app.post('/testDB/spots', async (req, res) => {
  const data = {
    Country: 'Australia',
    Food: 'Roo steak',
    Price: 190,
    Veg: false
  }
  await db.collection('testCollection').add(data)

  console.log('Data added to the database');
  res.status(201).json({ status: 201, message: 'Data added to the database' });
});

// Not sure if we need this, I just put here for better manipulation of firebase atm
app.post('/auth/logoff', async (req, res) => {
  try {
    await signOutAccount();
    return res.status(200).json({ status: 200, message: 'Sign off successfully' });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
});

// Account Registeration
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const respond = await registerNewAccount(email, password);

  if (respond.status === 201) {
    return res.status(201).json(respond);
  } else if (respond.status === 400) {
    res.status(400).json(respond)
  } else if (respond.status === 500) {
    res.status(500).json(respond)
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const respond = await signInAccount(email, password);

  if (respond.status === 200) {
    return res.status(200).json(respond);
  } else if (respond.status === 500) {
    return res.status(500).json(respond);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// authentication usieng passowrd

app.post('/auth/:userID', async (req, res) => {
  const { email, password } = req.body;
  const respond = await authAccountwithPassword(email, password);

  if (respond.status === 200) {
    return res.status(200).json(respond);
  } else if (respond.status === 400) {
    return res.status(400).json(respond);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Account Deletion
app.delete('/user/:userId/delete', async (req, res) => {
  const uid = req.params.userId;
  const respond = await deleteAccount(uid);

  if (respond.status === 200) {
    return res.status(200).json(respond);
  } else if (respond.status === 500) {
    return res.status(500).json(respond);
  } else if (respond.status === 401) {
    return res.status(401).json(respond);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Create new spot
app.post('/spot/new', async (req, res) => {
  const data = req.body;
  const response = await createNewSpot(data);

  if (response.status === 201) {
    return res.status(201).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Update spot
app.patch('/spot/:spotId/update', async (req, res) => {
  const data = req.body;
  const sid = req.params.spotId

  const response = await patchSpot(sid, data);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Delete spot
app.delete('/spot/:spotId/delete', async (req, res) => {
  const sid = req.params.spotId

  const response = await deleteSpot(sid);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Get spot
app.get('/spot/:spotId', async (req, res) => {
  const sid = req.params.spotId
  const response = await getSpot(sid);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

app.get('/spot/:spotId/bookings', async (req, res) => {
  const response = {
    upcoming: ['this1SafAKeID', 'aN01theR_0ne'],
    history: ['historyID1', 'historyID2', 'historyID3']
  }

  return res.status(200).json(response);
  // if (true) { // if valid user ID
  //   return res.status(200).json(response);
  // } else {
  //   return res.status(500).json({ error: 'invalid user ID' })
  // }
});

// Get user profile
app.get('/user/:userID', async (req, res) => {
  const sid = req.params.userID
  const response = await getUser(sid);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

app.get('/user/:userID/basic', async (req, res) => {
  const sid = req.params.userID
  const response = await getUserBasic(sid);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Update User profile
app.patch('/user/:userID/update', async (req, res) => {
  const data = req.body;
  const uid = req.params.userID
  console.log('Patching user with following information');
  console.log(data);

  const response = await patchUser(uid, data);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

/*
    Sprint II related,
    Starts here
*/

// Recommend unreceived spot
// It gives first num spots at the moment, will implement the real recommendation later
app.post('/recommend/:userID', async (req, res) => {
  // const uid = req.params.userID
  // const num = req.body.num;
  // const alreadyReceived = req.body.alreadyReceived;
  const request = req.body;
  request.uid = req.params.userID;
  const respond = await recommendSpot(request);
  // const respond = await recommendSpot(uid, num, alreadyReceived);

  if (respond.status === 200) {
    return res.status(200).json(respond);
  } else if (respond.status === 404) {
    return res.status(404).json(respond);
  } else {
    return res.status(400).json({ message: 'Unknown Error' })
  }
});

// Search spots
// It gives first num spots at the moment, will implement the real search later
// app.post('/search', async (req, res) => {
//   console.log('searching');
//   const response = await searchBackup(req);
//   return res.status(200).json(response);
//   const { num, alreadyReceived, ...conditions} = req.body;
//   const respond = await searchSpot(num, alreadyReceived,conditions);

//   if (respond.status === 200) {
//       return res.status(200).json(respond);
//   } else if (respond.status === 404) {
//       return res.status(404).json(respond);
//   } else {
//       return res.status(400).json({ message: 'Unknown Error' })
//   }
// });

// get totalPrice of a spot
app.post('/book/:spotID/price', async (req, res) => {
  const spotID = req.params.spotID
  const { startTime, endTime } = req.body;
  const response = await getPriceForBooking(spotID, startTime, endTime);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 409) {
    return res.status(409).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// confirm booking and create a new booking document
app.post('/book/:spotID/confirm', async (req, res) => {
  const spotID = req.params.spotID
  const { userID, startTime, endTime, cardNumber, cardName, cardCvv } = req.body;
  const response = await confirmNewBooking(spotID, userID, startTime, endTime, cardNumber, cardName, cardCvv);

  if (response.status === 201) {
    return res.status(201).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 409) {
    return res.status(409).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get details of a booking
app.get('/booking/:bookingID', async (req, res) => {
  const bookingID = req.params.bookingID
  const response = await getBooking(bookingID);
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// write or update review and rating for a booking
app.post('/booking/:bookingID/review', async (req, res) => {
  const bookingID = req.params.bookingID;
  const { rating, review } = req.body;
  const response = await updateReview(bookingID, rating, review);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// cancel a booking, thus delete the corresponding booking document
app.delete('/booking/:bookingID/cancel', async (req, res) => {
  const bookingID = req.params.bookingID;
  const response = await deleteBooking(bookingID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get upcoming bookings of that user
app.get('/upcoming/:userID', async (req, res) => {
  const userID = req.params.userID;
  const response = await getUpcomingBooking(userID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get historical booking of that user
app.get('/history/:userID', async (req, res) => {
  const userID = req.params.userID;
  const response = await getHistoryBooking(userID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get all bookings of that user
app.get('/booking/all/:userID', async (req, res) => {
  const userID = req.params.userID;
  const response = await getAllBooking(userID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get average rating for a spot
app.get('/spot/:spotID/rating', async (req, res) => {
  const spotID = req.params.spotID;
  const response = await getRating(spotID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// get all ratings and reviews for a spot
app.get('/spot/:spotID/reviews', async (req, res) => {
  const spotID = req.params.spotID;
  const num = req.query.num || 10
  const response = await getReviews(num, spotID);

  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

/*
    Sprint III (3) (three) related,
    Starts here
*/

// Returns weather for the next 7 days (today, as well as the following 6 days)
app.get('/weather/:postcode', async (req, res) => {
  const postcode = req.params.postcode;
  const response = await getWeather(postcode);
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// Return IDs of all upcoming bookings from all users
app.get('/admin/upcoming', async (req, res) => {
  const response = await getAdminUpcomingBooking()
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 401) {
    return res.status(401).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// Return IDs of all historical bookings from all users
app.get('/admin/history', async (req, res) => {
  const response = await getAdminHistoryBooking()
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 401) {
    return res.status(401).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// Return IDs of all users
app.get('/admin/users', async (req, res) => {
  const response = await getUsersForAdmin()
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 401) {
    return res.status(401).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

// Return IDs of all users
app.get('/admin/spots', async (req, res) => {
  const response = await getSpotsForAdmin()
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 401) {
    return res.status(401).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

app.get('/user/:userID/notifications', async (req, res) => {
  const userID = req.params.userID;
  const response = await getNotificationsForUser(userID)
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 401) {
    return res.status(401).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

app.get('/notification/:notificationID', async (req, res) => {
  const notificationID = req.params.notificationID;
  const response = await getNotification(notificationID)
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

app.post('/notification/:notificationID/view', async (req, res) => {
  // mark notification as viewed
  const notificationID = req.params.notificationID;
  const response = await viewNotification(notificationID)
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 404) {
    return res.status(404).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

app.get('/admin/:userID/check', async (req, res) => {
  const userID = req.params.userID;
  const response = await checkAdminAccountID(userID)
  if (response.status === 200) {
    return res.status(200).json(response);
  } else if (response.status === 500) {
    return res.status(500).json(response);
  } else {
    return res.status(400).json({ error: 'other error' });
  }
})

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
});

export default server
