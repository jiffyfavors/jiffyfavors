import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '../components/Home'
import Booking from '../components/Booking'
import TransferDetails from '../components/TransferDetails'
import TourDetails from '../components/TourDetails'
import Cart from '../components/Cart'
import MyBookings from '../components/MyBookings'
import Encoder from '../components/Encoder'
import Tours from '../components/Tours'
import Wishlist from '../components/Wishlist'
import Payments from '../components/Payments'
import Ticket from '../components/Ticket'
import ListingEncoder from '../components/ListingEncoder'
import SignUp from '../components/SignUp'
import Dashboard from '../components/Dashboard'
const router = new Router({
  base: __dirname,
  mode:'history',
  routes: [{
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/transfers',
      name: 'Booking',
      component: Booking,
    },
        {
      path: '/encoder',
      name: 'Encoder',
      component: Encoder,
    },
     {
      path: '/transportation/:route',
      name: 'TransferDetails',
      component: TransferDetails,
    },
    {
      path: '/tour/:route',
      name: 'TourDetails',
      component: TourDetails,
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
      path: '/manage-booking',
      name: 'MyBookings',
      component: MyBookings,
    },
       {
      path: '/wishlist',
      name: 'Wishlist',
      component: Wishlist,
    },
     {
      path: '/payments',
      name: 'Payments',
      component: Payments,
    },
    {
      path: '/ticket/:ref/:code',
      name: 'Ticket',
      component: Ticket,
    },
    {
      path: '/listing',
      name: 'ListingEncoder',
      component: ListingEncoder
    },
    {
      path: '/login',
      name: 'SignUp',
      component: SignUp
    }
  ]
})



export default router
