<template>
  <v-flex @click="reserve" xs12 md4 sm4 lg3>
    <v-card :to="to" :loading="loading" class="mx-1 my-2" max-width="90%">
      <v-img height="180" :src="data.thumb.url" :alt="data.thumb.alt"> <span class="bestseller">{{data.type}}</span>
      </v-img>
      <v-card-title class="black--text fill-height">{{data.name}}</v-card-title>
      <v-card-text>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Agent Rate</th>
                <th class="text-left">Selling Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size:10px;">
                  <div class="psubtitle-1 red--text">
                    {{price|toPHP}}
                  </div>
                </td>
                <td style="font-size:10px;">
                  <div class="psubtitle-1 green--text">
                    {{price|toPHP}}
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
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
      loading: false,
      selection: 1,
    }
  },
  computed: {
    price: function() {
      return this.pax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.pax - this.data.ceil) * this.data.price))
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
  font-size: 16px;
}
</style>
