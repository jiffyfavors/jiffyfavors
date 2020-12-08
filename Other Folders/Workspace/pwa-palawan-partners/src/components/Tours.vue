<template>
  <v-container>
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm12 md12>
        <div class="toursection ast">
          <div class="rg-img rg-img-bg bg-img-ast">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Majestic Puerto Princesa</p>
            <p style="margin: 10px 0; white-space: normal;">Experience white beaches and natural heritage
            </p>
          </article>
        </div>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index)  in getTourResult.filter((x)=>{return (x.origin=='PPS') || (x.desti=='PPS')})" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/tour/'+i.url" :key="`pps_tour_`+index" :pax=1></TransferResult>
          </div>
        </v-layout>
        <div class="toursection eln">
          <div class="rg-img rg-img-bg bg-img-eln">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">El Nido Adventure</p>
            <p style="margin: 10px 0; white-space: normal;">Go on a journey through El Nido's world-famous scenic islands and beautiful beaches
            </p>
          </article>
        </div>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index) in getTourResult.filter((x)=>{return (x.origin=='ELN') || (x.desti=='ELN')})" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/tour/'+i.url" :pax=1 :key="`eln_tour_`+index"></TransferResult>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TransferResult from '../components/TransferResult'
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash/core';
export default {
  name: 'Tours',
  data() {
    return {
      imgurl: 'https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/Tour%20Images%2FTour%20A%2FBig%20Lagoon.jpg?alt=media&token=255349c2-f9c8-4b9e-adda-8eb18be9bdd4'
    }
  },
  components: {
    TransferResult
  },
  computed: {

    ...mapGetters(['getTourResult','getCurrentUser'])
  },
  mounted() {

    this.isCurrent = isEmpty(this.getCurrentUser)
    if (this.isCurrent){
      this.$router.push({ path: '/login' })
    }
    else {
      if (JSON.parse(this.getCurrentUser.entity.notallowedpaths).indexOf('/tours') > -1) {
       
        this.$router.push({ path: '/login' })
      }else
      {


      fetch('https://www.diskubrepalawan.com/get-master-file', { method: 'GET', mode: 'cors' })
        .then((response) => {

          return response.json();
        })
        .then((myJson) => {
          this.$store.commit('updateTourResult', myJson.tours)
        })
    
      }
    
  }
}
}</script>
