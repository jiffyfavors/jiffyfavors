import {
  GeoCollectionReference
} from 'geofirestore'
export default {
  computed: {
    isNotifAllowed() {
      return Notification.permission === 'granted' ? true : false
    },
    user() {
      return this.$store.getters['auth/getUser']
    },
    lastUpdate() {
      try {
        return this.$store.getters['auth/lastUpdate']
      } catch (e) {
        return new Date().getTime() - 119000
      }
    },
    fcmToken() {
      return this.$store.getters['auth/getFCMToken']
    },
    df() {
      return this.$store.getters['admin/getFare']
    }
  },
  mounted() {
    let now = new Date().getTime()
    if (now - this.lastUpdate > 60 * 1000 * 30) {
      if (!this.fcmToken || this.fcmToken === null) {
        this.getToken()
      }
      try {
        this.$fireMess.onMessage(
          (payload) => {
            this.displayNotification(payload)
          }, (error) => {
            console.log('FCM Error:', error)
          }, (completed) => {
            console.log('FCM Sucess', completed)
          })
        this.$store.commit('auth/setLastUpdate', now)
        this.getLocation()
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    displayNotification(payload) {
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            body: payload.notification.body,
            icon: '/icon-96px.png',
            badge: '/icon-96px.png',
            vibrate: [100, 50, 100],
            data: payload.notification.data
          }
          reg.showNotification(payload.notification.title, options)
        })
      }
    },
    topicSubscription(tokens, topics, fn) {
      this.$fireFunc.httpsCallable(fn)({
        tokens: tokens,
        topics: topics
      })
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            let coord = pos.coords
            if (coord.accuracy < 100) {
              if (this.user) {
                const firestore = this.$fireStoreObj()
                const user = new GeoCollectionReference(firestore.collection('users'))
                let payload = {
                  coordinates: new this.$fireStoreObj.GeoPoint(coord.latitude, coord.longitude)
                }
                if (this.fcmToken) payload.tokens = this.$fireStoreObj.FieldValue.arrayUnion(this.fcmToken)
                user.doc(this.user.id).update(payload)
              }
              if (this.isNotifAllowed) {
                this.$store.dispatch('admin/getArea', {
                  lat: coord.latitude,
                  lng: coord.longitude
                }).then(() => {
                  this.getToken()
                  this.onTokenChange()
                })
              }
            } else {
              this.getToken()
              this.onTokenChange()
            }
          },
          (err) => {
            console.log(err)
          },
          {
            enableHighAccuracy: true,
            timeout: Infinity
          })
      }
    },
    async getToken() {
      let currentToken
      try {
        currentToken = await this.$fireMess.getToken()
      } catch (e) {
        console.log('An error occurred while retrieving token. ', e)
      }
      if (currentToken) {
        if (!this.fcmToken) this.updateServerToken(null, currentToken)
        this.$store.commit('auth/setFCMToken', currentToken)
      }
      if (currentToken && this.fcmToken && currentToken !== this.fcmToken) {
        this.updateServerToken(this.fcmToken, currentToken)
      } else {
        console.info('No Instance ID token available. Request permission to generate one.')
      }
    },
    updateServerToken(oldtoken, newtoken) {
      this.$store.commit('auth/setFCMToken', newtoken)
      const firestore = this.$fireStoreObj()
      const user = new GeoCollectionReference(firestore.collection('users'))
      const area = new GeoCollectionReference(firestore.collection('areas').doc(this.df.id).collection('tokens'))
      let path = this.user ? 'registered' : 'unregistered'
      if (oldtoken || oldtoken.length > 0) {
        if (this.user) {
          user.doc(this.user.id).update({
            tokens: this.$fireStoreObj.FieldValue.arrayRemove(oldtoken)
          })
        }
        area.doc(path).update({
          tokens: this.$fireStoreObj.FieldValue.arrayRemove(oldtoken)
        })
        this.topicSubscription(
          [oldtoken],
          [path, path + '_' + area_name, path + '_' + this.df.country.code], 'unsubscribeFromTopic')
      }
      if (newtoken || newtoken.length > 0) {
        area.doc(path).update({
          tokens: this.$fireStoreObj.FieldValue.arrayUnion(newtoken)
        })
        this.topicSubscription(
          [newtoken],
          [path, path + '_' + area_name, path + '_' + this.df.country.code], 'subscribeToTopic')
        let area_name = this.df.name.replace(/ /g, '_').toLowerCase()
        if (this.user) {
          user.doc(this.user.id).update({
            tokens: this.$fireStoreObj.FieldValue.arrayUnion(newtoken)
          })
        }
      }
    },
    onTokenChange() {
      try {
        this.$fireMess.onTokenRefresh(async () => {
          try {
            const refreshedToken = await this.$fireMess.getToken()
            this.updateServerToken(this.fcmToken, currentToken)
          } catch (e) {
            console.log('Unable to retrieve refreshed token ', e)
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
