import { initializeApp } from 'firebase'

const app = initializeApp({
	apiKey: "AIzaSyANJwFrZ7S5i7ky8f09PCrfG3qCLgvWOCQ",
    authDomain: "palawan-van.firebaseapp.com",
    databaseURL: "https://palawan-van.firebaseio.com",
    projectId: "palawan-van",
    storageBucket: "palawan-van.appspot.com",
    messagingSenderId: "454941456264",
    appId: "1:454941456264:web:4cb2f2819e929f1c"
})


app.firestore().settings({
  cacheSizeBytes: app.firestore.CACHE_SIZE_UNLIMITED,
});

app.firestore().enablePersistence({
	synchronizeTabs:true
})



export const db=  app.firestore()
export const svc = db.collection('transfers')
export const bookings = db.collection('bookings')
export const users = db.collection('users')
export const tours = db.collection('tours')
export const listing = db.collection('services')
export const agent = db.collection('agents')
export const agent_user = db.collection('agent_user')
export const dbrates  = db.collection('request_rate')
export const fs = app.storage().ref()
export const auth = app.auth()