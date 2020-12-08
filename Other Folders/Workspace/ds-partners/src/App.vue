<template>
  <v-app height="100%" light id="e3" standalone>
    <v-app-bar app fixed elevate-on-scroll dense color="indigo" flat>
      <v-app-bar-nav-icon v-if="isAuth" small color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <span>Diskubre Palawan</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-if="isAuth" icon v-on="on">
            <v-icon color="white" small>fas fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <!-- <v-list-item to="/wishlist">
            <v-list-item-avatar>
              <v-avatar size="14px" tile>
                <v-icon color="red">fas fa-heart</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>My Account</v-list-item-title>
          </v-list-item>
          <v-list-item to="/manage-booking">
            <v-list-item-avatar>
              <v-avatar size="14px" tile>
                <v-icon color="blue">fas fa-address-book</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item> -->
          <v-list-item @click="Logout()">
            <v-list-item-avatar>
              <v-avatar size="14px" tile>
                <v-icon color="red">fab fa-cc-mastercard</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <!--   <v-list-item>
            <v-list-item-avatar>
              <v-avatar size="14px" tile>
                <v-icon color="orange">far fa-envelope</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>Contact Information</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </v-app-bar>
    </v-app-bar>
    <v-navigation-drawer v-if="isAuth" fixed class="pb-0" temporary disable-route-watcher hide-overlay persistent v-model="drawer" src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" absolute dark>
      <v-list dense dark class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="require('./assets/shop-icon-128.png')">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Diskubre Palawan</v-list-item-title>
            <v-list-item-subtitle>Partner's Portal</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/">
          <v-list-item-avatar>
            <v-avatar tile>
              <v-icon dense>fas fa-home</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense v-for="item in items" :key="item.title" v-if="allowed(item.url)" link :to="item.url">
          <v-list-item-avatar>
            <v-avatar tile>
              <v-icon dense>{{item.icon}}</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <!--  <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="sheet = !sheet , drawer = !drawer">
          <v-list-item-avatar>
            <v-avatar tile>
              <v-icon dense>fas fa-inbox</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Contact Us</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-bottom-sheet scrollable inset v-model="sheet">
      <v-card height="400">
        <v-card-text>
          <v-list>
            <v-subheader>Contact Us in</v-subheader>
            <v-list-item two-line v-for="tile in tiles" :href="tile.url" :key="tile.title" @click="sheet = false">
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

import tour_data from './tours.json'
export default {
  name: 'App',
  components: {
    CartIcon
  },

  computed: {
    ...mapState([
      "contactSheet"
    ]),
    ...mapGetters(['contactSheet', 'getWishList', 'isAuth', 'getRequestedRates', 'getCurrentUser','getLastLoggedIn'])
  },
  data: () => ({
    router,
    fab: false,
    drawer: false,
    items: [

      { title: 'Transportation', icon: 'fas fa-shuttle-van', url: '/transfers' },

      // { title: 'Airport Transfer', icon: 'fas fa-plane-arrival' },
      { title: 'Tours & Activity', icon: 'fas fa-umbrella-beach', url: '/tours' },
      { title: 'Booking History', icon: 'fas fa-history', url: '/manage-booking' },

      // { title: 'Reviews', icon: 'fab fa-tripadvisor' }
    ],
    sheet: false,
    tiles: [

      { icon: 'far fa-envelope', title: 'Email', subtext: 'reservations@diskubre.com', url: 'mailto:reservations@diskubre.com' },
      { icon: 'fab fa-facebook-messenger', title: 'Messenger', subtext: 'Message us', url: 'https://m.me/diskubretravel' },
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
    if(new Date().getTime()-this.getLastLoggedIn>10800000){
       this.$store.commit('setAuth', false)
    }
    this.$store.commit('clearRequestRates', []);
    this.$store.commit('updateTourResult', tour_data)

    if (this.isAuth === false)
      this.$router.push({ path: '/login' })

    var self = this
    this.router.beforeEach((to, from, next) => {

      self.drawer = false
      window.scrollTo(0, 0)
      if (this.isAuth) {
        next()
      } else {
        if (to.path != '/login') {
          this.$router.push({ path: '/login' })
        }else{
           this.$router.replace({ path: '/login' }) 
        }
      }
    })


  },
  methods: {
    Logout() {
      this.$store.commit('setAuth', false)
    window.location.reload()
    },
    beginInitOnMount() {

    },
    allowed(url) {
      // if (url === '/tours')
      //   return typeof this.getCurrentUser.user.isTourAllowed != 'undefined' ? this.getCurrentUser.user.isTourAllowed : false
      // else
        return true
    },
    // beginInitOnMount() {
    //   var res = [];
    //   var routes_list = [];
    //   var transcod = [];
    //   svc.get().then(snap => {

    //     snap.docs.forEach((a) => {

    //       var c = Object.assign(a.data());
    //       routes_list.push('/transportation/' + c.url)
    //       c.id = a.id

    //       if (typeof c.destinations === 'undefined')
    //         c.destinations = []
    //       if (typeof c.inclusions === 'undefined')
    //         c.inclusions = []
    //       if (typeof c.exclusions === 'undefined')
    //         c.exclusions = []
    //       if (typeof c.schedule === 'undefined')
    //         c.schedule = []
    //       if (typeof c.notations === 'undefined')
    //         c.notations = []
    //       if (typeof c.cancellation === 'undefined')
    //         c.cancellation = []
    //       res.push(c)
    //       transcod.push(c.code)
    //     })

    //     this.$store.commit('updateTransResult', res)

    //     var tour = []
    //     tours.get().then(snap => {

    //       snap.docs.forEach((a) => {
    //         var c = Object.assign(a.data());
    //         c.id = a.id
    //         routes_list.push('/tour/' + c.url)
    //         if (typeof c.destinations === 'undefined')
    //           c.destinations = []
    //         if (typeof c.inclusions === 'undefined')
    //           c.inclusions = []
    //         if (typeof c.exclusions === 'undefined')
    //           c.exclusions = []
    //         if (typeof c.schedule === 'undefined')
    //           c.schedule = []
    //         if (typeof c.notations === 'undefined')
    //           c.notations = []
    //         if (typeof c.cancellation === 'undefined')
    //           c.cancellation = []
    //         tour.push(c)

    //       })

    //       console.log(routes_list)
    //       this.$store.commit('updateTourResult', tour)

    //     }).catch(e => {

    //       console.log(e)
    //       this.beginInitOnMount()
    //     })
    //   }).catch(e => {
    //     console.log(e)
    //     this.beginInitOnMount()
    //   })

    // },
    reloadHome() {
      window.location.href = "/"
    },
    alertMe() {
      this.sheet = true
    }
  },
  watch: {
    drawer(val) {
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
    width: 80%!important;
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
</style>
