<template>
  <v-btn class="mr-2" icon depressed text small to="/wishlist" v-if="getWishList.length > 0">
    <v-badge color="red">
      <template v-slot:badge overlap>{{getWishList.length}} </template>
      <v-icon color="white" dense>fas fa-heart</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'WishListIcon',
  computed: {
    ...mapGetters({ getWishList: 'getWishList' })
  },
}
</script>
