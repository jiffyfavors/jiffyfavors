import * as firebase from 'firebase/app'

const config = {"apiKey":"AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc","authDomain":"sound-aileron-279710.firebaseapp.com","databaseURL":"https:\u002F\u002Fsound-aileron-279710.firebaseio.com","projectId":"sound-aileron-279710","storageBucket":"sound-aileron-279710.appspot.com","messagingSenderId":"953894101400","appId":"1:953894101400:web:c06b9af64f518a17f14bed","measurementId":"G-RLCD9YBDHX"}

export default async ({ res }, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  const session = firebase.apps[0]

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
}
