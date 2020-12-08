<template>
  <v-container fluid>
   
      <v-layout wrap>
        <v-flex xs6 md4 sm4>
          <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="fas fa-search" label="Search"></v-text-field>
        </v-flex>
        <v-flex xs6 md4 sm4>
          <v-text-field name="month" v-model="month" flat solo-inverted hide-details prepend-inner-icon="far fa-calendar-alt" label="Month" type="month"></v-text-field>
        </v-flex>
      </v-layout>
    
    <v-data-iterator :items="booking" :items-per-page.sync="itemsPerPage" :page="page" :search="search" :sort-by="sortBy.toLowerCase()" :sort-desc="sortDesc" hide-default-footer>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item._id" cols="12" sm="4" md="3" lg="3">
            <BookingItem :key="item._id" :bookingId="item._id">
            </BookingItem>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Show</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="primary" class="ml-2" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div class="flex-grow-1"></div>
          <span class="mr-4
            grey--text">
            {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn fab small dark color="blue darken-3"  @click="formerPage">
            <v-icon small >fas fa-chevron-left</v-icon>
          </v-btn>
          <v-btn fab small dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon small outlined>fas fa-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
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
import { bookings, users } from '../firebase'
import { mapState, mapGetters } from 'vuex'
import BookingItem from '../components/BookingItem'
export default {
  name: 'MyBookings',
  data() {
    return {
      loadingdiag: false,
      statusupdate: '',
      itemsPerPageArray: [8, 12],
      search: '',
      month: new Date().toISOString().substr(0, 7),
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      sortBy: 'item.traveldate',
      data: {},
      booking: []
    }
  },
  components: {
    BookingItem
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
    numberOfPages() {
        return Math.ceil(this.booking.length / this.itemsPerPage)
      }
  },
  mounted() {
    this.loadBooking(new Date().toISOString().substr(0, 7))
      

  },
  methods: {
     nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    loadBooking(val) {
      this.loadingdiag = true
      this.statusupdate = 'Getting booking..'
      var start = val + '-01'
      var _end = new Date(start)
      var end = new Date(_end.getFullYear(), _end.getMonth() + 1, 0).toISOString().substr(0, 10);
      this.booking = []
      bookings.where('src', '==', this.getCurrentUser.id).where('traveldate', '>=', start).where('traveldate', '<=', end).get().then(snap => {
        this.loadingdiag = false
        snap.docs.forEach(a => {

          var d = a.data()
          d._id = a.id
          this.booking.push(d)
        })


      })
    }
  },
  watch: {
    month(val) {
      this.loadBooking(val)
    }
  }
};
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
