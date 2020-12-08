import * as firebase from 'firebase/app'

const config = {"apiKey":"AIzaSyDqSXAyqrKZJj6zhY3AiaEdZnghBETq2Lw","authDomain":"laundry-93534.firebaseapp.com","databaseURL":"https:\u002F\u002Flaundry-93534.firebaseio.com","projectId":"laundry-93534","storageBucket":"laundry-93534.appspot.com","messagingSenderId":"791612764515","appId":"1:791612764515:web:66967d60845a2b16782356","measurementId":"G-L8YRMR4XX5"}

export default async ({ res }, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  const session = firebase.apps[0]

  /** --------------------------------------------------------------------------------------------- **/
  /** -------------------------------------- FIREBASE AUTH ---------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  await import(/* webpackChunkName: 'firebase-auth' */'firebase/auth')

  const fireAuth = session.auth()
  const fireAuthObj = firebase.auth
  inject('fireAuth', fireAuth)
  inject('fireAuthObj', fireAuthObj)

  // persistence should only be enabled client side
  if (process.client) {
    const persistence = firebase.auth.Auth.Persistence.LOCAL

    try {
      await fireAuth.setPersistence(persistence)
    } catch (err) {
      if (err.code === 'auth/invalid-persistence-type') {
        console.warn(`[@nuxtjs/firebase]: Invalid persistence type '${persistence}' provided`)
      } else if (err.code === 'auth/unsupported-persistence-type') {
        console.warn(`[@nuxtjs/firebase]: Persistence type '${persistence}' is not supported in this environment.`)
      }
    }
  }

  /** --------------------------------------------------------------------------------------------- **/
  /** ------------------------------------- FIREBASE FIRESTORE ------------------------------------ **/
  /** --------------------------------------------------------------------------------------------- **/

  await import(/* webpackChunkName: 'firebase-firestore' */'firebase/firestore')

  const fireStore = session.firestore()
  const fireStoreObj = firebase.firestore
  inject('fireStore', fireStore)
  inject('fireStoreObj', fireStoreObj)

  // persistence should only be enabled client side
  if (process.client) {
    try {
      await fireStore.enablePersistence({})
    } catch (err) {
      if (err.code == 'failed-precondition') {
        console.warn('[@nuxtjs/firebase]: Firestore Persistence not enabled. Multiple tabs open, persistence can only be enabled in one tab at a a time.')
      } else if (err.code == 'unimplemented') {
        console.info('[@nuxtjs/firebase]: Firestore Persistence not enabled. The current browser does not support all of the features required to enable persistence.')
      }
    }
  }

  /** --------------------------------------------------------------------------------------------- **/
  /** -------------------------------------- FIREBASE STORAGE ------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  await import(/* webpackChunkName: 'firebase-storage' */'firebase/storage')

  const fireStorage = session.storage()
  const fireStorageObj = firebase.storage
  inject('fireStorage', fireStorage)
  inject('fireStorageObj', fireStorageObj)

  /** --------------------------------------------------------------------------------------------- **/
  /** ------------------------------------ FIREBASE FUNCTIONS ------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  await import(/* webpackChunkName: 'firebase-functions' */'firebase/functions')

  const fireFunc = session.functions()
  const fireFuncObj = firebase.functions

  inject('fireFunc', fireFunc)
  inject('fireFuncObj', fireFuncObj)

  /** --------------------------------------------------------------------------------------------- **/
  /** ------------------------------------ FIREBASE MESSAGING ------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  // Firebase Messaging can only be initiated on client side
  if (process.client) {
    await import(/* webpackChunkName: 'firebase-messaging' */'firebase/messaging')

    if (firebase.messaging.isSupported()) {
      const fireMess = session.messaging()
      const fireMessObj = firebase.messaging

      inject('fireMess', fireMess)
      inject('fireMessObj', fireMessObj)
    }
  }

  /** --------------------------------------------------------------------------------------------- **/
  /** ----------------------------------- FIREBASE ANALYTICS -------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  // Firebase Analytics can only be initiated on the client side
  if (process.client) {
    await import(/* webpackChunkName: 'firebase-analytics' */'firebase/analytics')

    const fireAnalytics = session.analytics()
    const fireAnalyticsObj = firebase.analytics
    inject('fireAnalytics', fireAnalytics)
    inject('fireAnalyticsObj', fireAnalyticsObj)
  }
}
