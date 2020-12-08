import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { GeoCollectionReference, GeoFirestore } from 'geofirestore'
import shuffle from 'lodash.shuffle'
export const state = () => ({
  merchants: [],
  isHide: false,
  isLoading: false,
  areas:null,
  location:null
})

export const getters = {
  getAreas(state){
    return state.areas
  },
  getLocation(state){
    return state.location
  },
  getStores(state) {
    return state.merchants
  },
  isHide(state) {
    return state.isHide
  },
  isLoading(state) {
    return state.isLoading
  }
}

export const mutations = {
  setLocation(state, data){
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
  getNearbyStore: firestoreAction(async function({ dispatch, bindFirestoreRef }, data) {
    var firestore = this.$fireStoreObj()

    var geocollection = new GeoCollectionReference(
      firestore.collection('merchant')
    )
    const query = geocollection
      .near({
        center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
        radius: 15
      })
      .where('draft', '==', false)
   
    return bindFirestoreRef('merchants', query).then(()=>{
      return    dispatch('admin/getArea', data, {root:true})
    })
  })
}
