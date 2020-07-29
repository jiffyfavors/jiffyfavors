import {
  firestoreAction
} from 'vuexfire'
import {
  GeoFirestore,
  GeoCollectionReference
} from 'geofirestore'
export const state = () => ({
  isLoading: false,
  openjobs: {
    food: [],
    billspay: [],
    shop: []
  },
  acceptedjobs: {
    food: [],
    billspay: [],
    shop: []
  },
  completedjobs: {
    food: [],
    billspay: [],
    shop: []
  },
  location: null,
  area: null,
  acceptedjobs_balance: 0,
  lastUpdate: 0,
  lastUpdateArea: 0
})
export const getters = {
  isLoading(state) {
    return state.isLoading
  },
  getArea(state) {
    return state.area
  },
  getCurrentJobCount(state) {
    return (state.acceptedjobs.food.length + state.acceptedjobs.billspay.length + state.acceptedjobs.shop.length)
  },
  getLocation(state) {
    return state.location
  },
  getAccBalance(state) {
    var total = 0
    try {
      state.acceptedjobs.food.forEach((job) => {
        total = total + job.amount.delivery.platform + job.amount.sc.markup + job.amount.sc.store
      })
      state.acceptedjobs.billspay.forEach((job) => {
        total = total + job.fees.pickup.fees.platform + job.fees.dropoff.fees.platform + job.fees.sf * 0.4
      })
      state.acceptedjobs.shop.forEach((job) => {
        total = total + job.fees.delivery.platform
        let item_total = 0;
        job.items.forEach(item => {
          item_total = item_total + (item.qty * item.price)
        })
        total = total + ((item_total * (job.fees.sc / 100)) * 0.4)
      })
    } catch (e) {
      console.log(e)
    }
    return total
  },
  getLastUpdateArea(state) {
    return state.lastUpdateArea
  },
  getLastUpdate(state) {
    return state.lastUpdate
  },
  getJobs(state) {
    return {
      open: state.openjobs,
      accepted: state.acceptedjobs,
      completed: state.completedjobs
    }
  }
}
export const mutations = {
  setLoading(state, data) {
    state.isLoading = data
  },
  setArea(state, data) {
    state.area = data
  },
  suspendAccount(state) {
    Object.keys(state.openjobs).forEach(a => {
      state.openjobs[a] = []
    })
  },
  setLastUpdateArea(state) {
    state.lastUpdateArea = new Date().getTime()
  },
  setLocation(state, data) {
    state.lastUpdate = new Date().getTime()
    state.location = {
      lat: data.lat,
      lng: data.lng
    }
  },
  resetJob(state, data) {
    state.jobs = data
  },
  removeJob(state, data) {
    for (var i = 0; i < state.openjobs.length; i++) {
      if (state.openjobs[i].id === data) {
        state.openjobs.splice(i, 1)
      }
    }
  },
  removeAccJob(state, data) {
    for (var i = 0; i < state.acceptedjobs.length; i++) {
      if (state.acceptedjobs[i].id === data) {
        state.acceptedjobs.splice(i, 1)
      }
    }
  }
}
export const actions = {
  getJobs: firestoreAction(async function({
    rootState,
    commit,
    bindFirestoreRef,
    state
  }, data) {
    commit('setLoading', true)
    const firestore = this.$fireStoreObj()
    const geofirestore = new GeoFirestore(firestore)
    const geocollection = geofirestore.collection('orders')
    const query = geocollection.where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'accepted')
    await bindFirestoreRef('acceptedjobs.food', query)
    const bills = geofirestore.collection('billspay_request').where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'accepted')
    await bindFirestoreRef('acceptedjobs.billspay', bills)
    const shop = geofirestore.collection('shop_request').where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'accepted')
    await bindFirestoreRef('acceptedjobs.shop', shop)
    commit('setLoading', false)
  }),
  suspendAccount: firestoreAction(async function({ dispatch, commit, unbindFirestoreRef, state }) {
    Object.keys(state.openjobs).forEach(a => {
      unbindFirestoreRef(a)
    })
    commit('suspendAccount')
  }),
  getCompeletedJobs: firestoreAction(async function({
    rootState,
    commit,
    bindFirestoreRef,
    state
  }, data) {
    commit('setLoading', true)
    let start = this.$generateTimestamp(this.$getNow())
    const firestore = this.$fireStoreObj()
    const geofirestore = new GeoFirestore(firestore)
    const geocollection = geofirestore.collection('orders')
    const query = geocollection.where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'completed').where('completion_time', '>=', start)
    await bindFirestoreRef('completedjobs.food', query)
    const bills = geofirestore.collection('billspay_request').where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'completed').where('completion_time', '>=', start)
    await bindFirestoreRef('completedjobs.billspay', bills)
    const shop = geofirestore.collection('shop_request').where('rider', '==', rootState.auth.authUser.id).where('status', '==', 'completed').where('completion_time', '>=', start)
    await bindFirestoreRef('completedjobs.shop', shop)
    commit('setLoading', false)
  }),
  getAvailableJobs: firestoreAction(async function({
    commit,
    dispatch,
    rootState,
    getters,
    bindFirestoreRef,
    state
  }, data) {
    if (data) {
      commit('setLastUpdateArea', data)
    }
    if (!state.location) return
    if (!rootState.auth.authUser) return
    if (!state.area) return
    let limit = 5 - parseInt(getters['getCurrentJobCount'])
    let status = rootState.auth.profile.status
    console.log(limit, status.job, status.profile)
    if (limit > 0 && status.job === 'ACCEPTING' && status.profile === 'ACTIVE' && navigator.onLine) {
      commit('setLoading', true)
      console.log('getting jobs')
      const firestore = this.$fireStoreObj()
      let food = new GeoCollectionReference(firestore.collection('orders'))
      let bills = new GeoCollectionReference(firestore.collection('billspay_request'))
      let shop = new GeoCollectionReference(firestore.collection('shop_request'))
      var next = new Date()
      let area = state.area
      let start = this.$generateTimestamp(this.$getNow(), this.$formatAMPM(next))
      next = new Date(next.getTime() + 90 * 60000)
      let end = this.$generateTimestamp(this.$getNow().substring(0, 10), this.$formatAMPM(next))
      let foodref = food.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('timestamp', '>=', start).where('timestamp', '<=', end).where('area', '==', area).limit(limit)
      let shopref = shop.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('timestamp', '>=', start).where('timestamp', '<=', end).where('area', '==', area).limit(limit)
      let billsref = bills.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('timestamp', '>=', start).where('timestamp', '<=', end).where('area', '==', area).limit(limit)
      await bindFirestoreRef('openjobs.food', foodref)
      await bindFirestoreRef('openjobs.billspay', billsref)
      await bindFirestoreRef('openjobs.shop', shopref)
      //ASAP
      await bindFirestoreRef('openjobs.asap_billspay', bills.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('appointment.time', '==', 'ASAP').where('area', '==', area).limit(limit))
      await bindFirestoreRef('openjobs.asap_shop', shop.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('date.time', '==', 'ASAP').where('area', '==', area).limit(limit))
      await bindFirestoreRef('openjobs.asap_food', food.where('rider', '==', 'unassigned').where('status', '==', 'placed').where('delivery.time', '==', 'ASAP').where('area', '==', area).limit(limit))
      commit('setLoading', false)
    } else {
      dispatch('suspendAccount')
    }
  }),
  getArea: function({
    commit
  }, data) {
    commit('setLastUpdateArea')
    commit('setLoading', true)
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('areas'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    commit('setArea', null)
    query.get().then((area) => {
      commit('setLoading', false)
      commit('setArea', area.docs[0].id)
    })
  }
}
