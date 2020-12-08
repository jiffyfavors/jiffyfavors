import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '../components/Home'
import Booking from '../components/Booking'
import TransferDetails from '../components/TransferDetails'
// import TourDetails from '../components/TourDetails'
import Cart from '../components/Cart'

import Tours from '../components/Tours'
import Wishlist from '../components/Wishlist'
import Ticket from '../components/Ticket'
import Packages from '../components/Packages'
import PackageDetails from '../components/PackageDetails'
export default new Router({
    base: __dirname,
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/transfers',
            name: 'Booking',
            component: Booking,
        },

        {
            path: '/transportation/:route',
            name: 'TransferDetails',
            component: TransferDetails,
        },
        {
            path: '/tour/:route',
            name: 'TransferDetails',
            component: TransferDetails,
        },
        {
            path: '/tours',
            name: 'Tours',
            component: Tours,
        },
        {
            path: '/cart',
            name: 'Cart',
            component: Cart,
        },

        {
            path: '/wishlist',
            name: 'Wishlist',
            component: Wishlist,
        },

        {
            path: '/packages',
            name: 'Packages',
            component: Packages,
        },
         {
            path: '/package/:pkid',
            name: 'PackageDetails',
            component: PackageDetails,
        },



        {
            path: '/ticket/:ref',
            name: 'Ticket',
            component: Ticket,
        }
    ]
})