import createApp from './app.js'

import authService from './service.auth.js'
import firestoreService from './service.firestore.js'
import storageService from './service.storage.js'

const appConfig = {"apiKey":"AIzaSyDqSXAyqrKZJj6zhY3AiaEdZnghBETq2Lw","authDomain":"laundry-93534.firebaseapp.com","databaseURL":"https:\u002F\u002Flaundry-93534.firebaseio.com","projectId":"laundry-93534","storageBucket":"laundry-93534.appspot.com","messagingSenderId":"791612764515","appId":"1:791612764515:web:66967d60845a2b16782356","measurementId":"G-L8YRMR4XX5"}

export default async (ctx, inject) => {
  /****************************************
  **************** LAZY MODE **************
  ****************************************/

  const { firebase, session } = await createApp(appConfig, ctx)

  let servicePromises = []

  if (process.server) {
    servicePromises = [
      authService(session, firebase, ctx, inject),
    firestoreService(session, firebase, ctx, inject),
    storageService(session, firebase, ctx, inject),

    ]
  }

  if (process.client) {
    servicePromises = [
      authService(session, firebase, ctx, inject),
      firestoreService(session, firebase, ctx, inject),
      storageService(session, firebase, ctx, inject),

    ]
  }

  const [
    auth,
    firestore,
    storage
  ] = await Promise.all(servicePromises)

  const fire = {
    auth: auth,
    firestore: firestore,
    storage: storage
  }

    inject('fireModule', firebase)
    ctx.$fireModule = firebase

  inject('fire', fire)
  ctx.$fire = fire
}
