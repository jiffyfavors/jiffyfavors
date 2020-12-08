<template>
  <v-container>
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm9 md9 mb-4>
        <v-row align="center" justify="center">
          <v-img :src="require('../assets/mainbg.png')" lazy-src="https://picsum.photos/id/11/100/60" aspect-ratio="1" class="grey lighten-2" max-width="100%" max-height="300">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
            <v-layout column wrap>
              <h1 class="white--text mt-5">Discover Palawan with Us</h1>
              <h3 class="white--text">Booking is easy we made it even simplier</h3>
              <h4 class="white--text mt-12">We are TripAdvisor's No.1 Tourist Service Provider</h4>
              <h3 class="white--text mt-12">Book Now</h3>
              <v-flex xs4 sm4 md4>
                <v-btn to="/transfers" color="blue" class="white--text" small>Transfers</v-btn>
                <v-btn to="/tours" color="red" class="white--text" small>Tours</v-btn>
              </v-flex>
            </v-layout>
          </v-img>
        </v-row>
      </v-flex>
      <v-flex xs12 sm9>
        <h3>Book with Confidence</h3>
       <Reviews/>

        <div class="toursection ast">
          <div class="rg-img rg-img-bg bg-img-ast">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Our Bestsellers</p>
            <p style="margin: 10px 0; white-space: normal;">We have services from transportation to tours & activities.
            </p>
          </article>
        </div>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index) in result" class="review-card" style="white-space:initial;" v-bind:data="i" :to="i.url" v-bind:pax=pax :key="index"></TransferResult>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
function removeStyle() {
  var d = document.getElementsByClassName('widSSPnarrow')
  for (var i = 0; i < d.length; i++) {
    d[i].style.cssText = null;
  }
}

import TransferResult from '../components/TransferResult'
import Reviews from '../components/Reviews'
import {  mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import shuffle from 'lodash/shuffle'
export default {
  name: 'Home',
  data() {
    return {
      pax: 1
    }
  },
  components: {
    TransferResult,
    Reviews
  },
  computed: {
    ...mapGetters(['getTransResult', 'getTourResult','getRevCount']),
    result: function() {
      var trans_data = cloneDeep(this.getTransResult)

      var tour_data = cloneDeep(this.getTourResult)
      var data = []
      trans_data.forEach(a => {

        a.url = '/transportation/' + a.url
        if (a.bestseller)
          data.push(a)
      })
      tour_data.forEach(a => {

        a.url = '/tour/' + a.url
        if (a.bestseller)
          data.push(a)
      })
      return shuffle(data)
    }
  },
  mounted() {
    setTimeout(function() {
      removeStyle()

    }, 2000)

  }

};
</script>

<style scoped>
.reviews {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  display: block;
  margin-left: 20px;
  margin-right: 20px;
  min-height: 275px;
  -webkit-overflow-scrolling: touch
}

.review-card {
  max-width: 60%;
  margin: 10px;
  vertical-align: top;
  display: inline-block
}

@media screen and (min-width: 320px) and (max-width:768px) {
  .review-card {
    width: 80%!important;
    max-width: 80%
  }
  .desti {
    width: 100%;
  }
}

.pps {
  background: linear-gradient(to right, #BAD870 50%, transparent 100%);
}

.ast {
  background: linear-gradient(to right, #673ab7 50%, transparent 100%);
}

.sab {
  background: linear-gradient(to right, #00bcd4 50%, transparent 100%);
}

.eln {
  background: linear-gradient(to right, #6288DF 50%, transparent 100%)
}
</style>
