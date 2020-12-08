<template>
  <v-container v-if="getIfReady">
    <v-layout align="center" column wrap>
      <v-card :loading="loading" class="mx-auto mb-8" width="500" max-width="100%">
        <v-img class="white--text" height="250px" :src="img">
          <span v-if="data.bestseller" class="bestseller">Bestseller</span>
        </v-img>
        <v-card-title class="align-end black--text fill-height">{{data.name}}</v-card-title>
        <v-layout wrap>
          <v-chip small class="ma-2" color="primary">
            {{data.type}}
          </v-chip>
          <v-chip small class="ma-2 white--text" color="green">
            Price starts at {{price|toPHP}}
          </v-chip>
          <v-chip v-if="data.schedule.length>0" small dense class="ma-2 white--text" color="blue">Fixed Schedule</v-chip>
          <v-chip v-if="data.schedule.length==0" small dense class="ma-2 white--text" color="red">Departs Anytime</v-chip>
        </v-layout>
        <v-divider></v-divider>
        <v-card-text>
          <v-row align="center">
            <v-rating :value="5" color="amber" half-increments dense size="14" readonly></v-rating>
            <div class="grey--text ml-4">{{data.booked}} people booked</div>
          </v-row>
          <span class="text--primary">
        <span>{{data.desc}}</span>
          </span>
          <v-divider></v-divider>
          <Reviews/>
          <div class="reviews">
            <div v-for="(i,index) in data.destinations" class="review-card" :key="`dest`+index">
              <v-card>
                <v-img :src="i.url" :alt="i.name" height="180">
                  <span class="bestseller">{{i.name}}</span>
                </v-img>
              </v-card>
            </div>
          </div>
          <v-divider></v-divider>
          <v-container wrap>
            <h3>Departure Times</h3>
            <v-layout wrap>
              <v-chip v-if="data.schedule.length>0" small dense class="white--text ma-1" color="green" v-for="sched in data.schedule">{{sched}}</v-chip>
              <v-chip v-if="data.schedule.length==0" small dense class="white--text ma-1" color="green">Anytime</v-chip>
            </v-layout>
            <v-alert dense small type="error" v-if="data.type.includes('Shared') || data.type.includes('Joining')">This is a <strong>shared or joining activity</strong>. Departure times might be delay and move to a later time.</v-alert>
            <h3>Inclusions & Exclusions</h3>
            <v-list dense>
              <v-list-item style="min-height:15px;" v-for="(i,index) in data.inclusions" :key="`inc`+index">
                <v-list-item-content>
                  <v-list-item-subtitle style="white-space:initial;"><span style="color:green">&#10004;</span> {{i}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height:15px;" v-for="(i,index) in data.exclusions" :key="`exc`+index">
                <v-list-item-content>
                  <v-list-item-subtitle style="white-space:initial;"><span style="font-size:10px">&#10060;</span> {{i}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <div v-if="data.base>0">
              <h3>Inclusions & Exclusions</h3>
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th class="text-left">Price</th>
                    <th class="text-left">Persons</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i,index) in data.max" :key="index">
                    <td>{{pricing(i)|toPHP}}</td>
                    <td>{{i}} people</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
            <h2>Itinerary</h2>
            <v-timeline align-top dense>
              <v-timeline-item color="green" v-for="(i, index) in data.itinerary" :key="index" small dense>
                <template v-slot:icon>
                  <span class="white--text">{{index + 1}}</span>
                </template>
                <v-row>
                  {{i}}
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-container>
          <div class="reminder_div">
            <h3>Important Information</h3>
            <ul>
              <li style="font-size:11px;" v-for="(i,index) in data.notations" :key="`note-`+index">
                {{i}}
                <v-divider></v-divider>
              </li>
            </ul>
            <h3>Cancellation Policy</h3>
            <ul>
              <li>Full refund if cancelled within 7 days before departure.</li>
              <li>No refund for <strong>No Show</strong> and <strong>Unused Tickets</strong></li>
              <li style="font-size:11px;" v-for="(i,index) in data.cancellation" :key="`can-`+index">
                {{i}}
              </li>
            </ul>
          </div>
        </v-card-text>
        <h3>You might also like </h3>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index) in suggest" :key="`sug`+index" class="review-card" style="white-space:initial;" v-bind:data="i" :to="i.url" :pax="pax"></TransferResult>
          </div>
        </v-layout>
      </v-card>
      <v-toolbar bottom width="100%" v-show="!sheet" class="shopresponsive">
        <v-btn tile @click="addToWishList" icon fab>
          <v-icon :color="color">fas fa-heart</v-icon>
        </v-btn>
        <v-btn tile @click="initContact" icon fab>
          <v-icon color="green">fab fa-whatsapp</v-icon>
        </v-btn>
        <v-chip class="white--text" color="blue">
          {{price|toPHP}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn @click="bookNow" tile outlined color="blue">
          Book Now
        </v-btn>
      </v-toolbar>
    </v-layout>
    <v-row justify="center">
      <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="sheet = false">
              <v-icon>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>{{data.type}} - {{data.name}} Booking Form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="bookForm" lazy-validation @submit="bookingSubmit">
            <v-layout align="center" column wrap>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-list two-line subheader>
                  
                 
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Select Date & Time</v-list-item-title>
                      <v-flex xs4 md4 sm4>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="traveldate" persistent full-width width="290px">
                          <template v-slot:activator="{ on }">
                            <v-text-field required v-model="traveldate" label="Travel Date" readonly v-on="on"></v-text-field>
                          </template>
                          <v-date-picker full-width :min="min" v-model="traveldate" :allowed-dates="allowedDates" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.dialog.save(traveldate)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs4 md4 sm4>
                        <v-text-field v-if="data.schedule.length<1" name="name" type="time" :rules="timeRules" placeholder="Time" required v-model="depart_time" label="Time" id="id"></v-text-field>
                        <v-select v-if="data.schedule.length>0" flat :rules="timeRules" label="Time" placeholder="Time" required v-model="depart_time" :items="data.schedule">
                        </v-select>
                      </v-flex>
                      <v-flex xs4 md4 sm4>
                        <v-layout>
                          <v-text-field name="name" readonly type="number" text-center required step=1 min=1 max=12 v-model="pax" label="Persons" id="id"></v-text-field>
                          <v-icon @click="pax = pax - 1" class="ma-2 white--text" color="green">far fa-minus-square</v-icon>
                          <v-icon @click="pax = pax + 1" class="ma-2 white--text" color="green">far fa-plus-square</v-icon>
                        </v-layout>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense :disabled="(data.origin==='PBT' || data.desti==='SAB') && data.type.includes('Shared')" label="Pickup Area" single-line required v-model="pickup" :items="locations.find(x=>x.code==data.origin).locations" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="pickup.rate>0" dense text type="warning">
                          <small> Additional Pickup Charge of <strong><span style='color:red;'>{{pickup.rate|toPHP}}</span></strong> for the whole group</small>
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="data.origin==='PBT' && data.type.includes('Shared')" dense text type="warning">
                        <small> All Pickup on Shared Transfer is set to <strong>Port Barton Common Terminal</strong></small>
                      </v-alert>
                      <v-alert v-if="data.desti==='SAB' && data.type.includes('Shared')" dense text type="warning">
                        <small>  All Pickup on Shared Transfer going to Sabang Beach is infront of <strong>Jolibee, Robinsons Place Palawan</strong></small>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense :disabled="(data.desti==='PBT' || data.origin=='SAB') &&  data.type.includes('Shared')" label="Drop Area" single-line required v-model="dropoff" :items="locations.find(x=>x.code==data.desti).locations" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="dropoff.rate>0" dense text type="warning">
                          <small>  Additional Drop Off Charge of <strong><span style='color:red;'>{{dropoff.rate|toPHP}}</span></strong> for the whole group</small>
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="data.desti==='PBT' && data.type.includes('Shared')" dense text type="warning">
                        <small>All Drop Off on Shared Transfer is set to <strong>Port Barton Common Terminal</strong></small>
                      </v-alert>
                      <v-alert v-if="data.desti==='PPS' && data.origin==='SAB' && data.type.includes('Shared')" dense text type="warning">
                        <small> All Drop off on Shared Transfer from  Sabang Beach is set to <strong>Jolibee Robinsons Place Palawan</strong></small>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                </v-list>
                <v-alert dense text type="success">
                  <small>You will add Pickup/Drop Off Address later at <strong>Checkout</strong></small>
                </v-alert>
                <v-toolbar dense min-width="100%" max-width="100%" class="shopresponsive">
                  <v-chip class="white--text" color="blue">
                    Total {{price|toPHP}}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" tile outlined color="red">
                    Add to Cart
                  </v-btn>
                </v-toolbar>
              </v-card>
            </v-layout>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" color="success">
      Item added to Cart
      <v-btn dark text @click="snackbar = false, sheet = !sheet">
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="wishlist" color="success">
      Item {{proc}} to Wishlist
      <v-btn dark text @click="wishlist = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="contactSheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-layout column align-center class="fill-height">
          <v-card height="100%" width="500">
            <v-toolbar dark color="primary">
              <v-btn icon dark type="submit" @click="contactSheet = false">
                <v-icon>fas fa-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title>Contact Information</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-alert dense class="mt-2" type="success">
              We will use this information to send your ticket and contact you.
            </v-alert>
            <v-form ref="cartForm" lazy-validation @submit="cartFormSubmit">
              <v-card>
              <v-layout wrap mx-5 my-2 justify-space-around>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="fullname" :rules="nameRules" label="Primary Contact Person" placeholder="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="email" label="Email" :rules="emailRules" placeholder="Email"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="phone" label="Phone" :rules="phoneRules" placeholder="Phone"></v-text-field>
                </v-flex>
              </v-layout>
            </v-card>
              <v-toolbar dense width="100%" max-width="100%" class="full-width shopresponsive">
                <v-spacer></v-spacer>
                <v-btn type="submit" tile outlined color="red">
                  Continue
                </v-btn>
              </v-toolbar>
            </v-form>
          </v-card>
        </v-layout>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TransferResult from '../components/TransferResult'
import Reviews from '../components/Reviews'
import { isEmpty } from 'lodash/core';
import cloneDeep from 'lodash/cloneDeep'
import shuffle from 'lodash/shuffle'
export default {
  name: 'TransferDetails',
  components: {
    TransferResult,
    Reviews
  },
  computed: {
    ...mapGetters(['getIfReady', 'cartSize', 'getCurrentTransDetails', 'getCurrentUser', 'getCurrentSearch', 'getTourResult', 'getTransResult', 'getWishList']),
    locations: function() {
      var tour = [{
        "code": "ELN",
        "locations": [{
          "name": "Hotel in Town Center or Corong Corong Area",
          "rate": 0
        }, {
          "name": "Las Cabanas & Maremegmeg",
          "rate": 850
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
          "name": "Hotel in Puerto Princesa City Center",
          "rate": 0
        }, {
          "name": "Puerto Princesa International Airport",
          "rate": 0
        }, {
          "name": "Astoria Palawan",
          "rate": 2500
        }, {
          "name": "Peace & Love Resort",
          "rate": 2500
        }, {
          "name": "Coppers Beach Resort",
          "rate": 2500
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
      }]

      var transfer = [{
        "code": "ELN",
        "locations": [{
          "name": "Hotel in Corong Corong Area",
          "rate": 0
        }, {
          "name": "El Nido Bus Terminal",
          "rate": 0
        }, {
          "name": "El Nido Town Center(Pickup&Drop Off is at Bus Terminal)",
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
          "name": "Astoria Palawan",
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

      }]
      if (this.data.type.includes('Transfer')) {
        return transfer
      } else {
        return tour
      }
    }


  },
  data() {
    return {
      sheet: false,
      loaded: false,
      phone: '',
      wishlist: false,
      contactSheet:false,
      color: 'grey',
      proc: '',
      e6: 1,
      leadguest: '',
      isCurrent: false,
      snackbar: false,
      fullname: '',
      depart_time: '',
      pickup: {},
      dropoff: {},
      pickup_location: '',
      drop_location: '',
      loading: true,
      min: new Date().toISOString().substr(0, 10),
      modal: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 5) || 'Name must be more than 5 characters',
      ],
      phoneRules: [
        v => !!v || 'Phone is required',
        v => (v && v.length >= 5) || 'Phone must be more than 2 characters. Type NA if not applicable',
      ],
      textAreaRule: [
        v => !!v || 'Location is required',
        v => (v && v.length >= 3) || 'Field must be more than 3 characters',
      ],
      selectRules: [
        v => !!v || 'Location is required',
        v => (v && v.length >= 1) || 'Area is required'
      ],
      timeRules: [
        v => !!v || 'Time is required',
        v => (v && v.length >= 1) || 'Time is required'
      ],
      email: '',
      traveldate: '',
      data: {
        origin: 'PPS',
        desti: 'ELN',
        schedule: [],
        name: '',
        type: '',
      },
      img: '',
      price: 0,
      pax: 1,
      suggest: []

    }

  },
  beforeRouteUpdate(to, from, next) {
    this.undefChecker(to.params.route)
    next()
  },
  mounted() {




    this.isCurrent = isEmpty(this.getCurrentUser)

    this.pax = 1
    this.traveldate = typeof this.getCurrentSearch.traveldate == 'undefined' ? new Date().toISOString().substr(0, 10) : new Date(this.getCurrentSearch.traveldate).toISOString().substr(0, 10)


    if (this.getIfReady) {
      //alert(this.$route.params.route)
      this.undefChecker(this.$route.params.route)
    }

    this.isDisable()

  },
  methods: {
    bookNow() {
      if (this.cartSize === 0 && isEmpty(this.getCurrentUser) ) {
        this.contactSheet = true
      } else {
        this.sheet = true
      }
    },
    cartFormSubmit: function(e) {

      if (this.$refs.cartForm.validate()) {

        var user = {
          name: this.fullname,
          email: this.email,
          phone: this.phone
        }
        this.contactSheet = false
        this.sheet = true
        this.$store.commit('updateCurrentUser', user)


      }
      e.preventDefault()
      return false
    },
    initContact() {
      this.$store.commit('updateContactSheet', true)
    },
    isDisable() {
      if ((this.data.origin === 'PBT' || this.data.desti === 'PBT' || this.data.desti == 'SAB') && this.data.type.includes('Shared')) {
        if (this.data.origin === 'PBT') {
          this.pickup_location = "Port Barton Terminal"
        }
        if (this.data.desti === 'PBT') {
          this.drop_location = 'Port Barton Terminal'
        }
        if (this.data.desti === 'SAB') {
          this.pickup_location = 'Jolibee Robinsons Place Palawan'
        }
        if (this.data.origin === 'SAB') {
          this.pickup_location = 'Jolibee Robinsons Place Palawan'
        }
        return true
      } else
        return false
    },

    bookingSubmit: function(e) {
      if (this.$refs.bookForm.validate()) {
        this.sheet = false
        this.addToCart()
      }
      e.preventDefault()
      return false
    },
    allowedDates(val) {

      var c = val.split('-')[1] + val.split('-')[2]




      return c != '1231' && c != '0101'
    },
    pricing(i) {
      return i < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(i) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
    },
    addToWishList() {
      this.wishlist = true
      this.$store.commit('addToWishList', this.data.url)
      if (this.getWishList.indexOf(this.data.url) > -1) {
        this.color = 'red'
        this.proc = 'added'
      } else {
        this.color = "grey"
        this.proc = "removed"
      }

    },
    undefChecker: function(url) {

      var trans = this.getTransResult.map((x) => x)
      var tour = this.getTourResult.map((x) => x)

      var data = trans.concat(tour)

      data = data.find((x) => {
        return x.url === url
      })




      this.data = cloneDeep(data)

      this.loading = false

      document.title = this.data.type +' '+this.data.name
      this.img = this.data.thumb.url
      this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.pax - this.data.ceil) * this.data.price))
      this.pickup = this.locations.find(x => x.code == this.data.origin).locations[0]
      this.dropoff = this.locations.find(x => x.code == this.data.desti).locations[0]
      if (this.getWishList.indexOf(this.data.url) > -1)
        this.color = 'red'
      else
        this.color = "grey"




      var trans_1 = cloneDeep(this.getTransResult)
      var a = trans_1.filter(x => {
        return ((x.url != this.$route.params.route) && (x.origin == this.data.desti))
      })

      var trans_data = [];
      a.forEach(x => {
        var tmp = x;
        tmp.url = '/transportation/' + x.url
        trans_data.push(tmp)

      })
      var toursdata = cloneDeep(this.getTourResult)


      var c = toursdata.filter(x => {
        if (this.data.type.includes('Tour'))
          return ((x.url != this.$route.params.route) && (x.origin == this.data.origin))
        else
          return x.desti == this.data.desti
      })


      var tour_data = []
      c.forEach(x => {
        var tmp = x

        tmp.url = '/tour/' + x.url
        tour_data.push(tmp)

      })

      this.suggest = trans_data.concat(tour_data)

      this.suggest = shuffle(this.suggest)








    },

    step1Submit: function(e) {

      if (this.$refs.step1.validate()) {
        this.e6 = 2
      }
      e.preventDefault()
      return false
    },
    step2Submit: function(e) {

      if (this.$refs.step2.validate()) {
        this.e6 = 3
      }
      e.preventDefault()
      return false
    },
    addToCart: function() {


      var party = {
        id: 'guest_0',
        name: '',
        age: 18,
        gender: 'M',
        nationality: 'Filipino'
      }
      var participants = []

      if (this.data.type.includes("Tour")) {
        for (var i = 0; i < this.pax; i++) {

          participants.push({
            id: 'guest_' + i,
            name: '',
            age: 18,
            gender: 'M',
            nationality: 'Filipino'
          })
        }
      } else {
        participants.push(party)
      }



      var payload = {
        src: 'DS-ONLINE',
        service: this.data.name,
        type: this.data.type,
        srv_code: this.data.code,
        traveldate: this.traveldate,
        time: this.depart_time,
        isNameRequired: this.data.nameRequired,
        participants: participants,
        pax: this.pax,
        request: '',
        rateinfo: {
          listing_id: this.data.id,
          thumb: this.img,
          base: this.data.base,
          ceil: this.data.ceil,
          price: this.data.price
        },
        rates: {
          base: this.price,
          extra: {
            pickup: {
              location: this.pickup_location,
              area: this.pickup.name,
              rate: this.pickup.rate
            },
            dropoff: {
              location: this.drop_location,
              area: this.dropoff.name,
              rate: this.dropoff.rate
            }
          }
        }
      }

      this.$store.commit('addToCart', payload)
      console.log(payload)
      this.snackbar = true
    },

  },
  watch: {
    getIfReady: function(val) {

      if (val == true) {
        this.undefChecker(this.$route.params.route)
      }
    },
    pickup: function() {
      this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(this.pax) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
      this.price = this.price + parseFloat(this.pickup.rate) + parseFloat(this.dropoff.rate)
    },
    dropoff: function() {
      this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(this.pax) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
      this.price = this.price + parseFloat(this.pickup.rate) + parseFloat(this.dropoff.rate)
    },
    pax: function(val) {
      if (val > this.data.max) {
        alert('Maximum ' + this.data.max + ' per booking')
        this.pax = this.data.max
      } else if (val < 1) {
        this.pax = 1
      }
      this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(this.pax) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
      this.price = this.price + parseFloat(this.pickup.rate) + parseFloat(this.dropoff.rate)


    }
  }


}
</script>

<style scoped>
.reviews {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  display: block;
  margin-left: 20px;
  margin-right: 20px;
  -webkit-overflow-scrolling: touch
}

.plusminus {
  display: inline-block;
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
  border-radius: 5px;
}

.bestseller {
  float: left;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: #f44336;
  font-size: 12px !important;
  margin-top: 5px;
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
  border-radius: 5px;
}

.eln {
  background: linear-gradient(to right, #6288DF 50%, transparent 100%)
}

.article {
  margin-left: 30px;
  z-index: 2;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  box-sizing: border-box;
  display: block;
}

.reminder_div {
  border-radius: 2px;
  padding: 20px 20px;
  padding-bottom: 20px !important;
  background-color: #fffae5
}

.price {
  font-size: 14px;
  color: orange;
}

.shopresponsive {
  position: fixed;
  width: 100%;
  display: block;
  z-index: 100;
  bottom: 0;
  right: 0;
}
</style>
