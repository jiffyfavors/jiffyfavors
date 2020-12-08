<template>
  <v-card class="ma-1 pa-1" @click="viewInfo">
  
     <span class="transtype">{{item.type}} -{{item.service}}</span>

    <v-list flat dense>
      <v-list-item>
        <v-list-item-content>
        <small>{{item.ref}}</small>
          <v-list-item-title> <strong>{{item.participants[0].name}}</strong></v-list-item-title>
          <v-list-item-subtitle :key="item.traveldate">{{item.traveldate}} {{item.time}} {{item.pax}} pax</v-list-item-subtitle>
          <v-list-item-subtitle>{{item.srv_code}}</v-list-item-subtitle>
         <v-list-item-subtitle><small>Balance: {{price-payment|setCurrency(item.currency)}}</small></v-list-item-subtitle>
         
        </v-list-item-content>
      </v-list-item>
    </v-list>
      <v-divider></v-divider>

  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex' 
export default {

  name: 'BookingDetails',
  filters: {
    setCurrency: function(value, cur) {
      if (typeof value !== "number") {
        return value;
      }



      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 0,
        currencyDisplay: 'code'
      });
      return formatter.format(Math.round(value))
    }
  },
  computed: {
    ...mapGetters(['getTourResult', 'getTransResult'])
  },
  props: {
    item: Object
  },
  data() {
    return {

      price: 0,
      payment: 0,
      isloading: false
    }
  },

  mounted() {
    this.price = parseFloat(this.item.rates.base)
    this.item.payment.forEach(d => {
      this.payment = this.payment + parseFloat(d.amount)
    })


  },
  methods:{
    viewInfo(){
      console.log(this.item)
    }
  }

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


.transtype {
  padding-right: 5px;
  padding-left: 5px;
  color: white !important;
  background-color: #4caf50;
  font-size: 10px !important;
  top: 0;
  right: 0;

  position: absolute;
}
</style>
