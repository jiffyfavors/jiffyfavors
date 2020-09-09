import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference, GeoFirestore } from 'geofirestore'
export const state = () => ({
  authUser: null,
  orders: [],
  bills: [],
  shops: [],
  fcmToken: null,
  lastUpdate: 0,
  isMerchant: false,
  businesses: [],
  defaultBusiness: {},
  myStores: [],
  today:[],
  advance:[],
  history:[]
})
export const getters = {
  isAuth(state) {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  getOrders(state) {
    return {
      today: state.today,
      advance: state.advance,
      history: state.history
    }
  },
  getDefaultBusiness(state) {
    return state.defaultBusiness
  },
  getBusinesses(state) {
    return state.businesses
  },
  lastUpdate(state) {
    return state.lastUpdate
  },
  isMerchant(state) {
    return state.isMerchant
  },
  getFCMToken(state) {
    if (state.authUser && state.authUser.fcmToken) return state.authUser.fcmToken
    else return state.fcmToken
  },
  getUser(state) {
    return state.authUser
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
  }
}
export const mutations = {
  setLastUpdate(state, data) {
    state.lastUpdate = data
  },
  setIsMerchant: (state, data) => {
    state.isMerchant = data
  },
  setFCMToken: (state, data) => {
    state.lastUpdate = new Date().getTime()
    if (state.authUser) state.authUser.fcmToken = data
    else state.fcmToken = data
  },
  setDefaultBusiness: (state, data) => {
    state.defaultBusiness = data
  },
  setBusinesses: (state, data) => {
    state.businesses = data
  },
  RESET_STORE: (state) => {
    Object.assign(state, {
      authUser: null,
      orders: []
    })
  },
  SET_AUTH_USER: (state, { authUser, claims }) => {
    state.isAdmin = claims.admin
    state.authUser = {
      id: authUser.uid,
      phoneNumber: authUser.phoneNumber,
      photoURL: authUser.photoURL,
      isAnonymous: authUser.isAnonymous,
      displayName: authUser.displayName,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      fcmToken: state.fcmToken,
      admin: claims.admin
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
  getMyOrders: firestoreAction(async function({ bindFirestoreRef, state }) {
    const firestore = this.$fireStoreObj()
    const orders = await firestore.collection('orders').where('order.by.id', '==', state.authUser.id)
    return bindFirestoreRef('orders', orders)
  }),
  onAuthStateChanged({ commit }, { authUser, claims }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', {
      authUser,
      claims
    })
  },
  getMyTransaction: firestoreAction(async function({ bindFirestoreRef, state }, data) {
    console.log(data)
    const firestore = this.$fireStoreObj()
    const ref = new GeoCollectionReference(firestore.collection('orders'))
    const ref_shops = new GeoCollectionReference(firestore.collection('shop_request'))
    const bills = new GeoCollectionReference(firestore.collection('billspay_request'))
    await bindFirestoreRef('orders', ref.where('timestamp', '>=', data.start).where('timestamp', '<=', data.end))
    await bindFirestoreRef('shops', ref_shops.where('timestamp', '>=', data.start).where('timestamp', '<=', data.end))
    return await bindFirestoreRef('bills', bills.where('timestamp', '>=', data.start).where('timestamp', '<=', data.end))
  }),
  getTodaysOrder: firestoreAction(async function({ bindFirestoreRef, state }, data) {
    console.log('getting orders')
    let today = this.$generateTimestamp(this.$getNow().substring(0, 10).replace(/-/g, '/'))
    let today_end = this.$generateTimestamp(this.$getNow().substring(0, 10).replace(/-/g, '/'), '11:59 PM')
    let firestore = this.$fireStoreObj()
    let ref = new GeoCollectionReference(firestore.collection('orders'))
    let orders = ref.where('order.merchant.id', 'in', data.ids).where('timestamp', '>=', today).where('timestamp', '<=', today_end)
    return await bindFirestoreRef('today', orders)
  }),
  getAdvanceOrder: firestoreAction(async function({ bindFirestoreRef, state }, data) {
    let today = this.$generateTimestamp(this.$getNow().substring(0, 10).replace(/-/g, '/'), '11:59 PM')
    let firestore = this.$fireStoreObj()
    let ref = new GeoCollectionReference(firestore.collection('orders'))
    let orders = ref.where('order.merchant.id', 'in', data.ids).where('timestamp', '>', today)
    return await bindFirestoreRef('advance', orders)
  }),
  getOrderHistory: firestoreAction(async function({ bindFirestoreRef, state }, data) {
    let start = this.$generateTimestamp(data.date)
    let end = this.$generateTimestamp(data.date,'11:59 PM')
    let firestore = this.$fireStoreObj()
    let ref = new GeoCollectionReference(firestore.collection('orders'))
    let orders = ref.where('order.merchant.id', 'in', data.ids).where('timestamp', '>=', start).where('timestamp','<=', end)
    return await bindFirestoreRef('history', orders)
  })
}
