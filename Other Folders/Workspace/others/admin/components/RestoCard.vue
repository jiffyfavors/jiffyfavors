<template>
  <v-flex xs12 md4 sm4 lg3>
    <v-card class="ma-1" :to="'/resto/'+data.url" @click.stop="merchantSetter()">
      <v-img :src="data.backdrop" height="200px" />
      <v-card-actions>
        <v-list-item dense>
          <v-list-item-avatar color="grey darken-3">
            <v-img class="elevation-6" :src="data.logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ data.business_name }}</v-list-item-title>
            <v-list-item-subtitle> <small>{{ data.branch }}</small></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: {
    data: Object
  },
  methods: {
    merchantSetter () {
      this.$store.commit('admin/setCurrentMerchant', this.data)
    }
  }
}
</script>

<style scoped>
.bestseller {
  float: left;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: #f44336;
  font-size: 16px !important;
  margin-top: 10px;
  margin-left: 10px;
  text-align: center;
  min-width: 50%;
}

.onsale {
  float: right;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: red;
  font-size: 16px !important;
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
  margin-bottom: 10px;
  margin-right: 10px;
}

.v-card__title {
  font-size: 14px;
}
</style>
