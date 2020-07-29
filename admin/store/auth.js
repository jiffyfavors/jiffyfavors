import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  authUser: null,
  orders: [],
  bills: [],
  shops: [],
  fcmToken: null,
  lastUpdate: 0,
  isAdmin:true
})
export const getters = {
  isAuth(state) {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  lastUpdate(state){
    return state.lastUpdate
  },
  isAdmin(state){
    return state.isAdmin
  },
  getFCMToken(state) {
    if (state.authUser && state.authUser.fcmToken)
      return state.authUser.fcmToken
    else return state.fcmToken
  },
  getUser(state) {
    return state.authUser
  },
  getOrders(state) {
    return state.orders
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
  setLastUpdate(state, data){
    state.lastUpdate = data
  },
  setIsAdmin : (state, data)=>{
    state.isAdmin = data
  }, 
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
    const orders = await firestore
      .collection('orders')
      .where('order.by.id', '==', state.authUser.id)
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
  getMyTransaction: firestoreAction(async function(
    { bindFirestoreRef, state },
    data
  ) {
    console.log(data)
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
      ref
        .where('timestamp', '>=', data.start)
        .where('timestamp', '<=', data.end)
    )
    await bindFirestoreRef(
      'shops',
      ref_shops
        .where('timestamp', '>=', data.start)
        .where('timestamp', '<=', data.end)
    )
    return await bindFirestoreRef(
      'bills',
      bills
        .where('timestamp', '>=', data.start)
        .where('timestamp', '<=', data.end)
    )
  })
}
