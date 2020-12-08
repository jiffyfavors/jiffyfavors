<template>
  <v-container>
    <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue"></loading>
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm12 md12>
        <v-card flat width="100%" v-show="!isHide">
          <GMap id="gmap" ref="gMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy'}" :zoom="20" @dragend="dragEnd">
            <div class="centerMarker"></div>
          </GMap>
          <v-btn tile outlined class="ma-2 shopresponsive" color="red" @click.stop="findStore">
            Find Stores
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 v-show="isHide">
        <v-btn tile outlined class="ma-2 shopresponsive" color="red" @click.stop="isHide = !isHide">
         Change Delivery Address
        </v-btn>
        <v-layout wrap justify-start align-start text-left>
          <resto-card class="review-card" style="white-space:initial;" v-for="i in resto" :key="i.id" :data="i">
          </resto-card>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RestoCard from '~/components/RestoCard.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  components: {
    RestoCard,
    Loading
  },
  computed: {
    resto (){

      return this.$store.getters['map/getStores']
  
      
    },

    isLoading: {
      get() {
      return this.$store.getters['map/isLoading']
    },
      set(val) {

        this.$store.commit('map/setLoading', val);

      }
    },
    isHide: {get() {
      return this.$store.getters['map/isHide']
    },
      set(val) {

        this.$store.commit('map/setHide', val);

      }
    },
  },

  data() {
    return {
      partners:[],
      dialog: false,

      geocenter: {
        lat: 9.7941185,
        lng: 118.7322599
      },
      mylocation: {
        lat: 9.7941185,
        lng: 118.7322599
      }

    }
  },
  mounted() {
    var options = {
      enableHighAccuracy: true, //defaults to false
      timeout: Infinity, //defaults to Infinity

    }
    var change_ver = 0;
    this.$watchLocation(options)
      .then(coordinates => {

        this.mylocation = {
          lat: coordinates.lat,
          lng: coordinates.lng
        }

      })
  },

  update() {
    this.$refs.gMap.initMarkers()
  },

  methods: {
    dragEnd() {

      // var coor = this.$refs.gMap.map.getCenter()

      // var firestore = this.$fireStoreObj()


      // var geofirestore = new GeoFirestore(firestore);

      // var geocollection = geofirestore.collection('merchant');

      // geocollection.doc('6Tjd1D1Nl7C57YcRJ48g').delete()


    },
    findStore() {
      this.isLoading = true
      var coordinates = this.$refs.gMap.map.getCenter()

      this.geocenter = {
        lat: coordinates.lat(),

        lng: coordinates.lng()
      }



this.$store.dispatch('map/getNearbyStore', {
  lat: coordinates.lat(),
  lng: coordinates.lng()
}).then(()=>{
console.log(this.resto)
  this.isLoading = false
  this.isHide = true
});




      // var ioslink = 'maps://maps.google.com/maps?/dir/?api=1&origin=' +
      //   this.mylocation.lat + ',' + this.mylocation.lng + '&destination=' + this.geocenter.lat + ',' + this.geocenter.lng + '&amp;ll=';
      // var other_link = 'https://www.google.com/maps/dir/?api=1&origin=' +
      //   this.mylocation.lat + ',' + this.mylocation.lng + '&destination=' + this.geocenter.lat + ',' + this.geocenter.lng + '&amp;ll='

      // // if ((navigator.platform.indexOf("iPhone") != -1) ||
      // //   (navigator.platform.indexOf("iPad") != -1) ||
      // //   (navigator.platform.indexOf("iPod") != -1))
      // //   window.open(ioslink);
      // // else
      // //   window.open(other_link);

      // var renderer = new google.maps.DirectionsRenderer();
      // renderer.setMap(this.$refs.gMap.map)
      // var directionService = new google.maps.DirectionsService();

      // var request = {
      //   origin: this.mylocation,
      //   destination: this.geocenter,
      //   travelMode: 'DRIVING'
      // }
      // directionService.route(request, (res, status) => {
      //   if (status === 'OK')
      //     renderer.setDirections(res)
      // })



    }
  }
};
</script>

<style>
.GMap,
.GMap__Wrapper {
  height: calc(90vh - 100px);
  margin-top: 10px;
}
</style>
