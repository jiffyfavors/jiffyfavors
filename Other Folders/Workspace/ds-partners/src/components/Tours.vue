<template>
  <v-container>
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm12 md12>

     
        <div class="toursection eln">
          <div class="rg-img rg-img-bg bg-img-eln">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Book a tour for your guest. </p>
            <p style="margin: 10px 0; white-space: normal;">We do both Puerto Princesa & El Nido Tours.
            </p>
          </article>
        </div>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index)  in tours" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/tour/'+i.url" :pax="1" :key="`pps`+index"></TransferResult>
          </div>
        </v-layout>

       <!--  <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index) in getTourResult.filter((x)=>{return (x.origin=='ELN') || (x.desti=='ELN')})" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/tour/'+i.url" :pax="1" :key="`eln`+index"></TransferResult>
          </div>
        </v-layout> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TransferResult from '../components/TransferResult'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Tours',
  data() {
    return {
      tours:[],
      imgurl: 'https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/Tour%20Images%2FTour%20A%2FBig%20Lagoon.jpg?alt=media&token=255349c2-f9c8-4b9e-adda-8eb18be9bdd4'
    }
  },
  mounted(){

   var allow = typeof this.getCurrentUser.user.isTourAllowed !='undefined' ? this.getCurrentUser.user.isTourAllowed : false
   if(!allow)
    window.location="/"
  else
    this.tours = this._.shuffle(this.getTourResult)
  },
  components: {
    TransferResult
  },
  computed: {

    ...mapGetters(['getTourResult','getCurrentUser'])
  },
}
</script>

