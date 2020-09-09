import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
import shuffle from 'lodash.shuffle'
import cloneDeep from 'lodash.clonedeep'
export const state = () => ({
  locations: [],
  merchants: [],
  billers: [],
  shops: [],
  isHide: false,
  isLoading: false,
  selectedLocation: {
    lat: 0,
    lng: 0
  },
  storeLocation: {
    lat: 0,
    lng: 0
  }
})
export const getters = {
  getPHCities(){
    return this.$phCities()
  },
  getStoresAsc(state) {
    var stores = []
    state.merchants.forEach((store) => {
      var data = cloneDeep(store)
      data.id = store.id
      stores.push(data)
    })
    return stores.sort((a, b) => a.business_name > b.business_name ? 1 : b.business_name > a.business_name ? -1 : 0)
  },
  getBillersAsc(state) {
    var stores = []
    state.billers.forEach((store) => {
      var data = cloneDeep(store)
      data.id = store.id
      stores.push(data)
    })
    return stores.sort((a, b) => a.business_name > b.business_name ? 1 : b.business_name > a.business_name ? -1 : 0)
  },
  getShopsAsc(state) {
    var stores = []
    state.shops.forEach((store) => {
      var data = cloneDeep(store)
      data.id = store.id
      stores.push(data)
    })
    return stores.sort((a, b) => a.business_name > b.business_name ? 1 : b.business_name > a.business_name ? -1 : 0)
  },
  getStores(state) {
    return state.merchants
  },
  isHide(state) {
    return state.isHide
  },
  isLoading(state) {
    return state.isLoading
  },
  getTestLocation(state) {
    return state.locations
  },
  getDeliveryLocation(state) {
    return state.selectedLocation
  },
  getStoreLocation(state) {
    return state.storeLocation
  }
}
export const mutations = {
  clearLocation(state, data) {
    state.locations = data
  },
  addNewLocation(state, data) {
    state.locations.push(data)
  },
  setMerchantID(state, data) {
    const index = state.merchants.indexOf(data)
    console.log(state.merchants[index])
  },
  setHide(state, data) {
    state.isHide = data
  },
  setLoading(state, data) {
    state.isLoading = data
  },
  setLocation(state, data) {
    state.selectedLocation = {
      lat: data.lat,
      lng: data.lng
    }
  },
  setStoreLocation(state, data) {
    state.storeLocation = {
      lat: data.lat,
      lng: data.lng
    }
  }
}
export const actions = {
  getNearbyStore: firestoreAction(function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('merchant'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    }).where('draft', '==', false)
    return bindFirestoreRef('merchants', query)
  }),
  getStoreByArea: firestoreAction(async function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('merchant'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    return await bindFirestoreRef('merchants', query)
  }),
  getBillersByArea: firestoreAction(async function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('billers'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    return await bindFirestoreRef('billers', query)
  }),
  getShopsByArea: firestoreAction(async function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('shops'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    return await bindFirestoreRef('shops', query)
  })
}
