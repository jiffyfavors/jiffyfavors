export default ({ app, store }) => {
  let user = store.getters['auth/getUser']
  let fcmToken = store.getters['auth/getFCMToken']
  let lastUpdate = store.getters['auth/lastUpdate']
  //if (process.env.NODE_ENV !== 'production') return
  app.$fireMess.onMessage(
    (payload) => {
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            body: payload.notification.body,
            icon: '/icon-96px.png',
            badge: '/badge.png',
            vibrate: [100, 50, 100],
            data: payload.notification.data
          }
          reg.showNotification(payload.notification.title, options)
        })
      }
    },
    (error) => {
      console.log('FCM Error:', error)
    },
    (completed) => {
      console.log('FCM Sucess', completed)
    })
  const topicSubscription = (tokens, topics, fn) => {
    app.$fireFunc.httpsCallable(fn)({
      tokens: tokens,
      topics: topics
    })
  }
  const getToken = async () => {
    let currentToken
    try {
      currentToken = await app.$fireMess.getToken()
    } catch (e) {
      console.log('An error occurred while retrieving token. ', e)
    }
    if (currentToken) {
      setTokenAndSubscribe(currentToken)
    } else {
      console.info('No Instance ID token available. Request permission to generate one.')
    }
  }
  const setTokenAndSubscribe = (token) => {
    app.$fireStoreObj().collection('tokens').doc('admin').get().then((snap) => {
      let index = snap.data().tokens.indexOf(token)
      if (index < 0) {
        topicSubscription([token], ['admin'], 'subscribeToTopic')
        store.commit('auth/setFCMToken', token)
        app.$fireStoreObj().collection('tokens').doc('admin').update({
          tokens: app.$fireStoreObj.FieldValue.arrayUnion(token)
        })
      }
    })
  }
  const onTokenChange = () => {
    try {
      app.$fireMess.onTokenRefresh(async () => {
        try {
          const refreshedToken = await app.$fireMess.getToken()
          setTokenAndSubscribe(refreshedToken)
        } catch (e) {
          console.log('Unable to retrieve refreshed token ', e)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  const initFn = () => {
    onTokenChange()
    let now = new Date().getTime()
    if (now - lastUpdate > 60 * 1000 * 60 * 4 || !fcmToken) {
      getToken()
    }
  }
  app.router.afterEach((to, from) => {
    if ('Notification' in window) {
      if (user) {
        initFn()
      }
    } else {
      store.commit('auth/setFCMToken', 'NA')
    }
  })
}
