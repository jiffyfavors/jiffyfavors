<template>
  <v-flex xs12 md6 sm6 lg6 class="pa-1 ma-1">
    <v-card class="mx-auto" width="500" max-width="100%" outlined>
      <v-list-item three-line dense>
        <v-list-item-avatar tile size="100">
          <v-img :src="data.rateinfo.thumb"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <div class="overline">{{data.type}} - {{data.pax}} people</div>
          <div>{{data.service}}</div>
          <v-list-item-subtitle>{{data.traveldate}} {{data.time}}</v-list-item-subtitle>
          <div class="overline">Pickup: {{data.rates.extra.pickup.location}}</div>
          <div class="overline">Drop Off: {{data.rates.extra.dropoff.location}}</div>
        </v-list-item-content>
      </v-list-item>
      <v-layout align-center>
        <v-flex xs6 md6 sm6 lg6 class="mx-auto">
          <v-chip small align="end" class="ma-2 white--text" color="green">
            Total {{data.rates.base + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate|toPHP}}
          </v-chip>
        </v-flex>
        <v-flex xs6 md6 sm6 lg6>
          <v-col align="end">
            <v-icon small @click="removeCartItem" color="red">far fa-trash-alt</v-icon>
          </v-col>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    data: Object,
    index: Number
  },
  methods: {
    removeCartItem() {
      this.$store.commit('removeCartItem', this.index)
    }
  }
}
</script>
