<template>
  <v-flex @click="reserve" xs12 md4 sm4 lg3>
    <v-card :to="to" :loading="loading" class="mx-1 my-2" max-width="90%">
      <v-img height="180" :src="data.thumb.url" :alt="data.thumb.alt"> <span v-if="data.bestseller" class="bestseller">Bestseller</span>
        <span class="transtype">{{data.type}}</span>
      </v-img>
      <v-card-title class="black--text fill-height">{{data.name}}</v-card-title>
      <v-card-text>
        <small>Rates</small>
        <v-layout wrap>
          <v-flex xs6>
            <div class="my-1 caption font-weight-regular grey--text">
              Publish
            </div>
            <div class="pl-2 subtitle-1 red--text">
              {{price|toPHP}}
            </div>

          </v-flex>

          <v-flex xs6 v-if="contracted>0">
            <div class="my-1 caption font-weight-regular grey--text">
              Contracted
            </div>
            <div class="pl-2 subtitle-1 red--text">
              {{contracted|toPHP}}
            </div>
          </v-flex>
            <small v-if="contracted==0">Please request contracted rate for this activity</small>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { agent } from '../firebase'
import {mapGetters} from 'vuex'
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
    ...mapGetters(['getCurrentUser']),
    price: function() {
      return this.pax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.pax - this.data.ceil) * this.data.price))
    },
    contracted: function() {
      var c_rate = 0;
      agent.doc(this.getCurrentUser.id).collection('rates').doc(this.data.code).get().then(d => {
        if (d.exists) {
          var data = d.data();
          c_rate = this.pax < data.contracted.ceil ? parseFloat((data.contracted.base)) : parseFloat(data.contracted.base + ((pax - data.contracted.ceil) * data.contracted.price))
        } else{
          c_rate = 0
        }
      }).catch(err=>{
        console.log(err)
        c_rate = 0;
      });
return c_rate
    }
  },
  methods: {
    reserve() {

      this.$store.commit('updateCurrentTrans', this.data)
      this.loading = true
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
