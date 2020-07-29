import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  merchants: [],
  billers: [],
  shops: [],
  isHide: false,
  isLoading: false,
  areas: null,
  location: null
})

export const getters = {
  getAreas(state) {
    return state.areas
  },
  getLocation(state) {
    return state.location
  },
  getStores(state) {
    return state.merchants
  },
  getShops(state) {
    return state.shops
  },
  getBillers(state) {
    return state.billers
  },
  isHide(state) {
    return state.isHide
  },
  isLoading(state) {
    return state.isLoading
  }
}

export const mutations = {
  setLocation(state, data) {
    state.location = data
  },
  setHide(state, data) {
    state.isHide = data
  },
  setLoading(state, data) {
    state.isLoading = data
  }
}

export const actions = {
  getNearbyStore: firestoreAction(async function(
    { dispatch, bindFirestoreRef },
    data
  ) {
    const firestore = this.$fireStoreObj()

    const geocollection = new GeoCollectionReference(
      firestore.collection('merchant')
    )
    const query = geocollection
      .near({
        center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
        radius: 15
      })
      .where('draft', '==', false)

    return await bindFirestoreRef('merchants', query).then(async () => {
      return await dispatch('admin/getArea', data, { root: true })
    })
  }),
  getNearbyBiller: firestoreAction(async function(
    { dispatch, bindFirestoreRef },
    data
  ) {
    const firestore = this.$fireStoreObj()

    const geocollection = new GeoCollectionReference(
      firestore.collection('billers')
    )
    const query = geocollection
      .near({
        center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
        radius: 15
      })
      .where('draft', '==', false)

    return await bindFirestoreRef('billers', query).then(async () => {
      return await dispatch('admin/getArea', data, { root: true })
    })
  }),
  getNearbyShops: firestoreAction(async function(
    { dispatch, bindFirestoreRef },
    data
  ) {
    const firestore = this.$fireStoreObj()

    const geocollection = new GeoCollectionReference(
      firestore.collection('shops')
    )
    const query = geocollection
      .near({
        center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
        radius: 15
      })
      .where('draft', '==', false)

    return await bindFirestoreRef('shops', query).then(async () => {
      return await dispatch('admin/getArea', data, { root: true })
    })
  }),


}
