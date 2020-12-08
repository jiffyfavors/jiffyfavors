export const state = () => ({
  business: {
    id: 'NA',
    name: 'NA',
    branch: 'NA'
  },
  items: [],
  list: [],
  showCart: false,
  rates: {}
})

export const getters = {
  getList(state) {
    return state.list
  },
  getStoreID(state) {
    return state.business
  },
  getCartItemCount(state) {
    return state.items.length
  },
  getRates(state) {
    return state.rates
  },
  getCartData(state) {
    return state
  },
  getStoreLocation(state) {
    return state.business.location
  },
  getTotal(state) {
    const item = state.items
    let total = 0
    for (let i = 0; i < item.length; i++) {
      total = total + item[i].info.base_price * item[i].qty
      const addons = Object.values(item[i].add_ons)

      addons.forEach((a) => {
        if (Array.isArray(a)) {
          a.forEach((b) => {
            total = total + b.price * item[i].qty
          })
        } else {
          total = total + a.price * item[i].qty
        }
      })
    }

    return total
  }
}
export const mutations = {
  clearList(state){
    state.list = []
  },
  addList(state, data) {
    state.list.push(data)
  },
  removeFromList(state, index){
    state.list.splice(index,1)
  },
  updateItemList(state, data){
    state.list[data.index] = data.data
  },
  setRate(state, data) {
    state.rates = Object.assign({}, data)
  },
  add(state, data) {
    state.business = Object.assign({}, data.business)
    delete data.item.info.options
    delete data.item.info.owner
    state.items.push(data.item)
  },

  clearCart(state) {
    state.items = []
    state.business = Object.assign(
      {},
      {
        id: 'NA',
        name: 'NA',
        branch: 'NA'
      }
    )
  },

  remove(state, item) {
    state.items.splice(state.items.indexOf(item), 1)
  }
}
