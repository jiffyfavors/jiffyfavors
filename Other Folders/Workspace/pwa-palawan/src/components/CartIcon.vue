<template>
  <v-btn class="mr-2" icon depressed text small to="/cart" v-if="cartSize > 0">
    <v-badge color="red">
      <template v-slot:badge overlap>{{cartSize}} </template>
      <v-icon color="white" dense>fa-shopping-cart</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'CartIcon',
  computed: {
    ...mapState([
      "cart"
    ]),
    ...mapGetters(['cartSize', 'getCart'])
  },
  watch: {
    cartSize(val) {
      if (val === 0) {

        this.$store.commit('emptyCart', []);
      }
    }
  }
}
</script>
