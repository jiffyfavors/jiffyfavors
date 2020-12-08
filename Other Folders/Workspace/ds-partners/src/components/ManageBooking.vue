<template>
  <v-card class="mx-auto" height="100%" outlined>
    <v-container>

      <v-layout column align-center>
          <template v-if="data.length==0">
            <v-icon>fas fa-cart-arrow-down</v-icon>
           No Bookings Yet
          </template>
        <BookingItem v-for="(id,index) in data" :key="index" :bookingId="id">
        </BookingItem>
      </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { bookings, users } from '../firebase'
import { mapState, mapGetters } from 'vuex'
import BookingItem from '../components/BookingItem'
export default {
  name: 'ManageBooking',
  data() {
    return {
      data: {}
    }
  },
  components: {
    BookingItem
  },
  computed: {
    ...mapGetters(["getCurrentUser"])
  },
  mounted() {

     bookings.where('src','==',this.getCurrentUser.id).get().then(snap => {
     snap.docs.forEach(a=>{
      console.log(a)
     })
     
    })

  },
  methods: {}
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
