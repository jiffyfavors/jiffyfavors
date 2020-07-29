import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  authUser: null,
  profile: null,
  lastUpdate: 0,
  fcmToken: null
})
export const getters = {
  getFCMToken(state) {
    if (state.authUser && state.authUser.fcmToken)
      return state.authUser.fcmToken
    else return state.fcmToken
  },
  getStatus(state) {
    return state.profile ? state.profile.status : 'NA'
  },
  getBalance(state) {
    return state.profile ? state.profile.balance : 0
  },
  getProfile(state) {
    return state.profile ? state.profile.profile : { firstname: '' }
  },
  isAuth(state) {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  getUser(state) {
    return state.authUser
  },
  getOrders(state) {
    return state.orders
  }
}
export const mutations = {
  setFCMToken: (state, data) => {
    state.lastUpdate = new Date().getTime()
    if (state.authUser) state.authUser.fcmToken = data
    else state.fcmToken = data
  },
  RESET_STORE: (state) => {
    Object.assign(state, {
      authUser: null,
      orders: []
    })
  },
  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      id: authUser.uid,
      phoneNumber: authUser.phoneNumber,
      photoURL: authUser.photoURL,
      isAnonymous: authUser.isAnonymous,
      displayName: authUser.displayName,
      email: authUser.email,
      fcmToken: state.fcmToken,
      emailVerified: authUser.emailVerified
    }
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }, ctx) {
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      await dispatch('onAuthStateChanged', {
        authUser,
        claims
      })
    }
  },
  getProfile: firestoreAction(async function({ bindFirestoreRef, state }) {
    const firestore = this.$fireStoreObj()
    var profile = new GeoCollectionReference(firestore.collection('riders'))
    const rider = profile.doc(state.authUser.id)
    return await bindFirestoreRef('profile', rider)
  }),
  onAuthStateChanged({ dispatch, commit }, { authUser }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', {
      authUser
    })
    dispatch('getProfile')
  }
}
