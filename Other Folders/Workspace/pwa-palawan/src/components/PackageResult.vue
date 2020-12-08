<template>
  <v-flex xs12 md4 sm4 lg4>
    <v-card :href="to" class="ma-1 pa-1">
      <v-carousel height="180" hide-delimiters interval="3000" continuous touchless :show-arrows="false" cycle  reverse-transition="fade-transition"
      transition="fade-transition">
        <v-carousel-item v-for="(item,i) in data.images" :key="i" :src="item.url">
          <span class="bestseller">{{parseInt(data.days)}}D{{parseInt(data.days)-1}}N</span>
          <span class="transtype">{{data.tours.length}} Tours Included</span>
        </v-carousel-item>
      </v-carousel>
      <!--  <div class="overline blue--text">{{data.booked}} people booked</div> -->
      <h4>{{data.name}}</h4>

      <small>Experience the following</small>


              <v-simple-table dense>
                
                <tbody>
                  <tr v-for="(i,index) in data.tours_included" :key="index">
                  
                    <td><small>{{i}}</small></td>
                  </tr>
                </tbody>
              </v-simple-table>

      <div class="pl-2 subtitle-1 red--text">
        <span class="caption grey--text">
            Rate starts at
          </span>
          <div class="ml-4">{{parseFloat(data.rates.adult)|toPHP}}</div>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'PackageResult',
  props: {
    data: Object,
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
