import { firestoreAction } from 'vuexfire'
import { GeoCollectionReference } from 'geofirestore'
import shuffle from 'lodash.shuffle'
import clonedeep from 'lodash.clonedeep'
export const state = () => ({
  merchants: [],
  fare: [null],
  currentMerchant: null,
  deliveryinfo: null,
  currentArea: {},
  merchant_info: {
    d: {
      business_name: '',
      menu: []
    }
  },
  categories: [],
  food: []
})
export const mutations = {
  setCurrentArea(state, data) {
    state.currentArea = data
  },
  setCurrentMerchant(state, data) {
    state.currentMerchant = Object.assign({}, data)
  },
  setDeliveryInfo(state, data) {
    state.deliveryinfo = Object.assign({}, data)
  },
  deleteMenu(state, data) {
    var index = state.merchant_info.d.menu.findIndex((val, index) => {
      return val.name === data.name
    })
    if (index > 0) state.merchant_info.d.menu.splice(index, 1)
  },
  updateMenuName(state, data) {
    var index = state.merchant_info.d.menu.findIndex((val, index) => {
      return val.name === data.old_name
    })
    console.log(data, index)
    if (index > -1) state.merchant_info.d.menu[index].name = data.name
  }
}
export const getters = {
  getMerchants(state) {
    return state.merchants
  },
  getCurrentArea(state) {
    return state.currentArea
  },
  getCurrentMerchant(state) {
    return state.currentMerchant
  },
  getDeliveryInfo(state) {
    return state.deliveryinfo
  },
  getFood(state) {
    var food = []
    state.food.forEach((f) => {
      food.push({ ...f })
    })
    return food.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
  },
  getFare(state) {
    return state.fare[0]
  },
  getMerchantInfo(state) {
    return state.merchant_info
  },
  getBusinessInfo(state) {
    return state.merchant_info != null ? state.merchant_info.d : {}
  },
  getCategories(state) {
    var cat = []
    try {
      var allfood = []
      var allcategory = clonedeep(state.merchant_info.d.menu)
      allcategory.forEach((category, index) => {
        if (!category.hasOwnProperty('values')) {
          allcategory[index] = Object.assign({}, {
            name: category.name,
            values: []
          })
        }
        allfood = allfood.concat(category.values)
      })
      var food = []
      state.food.forEach((f) => {
        food.push(f.id)
      })
      cat.push({
        name: 'Draft',
        values: food.filter((a) => allfood.indexOf(a) < 0)
      })
      cat = cat.concat(allcategory.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    } catch (e) {
      console.log(e)
      cat = []
    }
    return cat
  },
  getFood(state) {
    return state.food
  }
}
export const actions = {
  getMerchantList: firestoreAction(async function({ bindFirestoreRef }) {
    const firestore = this.$fireStoreObj()
    return bindFirestoreRef('merchants', firestore.collection('merchant'), {
      wait: true,
      maxRefDepth: 5
    })
  }),
  addFoodItem: firestoreAction(function({ bindFirestoreRef, state }, data) {
    const firestore = this.$fireStoreObj()
    const cat = data.categories.slice()
    const owner = data.merchant_id
    data.owner = [owner]
    delete data.merchant_id
    delete data.categories
    firestore.collection('foods').add(data).then((d) => {
      const menu = []
      state.merchant_info.d.menu.forEach((a) => {
        const m = {
          name: a.name,
          values: []
        }
        a.values.forEach((b) => {
          m.values.push(b)
        })
        cat.forEach((cat_name) => {
          if (cat_name === a.name) {
            m.values.push(d.id)
          }
        })
        menu.push(m)
      })
      firestore.collection('merchant').doc(owner).update({
        'd.menu': menu
      })
    })
  }),
  editFoodItem: firestoreAction(function({ bindFirestoreRef, state }, data) {
    const firestore = this.$fireStoreObj()
    const owner = data.merchant_id
    const id = data.id
    const cat = data.categories.slice()
    data.owner = this.$fireStoreObj.FieldValue.arrayUnion(owner)
    delete data.merchant_id
    delete data.categories
    delete data.id
    firestore.collection('foods').doc(id).update(data).then(() => {
      const menu = []
      state.merchant_info.d.menu.forEach((a) => {
        const m = {
          name: a.name,
          values: []
        }
        if (a.hasOwnProperty('values')) {
          a.values.forEach((b) => {
            if (b !== id) {
              m.values.push(b)
            }
          })
        }
        cat.forEach((cat_name) => {
          if (cat_name === a.name) {
            m.values.push(id)
          }
        })
        menu.push(m)
      })
      firestore.collection('merchant').doc(owner).update({
        'd.menu': menu
      })
    })
  }),
  getFoodByMerchant: firestoreAction(function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    console.log(data.merchant_id)
    const ref = firestore.collection('foods').where('owner', 'array-contains', data.merchant_id)
    bindFirestoreRef('food', ref)
  }),
  updateMenu: firestoreAction(async function({ state }, data) {
    const firestore = this.$fireStoreObj()
    const menu = []
    state.merchant_info.d.menu.forEach((a) => {
      const m = {
        name: a.name,
        values: []
      }
      a.values.forEach((b) => {
        if (b != data.food_id) {
          m.values.push(b)
        }
      })
      menu.push(m)
    })
    if (data.food_id != 'NA') {
      firestore.collection('foods').doc(data.food_id).delete()
    }
    firestore.collection('merchant').doc(data.merchant_id).update({
      'd.menu': menu
    })
  }),
  getMerchantbyID: firestoreAction(async function({ dispatch, bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const owner = firestore.collection('merchant').doc(data.merchant_id)
    dispatch('admin/getFoodByMerchant', data, {
      root: true
    })
    return await bindFirestoreRef('merchant_info', owner)
  }),
  getAreaByLocation: firestoreAction(function({ bindFirestoreRef }, data) {
    const firestore = this.$fireStoreObj()
    const geocollection = new GeoCollectionReference(firestore.collection('areas').doc('PH').collection('areas'))
    const query = geocollection.near({
      center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
      radius: 15
    })
    return bindFirestoreRef('fare', query)
  })
}
