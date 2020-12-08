import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        cart: [],
        cartID: '',
        partners: [],
        areas: [{
            "code": "ELN",
            "locations": [{
                "name": "Hotel in Corong Corong Area",
                "rate": 0
            }, {
                "name": "El Nido Bus Terminal",
                "rate": 0
            }, {
                "name": "Lio Estate or Villa Libertad Area",
                "rate": 850
            }, {
                "name": "El Nido Cove Resort",
                "rate": 1200
            }, {
                "name": "Nacpan & Bucana Area",
                "rate": 1800
            }, {
                "name": "Duli Beach",
                "rate": 2500
            }, {
                "name": "San Fernando & Sibaltan Area",
                "rate": 3000
            }]
        }, {
            "code": "PPS",
            "locations": [{
                "name": "Puerto Princesa International Airport(PPS)",
                "rate": 0
            }, {
                "name": "Hotel in Puerto Princesa City Center",
                "rate": 0
            }, {
                "name": "PPS North Area",
                "rate": 0
            }, {
                "name": "Sabang Area",
                "rate": 0
            }]
        }, {
            "code": "SAB",
            "locations": [{
                "name": "Sabang Beach",
                "rate": 0
            }, {
                "name": "Sabang Wharf",
                "rate": 0
            }, {
                "name": "Daluyon Beach & Mountain Resort",
                "rate": 100
            }, {
                "name": "Sheridan Beach Resort & Spa",
                "rate": 100
            }]
        }, {
            "code": "SVC",
            "locations": [{
                "name": "Poblacion, San Vicente",
                "rate": 0
            }, {
                "name": "San Vicente Airport(SWL)",
                "rate": 0
            }, {
                "name": "San Vicente Van Terminal",
                "rate": 0
            }, {
                "name": "Brgy. Alimanguhan",
                "rate": 500
            }, {
                "name": "Panindigan",
                "rate": 500
            }]
        }, {
            "code": "PBT",
            "locations": [{
                "name": "Port Barton Common Terminal",
                "rate": 0,
            }, {
                "name": "Hotel in Port Barton",
                "rate": 100,
            }]

        }],
        services: [],
        search: {
            origin: 'PPS',
            desti: 'ELN',
            traveldate: new Date().toISOString().substr(0, 10),
            pax: 2
        },
        contactSheet: false,
        bookings: [],
        currency: 'PHP',
        trans_details: {},
        revCount: {
            taDs: 80,
            taPV: 44
        },
        mode: false,
        currentUser: {},
        trans_result: [],
        tour_result: [],
        exchange: [],
        wishlist: [],
        nationality: [
            "Afghan",
            "Albanian",
            "Algerian",
            "American",
            "Andorran",
            "Angolan",
            "Antiguans",
            "Argentinean",
            "Armenian",
            "Australian",
            "Austrian",
            "Azerbaijani",
            "Bahamian",
            "Bahraini",
            "Bangladeshi",
            "Barbadian",
            "Barbudans",
            "Batswana",
            "Belarusian",
            "Belgian",
            "Belizean",
            "Beninese",
            "Bhutanese",
            "Bolivian",
            "Bosnian",
            "Brazilian",
            "British",
            "Bruneian",
            "Bulgarian",
            "Burkinabe",
            "Burmese",
            "Burundian",
            "Cambodian",
            "Cameroonian",
            "Canadian",
            "Cape Verdean",
            "Central African",
            "Chadian",
            "Chilean",
            "Chinese",
            "Colombian",
            "Comoran",
            "Congolese",
            "Costa Rican",
            "Croatian",
            "Cuban",
            "Cypriot",
            "Czech",
            "Danish",
            "Djibouti",
            "Dominican",
            "Dutch",
            "East Timorese",
            "Ecuadorean",
            "Egyptian",
            "Emirian",
            "Equatorial Guinean",
            "Eritrean",
            "Estonian",
            "Ethiopian",
            "Fijian",
            "Filipino",
            "Finnish",
            "French",
            "Gabonese",
            "Gambian",
            "Georgian",
            "German",
            "Ghanaian",
            "Greek",
            "Grenadian",
            "Guatemalan",
            "Guinea-Bissauan",
            "Guinean",
            "Guyanese",
            "Haitian",
            "Herzegovinian",
            "Honduran",
            "Hungarian",
            "I-Kiribati",
            "Icelander",
            "Indian",
            "Indonesian",
            "Iranian",
            "Iraqi",
            "Irish",
            "Israeli",
            "Italian",
            "Ivorian",
            "Jamaican",
            "Japanese",
            "Jordanian",
            "Kazakhstani",
            "Kenyan",
            "Kittian and Nevisian",
            "Kuwaiti",
            "Kyrgyz",
            "Laotian",
            "Latvian",
            "Lebanese",
            "Liberian",
            "Libyan",
            "Liechtensteiner",
            "Lithuanian",
            "Luxembourger",
            "Macedonian",
            "Malagasy",
            "Malawian",
            "Malaysian",
            "Maldivan",
            "Malian",
            "Maltese",
            "Marshallese",
            "Mauritanian",
            "Mauritian",
            "Mexican",
            "Micronesian",
            "Moldovan",
            "Monacan",
            "Mongolian",
            "Moroccan",
            "Mosotho",
            "Motswana",
            "Mozambican",
            "Namibian",
            "Nauruan",
            "Nepalese",
            "New Zealander",
            "Nicaraguan",
            "Nigerian",
            "Nigerien",
            "North Korean",
            "Northern Irish",
            "Norwegian",
            "Omani",
            "Pakistani",
            "Palauan",
            "Panamanian",
            "Papua New Guinean",
            "Paraguayan",
            "Peruvian",
            "Polish",
            "Portuguese",
            "Qatari",
            "Romanian",
            "Russian",
            "Rwandan",
            "Saint Lucian",
            "Salvadoran",
            "Samoan",
            "San Marinese",
            "Sao Tomean",
            "Saudi",
            "Scottish",
            "Senegalese",
            "Serbian",
            "Seychellois",
            "Sierra Leonean",
            "Singaporean",
            "Slovakian",
            "Slovenian",
            "Solomon Islander",
            "Somali",
            "South African",
            "South Korean",
            "Spanish",
            "Sri Lankan",
            "Sudanese",
            "Surinamer",
            "Swazi",
            "Swedish",
            "Swiss",
            "Syrian",
            "Taiwanese",
            "Tajik",
            "Tanzanian",
            "Thai",
            "Togolese",
            "Tongan",
            "Trinidadian or Tobagonian",
            "Tunisian",
            "Turkish",
            "Tuvaluan",
            "Ugandan",
            "Ukrainian",
            "Uruguayan",
            "Uzbekistani",
            "Venezuelan",
            "Vietnamese",
            "Welsh",
            "Yemenite",
            "Zambian",
            "Zimbabwean"
        ]

    },
    getters: {
        getBookings: (state) => {
            return state.bookings
        },
        getPartners: (state) => {
            return state.partners
        },
        getServices: (state) => {
            return state.services
        },
        getAreas: (state) => {
            return state.areas
        },
        getSearchData: (state) => {
            return state.search
        },
        contactSheet: (state) => {
            return state.contactSheet
        },
        cartSize: (state) => {
            return state.cart.length
        },
        getCurrencies: (state) => {
            return state.exchange
        },
        getCurrency: (state) => {
            return state.currency
        },
        cardMode: (state) => {
            return state.mode
        },
        getNationality: (state) => {
            return state.nationality
        },
        getCart: (state) => {
            return state.cart
        },
        getRevCount: (state) => {
            return state.revCount

        },
        getCartID: (state) => {
            return state.cartID
        },
        getCurrentUser: (state) => {
            return state.currentUser
        },
        getCurrentSearch: (state) => {
            return state.search
        },
        getWishList: (state) => {
            return state.wishlist
        },
        getTransResult: (state) => {
            return state.trans_result
        },
        getTourResult: (state) => {
            return state.tour_result
        },
        getIfReady: (state) => {
            return state.tour_result.length > 0 && state.trans_result.length > 0
        },
        getCartTotal: (state) => {
            var total = 0;
            state.cart.forEach(function(data) {
                var baseprice = data.pax < data.rateinfo.ceil ? parseFloat((data.rateinfo.base)) : (parseFloat(data.rateinfo.base) + ((parseInt(data.pax) - parseInt(data.rateinfo.ceil)) * parseFloat(data.rateinfo.price)))
                var price = parseFloat(baseprice + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate)
                total = parseFloat(total) + price
            })

            return total
        },
        getCurrentTransDetails: (state) => {
            return state.trans_details
        },
    },
    mutations: {
         fetchServices: function(state,data){
            state.services = data
        },

        updatePartners: function(state, data) {
            state.partners = data
        },
        setBookings: function(state, data) {
            state.bookings = data
        },
        setCurrency: function(state, data) {
            state.currency = data
        },
        setMode: function(state, data) {
            state.mode = data
        },
        setExchangeRate: function(state, data) {
            state.exchange = data
        },
        addToCart: function(state, data) {
            state.cart.push(data)

        },
        emptyCart: function(state) {
            state.cart = []

        },

        removeCartItem: function(state, data) {
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i] === data)
                    state.cart.splice(i, 1)

            }


        },
        updateCartItem: function(state, data) {

            var index = state.cart.indexOf(data.oldData);

            state.cart.splice(index, 1, data.newData)




        },
        addToWishList: function(state, data) {

            if (state.wishlist.indexOf(data) < 0)
                state.wishlist.push(data)
            else
                state.wishlist.splice(state.wishlist.indexOf(data), 1)

        },

        updateSearch: function(state, data) {
            state.search = Object.assign({}, data)

        },

        updateTransResult: function(state, data) {
            state.trans_result = data

        },
        updateTourResult: function(state, data) {
            state.tour_result = data

        },
        updateCurrentUser: function(state, data) {
            state.currentUser = Object.assign({}, data)

        },
        updateRevCount: function(state, data) {
            state.revCount = Object.assign({}, data)

        },

        updateCurrentTrans: function(state, data) {
            state.trans_details = Object.assign({}, data)

        },
        updateContactSheet: function(state, data) {
            state.contactSheet = data
        },
        generateCartID: function(state, data) {
            state.cartID = data
        }
    },
    actions: {
        fetchServices: function(context,data){
            context.commit('fetchServices',data)
        },
        setBookings: function(context, data) {
            context.commit('setBookings', data)
        },
        updatePartners: function(context, data) {
            context.commit('updatePartners', data)
        },
        generateCartID: function(context, data) {
            context.commit('generateCardID', data)
        },
        addToCart: function(context, data) {
            context.commit('addToCart', data)
        },
        emptyCart: function(context) {
            context.commit('emptyCart')
        },

        addToWishList: function(context, data) {
            context.commit('addToWishList', data)

        },
        setCurrency: function(context, data) {
            context.commit('setCurrency', data)
        },
        setMode: function(context, data) {
            context.commit('setMode', data)
        },
        setExchangeRate: function(context, data) {
            context.commit('setExchangeRate', data)
        },
        removeCartItem: function(context, data) {

            context.commit('removeCartItem', data)
        },
        updateCartItem: function(context, data) {
            context.commit('updateCartItem', data)
        },
        updateSearch: function(context, data) {
            context.commit('updateSearch', data)
        },
        updateTransResult: function(context, data) {
            context.commit('updateTransResult', data)
        },
        updateTourResult: function(context, data) {
            context.commit('updateTourResult', data)
        },
        updateCurrentUser: function(context, data) {
            context.commit('updateCurrentUser', data)
        },
        updateContactSheet: function(context, data) {
            context.commit('updateContactSheet', data)
        },
        updateCurrentTrans: function(context, data) {
            context.commit('updateCurrentTrans', data)
        }
    }
})
export default store