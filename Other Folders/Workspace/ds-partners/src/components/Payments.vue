<template>
  <v-card class="mx-auto" height="100%" outlined>
    <v-container>
      <v-layout column align-center>
        <template v-if="data.payments.length==0">
          <v-icon>fas fa-cart-arrow-down</v-icon>
          No Payments Yet
        </template>
        <v-card>
          <v-card-title primary-title>
            Payment Transactions & Balances
          </v-card-title>
          <v-card-text>
            <v-list dense flat two-line>
              <v-list-item-group color="primary">
                <v-subheader>Services</v-subheader>
                <v-list-item v-for="item in mybookings" :key="item.id">
                  <v-list-item-avatar>
                    <v-icon color="blue">fas fa-umbrella-beach</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{item.rates.base + item.rates.extra.dropoff.rate + item.rates.extra.pickup.rate|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.service}}-{{item.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                 <v-subheader>Payments</v-subheader>
                <v-list-item v-for="(item, i) in data.payments" :key="i">
                  <v-list-item-avatar>
                    <v-icon v-if="item.mode=='Cash'" color="red">far fa-money-bill-alt</v-icon>
                    <v-icon v-if="item.mode=='Card'" color="red">fab fa-cc-mastercard</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{-item.amount|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.mode}} Payment on {{item.date}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </v-list-item-group>
              <v-list-item-group color="primary">
                <v-subheader>Summary</v-subheader>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="green">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{total|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Total Amount Due</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="indigo darken-2">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{pay|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Total Payments</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="orange">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{total-pay|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Remaining Balance</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { bookings, users } from '../firebase'
import { mapGetters } from 'vuex'
export default {
  name: 'Payments',
  data() {
    return {
      data: {},
      mybookings: [],
      total: 0,
      pay: 0,
    }
  },
  computed: {
    ...mapGetters(["getCurrentUser"])
  },
  mounted() {
    users.doc(this.getCurrentUser.id).get().then(snap => {
      this.data = snap.data()
      this.data.payments.forEach(i => {
        this.pay = this.pay + i.amount
      })
      this.data.mybookings.forEach(i => {
        bookings.doc(i).get().then(snap => {
          var item = snap.data()
          this.mybookings.push(snap.data())
          this.total = this.total + item.rates.base + item.rates.extra.dropoff.rate + item.rates.extra.pickup.rate

        })
      })

    })



  },
  methods: {}
}
</script>
