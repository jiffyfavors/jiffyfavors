<template>
  <v-container>
    <v-layout align="center" column wrap>
      <v-card :loading="loading" class="mx-auto mb-8" width="800" max-width="100%">
        <v-img class="white--text" height="350px" :src="img">
          <span v-if="data.bestseller" class="bestseller">Bestseller</span>
        </v-img>
        <v-card-title class="align-end black--text fill-height">{{data.name}}</v-card-title>
        <v-chip small class="ma-2" color="primary">
          {{data.type}}
        </v-chip>
        <v-divider></v-divider>
        <v-card-text>
          <v-toolbar v-show="!sheet" flat class="shopresponsive">
            <v-btn @click="addToWishList" tile icon fab>
              <v-icon :color="color">fas fa-heart</v-icon>
            </v-btn>
            <!--   <v-btn tile icon fab>
              <v-icon color="green">fas fa-share-alt</v-icon>
            </v-btn> -->
            <v-spacer></v-spacer>
            <v-btn text v-if="isWithRate" @click="sheet = !sheet" tile outlined color="blue">
              Book Now
            </v-btn>
            <v-btn text v-if="!isWithRate" @click="requestRate" tile outlined color="blue">
              Request Rate
            </v-btn>
          </v-toolbar>
          <span class="text--primary">
        <span>{{data.desc}}</span>
          </span>
          <v-divider></v-divider>
          <h3>Destinations</h3>
          <div class="reviews">
            <div v-for="(i,index) in data.destinations" class="review-card" :key="`desti`+index">
              <v-card>
                <v-img :src="i.url" :alt="i.name">
                  <span class="bestseller">{{i.name}}</span>
                </v-img>
              </v-card>
            </div>
          </div>
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
            <h3>Itinerary</h3>
            <v-timeline align-top dense>
              <v-timeline-item color="pink" v-for="(i, index) in data.itinerary" :key="index" small>
                <template v-slot:icon>
                  <span class="white--text">{{index + 1}}</span>
                </template>
                <v-row>
                  <v-col>
                    {{i}}
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
            <div v-if="isWithRate">
              <h2>Pricing</h2>
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th class="text-left">People</th>
                    <th class="text-left">Contracted Rate</th>
                    <th class="text-left">Publish Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i,index) in data.max" :key="index">
                    <td>{{i}} people</td>
                    <td>{{contracted(i)|toPHP}}</td>
                    <td>{{pricing(i)|toPHP}}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
          </v-container>
          <div class="reminder_div">
            <h3>Important Note</h3>
            <ul>
              <li style="font-size:11px;" v-for="(i,index) in data.notations" :key="`not`+index">
                {{i}}
                <v-divider></v-divider>
              </li>
            </ul>
            <h3>Cancellation Policy</h3>
            <ul>
              <li style="font-size:11px;" v-for="(i,index) in data.cancellation" :key="`can`+index">
                {{i}}
                <v-divider></v-divider>
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-bottom-sheet inset v-model="sheet" scrollable v-if="typeof data != 'undefined'">
      <v-card max-height="100%">
        <v-card-text>
          <v-stepper v-model="e6" vertical>
            <v-stepper-step :complete="e6 > 1" step="1">
              Travel Information
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="step1" lazy-validation @submit="step1Submit">
                <v-layout wrap mx-5>
                  <template v-if="isCurrent">
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="fullname" :rules="nameRules" label="Primary Contact Person" placeholder="Name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="email" label="Email" :rules="emailRules" placeholder="Email"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="phone" label="Phone" :rules="phoneRules" placeholder="Phone"></v-text-field>
                    </v-flex>
                    <v-divider></v-divider>
                  </template>
                  <v-flex xs12 sm12 md12>
                    <v-text-field required :value="fullname" v-model="leadguest" :rules="nameRules" label="Lead Passenger's Name" placeholder="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="traveldate" persistent full-width width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field required v-model="traveldate" label="Travel Date" readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="traveldate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(traveldate)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs6 md6 sm6>
                    <v-text-field v-if="data.schedule.length<1" name="name" type="time" placeholder="Time" required v-model="depart_time" label="Time" id="id"></v-text-field>
                    <v-select v-if="data.schedule.length>0" flat :rules="timeRules" label="Time" placeholder="Time" single-line required v-model="depart_time" :items="data.schedule">
                    </v-select>
                  </v-flex>
                  <v-flex xs6 md6 sm6>
                    <v-text-field name="name" type="number" required step="1" min="1" max="12" v-model="pax" label="Participants" id="id"></v-text-field>
                  </v-flex>
                  <v-flex xs6 md6 sm6>
                    <v-chip class="ma-2 white--text" color="green">
                      Total {{price|toPHP}}
                    </v-chip>
                  </v-flex>
                </v-layout>
                <v-col align="end">
                  <v-btn color="primary" type="submit" text outlined small>Continue</v-btn>
                </v-col>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 2" step="2">
              Pickup & Drop Off Location
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-form ref="step2" lazy-validation @submit="step2Submit">
                <v-layout wrap mx-5>
                  <v-row>
                    <span>Departure</span>
                  </v-row>
                  <v-flex xs12 md12 sm12>
                    <v-select flat dense label="Pickup Area" single-line required v-model="pickup" :items="locations.find(x=>x.code==data.origin).locations" item-text="name" :hint="`Additional Charge of PHP ${pickup.rate} for the whole group`" persistent-hint return-object>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 md12 sm12 class="mt-2">
                    <v-textarea :rules="textAreaRule" outlined v-model="pickup_location" required label="Address" v-if="pickup.rate>-1" placeholder="Hotel or Flight Number"></v-textarea>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-select flat dense label="Drop Area" single-line required v-model="dropoff" :items="locations.find(x=>x.code===data.desti).locations" item-text="name" :hint="`Additional Charge of PHP ${dropoff.rate} for the whole group`" persistent-hint return-object>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 md12 sm12 class="mt-2">
                    <v-textarea :rules="textAreaRule" v-if="dropoff.rate>0" outlined v-model="drop_location" required label="Address" placeholder="Hotel or Flight Number"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12 align="end">
                    <v-btn color="secondary" text outlined small @click="e6 =1">Back</v-btn>
                    <v-btn color="primary" text outlined small type="submit">Continue</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 4" step="3">
              Summary
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-list dense two-line>
                <v-subheader>Summary</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Service</v-list-item-title>
                    <v-list-item-subtitle>{{data.name}} {{data.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Travel Date & Time</v-list-item-title>
                    <v-list-item-subtitle>{{traveldate}} {{depart_time}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Lead Participant</v-list-item-title>
                    <v-list-item-subtitle>{{fullname}} {{pax}} people</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Rate</v-list-item-title>
                    <v-list-item-subtitle>{{price|toPHP}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pickup</v-list-item-title>
                    <v-list-item-subtitle>{{pickup_location}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pickup Charge</v-list-item-title>
                    <v-list-item-subtitle>{{pickup.name}} ({{pickup.rate|toPHP}})</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Drop Off</v-list-item-title>
                    <v-list-item-subtitle>{{drop_location}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Drop Off Charge</v-list-item-title>
                    <v-list-item-subtitle>{{dropoff.name}} ({{dropoff.rate|toPHP}})</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title color="red"><strong>Total Rate</strong></v-list-item-title>
                    <v-list-item-subtitle><span style="color:red"><strong>{{ price + pickup.rate + dropoff.rate | toPHP}}</strong></span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-flex xs12 sm12 md12 align="end">
                <v-btn color="secondary" text outlined small @click="e6 =2">Back</v-btn>
                <v-btn color="primary" text outlined small :disabled="snackbar" @click="dialog=true">Continue</v-btn>
              </v-flex>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
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
    <v-dialog v-model="loadingdiag" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{statusupdate}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Submit Booking Request</v-card-title>
        <v-card-text>Please verify all booking information is correct. Please click <strong>SUBMIT</strong> to proceed with the booking.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" @click="submitBooking">Submit</v-btn>
          <v-dialog v-model="dialog2" width="500">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>
                Booking Request Submitted
              </v-card-title>
              <v-card-text>
                Your booking request is already submitted to us. We will send you an email notification once we acknowledge the booking.
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog=false">
                  Done
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loadingdiag" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{statusupdate}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { bookings, agent, dbrates } from '../firebase'
export default {
  name: 'TourDetails',
  computed: {
    ...mapGetters(['getIfReady', 'getCurrentTransDetails', 'getCurrentUser', 'getCurrentSearch', 'getRequestedRates', 'getTourResult', 'getTransResult', 'getWishList']),
    locations: function() {
      return [{
        "code": "ELN",
        "locations": [{
          "name": "El Nido Beach",
          "rate": 0
        }, {
          "name": "Corong Corong Area",
          "rate": 0
        }, {
          "name": "El Nido Town Center",
          "rate": 0
        }, {
          "name": "Lio Estate or Villa Libertad Area",
          "rate": 850
        }, {
          "name": "El Nido Cove Resort",
          "rate": 1200
        }, {
          "name": "Nacpan & Bucana Area",
          "rate": 1600
        }, {
          "name": "Duli Beach",
          "rate": 2200
        }, {
          "name": "San Fernando & Sibaltan Area",
          "rate": 2800
        }]
      }, {
        "code": "PPS",
        "locations": [{
          "name": "PPS Hotel",
          "rate": 0
        }, {
          "name": "PPS Airport",
          "rate": 0
        }, {
          "name": "Astoria Palawan",
          "rate": 2500
        }, {
          "name": "Peace & Love Resort",
          "rate": 2000
        }, {
          "name": "Coppers Beach Resort",
          "rate": 2300
        }]
      }, {
        "code": "SVC",
        "locations": [{
          "name": "Poblacion, San Vicente",
          "rate": 0
        }, {
          "name": "San Vicente Van Terminal",
          "rate": 0
        }, {
          "name": "Brgy. Alimanguhan",
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
    }

  },
  data() {
    return {
      sheet: false,
      color: 'grey',
      dialog: false,
      dialog2: false,
      loadingdiag: false,
      phone: '',
      wishlist: false,
      loadingdiag: false,
      statusupdate: '',
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
        ceil: 0,
        base: 0,
        price: 0,
        bestseller: false,
      },
      img: '',
      price: 0,
      pax: 1,
      isWithRate: false,
      suggest: [],
      loaded_rates:{},
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.undefChecker(to.params.route)
    next()
  },
  mounted() {



    this.isCurrent = this._.isEmpty(this.getCurrentUser)
    this.pax = this.getCurrentSearch.pax == null ? 1 : this.getCurrentSearch.pax
    this.traveldate = typeof this.getCurrentSearch.traveldate == 'undefined' ? new Date().toISOString().substr(0, 10) : new Date(this.getCurrentSearch.traveldate).toISOString().substr(0, 10)



    if (this.getIfReady) {
      //alert(this.$route.params.route)

    }

    this.undefChecker(this.$route.params.route)



  },
  methods: {

    contracted(i) {
      var c_rate = 0;
   
      var data = this.loaded_rates
    
      return  i < data.contracted.ceil ? parseFloat((data.contracted.base)) : parseFloat(data.contracted.base + ((i - data.contracted.ceil) * data.contracted.rate))
      
      // agent.doc(this.getCurrentUser.id).collection('rates').doc(this.data.code).get().then(d => {

      //   if (d.exists) {
      //     var data = d.data();
      //     console.log(data)
      //     this.isWithRate = true
      //     c_rate = i < data.contracted.ceil ? parseFloat((data.contracted.base)) : parseFloat(data.contracted.base + ((i - data.contracted.ceil) * data.contracted.price))
      //   }
      // }).catch(err => {
      //   c_rate = 0
      //   this.isWithRate = false
      //   console.log(err)
      // })


    },
    pricing(i) {
      return i < this.data.ceil ? parseFloat((this.data.base)) : (parseFloat(this.data.base) + ((parseInt(i) - parseInt(this.data.ceil)) * parseFloat(this.data.price)))
    },

    requestRate: function() {
      this.statusupdate = 'Requesting rates....';
      this.loadingdiag = true

      var req_rate = {
        agent_id: this.getCurrentUser.id,
        agent_name: this.getCurrentUser.user.entity_name,
        code: this.data.code,
        service_name: this.data.name + '-' + this.data.type
      }


      agent.doc(this.getCurrentUser.id).collection('rates').doc(this.data.code).get().then(d => {
      
        if (d.exists) {
          this.isWithRate = true
          this.getRequestedRates.forEach((a, b) => {
            if (a.code === d.id) {
              dbrates.where('code', '==', a.code).get().then(r => {
                r.docs.forEach(_r => {
                  dbrates.doc(_r.id).delete()
                  this.getRequestedRates.splice(b, 1)
                })

              });

            }



            var indexOf = -1;
            this.getRequestedRates.forEach((a, i) => {
              if (this.data.code === a.code)
                indexOf = i
            })

            if (indexOf < 0) {
              dbrates.add(req_rate).then(snap => {
                this.$store.commit('addRequestedRate', req_rate)

                this.loadingdiag = false
                alert('Request success')
              }).catch(err => {
                console.log(err)
              })

            } else {
              this.loadingdiag = false
              alert('Request is on process')
            }


          })
        } else {

          var indexOf = -1;
          this.getRequestedRates.forEach((a, i) => {
            if (this.data.code === a.code)
              indexOf = i
          })

          if (indexOf < 0) {
            dbrates.add(req_rate).then(snap => {
              this.$store.commit('addRequestedRate', req_rate)

              this.loadingdiag = false
              alert('Request success')
            }).catch(err => {
              console.log(err)
            })

          } else {
            this.loadingdiag = false
            alert('Request is on process')
          }

          this.isWithRate = false
        }
      })


    },
    addToWishList() {
      this.wishlist = true
      this.$store.commit('addToWishList', this.data.id)
      if (this.getWishList.indexOf(this.data.id) > -1) {
        this.color = 'red'
        this.proc = 'added'
      } else {
        this.color = "grey"
        this.proc = "removed"
      }

    },

    RateFinder: function(code){

       var myrates = this.getCurrentUser.rates
      var keys = [];
      for(var i=0;i<myrates.length;i++){
       keys.push(Object.keys(myrates[i])[0])
       if(Object.keys(myrates[i])[0]===code){
        this.loaded_rates = myrates[i][code]
        this.isWithRate = true
       }

      }
 


    },
    undefChecker: function(url) {
      //var data = this.getTourResult.map((x) => x)

      var data = this.getTourResult.find((x) => {
        return x.url === url
      })
 

      this.data = this._.cloneDeep(data)
      this.RateFinder(this.data.code)

      this.loading = false

      this.img = this.data.thumb.url
   
      this.pickup = this.locations.find(x => x.code == this.data.origin).locations[0]
      this.dropoff = this.locations.find(x => x.code == this.data.desti).locations[0]
      if (this.getWishList.indexOf(this.data.id) > -1)
        this.color = 'red'
      else
        this.color = "grey"




      var trans = this._.cloneDeep(this.getTransResult)
      var a = trans.filter(x => {
        return x.origin = this.data.origin
          //return (x.url != this.$route.params.route) && x.origin == this.data.desti
      })

      var trans_data = [];
      a.forEach(x => {
        var tmp = x;
        tmp.url = '/transportation/' + x.url
        trans_data.push(tmp)

      })
      var toursdata = this._.cloneDeep(this.getTourResult)

      var c = toursdata.filter(x => {
        return ((x.url != this.$route.params.route) && (x.origin == this.data.origin))
          //return x.desti == this.data.desti
      })
      var tour_data = []
      c.forEach(x => {
        var tmp = x

        tmp.url = '/tour/' + x.url
        tour_data.push(tmp)

      })

      this.suggest = trans_data.concat(tour_data)

      this.suggest = this._.shuffle(this.suggest)
     // this.requestRate()


    },
    selectChange: function(e) {
      if (e.rate == 0)
        this.drop_location = e.name
      else
        this.drop_location = ''
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

    generateBookingId: function() {
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = 'BR-' + new Date().getFullYear().toString() + '-'
      for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

      return result

    },
    submitBooking: function() {


      this.loadingdiag = true;
      this.statusupdate = 'Submitting Booking Request...'

      var payload = {
        src: this.getCurrentUser.id,
        status: 'PENDING',
        service: this.data.name,
        type: this.data.type,
        traveldate: this.traveldate,
        srv_code: this.data.code,
        time: this.depart_time,
        leadguest: this.leadguest,
        ref: this.generateBookingId(),
        isNameRequired: true,
        participants: [],
        pax: this.pax,
        rateinfo: {
          listing_id: this.data.id,
          thumb: this.img,
          base: this.data.contracted.base,
          ceil: this.data.contracted.ceil,
          rate: this.data.contracted.price
        },
        rates: {
          base: {
            rate: this.price,
            total: this.price + this.pickup.rate + this.dropoff.rate
          },
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

      bookings.add(payload).then((b) => {
        this.loadingdiag = false
        this.statusupdate = 'Booking succesfully submitted';
        this.dialog2 = true
      }).catch(err => {
        this.loadingdiag = false
        this.statusupdate = 'Booking Request Error';
        this.dialog2 = true
      })




    },

  },
  watch: {
    getIfReady: function(val) {

      if (val == true) {
        this.undefChecker(this.$route.params.route)
      }
    },
    pax: function(val) {

      if (JSON.stringify(this.loaded_rates)!==JSON.stringify({})){
         var data = this.loaded_rates
       this.price = this.pax < data.contracted.ceil ? parseFloat((data.contracted.base)) : parseFloat(data.contracted.base + ((this.pax - data.contracted.ceil) * data.contracted.rate))
      }
          
    }
  }
};
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

@media screen and (max-width: 480px) {
  .shopresponsive {
    position: fixed;
    width: 100%;
    display: block;
    z-index: 100;
    bottom: 0;
    right: 0;
  }
}
</style>
