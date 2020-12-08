<template>
  <v-layout>
    <client-only>
      <v-card width="100%">
        <v-toolbar dark color="primary">
          <v-btn icon @click.stop="$router.go(-1)">
            <v-icon> mdi-arrow-left-bold</v-icon>
          </v-btn>
          <v-toolbar-title>Merchant Management System</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="dialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs4 sm4 md4 v-show="false">
              <GMap ref="mainMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy'}" :zoom="20">
                <div class="centerdivmarker"></div>
              </GMap>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-data-table :headers="headers" :items="merchant" must-sort sort-by="d.business_name" class="elevation-1">
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title>Merchants</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click.stop="dialog = true" v-on="on">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="editedItem.d.business_name" label="Business Name"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.d.branch" label="Branch"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field type="number" v-model.number="editedItem.d.rates.cr" label="CR"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field type="number" v-model.number="editedItem.d.rates.sc" label="SC"></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small color="blue" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small color="blue" @click="editedIndex = 0, editedItem = item, menuDiag=true">
                    mdi-food
                  </v-icon>
                  <v-icon small color="red" @click="deleteItem(item)">
                    mdi-delete
                  </v-icon>
                  <v-icon small color="indigo" @click="editedIndex = 0, editedItem = item, setCenter(), coordiag = true">
                    mdi-map-marker
                  </v-icon>
                  <v-icon :color="item.d.draft ? 'red' : 'green'" small @click="editedIndex = 0, editedItem = item, editedItem.d.draft = !editedItem.d.draft,  save()">
                    {{item.d.draft ? 'mdi-close' : 'mdi-check'}}
                  </v-icon>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-row justify="center">
        <v-dialog v-model="coordiag" persistent max-width="400px">
          <v-card>
            <v-card-text>
              <v-container>
                <GMap ref="gMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy'}" :zoom="16" @loaded="mapLoaded">
                  <div class="centerdivmarker"></div>
                </GMap>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="coordiag = false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="updateMapLocation">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    
    </client-only>
  </v-layout>
</template>

<script>
import { GeoFirestore } from 'geofirestore';

export default {
  layout: 'menu',

  data: () => ({
    food: [],
    selectedCat: [],
    merchant: [],
    current_food_id:'',
    menuDiag: false,
    current_location: {
      lat: 0,
      lng: 0
    },
    current_id: '',
    isMapLoaded: false,
    dialog: false,
    coordiag: false,
   

    headers: [{
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'd.business_name',
      },
      { text: 'Branch', value: 'd.branch' },
      { text: 'CR', value: 'd.rates.cr' },
      { text: 'SC', value: 'd.rates.sc' },

      { text: 'Actions', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      d: {
        business_name: '',
        branch: '',
        rates: {
          sc: 0,
          cr: 0
        },
        draft: false
      }
    },
    defaultItem: {
      d: {
        business_name: '',
        branch: '',
        rates: {
          sc: 0,
          cr: 0
        },
        draft: false
      }
    },
    business_name: '',
    branch: '',
    sc: 0,
    cr: 0,
    mylocation: {
      lat: 9.7941185,
      lng: 118.7322599
    }
  }),


  computed: {

    formTitle() {
      return this.editedIndex === -1 ? 'New Merchant' : 'Edit Merchant Info'
    }
  },

  watch: {

    dialog(val) {
      val || this.close()
    },
    editedItem(val) {
      this.getFood()
    },
    mylocation(val) {
      if (this.isMapLoaded && val)
        this.$refs.gMap.map.setCenter({ lat: this.editedItem.d.coordinates.latitude, lng: this.editedItem.d.coordinates.longitude })
    }

  },






  mounted() {


    this.$getLocation({
        enableHighAccuracy: true, //defaults to false
        timeout: Infinity, //defaults to Infinity
        maximumAge: 60 //defaults to 0
      })
      .then(coordinates => {
        this.current_location = {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      });
    this.$bind('merchant', this.$fireStore.collection('merchant'))
  },



  methods: {

    selectChange(val){
    var cats = this.categories
       var ref = this.$fireStore.collection('foods').doc(val)
      
this.selectedCat.forEach(cal=>{
 this.categories.forEach(c=>{
  if(c.name===cal.name){
    if(c.values.length>0){
       c.values.forEach(d=>{
      if(d.path!==ref.path)
      c.values.push(ref)
    })
     }else{
        c.values.push(ref)
     }
   
  }
 })
})



this.$fireStore.collection('merchant').doc(this.editedItem.id).update({
  'd.menu': this.categories
})


//console.log(cats)
      
    },
    getFood() {
      var food = []
      if (this.editedIndex > -1) {
        var ref = this.$fireStore.collection('merchant').doc(this.editedItem.id)
        var food_data = this.$fireStore.collection('foods').where('owner', '==', ref)

        this.$bind('food', food_data)
      }




    },
    setCenter() {
      this.mylocation = { lat: this.editedItem.d.coordinates.latitude, lng: this.editedItem.d.coordinates.longitude }
      this.$refs.mainMap.map.setCenter(this.mylocation)

    },
    mapLoaded() {
      this.isMapLoaded = true
    },
    editItem(item) {

      this.editedIndex = this.merchant.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.id = item.id

      this.dialog = true
    },

    deleteItem(item) {

      confirm('Are you sure you want to delete this item?') && this.$fireStore.collection('merchant').doc(item.id).delete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.coordiag = false
      })
    },

    updateMapLocation() {


      console.log('updated map location', this.editedItem.id)
      var firestore = this.$fireStoreObj()


      var geofirestore = new GeoFirestore(firestore);
      var geocollection = geofirestore.collection('merchant');
      var data = Object.assign({}, this.editedItem.d)

      var coordinates = this.$refs.gMap.map.getCenter()

      data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.lat(), coordinates.lng())
      geocollection.doc(this.editedItem.id).update(data)
      this.close()

    },

    save() {

      var firestore = this.$fireStoreObj()


      var geofirestore = new GeoFirestore(firestore);

      var geocollection = geofirestore.collection('merchant');

      if (this.editedIndex > -1) {
        console.log(this.editedItem)
        var data = Object.assign({}, this.editedItem.d)
        var coordinates = data.coordinates
        data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.latitude, coordinates.longitude)
        geocollection.doc(this.editedItem.id).update(data);

      } else {


        this.editedItem.d.coordinates = new this.$fireStoreObj.GeoPoint(this.current_location.lat, this.current_location.lng)
        geocollection.add(this.editedItem.d);
      }

      this.close()

    },
    addNew() {
      var firestore = this.$fireStoreObj()


      var geofirestore = new GeoFirestore(firestore);

      var geocollection = geofirestore.collection('merchant');

      geocollection.add({
        business_name: this.business_name,
        branch: this.branch,
        rates: {
          sc: this.sc,
          cr: this.cr
        },
        draft: true,
        coordinates: new this.$fireStoreObj.GeoPoint(0, 0)
      })
    },
    deleteData() {
      this.$fireStore.collection('merchant').doc(this.current_id).delete()
    },
    modifyData(name) {

      var c = this.$fireStore.collection('merchant').doc(this.current_id)
      c.update({ 'd.name': name })
    }
  }
}
</script>

<style scoped>
.GMap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerdivmarker {
  position: absolute;
  background: url(https://maps.gstatic.com/mapfiles/markers2/arrow.png) no-repeat;
  z-index: 1;
  margin-left: -10px;
  margin-top: -34px;
  height: 35px;
  width: 25px;
  cursor: pointer;
}
</style>}
