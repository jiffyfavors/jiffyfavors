<template>
  <v-app height="100%" light id="e3" standalone>
    <v-app-bar app fixed elevate-on-scroll dense color="blue">
      <v-app-bar-nav-icon small v-if="showDrawer" color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon dark v-if="!showDrawer" @click="goBack">
        <v-icon>fas fa-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-uppercase white--text" text-align="center">
        Diskubre Palawan
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip small color="green" @click="drawer = false , curSheet = !curSheet" class="ma-1 white--text">
        {{getCurrency}}
      </v-chip>
      <WishListIcon/>
      <CartIcon/>
    </v-app-bar>
    <v-navigation-drawer fixed class="pb-0" temporary disable-route-watcher hide-overlay persistent v-model="drawer" src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" absolute dark>
      <v-list dense dark class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="require('./assets/shop-icon-128.png')">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Diskubre Palawan</v-list-item-title>
            <v-list-item-subtitle>Booking made easy.</v-list-item-subtitle>
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
            <v-list-item-title class="white--text">Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense v-for="item in items" :key="item.title" link :to="item.url">
          <v-list-item-avatar>
            <v-avatar tile>
              <v-icon dense>{{item.icon}}</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <!--  <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
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
    <v-bottom-sheet scrollable inset v-model="curSheet">
      <v-card height="400">
        <v-card-title> Choose currency</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item two-line dense v-for="cur in currencies" :key="cur.code" @click="changeCurrency(cur.code)">
              <v-list-item-content>
                <v-list-item-title>{{cur.code }}</v-list-item-title>
                <v-list-item-subtitle>{{ cur.name }}</v-list-item-subtitle>
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
import WishListIcon from './components/WishListIcon'
import { mapState, mapGetters } from 'vuex'
import { isEmpty } from 'lodash/core'
import shuffle from 'lodash/shuffle'
export default {
  name: 'App',
  components: {
    CartIcon,
    WishListIcon
  },

  computed: {
    ...mapState([
      "contactSheet"
    ]),
    ...mapGetters(['getCart', 'getCurrencies', 'getCurrentUser', 'contactSheet', 'getWishList', 'getCurrency', 'getCartID', 'getTransResult', 'getTourResult', 'cartSize'])
  },
  data: () => ({
    router,
    fab: false,
    drawer: false,
    showDrawer: true,
    loading: true,
    curSheet: false,
    countryCode: 'PH',
    countries: [],
    currencies: [{
        code: 'PHP',
        name: 'Philippine Peso'
      },
      { code: 'GBP', name: 'Pound Sterling' },
      { code: 'JPY', name: 'Japanese Yen' },
      { code: 'EUR', name: 'Euro' }, { code: 'AUD', name: 'Australian Dollar' }, { code: 'SGD', name: 'Singaporian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' }, { code: 'HKD', name: 'Hongkong Dollar' }, { code: 'HUF', name: 'Hungarian Forint' }, { code: 'ILS', name: 'Israeli New Shekel' }, { code: 'NZD', name: 'New Zealand Dollar' }, { code: 'NOK', name: 'Norwegian Krone' }, { code: 'SEK', name: 'Swedish Krona' }, { code: 'CHF', name: 'Swiss Franc' }, { code: 'USD', name: 'United States Dollar' }, { code: 'THB', name: 'Thai Baht' }, { code: 'TWD', name: 'New Taiwan Dollar' }
    ],
    items: [

      { title: 'Book a Ride', icon: 'fas fa-shuttle-van', url: '/transfers' },
      // { title: 'Airport Transfer', icon: 'fas fa-plane-arrival' },
      { title: 'Book a Tour', icon: 'fas fa-umbrella-beach', url: '/tours' },

      // { title: 'Reviews', icon: 'fab fa-tripadvisor' }
    ],
    sheet: false,
    tiles: [

      { icon: 'far fa-envelope', title: 'Email', subtext: 'reservations@diskubre.com', url: 'mailto:reservations@diskubre.com' },
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

    this.countryCode = 'PH'
    this.$store.commit('setCurrency', 'PHP')
    this.getResources()
    var self = this
    this.router.beforeEach(function(to, from, next) {
      if (to.path === '/' || to.path === '/transfers' || to.path === '/tours' || to.path === '/cart')
        self.showDrawer = true
      else
        self.showDrawer = false


      self.drawer = false
      window.scrollTo(0, 0)
      next()
    })



  },
  methods: {
    goBack() {
      this.router.go(-1)
    },
    fetchCurrency() {
      fetch('https://extreme-ip-lookup.com/json/', { method: 'GET', mode: 'cors' })
        .then((response) => {
          return response.json();
        }).then((myJson) => {

          this.countryCode = myJson.countryCode

          var c = this.countries.find((e) => {
            return e.CountryCode == this.countryCode
          });


          var cur = 'PHP'
          for (var i = 0; i < this.getCurrencies.length; i++) {

            if (this.getCurrencies[i].code === c.Code) {
              cur = c.Code
              this.$store.commit('setCurrency', cur)


            }

          }





        })
    },

    uploadCart(payload) {

      fetch('https://api.diskubrepalawan.com/index_dev.php/cart-update', {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ payload: payload })
      }).then((data) => {
        return data.json()
      }).then((data) => {




      })
    },

    changeCurrency(cur) {
      this.$store.commit('setCurrency', cur)
      this.curSheet = false
    },
    fetchCartInfo(id) {




      fetch('https://api.diskubrepalawan.com/index_dev.php/get-cart/' + id, { method: 'GET', mode: 'cors' })
        .then((response) => {

          return response.json();
        })
        .then((data) => {
          var user = {
            name: data.contact.name,
            email: data.contact.email,
            phone: data.contact.phone
          }

          this.$store.commit('updateCurrentUser', user)
          this.$store.commit('overrideCart', data.data)
        });

    },
    getResources() {


      fetch('https://www.diskubrepalawan.com/get-master-file', { method: 'GET', mode: 'cors' })
        .then((response) => {

          return response.json();
        })
        .then((myJson) => {

          this.$store.commit('updateTransResult', myJson.transfers)
          this.$store.commit('updateTourResult', myJson.tours)
          this.$store.commit('setExchangeRate', myJson.rates)
          this.$store.commit('setMode', myJson.cardMode)
            // this.$store.commit('setTourPackages', myJson.packages)
          var pckg = [];
          myJson.packages.forEach(a => {
            a.images = [];
            a.tours_included=[]
            a.tours.forEach(b => {
              myJson.tours.find((x) => {
                if(x.code===b)
                a.tours_included.push(x.name)
                return x.code === b }).destinations.forEach(c => {
                a.images.push(c)
                a.images = shuffle(a.images)
              })
            })
            pckg.push(a)
            pckg = shuffle(pckg)

          })

          this.$store.commit('setTourPackages', pckg)

          this.countries = myJson.currencies


          var revCount = {
            taDs: myJson.TA_Ds,
            taPV: myJson.TA_PV
          }
          this.$store.commit('updateRevCount', revCount)

          this.fetchCurrency()

        }).catch(() => {


          if (this.getTransResult.length === 0) {
            if (navigator.onLine) {
              this.getResources()
            }

          }

        }).finally(() => {




          var isDeclined = false

          if (this.$route.query.declinebnpl) {
            isDeclined = true
          }
          if (isDeclined) {
            this.$store.commit('emptyCart', []);

          } else {

            if (this.getCartID.length === 0)
              this.$store.commit('generateCartID', 'Cart-' + new Date().getTime())

            if (this.$route.query.cartid) {
              this.$store.commit('generateCartID', this.$route.query.cartid)
              this.fetchCartInfo(this.getCartID)
            }
            if (this.$route.query.allowbnpl) {
              if (this.$route.query.allowbnpl === 'true')
                this.$store.commit('setMode', false)
            }

          }









        })
    }
  },
  watch: {
    getTransResult(val) {
      if (val.length > 0)
        this.loading = false
    },
    drawer() {
      window.scrollTo(0, 0)
    },
    sheet(val) {
      this.$store.commit('updateContactSheet', val)
    },
    contactSheet(val) {

      this.sheet = val
    },
    getCart(val) {

      if (!isEmpty(this.getCurrentUser)) {

        var cartPayload = {
          id: this.getCartID,
          contact: this.getCurrentUser,
          data: val
        }
        if (this.cartSize > 0)
          this.uploadCart(cartPayload)
      }
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
