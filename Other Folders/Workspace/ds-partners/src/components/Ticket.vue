<template>
  <v-layout wrap mx-5 v-if="isready">
    <v-layout column align-center>
      <v-flex xs12 md6 sm6 lg6 class="pa-1 ma-1">
        <v-card class="mx-auto" width="500" max-width="100%" outlined>
       
          <v-list-item three-line dense>
            <v-list-item-avatar size="100">
              <qrcode-vue :value="`https://m.diskubrepalawan.com/ticket/`+data.ref+`/`+data.srv_code" size="120" level="H"></qrcode-vue>

            </v-list-item-avatar>
            <v-list-item-content>

              <v-flex xs12 md6 sm6>

              <v-list two-line  tile flat dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> {{data.leadguest}}</v-list-item-title>
                    <v-list-item-subtitle>Lead Guest</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{data.traveldate}} {{data.time}}</v-list-item-title>
                    <v-list-item-subtitle>Activity Date</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-flex>

             <v-flex xs12 md6 sm6>
              <v-list two-line dense tile flat>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> {{data.ref}}</v-list-item-title>
                    <v-list-item-subtitle>eTicket No</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> {{data.srv_code}}</v-list-item-title>
                    <v-list-item-subtitle>Activity Code</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-flex>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item three-line dense>
           
            <v-list-item-content>
              <div class="overline">{{data.type}}</div>
              <div>{{data.service}}</div>
              
              <div class="overline">No.of Participants: {{data.pax}} people</div>
              <div class="overline">Pickup: {{data.rates.extra.pickup.location}}</div>
              <div class="overline">Drop Off: {{data.rates.extra.dropoff.location}}</div>
            </v-list-item-content>
          </v-list-item>
          <v-layout align-center>
            <v-chip small align="end" class="ma-2 white--text" color="green">
              {{data.status}}
           <!--   Total {{data.rates.base.rate + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate|toPHP}} -->
            </v-chip>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { bookings, users } from '../firebase'
import { mapState, mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'Ticket',
  components: {
    QrcodeVue
  },
  data() {
    return {
      data: null,
      isready:false,
    }
  },
  mounted() {
    bookings.where('ref', '==', this.$route.params.ref).where('srv_code', '==', this.$route.params.code).get().then(snap => {
      var c = snap.docs[0].data()
      this.data = c;
      this.isready = true
    

    })
  },

  methods: {

  }
}
</script>

<style scoped>
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
