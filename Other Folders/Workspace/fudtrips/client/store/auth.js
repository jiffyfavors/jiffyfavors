import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  authUser: null,
  orders: [],
  bills: [],
  shops: [],
  lastUpdate: 0,
  fcmToken: null
})

export const getters = {
  isAuth(state) {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  getFCMToken(state) {
    if (state.authUser && state.authUser.fcmToken) return state.authUser.fcmToken
    else return state.fcmToken
  },
  lastUpdate(state) {
    return state.lastUpdate
  },
  getMyTransaction(state) {
    return {
      orders: {
        data: state.orders,
        size: state.orders.length
      },
      bills: {
        data: state.bills,
        size: state.bills.length
      },
      shops: {
        data: state.shops,
        size: state.shops.length
      }
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
  fcmTokenSetter(state, data) {
    state.authUser.fcmToken = data
  },
  setLastUpdate: (state, data) => {
    state.lastUpdate = data
  },
  setFCMToken: (state, data) => {
    state.lastUpdate = new Date().getTime()
    if (state.authUser) state.authUser.fcmToken = data
    else state.fcmToken = data
  },
  RESET_STORE: (state) => {
    Object.assign(state, { authUser: null, orders: [] })
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      id: authUser.uid,
      phoneNumber: authUser.phoneNumber,
      photoURL: authUser.photoURL,
      isAnonymous: authUser.isAnonymous,
      displayName: authUser.displayName,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      fcmToken:state.fcmToken,
    }
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }, ctx) {
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { claims, ...authUser } = ctx.res.locals.user
      await dispatch('onAuthStateChanged', {
        authUser,
        claims
      })
    }
  },
  getMyTransaction: firestoreAction(async function({
    bindFirestoreRef,
    state
  }) {
    if (!state.authUser) return
    const firestore = this.$fireStoreObj()
    const ref = new GeoCollectionReference(firestore.collection('orders'))
    const ref_shops = new GeoCollectionReference(
      firestore.collection('shop_request')
    )
    const bills = new GeoCollectionReference(
      firestore.collection('billspay_request')
    )
    await bindFirestoreRef(
      'orders',
      ref.where('order.by.id', '==', state.authUser.id)
    )
    await bindFirestoreRef(
      'shops',
      ref_shops.where('contact.id', '==', state.authUser.id)
    )
    return await bindFirestoreRef(
      'bills',
      bills.where('contact.id', '==', state.authUser.id)
    )
  }),
  onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', { authUser })
  }
}
