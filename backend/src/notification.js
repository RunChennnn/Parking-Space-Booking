import { db } from './firebaseConfig.js';
import { isAuthorized } from './authorizer.js'

// this is designed to not check if user exists for security concern
const getNotificationsForUser = async (userID) => {
    try {
        if (!isAuthorized()){
            return {
                status: 401,
                error: 'User Unauthorised'
            }
        }
        let notificationsIDs = []
        const notifications = await db.collection('Notifications').where("owner","==",userID).get()
        notifications.forEach(note => notificationsIDs.push(note.id))
        return{
            status: 200,
            ids: notificationsIDs,
            message: `Notifications for user ${userID} retrieved`
        }

    } catch (error) {
        console.error('Error getting Notifications:', error);
        return {
          status: 500,
          message: 'Notifications for user retrieval FAILED',
          error: error.message
        };
    }
} 

const getNotification = async (notificationID) => {
    try {
        const notifications = await db.collection('Notifications').doc(notificationID).get()
        if (notifications.exists) {
            const { time, viewed, text, spotID } = notifications.data()
            return {
                status: 200,
                time,
                spotID,
                text,
                viewed,
                message: `Notifications ${notificationID} successfully retrieved`
            }
        } else {
            return {
                status: 404,
                error: `Notification ${notificationID} does not exist`
            }
        }
    } catch (error) {
        console.error(`Error getting Notification ${notificationID}:`, error);
        return {
          status: 500,
          message: 'Notification retrieval FAILED',
          error: error.message
        };
    }
} 

const viewNotification = async (notificationID) => {
    try {
        const notifications = await db.collection('Notifications').doc(notificationID).get()
        if (notifications.exists) {
            await notifications.ref.update({viewed:true})
            const newViewed = (await db.collection('Notifications').doc(notificationID).get()).data().viewed
            return {
                status: 200,
                nid: notificationID,
                viewed: newViewed,
                message: `Notification ${notificationID} successfully is now marked as viewed`
            }
        } else {
            return {
                status: 404,
                error: `Notification ${notificationID} does not exist`
            }
        }
    } catch (error) {
        console.error(`Error patching Notification ${notificationID}:`, error);
        return {
          status: 500,
          message: 'Notification patch FAILED',
          error: error.message
        };
    }
} 


export { getNotificationsForUser, getNotification, viewNotification }