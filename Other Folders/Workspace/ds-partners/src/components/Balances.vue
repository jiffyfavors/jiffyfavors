<template>
  <v-container fluid>
    <v-card>
      <v-layout wrap>
        <v-flex xs12 sm12>
          <v-card>
            <v-card-title>
              {{current_bal|toPHP}}
            </v-card-title>
            <v-card-text> Current Balance</v-card-text>
            <v-card-title>
              {{past_due|toPHP}}
            </v-card-title>
            <v-card-text>Past Due</v-card-text>
            <v-card-title>
              {{soa}}
            </v-card-title>
            <v-card-text>Current eSOA</v-card-text>
            <v-card-title>
              {{currentCycle}}
            </v-card-title>
            <v-card-text>Current Billing Cycle</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { bookings } from '../firebase'
import { mapGetters } from 'vuex'
export default {
  name: 'Balances',
  data() {
    return {
      soa: '',
      past_due: 0,
      current_bal: 0
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser']),
    currentCycle() {
      var m = this.getMonday(new Date())
      var s = this.getSunday(new Date())
      return m + ' to ' + s

    }
  },
  mounted() {

    var result = this.getWeekNumber(new Date());
    this.soa = 'SOA-' + this.getCurrentUser.id + '-' + result[0] + '-' + result[1];
    // bookings.where('status', '==', 'CONFIRMED').where('src', '==', this.getCurrentUser.id).where('traveldate', '>=', this.getMonday(new Date())).where('traveldate', '<=', this.getSunday(new Date())).get().then(snap => {
    //   snap.docs.forEach(a => {
    //     console.log(a.data())
    //   })
    // })
  },
  methods: {
    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      var nd = new Date(d.setDate(diff));
      return this.formatDate(nd)
    },
    getSunday(d) {
      var day = d.getDay();
      var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
      return this.formatDate(nd)
    },

    getWeekNumber(d) {
      // Copy date so don't modify original
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      // Get first day of year
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      // Return array of year and week number
      return [d.getUTCFullYear(), weekNo];
    },

    formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    }

  }
};
</script>
