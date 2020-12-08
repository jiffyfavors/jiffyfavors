<template>
  <v-container v-if="getIfReady">
     <div v-if="isLoading" class="loading"></div>
    <v-layout align="center" column wrap>
      <v-card :loading="loading" class="mx-auto mb-8" width="500" max-width="100%">
        <v-img class="white--text" height="250px" :src="img">
          <span v-if="data.bestseller" class="bestseller"> {{data.type}}</span>
        </v-img>
        <v-card-title class="align-end black--text fill-height">{{data.name}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h3>Destinations</h3>
          <div class="reviews">
            <div v-for="(i,index) in data.destinations" class="review-card" :key="`dest`+index">
              <v-card>
                <v-img height="180" :src="i.url" :alt="i.name">
                  <span class="bestseller">{{i.name}}</span>
                </v-img>
              </v-card>
            </div>
          </div>
          <v-divider></v-divider>
          <v-container wrap>
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
            <h2>Itinerary</h2>
            <v-timeline align-top dense>
              <v-timeline-item color="pink" v-for="(i, index) in data.itinerary" :key="index" small dense>
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
              <li style="font-size:11px;" v-for="(i,index) in data.cancellation" :key="`can-`+index">
                {{i}}
                <v-divider></v-divider>
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
      <v-toolbar bottom width="100%" v-show="!sheet" class="shopresponsive">
        <v-btn tile @click="initContact" icon fab>
          <v-icon color="green">fab fa-whatsapp</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="bookNowbtn" tile outlined color="blue">
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
            <v-toolbar-title>{{data.type}} {{data.name}} Booking</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="bookForm" lazy-validation @submit="bookingSubmit">
            <v-layout align="center" column wrap>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-list two-line subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{data.type}}</v-list-item-title>
                      <v-list-item-subtitle>{{data.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Select Date & Time</v-list-item-title>
                      <v-flex xs4 md4 sm4>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="traveldate" persistent full-width width="290px">
                          <template v-slot:activator="{ on }">
                            <v-text-field required :min="min" v-model="traveldate" label="Travel Date" readonly v-on="on"></v-text-field>
                          </template>
                          <v-date-picker full-width  v-model="traveldate" :allowed-dates="allowedDates" scrollable>
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
                    <v-list-item-content>
                      <v-col cols="12" sm="6" md="6" v-for="fee in data.fees">
                        <v-checkbox dense v-model="fees" :label="fee.name" :value="fee"></v-checkbox>
                      </v-col>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense label="Pickup Area" required v-model="pickup" :items="rateinfo.pickup.filter(x=>x.rate>-1)" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="pickup.rate>0" dense text type="warning">
                          Additional Pickup Charge of <strong><span style='color:red;'>{{pickup.rate|toPHP}}</span></strong> for the whole group
                        </v-alert>
                      </v-flex>
                    </v-layout>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense label="Drop Area" required v-model="dropoff" :items="rateinfo.dropoff.filter(x=>x.rate>-1)" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="dropoff.rate>0" dense text type="warning">
                          Additional Drop Off Charge of <strong><span style='color:red;'>{{dropoff.rate|toPHP}}</span></strong> for the whole group
                        </v-alert>
                      </v-flex>
                    </v-layout>
                  </v-list-item>
                </v-list>
                <v-alert dense text type="success">
                  You will add Pickup/Drop Off Address later at <strong>Checkout</strong>
                </v-alert>
                <v-list-item class="mb-10">
                  <v-list-item-content>
                    <v-list-item-title>Rates</v-list-item-title>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Particulars</th>
                            <th class="text-left">Contracted</th>
                            <th class="text-left">Publish</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="font-size:10px;">
                              <strong>Tour</strong>
                            </td>
                            <td style="font-size:10px;">
                              {{contracted|toPHP}}
                            </td>
                            <td style="font-size:10px;">
                              {{publish|toPHP}}
                            </td>
                          </tr>
                          <tr v-for="fee in fees">
                            <td style="font-size:10px;">
                              <strong>{{fee.name}}</strong>
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(fee.rate *pax)|toPHP}}
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(fee.rate * pax)|toPHP}}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:10px;">
                              <strong> Pickup Charge</strong>
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(pickup.rate)|toPHP}}
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(pickup.rate)|toPHP}}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:10px;">
                              <strong> Drop Off Charge</strong>
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(dropoff.rate)|toPHP}}
                            </td>
                            <td style="font-size:10px;">
                              {{parseFloat(dropoff.rate)|toPHP}}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:10px;">
                              <strong>Total</strong>
                            </td>
                            <td style="font-size:10px;">
                              <strong>{{totalcontracted|toPHP}}</strong>
                            </td>
                            <td style="font-size:10px;">
                              <strong>{{parseFloat(dropoff.rate) + parseFloat(pickup.rate) + parseFloat(totalfees) + parseFloat(publish)|toPHP}}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-list-item-content>
                </v-list-item>
                <v-toolbar dense min-width="100%" max-width="100%" class="shopresponsive">
                  <v-chip class="white--text" color="blue">
                    Total {{totalcontracted|toPHP}}
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
    <v-dialog v-model="norate" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Rate not approved.</v-card-title>
        <v-card-text>
          <v-alert type="info">
            Please contact us to get your contracted rate for this tour.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="norate = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TransferResult from '../components/TransferResult'
import Reviews from '../components/Reviews'
import { isEmpty } from 'lodash/core';
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'TransferDetails',
  components: {
    TransferResult,
    Reviews
  },
  computed: {
    ...mapGetters(['getIfReady', 'getCurrentTransDetails', 'getCurrentUser', 'getCurrentSearch', 'getTourResult', 'getTransResult', 'getWishList']),
  
    totalfees: function() {
      var c = 0;
      this.fees.forEach(a => {
        c = c + (parseFloat(a.rate) * parseInt(this.pax))
      })
      return c
    },
    publish: function() {
      var i = parseInt(this.pax)
      return i < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(i) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
    },
    contracted: function() {
      var i = parseInt(this.pax)

      return i < this.rateinfo.rates.ceil ? parseFloat((this.rateinfo.rates.base)) : (parseFloat(this.rateinfo.rates.base) + ((parseInt(i) - parseInt(this.rateinfo.rates.ceil)) * parseFloat(this.rateinfo.rates.rate)))
    },
      totalcontracted: function(){
    return parseFloat(this.dropoff.rate) + parseFloat(this.pickup.rate) + parseFloat(this.totalfees) + parseFloat(this.contracted)
    },

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
      fees: [],
      sheet: false,
      norate: false,
      loaded: false,
      phone: '',
      wishlist: false,
      color: 'grey',
      proc: '',
      e6: 1,
      leadguest: '',
      isCurrent: false,
      snackbar: false,
      fullname: '',
      depart_time: '',
      pickup: {
        rate:0
      },
      dropoff: {
        rate:0
      },
      rateinfo: {
        rates:{ceil:0,
        base:0,
        rate:0}
      },
      pickup_location: '',
      drop_location: '',
      loading: true,
       isLoading:false,
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
      traveldate: new Date().toISOString().substr(0, 10),
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
    if (this.isCurrent)
      this.$router.push({ path: '/login' })
    else {
      if (JSON.parse(this.getCurrentUser.entity.notallowedpaths).indexOf('/tours') > -1) {
        this.$router.push({ path: '/login' })
      }
    }

    this.pax = this.getCurrentSearch.pax == null ? 1 : this.getCurrentSearch.pax
    this.traveldate = typeof this.getCurrentSearch.traveldate == 'undefined' ? new Date().toISOString().substr(0, 10) : new Date(this.getCurrentSearch.traveldate).toISOString().substr(0, 10)
    this.rateinfo.pickup = this.locations.find(x => x.code == 'ELN').locations
    this.rateinfo.dropoff = this.locations.find(x => x.code == 'ELN').locations


    if (this.getIfReady) {
      //alert(this.$route.params.route)
      this.undefChecker(this.$route.params.route)
    }




    this.isDisable()

  },
  methods: {
    bookNowbtn() {


      var payload = {
        status: 'Requested',
        agent_id: this.getCurrentUser.entity.id,
        srv_code: this.data.code,
        rates: {
          base: 0,
          ceil: 0,
          rate: 0
        },
        pickup: this.locations.find(x => x.code == this.data.origin).locations,
        dropoff: this.locations.find(x => x.code == this.data.desti).locations
      }
      this.rateLookup(payload)


    },
    initContact() {
      this.$store.commit('updateContactSheet', true)
    },
    isDisable() {
      if ((this.data.origin === 'PBT' || this.data.desti === 'PBT') && this.data.type.includes('Shared')) {
        if (this.data.origin === 'PBT') {
          this.pickup_location = "Port Barton Terminal"
        }
        if (this.data.desti === 'PBT') {
          this.drop_location = 'Port Barton Terminal'
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

      this.img = this.data.thumb.url
      this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.pax - this.data.ceil) * this.data.price))
      this.pickup = this.locations.find(x => x.code == this.data.origin).locations[0]
      this.dropoff = this.locations.find(x => x.code == this.data.desti).locations[0]
      if (this.getWishList.indexOf(this.data.url) > -1)
        this.color = 'red'
      else
        this.color = "grey"


    },


    rateLookup(val) {
      this.isLoading = true
      this.norate = false
      fetch('https://api.diskubrepalawan.com/index_dev.php/rate-lookup', {

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
        body: JSON.stringify({ payload: val })
      }).then((data) => {
        return data.json()
      }).then((data) => {

        if (data.status === 'Requested')
          this.norate = true
        else {
          this.rateinfo = data
          this.pickup = this.rateinfo.pickup.filter(x => x.rate > -1)[0]
          this.dropoff = this.rateinfo.dropoff.filter(x => x.rate > -1)[0]
          this.sheet = !this.sheet
        }



      }).catch(() =>
        this.isLoading = false
      ).finally(() => this.isLoading = false)


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
        src: this.rateinfo.agent_id,
        service: this.data.name,
        type: this.data.type,
        srv_code: this.data.code,
        traveldate: this.traveldate,
        time: this.depart_time,
        isNameRequired: false,
        participants: participants,
        pax: this.pax,
        request: '',
        rateinfo: {
          listing_id: this.data.id,
          thumb: this.img,
          base: this.rateinfo.rates.base,
          ceil: this.rateinfo.rates.ceil,
          price: this.rateinfo.rates.rate
        },
        rates: {
          base: this.price,
          extra: {
            fees: this.fees,
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

      this.snackbar = true
    },

  },
  watch: {
    fees(val) {
      console.log(val)
    },
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
