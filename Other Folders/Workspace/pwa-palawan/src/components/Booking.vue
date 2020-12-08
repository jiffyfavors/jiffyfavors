<template>
  <v-layout column align-center>
    <v-flex sm6 md6 lg6 xs12>
      <v-container>
        <div class="toursection eln">
          <div class="rg-img rg-img-bg bg-img-van">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Book your transportation with us</p>
            <p style="margin: 10px 0; white-space: normal;">We do shared & private transfer and with tours too!
            </p>
          </article>
        </div>
      </v-container>
      <v-container>
        <v-toolbar @click="showFilter = false " width="100%" v-show="showFilter">
          <v-toolbar-title><small> {{locations.filter((x)=>{return x.code==origin})[0].name}} to {{locations.filter((x)=>{return x.code==desti})[0].name}}</small></v-toolbar-title>
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
                  Let's find your ride
                </v-card-title>
                <v-layout row wrap mx-5 pt-5>
                  <v-divider></v-divider>
                  <v-flex xs12 sm6 md6>
                    <v-select required v-model="origin" :items="locations" item-value="code" item-text="name" label="From">
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select required v-model="desti" :items="locations" item-value="code" item-text="name" label="To">
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
      <v-layout wrap text-start justify-center align-start>
        <TransferResult v-for="(i, index) in result" :key="index" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/transportation/'+i.url" :pax="parseInt(pax)"></TransferResult>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import TransferResult from '../components/TransferResult'
import shuffle from 'lodash/shuffle'
export default {
  name: 'Booking',
  components: {
    TransferResult
  },
  computed: {
    ...mapState([
      "contactSheet",
      "trans_result"
    ]),
    ...mapGetters(['contactSheet', 'getTransResult', 'getSearchData'])
  },
  data() {
    return {
      origin: 'PPS',
      showFilter: false,
      valid: true,
      desti: 'ELN',
      pax: 1,
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
      }]
    }
  },
  mounted() {

   document.title ='Transfers - Diskubre Palawan'
    this.fnSearch()



  },
  watch: {

    desti() {
      this.fnSearch()
    },
    origin() {
      this.fnSearch()
    },
    getTransResult(val) {


      if (this.$route.query.desti) {
        this.showFilter = true
        var routes = this.$route.query.desti.split(",")
        this.origin = routes[0]
        this.desti = routes[1]

        this.trans = val
        this.showFilter = true


        this.result = this.trans.filter((x) => {
          return (x.origin == routes[0] || x.origin == routes[1]) && (x.desti == routes[0] || x.desti == routes[1])
        });
        this.result = shuffle(this.result)





      }

    }
  },
  methods: {

    fnSearch() {

      this.trans = this.getTransResult

      if (this.$refs.form.validate()) {

        this.result = this.trans.filter((x) => {
          return x.origin == this.origin && x.desti == this.desti
        });
        this.result = shuffle(this.result)



      }

    }
  }
};
</script>

<style scoped>
#e3 {
  background: none
}
</style>
