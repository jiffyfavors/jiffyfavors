export const state = () => ({
  business: {
    id: 'NA',
    name: 'NA',
    branch: 'NA'
  },
  items: [],
  showCart: false,
  rates: {},
})

export const getters = {

  getStoreID (state) {
    return state.business
  },
  getCartItemCount (state) {
    return state.items.length
  },
  getRates (state) {
    return state.rates
  },
  getCartData (state) {
    return state
  },
  getStoreLocation(state){
    return state.business.location
  },
  getTotal (state) {
    const item = state.items
    let total = 0
    for (var i = 0; i < item.length; i++) {
      total = total + (item[i].info.base_price * item[i].qty)
      const addons = Object.values(item[i].add_ons)

      addons.forEach((a) => {
        if (Array.isArray(a)) {
          a.forEach((b) => {
            total = total + (b.price * item[i].qty)
          })
        } else {
          total = total + (a.price * item[i].qty)
        }
      })
    }

    return total
  }
}
export const mutations = {
  setRate (state, data) {
    state.rates = Object.assign({}, data)
  },
  add (state, data) {
    state.business = Object.assign({}, data.business)
    state.items.push(data.item)
  },

  clearCart (state) {
    state.items = []
   state.business = null
  },

  remove (state, item) {
    state.items.splice(state.items.indexOf(item), 1)
  }
}
