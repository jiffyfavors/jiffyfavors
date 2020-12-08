<template>
  <v-container>
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm12 md12>
        <div class="toursection ast">
          <div class="rg-img rg-img-bg bg-img-ast">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Tour Packages</p>
            <p style="margin: 10px 0; white-space: normal;">Book Now and Pay On Arrival
            </p>
          </article>
        </div>
        <v-layout >
          <div class="reviews">
            <PackageResult v-for="(i, index)  in getTourPackages" class="review-card" style="white-space:initial;" v-bind:data="i" :to="'/package/'+i.code" :key="`pps_tour_`+index"></PackageResult>
          </div>
        </v-layout>
       
       
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PackageResult from '../components/PackageResult'
import { mapGetters } from 'vuex'
export default {
  name: 'Tours',
  data() {
    return {
      imgurl: 'https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/Tour%20Images%2FTour%20A%2FBig%20Lagoon.jpg?alt=media&token=255349c2-f9c8-4b9e-adda-8eb18be9bdd4'
    }
  },
  components: {
    PackageResult
  },
  mounted(){
      document.title ='Tours - Diskubre Palawan'
  },
  computed: {

    ...mapGetters(['getTourPackages'])
  },
}
</script>
