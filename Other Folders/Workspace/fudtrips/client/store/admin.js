import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  merchants: [],
  merchant_info: {
    d: {
      menu: []
    }
  },
  categories: [],
  food: [],
  fare: [null]
})

export const getters = {
  getMerchantInfo(state) {
    return state.merchant_info
  },

  getCategories(state) {
    return state.merchant_info.d.menu
  },
  getFare(state) {
    if (state.fare.length > 0) return state.fare[0]
    else return []
  }
}

export const actions = {
  getMerchantList: firestoreAction(async function({ bindFirestoreRef }) {
    const firestore = this.$fireStoreObj()
    return await bindFirestoreRef('merchants', firestore.collection('merchant'))
  }),

  getFoodByMerchant: firestoreAction(async function(
    { bindFirestoreRef },
    data
  ) {
    const firestore = this.$fireStoreObj()
    const owner = firestore.collection('merchants').doc(data.merchant_id)
    const ref = firestore.collection('foods').where('owner', '==', owner)
    return await bindFirestoreRef('food', ref)
  }),

  getMerchantbyID: firestoreAction(async function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const owner = firestore.collection('merchant').doc(data.merchant_id)
    return await bindFirestoreRef('merchant_info', owner)
  }),

  getArea: firestoreAction(async function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()

    const geocollection = new GeoCollectionReference(
      firestore.collection('areas')
    )
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    return await bindFirestoreRef('fare', query)
  })
}
