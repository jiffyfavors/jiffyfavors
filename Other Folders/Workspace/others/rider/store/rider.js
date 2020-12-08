import { firestoreAction } from 'vuexfire'
import { GeoFirestore, GeoCollectionReference } from 'geofirestore'
export const state = () => ({
  openjobs: [],
  acceptedjobs: [],
  ongoingjobs: [],
  completedjobs: [],
  location: {},
  acceptedjobs_balance:0,
})

export const getters = {
  getLocation(state) {
    return state.location
  },
  getAccBalance(state){
    var total = 0
    if(state.acceptedjobs!==null){
          state.acceptedjobs.forEach(job=>{
    total = total +  job.amount.delivery.platform +job.amount.sc.markup +job.amount.sc.store
    })
    }

    return total
  },
  getJobs(state) {
    return {
      open:  state.openjobs,
      accepted: state.acceptedjobs,
      ongoing: state.ongoingjobs,
      completed: state.completedjobs
    }
  }
}


export const mutations = {
  setLocation(state, data) {
    state.location = {
      lat: data.lat,
      lng: data.lng
    }
  },
  resetJob(state, data) {
    state.jobs = data
  },
  removeJob(state, data){
    for(var i=0;i<state.openjobs.length;i++){
       if(state.openjobs[i].id===data){
         state.openjobs.splice(i, 1)

       }
    }
  },

    removeAccJob(state, data){
    for(var i=0;i<state.acceptedjobs.length;i++){
       if(state.acceptedjobs[i].id===data){
         state.acceptedjobs.splice(i, 1)

       }
    }
  }

}
export const actions = {

  getJobs: firestoreAction(async function({ bindFirestoreRef, state }, data) {
 
    const firestore = this.$fireStoreObj()
    const geofirestore = new GeoFirestore(firestore)
    const geocollection = geofirestore.collection('orders')
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(state.location.lat, state.location.lng),
      radius: 15
    }).where('assign_rider', '==', data.rider).where('delivery.date', '==', new Date().toISOString().slice(0, 10)).where('status', '==', data.status)
    return await bindFirestoreRef(data.bindTo, query, {wait:true})
  })

}
