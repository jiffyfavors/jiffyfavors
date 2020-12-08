import { firestoreAction } from 'vuexfire'
export const state = () => ({
  authUser: null,
  profile: {
    balance:0,
    firstname:''
  }
})

export const getters = {
  getBalance(state){
    try{
          return state.profile.balance
        }catch(e){
          console.log(e)
          return 0
        }

  },
  getProfile(state){
    try{
          return state.profile
        }catch(e){
     console.log(e)
          return {
            firstname:'Rider',
            balance:0
          }
        }

  },
  isAuth(state) {
    try {
      return state.authUser.id !== null
    } catch {
      return false
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
      emailVerified: authUser.emailVerified
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
  getProfile: firestoreAction(async function({ bindFirestoreRef, state }) {
    const firestore = this.$fireStoreObj()
    var profile = firestore.collection('riders').doc(state.authUser.id)
    return await bindFirestoreRef('profile', profile)
  }),

  onAuthStateChanged({ commit }, { authUser }) {

    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', { authUser })
  }
}
