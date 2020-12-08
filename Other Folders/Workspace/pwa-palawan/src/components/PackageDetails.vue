<template>
  <v-container v-if="getIfReady">
    <v-layout align="center" column wrap>
      <v-card :loading="loading" class="mx-auto mb-8" width="500" max-width="100%">
        <v-carousel height="350" hide-delimiters interval="3000" continuous touchless :show-arrows="false" cycle reverse-transition="fade-transition" transition="fade-transition">
          <v-carousel-item v-for="(item,i) in iteminfo.images" :key="i" :src="item.url">
            <span class="bestseller">{{item.name}}</span>
            <span class="transtype">{{iteminfo.tours.length}} Tours Included</span>
          </v-carousel-item>
        </v-carousel>
        <v-card-title class="align-end black--text fill-height">{{parseInt(iteminfo.days)}}D{{parseInt(iteminfo.days)-1}}N-{{iteminfo.name}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!--  <div class="reviews">
            <div v-for="(i,index) in item.destinations" class="review-card" :key="`dest`+index">
              <v-card>
                <v-img :src="i.url" :alt="i.name">
                  <span class="bestseller">{{i.name}}</span>
                </v-img>
              </v-card>
            </div>
          </div> -->
          <v-divider></v-divider>
          <v-container wrap>
            <h3>Pricing</h3>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">Adult(7 y/o Above)</th>
                  <th class="text-left">Child(4-6 y/o)</th>
                  <th class="text-left">Infant(0-2 y/o)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{{parseFloat(iteminfo.rates.adult)|toPHP}}</strong></td>
                  <td><strong>{{parseFloat(iteminfo.rates.child)|toPHP}}</strong></td>
                  <td><strong>{{parseFloat(iteminfo.rates.infant)|toPHP}}</strong></td>
                </tr>
                <small>2 adult is required to book this tour.</small>
              </tbody>
            </v-simple-table>
            <h3>Is this tour for you?</h3>
            <v-list dense>
              <v-list-item style="min-height:15px;" v-for="(i,index) in iteminfo.bestfor" :key="`bf`+index">
                <v-list-item-content>
                  <v-list-item-subtitle style="white-space:initial;"> {{i}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <small>If your answer is <strong>Yes</strong>, this tour package is for you.</small>
            </v-list>
            <h3>What's included?</h3>
            <v-list dense>
              <v-list-item style="min-height:15px;" v-for="(i,index) in iteminfo.inclusions" :key="`inc`+index">
                <v-list-item-content>
                  <v-list-item-subtitle style="white-space:initial;"><span style="color:green">&#10004;</span> {{i}}</v-list-item-subtitle>
                  <div v-if="i.toLowerCase().includes('meals')">
                    <v-chip v-if="parseInt(iteminfo.meals.breakfast)>0" small color="blue" class="white--text"> {{iteminfo.meals.breakfast}} Breakfast</v-chip>
                    <v-chip small v-if="parseInt(iteminfo.meals.lunch)>0" color="blue" class="white--text"> {{iteminfo.meals.lunch}} Lunch</v-chip>
                    <v-chip small v-if="parseInt(iteminfo.meals.snacks)>0" color="blue" class="white--text"> {{iteminfo.meals.snacks}} Snacks</v-chip>
                    <v-chip small v-if="parseInt(iteminfo.meals.dinner)>0" color="blue" class="white--text"> {{iteminfo.meals.dinner}} Dinner</v-chip>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height:15px;" v-for="(i,index) in iteminfo.exclusions" :key="`exc`+index">
                <v-list-item-content>
                  <v-list-item-subtitle style="white-space:initial;"><span style="font-size:10px">&#10060;</span> {{i}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <h2>You will experience these</h2>
            <div class="reviews">
              <v-flex xs12 sm12 md12 class="review-card" v-for="(t,index) in tours" :key="`inc_tour`+index" style="white-space:initial;">
                <v-card class="ma-1 pa-1">
                  <v-carousel height="180" hide-delimiters interval="2500" continuous touchless :show-arrows="false" cycle reverse-transition="fade-transition" transition="fade-transition">
                    <v-carousel-item v-for="(item,i) in t.destinations" :key="i" :src="item.url">
                      <span class="bestseller">{{item.name}}</span>
                    </v-carousel-item>
                  </v-carousel>
                  <h4>{{t.name}}</h4>
                  <v-card-actions>
                    <v-spacer> </v-spacer>
                    <v-btn tile align-end small dense outlined color="blue">
                      Read More
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </div>
            <h2>Itinerary</h2>
            <v-timeline align-top dense>
              <v-timeline-item color="red" v-for="(i, index) in iteminfo.itinerary" :key="index" small dense>
                <template v-slot:icon>
                  <span class="white--text">{{index + 1}}</span>
                </template>
                <v-row>
                  {{i}}
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-container>
          <div class="reminder_div">
            <h3>How do I book?</h3>
            <ul>
              <li style="font-size:11px;">
                We believe traveling should be full of relaxation, enjoyment, and exploring new places. You can <strong>Book Now and Pay When You Arrive.</strong>
                <v-divider></v-divider>
              </li>
              <li style="font-size:11px;">
                Just click <strong>Request to Book</strong> for us to capture your travel information and travel requirements. We will revert back via email/phone call or sms to process your booking.
                <v-divider></v-divider>
              </li>
              <li style="font-size:11px;">
                Please pay in <strong>Full Amount</strong> upon arrival in <strong>CASH or CARD</strong>. We are charging extra <strong>5%</strong> of the total amount on all card-based payment.
                <v-divider></v-divider>
              </li>
            </ul>
            <h3>Cancellation Policy</h3>
            <ul>
              <li style="font-size:11px;">As our package is on scheme of <strong>Book Now and Pay On Arrival</strong> and no upfront payment will be collected, we will communicate with you 3 days before your trip to <strong> finalize the details of your trip and for final confirmation of booking.</strong> </li>
              <li style="font-size:11px;">If your booking is <strong>Fully Confirmed</strong> we will finance your trip e.g hotel bookings, transportation etc. prior to your arrival. </li>
            </ul>
            <h3>Extra and Hidden Charges</h3>
            <ul>
              <li style="font-size:11px;">We don't have any extra and hidden charges, however, there are some <strong>Goverment-Imposed Fees e.g Environmental Fee, Entrance Fee </strong> that you will pay by <strong>CASH</strong> during the tour. You will see these fees on the <strong>What's Included Section.</strong></li>
              <li style="font-size:11px;">Please note the <strong>standard checkout time of 12:00PM</strong>. If you have tour on your checkout date, please checkout before going to any tour. Our partner's will be happy to leave your belongings to the front office while you are on the tour. They may charge extra (per hour) if you failed to checkout.</li>
            </ul>
          </div>
          <h3>Our Reviews</h3>
          <Reviews/>
        </v-card-text>
        <!--  <h3>You might also like </h3>
        <v-layout text-start justify-start align-start>
          <div class="reviews">
            <TransferResult v-for="(i, index) in suggest" :key="`sug`+index" class="review-card" style="white-space:initial;" v-bind:item="i" :to="i.url" :pax="pax"></TransferResult>
          </div>
        </v-layout> -->
      </v-card>
      <!--      <v-toolbar bottom width="100%" v-show="!sheet" class="shopresponsive">
        <v-btn tile @click="addToWishList" icon fab>
          <v-icon :color="color">fas fa-heart</v-icon>
        </v-btn>
        <v-btn tile @click="initContact" icon fab>
          <v-icon color="green">fab fa-whatsapp</v-icon>
        </v-btn>
        <v-chip class="white--text" color="blue">
          {{price|toPHP}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn @click="bookNow" tile outlined color="blue">
          Book Now
        </v-btn>
      </v-toolbar> -->
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PackageResult from '../components/PackageResult'
import Reviews from '../components/Reviews'
import { isEmpty } from 'lodash/core';
import cloneDeep from 'lodash/cloneDeep'
import shuffle from 'lodash/shuffle'
export default {
  name: 'PackageDetails',
  components: {
    Reviews,
    PackageResult
  },
  data() {
    return {
      tours: [],
      toursdetails:{},
      loading: false,
      iteminfo: {
        days: 0,
        bestfor: [],
        itinerary: [],
        inclusions: [],
        exclusions: [],
        tours: [],
        images: []
      },
      getIfReady: false,

    }
  },
  computed: {
    ...mapGetters(['getTourPackages', 'getTourResult']),
  },
  watch: {
    getTourPackages(val) {

      if (val.length > 0)
        this.getIfReady = true
    },
  },
  mounted() {

    this.iteminfo = Object.assign({}, this.getTourPackages.find((x) => {
      return x.code === this.$route.params.pkid
    }))
    this.iteminfo.tours.forEach(a => {
      this.tours.push(this.getTourResult.find((x) => {
        return x.code === a
      }))
    })
   this.toursdetails = Object.assign({}, this.tours[0])


  }

}
</script>

<style scoped>
.reviews {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  display: block;
  margin-left: 20px;
  margin-right: 20px;
  -webkit-overflow-scrolling: touch
}

.plusminus {
  display: inline-block;
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

.toursection {
  color: #eee;
  width: 100%;
  margin: 0 auto;
  display: block;
  height: 180px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.bestseller {
  float: left;
  padding-right: 20px;
  padding-left: 20px;
  color: white !important;
  background-color: #f44336;
  font-size: 12px !important;
  margin-top: 5px;
}

.toursection {
  color: #eee;
  width: 100%;
  margin: 0 auto;
  display: block;
  height: 180px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.eln {
  background: linear-gradient(to right, #6288DF 50%, transparent 100%)
}

.article {
  margin-left: 30px;
  z-index: 2;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  box-sizing: border-box;
  display: block;
}

.reminder_div {
  border-radius: 2px;
  padding: 20px 20px;
  padding-bottom: 20px !important;
  background-color: #fffae5
}

.price {
  font-size: 14px;
  color: orange;
}

.shopresponsive {
  position: fixed;
  width: 100%;
  display: block;
  z-index: 100;
  bottom: 0;
  right: 0;
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
</style>
