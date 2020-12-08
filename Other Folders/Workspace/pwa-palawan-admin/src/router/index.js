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
import Dashboard from '../components/Dashboard'
import Drivers from '../components/Drivers'
import PackageEditor from '../components/PackageEditor'
import MasterFileEditor from '../components/MasterFileEditor'
import Billing from '../components/Billing'
import ViewSOA from '../components/ViewSOA'
import Partners from '../components/Partners'
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
            path: '/rate-editor',
            name: 'RateEditor',
            component: RateEditor,
        },
        {
            path: '/drivers',
            name: 'Drivers',
            component: Drivers
        },
        {
            path: '/package-editor',
            name: 'PackageEditor',
            component: PackageEditor
        },
         {
            path: '/masterfile-editor',
            name: 'MasterFileEditor',
            component: MasterFileEditor
        },
        {
            path: '/billing',
            name: 'Billing',
            component: Billing
        },
        {
            path: '/view-soa/:ref',
            name: 'ViewSOA',
            component: ViewSOA
        },
          {
            path: '/partners',
            name: 'Partners',
            component: Partners
        }
    ]
})