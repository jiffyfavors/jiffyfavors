<template>
  <v-flex xs12 md6 sm6 lg6 class="pa-1 ma-1">
    <v-card  :to="data.href" class="mx-auto" width="500" max-width="100%" outlined>
  
      <v-img height="180" :src="data.thumb.url" :alt="data.thumb.alt"> <span v-if="data.bestseller" class="bestseller">Bestseller</span>
        <span class="transtype">{{data.type}}</span></v-img>
      <v-card-title class="black--text fill-height">{{data.name}}</v-card-title>
      <v-card-text>
      
          <v-rating :value="5" color="amber" dense half-increments size="12" readonly></v-rating>
        
      
         <div class="overline blue--text">{{data.booked}} people booked</div>
        <div class="my-1 subtitle-1 red--text">
          From {{price|toPHP}}

         
    
        </div>
       <v-icon small align="end" @click="removeCartItem" color="red">far fa-trash-alt</v-icon>
      </v-card-text>
     
    </v-card>
  </v-flex>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'WishItem',
  props: {
    id: String
  },
  computed: {
    ...mapGetters(['getTourResult', 'getTransResult', 'getWishList'])
  },
  data() {
    return {
      data: {},
      price: 0,
      pax: 1
    }
  },
  methods: {
    removeCartItem() {
         this.$store.commit('addToWishList', this.data.id)
    }
  },
  mounted() {
    this.getTourResult.forEach(i=>{
      if(i.id===this.id)
      {
        this.data = Object.assign({},i)
      this.data.href='/tour/'+i.url
      }
    })
    this.getTransResult.forEach(i=>{
      if(i.id===this.id){
       this.data = Object.assign({},i)
         this.data.href='/transportation/'+i.url
      }
    })
    this.price = this.pax < this.data.ceil ? parseFloat((this.data.base)) : parseFloat(this.data.base + ((this.pax - this.data.ceil) * this.data.price))
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
  font-size: 12px !important;
  margin-top: 5px;
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