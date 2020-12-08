<template>
  <v-flex xs12 md4 sm4 lg4>
    <v-card   :to="to" :loading="loading" class="ma-1 pa-1">
      <v-img height="180" :src="data.thumb.url" :alt="data.thumb.alt"> <span v-if="data.bestseller" class="bestseller">Bestseller</span>
        <span class="transtype">{{data.type}}</span>
      </v-img>
      <v-rating :value="5" color="blue" dense half-increments size="12" readonly></v-rating>
      <div class="overline blue--text">{{data.booked}} people booked</div>
      <h4>{{data.name}}</h4>
      <div class="pl-2 subtitle-1 red--text">
        <span class="caption grey--text">
            Rate starts at
          </span>
        <div class="ml-4">{{price|toPHP}}</div>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'TransferResult',
  props: {
    data: Object,
    pax: Number,
    to: String
  },
  data() {
    return {
      internalpax: 1,
      loading: false,
      selection: 1,
    }
  },
  computed: {
    price: function() {
      return this.internalpax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.internalpax - this.data.ceil) * this.data.price))
    }
  },
  methods: {
    reserve() {

      this.$store.commit('updateCurrentTrans', this.data)
      this.loading = true
      window.scrollTo(0, 0)
      setTimeout(() => (this.loading = false), 2000)
    },
  }
};
</script>

<style scoped>
.bestseller {
  float: left;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: #f44336;
  font-size: 12px !important;
  margin-top: 5px;
}

.onsale {
  float: right;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: red;
  font-size: 12px !important;
  margin-top: 5px;
  position: relative;
  z-index: 99
}

.transtype {
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: #3F51B5;
  font-size: 12px !important;
  bottom: 0;
  right: 0;
  position: absolute;
}


.v-card__title {
  font-size: 14px;
}
</style>
