import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Booking from '../components/Booking'
import TransferDetails from '../components/TransferDetails'
// import TourDetails from '../components/TourDetails'
import Cart from '../components/Cart'

import Tours from '../components/Tours'
import Wishlist from '../components/Wishlist'
import Ticket from '../components/Ticket'
import Bookings from '../components/Bookings'
import RateEditor from '../components/RateEditor'
import Login from '../components/Signup'
import Dashboard from '../components/Dashboard'
import ViewSOA from '../components/ViewSOA'
import Billing from '../components/Billing'
export default new Router({
    base: __dirname,
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
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
            path: '/ticket/:ref',
            name: 'Ticket',
            component: Ticket,
        },

        {
            path: '/bookings',
            name: 'Bookings',
            component: Bookings,
        },

        {
            path: '/my-rates',
            name: 'RateEditor',
            component: RateEditor,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/view-soa/:ref',
            name: 'ViewSOA',
            component: ViewSOA
        },
         {
            path: '/billing',
            name: 'Billing',
            component: Billing
        }

    ]
})