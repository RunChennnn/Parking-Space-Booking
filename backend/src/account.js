import { auth, client, db } from './firebaseConfig.js';
import { getAuth, getIdToken, signOut, signInWithEmailAndPassword } from 'firebase/auth';

const checkPasswordNaive = (pwdstr) => {
  const hasUppercase = /[A-Z]/.test(pwdstr) ? 1 : 0;
  const hasLowercase = /[a-z]/.test(pwdstr) ? 1 : 0;
  const hasNumbers = /\d/.test(pwdstr) ? 1 : 0;

  const hasCount = hasUppercase + hasLowercase + hasNumbers;
  return (pwdstr.length >= 8 && hasCount >= 2);
}

const registerNewAccount = async (email, password) => {
  try {
    if (!checkPasswordNaive(password)) {
      console.log('Error creating account, weak password')
      return ({
        status: 400,
        message: 'Account creation FAILED',
        error: 'Weak Password'
      })
    } else {
      const newUser = await auth.createUser({ email, password });
      const token = await auth.createCustomToken(newUser.uid);
      console.log('Account Created: ', newUser.uid);

      return ({
        status: 201,
        userID: newUser.uid,
        token,
        message: 'Account successfully created'
      });
    }
  } catch (error) {
    console.log('Error creating account: ', error.message);

    return ({
      status: 500,
      message: 'Account creation FAILED',
      error: error.message
    });
  }
}

const signInAccount = async (email, password) => {
  try {
    const clientAuth = getAuth(client);
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const token = await getIdToken(userCredential.user);
    console.log('Signed in successfully: ', userCredential.user.uid);

    return ({
      status: 200,
      userID: userCredential.user.uid,
      token,
      message: 'Signed in successfully'
    });
  } catch (error) {
    console.log('Error signing in: ', error.message);

    return ({
      status: 500,
      message: 'Signed in FAILED',
      error: error.message
    });
  }
}

const deleteAccount = async (uid) => {
  // this should be implemented later stage either by token or password check
  const authorizedUser = true;
  if (authorizedUser) {
    try {
      const renterBooking = await db.collection('Bookings').where('userID', '==', uid).get()
      const ownerBooking = await db.collection('Bookings').where('ownerID', '==', uid).get()
      const ownedSpot = await db.collection('Spots').where('owner', '==', uid).get()
      renterBooking.forEach(doc => doc.ref.delete())
      ownerBooking.forEach(doc => doc.ref.delete())
      ownedSpot.forEach(doc => doc.ref.delete())
      await auth.deleteUser(uid);
      console.log('Account Deleted: ', uid);
      return {
        status: 200,
        message: 'Account successfully deleted'
      };
    } catch (error) {
      console.log('Error deleting account: ', error.message);
      return {
        status: 500,
        message: 'Account deletion FAILED',
        error: error.message
      };
    }
  } else {
    console.log('This user not signed in');
    return {
      status: 401,
      message: 'User not signed in'
    };
  }
}

const authAccountwithPassword = async (email, password) => {
  try {
    const clientAuth = getAuth(client);
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    await getIdToken(userCredential.user);

    return {
      status: 200,
      message: 'Passoword match'
    }
  } catch (error) {
    console.log('Error validating password: ', error.message);
    return {
      status: 400,
      message: 'Password not match',
      error: error.message
    };
  }
}

const signOutAccount = async () => {
  try {
    await signOut(getAuth(client));
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

export { registerNewAccount, signInAccount, deleteAccount, signOutAccount, authAccountwithPassword, checkPasswordNaive };
