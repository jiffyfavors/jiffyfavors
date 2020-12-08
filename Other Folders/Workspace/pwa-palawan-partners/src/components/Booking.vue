<template>
  <v-layout column align-center>
    <div v-if="isLoading" class="loading"></div>
    <v-flex sm6 md6 lg6 xs12>
      <v-container>
        <div class="toursection eln">
          <div class="rg-img rg-img-bg bg-img-van">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Book a Van</p>
            <p style="margin: 10px 0; white-space: normal;">Select van transfer service that fits to your requirement
            </p>
          </article>
        </div>
      </v-container>
      <v-container>
        <v-toolbar @click="showFilter = false " width="100%" v-show="showFilter">
          <v-icon dense color="blue">fas fa-shuttle-van</v-icon>
          <v-toolbar-title> {{locations.filter((x)=>{return x.code==origin})[0].name}} to {{locations.filter((x)=>{return x.code==desti})[0].name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon dense color="red">fas fa-search</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form v-show="!showFilter" ref="form" v-model="valid" :lazy-validation="true">
          <v-layout align="center" column wrap>
            <v-flex xs12 sm6 md6>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-card-title primary-title>
                  Service Request Selection
                </v-card-title>
                <v-layout row wrap mx-5 pt-5>
                 
                  <template >
                    <v-flex xs6 sm6 md6>
                      <v-select required v-model="origin" :items="locations" item-value="code" item-text="name" label="From">
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select required v-model="desti" :items="locations" item-value="code" item-text="name" label="To">
                      </v-select>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-radio-group :mandatory="true" dense v-model="selectedService">
                        <v-radio dense small v-for="n in services.filter((x)=>{return x.origin==origin && x.desti === desti})" :key="n.code" :label="`${n.type}` +' '+ `${n.name}`" :value="n"></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-alert v-if="selectedService.type==='Ride Sharing'" dense text type="warning">
                      Please inform guest this service has <strong><span style='color:red;'>1h to 1h 30m</span></strong> waiting window.
                    </v-alert>
                    <v-alert v-if="!isWithRate && selectedService.type !=='NA'" dense text type="error">
                      The agent rate for <strong>{{selectedService.type}} {{selectedService.name}}</strong> is not yet <strong><span style='color:red;'>APPROVED</span></strong> please contact us.
                    </v-alert>
                  </template>
                  
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-form>
        <BookingForm  :item="selectedService" :rateinfo="rateinfo" :sheet="initBooking" />
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'


import BookingForm from '../components/BookingForm'
import shuffle from 'lodash/shuffle'
export default {
  name: 'Booking',
  components: {
    BookingForm
  },
  computed: {
    ...mapState([
      "contactSheet",
      "trans_result"
    ]),
    ...mapGetters(['getCurrentUser','getPartners','contactSheet', 'getTransResult', 'getSearchData', 'getServices', 'getAreas']),


  },
  data() {
    return {
     
      isLoading: false,
    
      items: [],
      selectedService: {
        type: 'NA'
      },
      initBooking: false,
      isWithRate: false,
      origin: 'PPS',
      showFilter: false,
      valid: true,
      rateinfo:{
        sched:[]
      },
      desti: 'ELN',
      pax: 2,
      traveldate: new Date().toISOString().substr(0, 10),
      min: new Date().toISOString().substr(0, 10),
      menu2: false,
      menu: false,
      modal: false,
      result: [],
      trans: [],
      locations: [{
        code: 'PPS',
        name: 'Puerto Princesa'
      }, {
        code: 'ELN',
        name: 'El Nido'
      }, {
        code: 'PBT',
        name: 'Port Barton'
      }, {
        code: 'SVC',
        name: 'San Vicente'
      }, {
        code: 'SAB',
        name: 'Sabang Beach'
      }],
      services: [],
      areas: []
    }
  },
  mounted() {



    this.services = this.getServices
 
    this.areas = this.getAreas
    this.origin = this.getSearchData.origin
    this.desti = this.getSearchData.desti
    this.pax = this.getSearchData.pax
    this.traveldate = this.getSearchData.traveldate
    if (this.$route.query.desti) {
      this.showFilter = true
      var routes = this.$route.query.desti.split(",")


      this.trans = this.getTransResult
      this.showFilter = true


      this.result = this.trans.filter((x) => {
        return (x.origin == routes[0] || x.origin == routes[1]) && (x.desti == routes[0] || x.desti == routes[1])
      });
      this.result = shuffle(this.result)





    }

  },
  watch: {

    search() {
      // Items have already been loaded
      if (this.items.length > 0) return

     this.items = this.getPartners

      // Lazily load input items
     
    },
    selectedService(val) {
      this.initBooking = false
      val.schedule = []


      this.isLoading = true
      var payload = {
        status: 'Requested',
        agent_id: this.getCurrentUser.entity.id,
        srv_code: val.code,
        rates: {
          base: 0,
          ceil: 0,
          rate: 0
        },
        pickup: this.areas.find(x => x.code == val.origin).locations,
        dropoff: this.areas.find(x => x.code == val.desti).locations
      }
      this.rateLookup(payload)


    }

  },
  methods: {

    rateLookup(val) {
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
          this.isWithRate = false
        else{
          this.rateinfo = data
         
          this.isWithRate = true
          this.initBooking = true
        }

      }).catch(() =>
        this.isLoading = false
      ).finally(() => this.isLoading = false)


    },
    fnSearch() {
      var data = {
        traveldate: this.traveldate,
        pax: this.pax,
        origin: this.origin,
        desti: this.desti
      }
      this.trans = this.getTransResult
      this.showFilter = true
      if (this.$refs.form.validate()) {

        this.result = this.trans.filter((x) => {
          return x.origin == this.origin && x.desti == this.desti
        });
        this.result = shuffle(this.result)
        this.$store.commit('updateSearch', data);


      }

    }
  }
};
</script>

<style scoped>
#e3 {
  background: none
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
