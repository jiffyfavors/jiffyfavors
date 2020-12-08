<template>
  <v-layout wrap mx-5 v-if="!isloading">
    <v-layout column align-center>
      <v-flex xs12 md6 sm6 lg6 class="pa-1 ma-1">
        <v-card class="mx-auto" width="500" max-width="100%" outlined>
          <v-list-item three-line dense>
            <v-list-item-content>
              <v-flex xs12 md12 sm12>
                <v-list flat dense>
                  <v-list-item dense>
                    <v-list-item-content v-if="data.participants">
                      <v-list-item-title> <strong>{{data.participants[0].name}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Lead Guest</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><strong>{{data.ref}}</strong></v-list-item-title>
                      <v-list-item-subtitle>eTicket No</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-flex>
            </v-list-item-content>
            <v-list-item-avatar size="100">
              <qrcode-vue :value="`https://m.diskubrepalawan.com/ticket/`+data.ref" size="100" level="H"></qrcode-vue>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item three-line dense>
            <v-list-item-content>
              <v-flex xs6 md6 sm6>
                <v-list dense flat>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><strong>{{data.traveldate}} {{data.time}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Activity Date</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title> <strong>{{data.srv_code}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Activity Code</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-flex>
              <v-flex xs6 md6 sm6>
                <v-list dense flat>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title> <strong> {{data.pax}} people</strong></v-list-item-title>
                      <v-list-item-subtitle>Participants</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title> <strong>{{data.type}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Activity Type</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-flex>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line dense v-if="data.rateinfo">
            <v-list-item-content>
              <div>{{data.service}}</div>
              <div class="overline">Pickup: {{data.rates.extra.pickup.location}}</div>
              <div class="overline">Area: {{data.rates.extra.pickup.area}}</div>
              <div class="overline">Drop Off: {{data.rates.extra.dropoff.location}}</div>
              <div class="overline">Area: {{data.rates.extra.dropoff.area}}</div>
            </v-list-item-content>
            <v-list-item-avatar tile size="100">
              <v-img :src="data.rateinfo.thumb.url" :alt="data.rateinfo.thumb.alt"></v-img>
            </v-list-item-avatar>
          </v-list-item>
          <v-simple-table dense v-if="data.type.includes('Tour')">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" width="50%">Participants</th>
                  <th class="text-left" width="15%"></th>
                  <th class="text-left" width="15%"></th>
                  <th class="text-left" width="20%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data.participants" :key="item.name">
                  <td style="font-size:10px;">{{ item.name }}</td>
                  <td style="font-size:10px;">{{ item.age }}</td>
                  <td style="font-size:10px;">{{ item.gender }}</td>
                  <td style="font-size:10px;">{{ item.nationality }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" width="60%"></th>
                  <th class="text-left" width="40%"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Total</th>
                  <td> {{price|setCurrency(data.currency)}}</td>
                </tr>
                <tr>
                  <th>Payment</th>
                  <td> {{payment|setCurrency(data.currency)}}</td>
                </tr>
                <tr color="red">
                  <th>Balance</th>
                  <td><strong>{{price-payment|setCurrency(data.currency)}}</strong></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'Ticket',
  components: {
    QrcodeVue
  },
  filters: {
    setCurrency: function(value, cur) {
      if (typeof value !== "number") {
        return value;
      }



      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 0,
        currencyDisplay: 'code'
      });
      return formatter.format(Math.round(value))
    }
  },
  computed: {
    ...mapGetters(['getTourResult', 'getTransResult'])
  },
  data() {
    return {
      data: {},
      price: 0,
      payment: 0,
      isloading: true
    }
  },

  mounted() {
    this.isloading = true
    fetch('https://www.diskubrepalawan.com/index_dev.php/get-ticket?ref=' + this.$route.params.ref).then((data) => {
      return data.json()
    }).then((data) => {
      this.data = data

      var trans = this.getTransResult.map((x) => x)
      var tour = this.getTourResult.map((x) => x)
      var listing = trans.concat(tour)

      var listInfo = listing.find((x) => {
        return x.code === data.srv_code
      })
      data.rateinfo.thumb = listInfo.thumb


      this.price = parseFloat(data.rates.base)
      data.payment.forEach(d => {
        this.payment = this.payment + parseFloat(d.amount)
      })

      this.isloading = false

    })

  },


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
