<template>
  <v-card>
    <v-card-title>
      For Approval
      <div class="flex-grow-1"></div>
      <v-text-field v-model="search" append-icon="fas fa-search" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table dense height="500" :headers="headers" :items="pendings" :search="search">
      <template v-slot:item.total="{ item }">
        {{item.total|toPHP}}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip small class="ma-2 white--text" :color="setColor(item.status)">
          {{item.status}}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { bookings } from '../firebase'
import { mapGetters } from 'vuex'
export default {
  name: 'ForApproval',
  data() {
    return {
      search: '',
      pendings: [],
      headers: [{
        text: 'Lead Guest',
        value: 'leadguest'
      }, {
        text: 'Service Code',
        value: 'srv_code'
      }, {
        text: 'Travel Date',
        value: 'traveldate'
      }, {
        text: 'Amount',
        value: 'total'
      }, {
        text: 'Status',
        value: 'status'
      }]
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser'])
  },
  mounted() {
    bookings.where('status', '==', 'PENDING').where('src', '==', this.getCurrentUser.id).get().then(snap => {

      snap.docs.forEach(d => {
        var c = d.data()
        c.total = c.rates.base.rate + c.rates.extra.dropoff.rate + c.rates.extra.pickup.rate
        c.leadguest = c.leadguest + ' ' + c.pax + 'pax'
        c.traveldate = c.traveldate + ' ' + c.time
        this.pendings.push(c)
      })

    })

    bookings.where('status', '==', 'NEED_PAYMENT').where('src', '==', this.getCurrentUser.id).get().then(snap => {

      snap.docs.forEach(d => {
          var c = d.data()
          c.total = c.rates.base.rate + c.rates.extra.dropoff.rate + c.rates.extra.pickup.rate
          c.leadguest = c.leadguest + ' ' + c.pax + 'pax'
          c.traveldate = c.traveldate + ' ' + c.time
          this.pendings.push(c)
        })
        //
    })
    console.log(this.pendings)
  },
  methods: {
    setColor(status) {
      if (status === 'PENDING')
        return 'orange'
      else if (status === 'CONFIRMED')
        return 'blue'
      else if (status === 'CANCELLED')
        return 'red'
      else if (status === 'NEED_PAYMENT')
        return 'green'
    }
  }
};
</script>
