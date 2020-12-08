<template>
  <v-card class="mx-auto" height="100%" outlined>
    <v-container>
      <v-layout wrap mx-5>
        <v-layout column align-center>
         
          <template v-if="getWishList.length==0">
            <v-icon>fas fa-cart-arrow-down</v-icon>
            No Wishlist
          </template>
          <template v-if="getWishList.length>0">
            <WishItem v-for="data in getWishList" :key="data" :id="data">
            </WishItem>
          </template>
      
        </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WishItem from '../components/WishItem'
export default {
  name: 'Wishlist',
  components: {
    WishItem
  },
  computed: {
    ...mapGetters(['getWishList'])
  }
}
</script>
