<template>
  <v-layout align-center>
    <v-flex xs12 md6 sm6 offset-md-3 offset-sm-3 pa-2>
      <v-container>
        <div class="toursection eln">
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Book your guest transportation with us</p>
            <p style="margin: 10px 0; white-space: normal;">We do shared & private van transfer.
            </p>
          </article>
          <div class="rg-img rg-img-bg bg-img-van">
          </div>
        </div>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step step="1" complete>Request</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2">Pickup & Drop Off</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Summary</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card>
                <v-layout wrap>
                  <v-flex xs12 sm12>
                    <v-autocomplete v-model="service" :items="getTransfers" :search-input.sync="search" hide-no-data hide-selected item-text="name" item-value="code" label="Select Service" placeholder="Start typing to select service" return-object></v-autocomplete>
                  </v-flex>
                  <v-layout v-if="withRate" wrap>
                    <v-flex xs12 sm12 md12>
                      <v-text-field label="Lead Guest" placeholder="Name of Lead Passenger" outline v-model="leadguest" required></v-text-field>
                    </v-flex>
                    <v-flex xs2 sm2 class="pa-1">
                      <v-text-field label="Pax" v-model="pax" type="number" min="1" max="12" step="1" outline required></v-text-field>
                    </v-flex>
                    <v-flex xs5 sm5 class="pa-1">
                      <v-text-field label="Date" type="date" :min="new Date().toISOString().substr(0, 10)" outline placeholder="Travel Date" v-model="traveldate" hint="Travel Date" required></v-text-field>
                    </v-flex>
                    <v-flex xs5 sm5 class="pa-1">
                      <v-text-field label="Time" v-model="time" type="time" outline required v-if="schedules.length==0"></v-text-field>
                      <v-select :items="schedules" v-model="time" label="Schedule" outline required v-if="schedules.length>0"></v-select>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm12 md12>
                    <v-alert :value="!withRate && service.code!==''" type="info">
                      <v-row align="center" v-if="currentService.status!=='PENDING'">
                        <v-col class="grow"> No Contracted Rate Yet. Please request.</v-col>
                        <v-col class="shrink">
                          <v-btn small color="red" @click="requestRate">
                            Request
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row align="center" v-if="currentService.status==='PENDING'">
                        Already Requested. Waiting for <strong>APPROVAL</strong>
                      </v-row>
                    </v-alert>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-flex>
    <v-dialog v-model="loadingdiag" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{statusupdate}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {
  mapGetters
} from 'vuex'


function initData() {
  return {
    e1: 1,
    loadingdiag: false,
    statusupdate: '',
    service: { code: '' },
    search: '',
    schedules: [],
    leadguest: '',
    traveldate: new Date().toISOString().substr(0, 10),
    currentService: {},
    time: '',
    pax: 1,
    withRate: false
  }
}

export default {
  name: 'Booking',

  data: function() {
    return initData()
  },
  computed: {
    ...mapGetters(['getTransfers', 'getContractedRates', 'getCurrentUser'])
  },
  mounted: function() {

    this.default = this.$data;



  },
  methods: {
    requestRate() {
      alert('request')
      var payload = {
        partner_id: this.getCurrentUser.id,
        code: this.service.code,
        name: this.service.name,
        type: 'Transfers'
      }
      this.postData(['auth', 'request-rate'], { payload: payload }).then((data) => {
        console.log(data)
      });
    }
  },
  watch: {
    service(val) {

      this.postData(['auth', 'get-myrate'], { auth: { partner_id: this.getCurrentUser.id } })
        .then((data) => {
          this.$store.commit('updateData', data.data)
        }).then(() => {


          this.schedules = JSON.parse(val.schedules)
          var c = this.getContractedRates.find(x => x.code === val.code)
          if (typeof c === 'undefined')
            this.withRate = false
          else {
            if (c.status === 'PENDING')
              this.withRate = false
            else {
              this.withRate = true
            }
          }
          this.currentService = Object.assign({}, c)
        }).catch(err => {
          this.schedules = JSON.parse(val.schedules)
          var c = this.getContractedRates.find(x => x.code === val.code)
          if (typeof c === 'undefined')
            this.withRate = false
          else {
            if (c.status === 'PENDING')
              this.withRate = false
            else {
              this.withRate = true
            }
          }
          this.currentService = Object.assign({}, c)
        })




    }
  }


};
</script>

<style scoped>
#e3 {
  background: none
}
</style>
