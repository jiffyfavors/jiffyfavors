import { firestoreAction } from 'vuexfire'
import { GeoFirestore, GeoCollectionReference } from 'geofirestore'
export const state = () => ({
	riders:[]
})
export const getters = {
  getRiders(state) {
    return state.riders
  }
}
export const mutations = {}
export const actions = {
  getRiders: firestoreAction(async function({ bindFirestoreRef, state }, data) {
    const firestore = this.$fireStoreObj()
    const ref = new GeoCollectionReference(firestore.collection('riders'))
       await bindFirestoreRef('riders', ref.where('area','==',data.area))
  })
}
