<template>
  <v-app height="100%" light id="e3" standalone>
    <v-app-bar app fixed elevate-on-scroll dense color="blue" class="no-print">
      <v-app-bar-nav-icon v-if="isAuth" small color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text" text-align="center">
        Partners Portal
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <CartIcon />
      <v-btn v-if="isAuth" @click="Logout" class="mr-2" icon depressed text small>
        <v-icon color="red" dense>fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer fixed class="pb-0" temporary disable-route-watcher hide-overlay persistent v-model="drawer" src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" absolute dark>
      <v-list dense dark class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="require('./assets/shop-icon-128.png')">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Diskubre Palawan</v-list-item-title>
            <v-list-item-subtitle>Partners Portal</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        Hi <strong>{{currentUser}}</strong>,
        <br/>
        <small class="ma-5">You can use this portal in all booking transaction with us.</small>
        <v-divider></v-divider>
        <v-list-item link to="/">
          <v-list-item-title class="white--text">Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="(item, i) in items" :key="i" link :to="item.url" v-if="isallowed(item.url)">
          <v-list-item-content>
            <v-list-item-title class="white--text">{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="sheet = !sheet , drawer = !drawer">
          <v-list-item-title class="white--text">Contact Us</v-list-item-title>
        </v-list-item>

       
      </v-list>
    </v-navigation-drawer>
    <v-bottom-sheet scrollable inset v-model="sheet">
      <v-card height="400">
        <v-card-title> Contact us in</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item two-line dense v-for="tile in tiles" :href="tile.url" :key="tile.title" @click="sheet = false">
              <v-list-item-avatar>
                <v-avatar size="32px" tile>
                  <v-icon>{{tile.icon}}</v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ tile.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ tile.subtext }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-content>
      <div v-if="loading" class="loading"></div>
      <router-view></router-view>
    </v-content>
    <!--    <v-speed-dial v-model="fab" bottom  right direction="top">
        <template v-slot:activator>
          <v-btn v-model="fab" small color="blue darken-2" dark fab>
            <v-icon v-if="fab">far fa-times-circle</v-icon>
            <v-icon v-else>fas fa-envelope-open-text</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small v-for="tile in tiles" color="green">
          <v-icon>{{tile.icon}}</v-icon>
        </v-btn>
       
      </v-speed-dial> -->
  </v-app>
</template>

<script>
import router from './router'
import CartIcon from './components/CartIcon'

import { mapState, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    CartIcon
  },

  computed: {
    ...mapState([
      "contactSheet"
    ]),
    ...mapGetters(['getTransResult', 'getTourResult', 'isAuth', 'getCurrentUser'])
  },
  data: () => ({
    router,
    fab: false,
    currentUser: 'NA',
    drawer: false,

    loading: false,
    curSheet: false,

    countries: [],

    items: [

      { title: 'Book a Ride', icon: 'fas fa-shuttle-van', url: '/transfers' },
      { title: 'Book a Tour', icon: 'fas fa-shuttle-van', url: '/tours' },
      { title: 'Booking History', icon: 'fas fa-shuttle-van', url: '/bookings' },
      { title: 'Rates', icon: 'far fa-calendar-check', url: '/my-rates' },
      { title: 'Billing', icon: 'far fa-calendar-check', url: '/billing' },
      // { title: 'Airport Transfer', icon: 'fas fa-plane-arrival' },


      // { title: 'Reviews', icon: 'fab fa-tripadvisor' }
    ],
    sheet: false,
    tiles: [

      { icon: 'far fa-envelope', title: 'Email', subtext: 'admin@diskubre.com', url: 'mailto:admin@diskubre.com' },
      { icon: 'fab fa-facebook-messenger', title: 'Messenger', subtext: 'Message us on Facebook', url: 'https://m.me/diskubretravel' },
      { icon: 'fab fa-whatsapp', title: 'Whatsapp', subtext: '+639399391913', url: 'https://api.whatsapp.com/send?phone=+639399391913&text=Hello%20Diskubre%20Travel%20Palawan,' },
      { icon: 'fas fa-sms', title: 'SMS(Globe)', subtext: '+639176309830', url: 'sms:+639176309830' },
      { icon: 'fas fa-sms', title: 'SMS(SMART)', subtext: '+639399391913', url: 'sms:+639399391913' },
      { icon: 'fas fa-mobile-alt', title: 'Phone Call(Globe)', subtext: '+639176309830', url: 'tel:+639176309830' },
      { icon: 'fas fa-mobile-alt', title: 'Phone Call(SMART)', subtext: '+639399391913', url: 'tel:+639399391913' }

    ],
    //
  }),
  events: {
    openContact: function() {
      this.sheet = true
    }
  },
  mounted() {
    this.fetchServices()
    if (new Date().getTime() - this.getLastLoggedIn > 10800000) {
      this.$store.commit('setAuth', false)
    }

    if (this.isAuth === false)
      this.$router.push({ path: '/login' })

    if (this.isAuth) {
      this.currentUser = this.getCurrentUser.entity.business_name
    }

    var self = this
    this.router.beforeEach((to, from, next) => {

      self.drawer = false
      window.scrollTo(0, 0)
      if (this.isAuth) {
        next()
      } else {
        if (to.path != '/login') {

          this.$router.push({ path: '/login' })
        } else {
          this.$router.replace({ path: '/login' })
        }
      }
    })

    // setTimeout(function() {
    //   this.loading = false
    // }, 2000)



  },
  methods: {


    isallowed(i) {
      if(this.isAuth){
        return JSON.parse(this.getCurrentUser.entity.notallowedpaths).indexOf(i) < 0
      }else
      return false
      
    },
    fetchServices() {
      this.loading = true
      fetch('https://api.diskubrepalawan.com/get-transfers-files', { method: 'GET', mode: 'cors' }).then((data) => {
        return data.json()
      }).then((data) => {

        this.$store.commit('fetchServices', data)
        this.fetchTours()


      }).catch(() => this.loading = false)
    },
    Logout() {
      this.$store.commit('setAuth', false)
      window.location.reload()
    }
  },
  watch: {
    isAuth() {
      if (this.isAuth) {
        this.currentUser = this.getCurrentUser.entity.business_name
      }
    },
    drawer() {
      window.scrollTo(0, 0)
    },
    sheet(val) {
      this.$store.commit('updateContactSheet', val)
    },
    contactSheet(val) {

      this.sheet = val
    }
  }
};
</script>

<style>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}

#e3,
#e3 .container {
  overflow: hidden;
  z-index: 0;
}

#e3 .input-group__details:after {
  background-color: rgba(255, 255, 255, 0.32) !important;
}

#e3 .input-group--focused .input-group__append-icon {
  color: inherit !important;
}

#e3 .v-speed-dial {
  position: absolute;
}

#e3 .v-btn--floating {
  position: relative;
}

.reviews {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  display: block;
  margin-left: 20px;
  margin-right: 20px;
  min-height: 275px;
  -webkit-overflow-scrolling: touch
}

.review-card {
  max-width: 60%;
  margin: 10px;
  vertical-align: top;
  display: inline-block
}

@media screen and (min-width: 320px) and (max-width:768px) {
  .review-card {
    width: 80% !important;
    max-width: 80%
  }
  .desti {
    width: 100%;
  }
}

.toursection {
  color: #eee;
  width: 100%;
  margin: 0 auto;
  display: block;
  height: 180px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  border-radius: 5px
}

.rg-img {
  float: right;
  display: block;
  width: 40%
}

.rg-img-bg {
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  background-position: center center;
  background-color: #e0e0e0;
  overflow: hidden;
}

.bg-img-eln {
  position: relative;
  width: 550px;
  z-index: -1;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/Tour%20Images%2FTour%20C%2FSecret%20Beach.jpg?alt=media&token=cef8cfa1-d76f-46e4-bcf0-4094d6e33a40');
}

.bg-img-van {
  position: relative;
  width: 550px;
  z-index: -1;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/grandia-1.jpg?alt=media&token=d2a2ce76-061a-4306-ba96-6ae85ed5bb39');
}

.bg-img-ast {
  position: relative;
  width: 550px;
  z-index: -1;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/Tour%20Images%2FPPUR%2Fur.webp?alt=media&token=80096e9c-a1cb-492d-ba27-d2bb55898fbd');
}

.article {
  margin-left: 30px;
  z-index: 2;
  position: absolute;
  text-align: left;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  box-sizing: border-box;
  display: block
}

.eln {
  background: linear-gradient(to right, #6288DF 50%, transparent 100%);
}

.ast {
  background: linear-gradient(to right, #00bcd4 50%, transparent 100%);
}

#e3 {
  background: none
}


/* Absolute Center Spinner */

.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}


/* Transparent Overlay */

.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(rgba(20, 20, 20, .8), rgba(0, 0, 0, .8));
  background: -webkit-radial-gradient(rgba(20, 20, 20, .8), rgba(0, 0, 0, .8));
}


/* :not(:required) hides these rules from IE9 and below */

.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spinner 150ms infinite linear;
  -moz-animation: spinner 150ms infinite linear;
  -ms-animation: spinner 150ms infinite linear;
  -o-animation: spinner 150ms infinite linear;
  animation: spinner 150ms infinite linear;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(255, 255, 255, 0.75) 1.5em 0 0 0, rgba(255, 255, 255, 0.75) 1.1em 1.1em 0 0, rgba(255, 255, 255, 0.75) 0 1.5em 0 0, rgba(255, 255, 255, 0.75) -1.1em 1.1em 0 0, rgba(255, 255, 255, 0.75) -1.5em 0 0 0, rgba(255, 255, 255, 0.75) -1.1em -1.1em 0 0, rgba(255, 255, 255, 0.75) 0 -1.5em 0 0, rgba(255, 255, 255, 0.75) 1.1em -1.1em 0 0;
  box-shadow: rgba(255, 255, 255, 0.75) 1.5em 0 0 0, rgba(255, 255, 255, 0.75) 1.1em 1.1em 0 0, rgba(255, 255, 255, 0.75) 0 1.5em 0 0, rgba(255, 255, 255, 0.75) -1.1em 1.1em 0 0, rgba(255, 255, 255, 0.75) -1.5em 0 0 0, rgba(255, 255, 255, 0.75) -1.1em -1.1em 0 0, rgba(255, 255, 255, 0.75) 0 -1.5em 0 0, rgba(255, 255, 255, 0.75) 1.1em -1.1em 0 0;
}


/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
