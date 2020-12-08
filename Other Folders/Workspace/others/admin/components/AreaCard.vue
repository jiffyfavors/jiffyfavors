<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card class="mx-auto" max-width="400">
            <v-card-title primary-title> {{ item.name}} </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-layout wrap>
                    <v-flex xs8 sm8 md8>
                        <strong>Currency</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.currency}}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Locale</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.locale}}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Platform Fee</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.fees.distance_platform|toMoney(item.locale, item.currency)}}/km</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Rider Fee</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.fees.distance_rider|toMoney(item.locale, item.currency)}}/km</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Min. Delivery Fee</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.fees.min_df|toMoney(item.locale, item.currency)}}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Min. Distance</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.fees.min_distance}} km</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Min. Service Charge</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{item.fees.sc_min_value|toMoney(item.locale, item.currency)}}/order</strong>
                    </v-flex>
                </v-layout>
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Tags</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field name="name" v-model="tagText" v-on:keyup.enter="addTag" label="Tag" id="id"></v-text-field>
                                </v-flex>
                                <v-container>
                                    <v-chip small v-for="chip in item.tags" :key="chip" color="blue" class="white--text" close @click:close="removeTag(chip)" active>{{chip}}</v-chip>
                                </v-container>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
            <v-card-actions>
                <v-row align="center" justify="end">
                    <v-btn text color="blue darken-1" @click.stop="orderSheet  = true">Manage</v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
        <v-bottom-sheet inset v-model="orderSheet">
            <v-list dense>
                <v-subheader>Manage Area</v-subheader>
                <v-list-item @click.stop="orderSheet =false , newAreaSheet = true">
                    <v-list-item-title>Update Info</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="deleteArea()">
                    <v-list-item-title>Delete Area</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-bottom-sheet>
        <v-row justify="center">
            <v-bottom-sheet inset scrollable v-model="newAreaSheet">
                <v-card tile>
                    <v-card-title primary-title> Area Information </v-card-title>
                    <v-card-text>
                        <v-layout wrap>
                           
                            <v-flex xs12 md12>
                                <v-text-field v-model="area.name" dense label="Name" outlined placeholder="Name"> </v-text-field>
                            </v-flex>
                            <v-tabs v-model="tab_fees" centered center-active dense>
                                <v-tab key="map" href="#map">Map</v-tab>
                                <v-tab key="delivery" href="#delivery">Delivery Fees</v-tab>
                                <v-tab key="biller" href="#biller">Biller Fees</v-tab>
                                <v-tabs-items v-model="tab_fees">
                                    <v-tab-item key="map" value="map">
                                        <small>Please confirm radial area</small>
                                        <div class="mapcontainer">
                                            <GMap id="gmap" ref="gMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy'}" :zoom="10" @center_changed="centerChange" @loaded="mapLoaded" @dragend="dragEnd">
                                                <GMapMarker ref="gmapmarker" :position="mylocation" :options="{icon:selectedmarker}"></GMapMarker>
                                                <GMapCircle ref="gmapcircle" :options="circleOptions"></GMapCircle>
                                            </GMap>
                                        </div>
                                    </v-tab-item>
                                    <v-tab-item key="delivery" value="delivery">
                                        <v-layout wrap>
                                            <v-flex xs4 md4>
                                                <v-text-field v-model.number="area.fees.distance_platform" type="number" dense label="Platform Fee" outlined placeholder="Fee(Platform)" /></v-flex>
                                            <v-flex xs4 md4>
                                                <v-text-field v-model.number="area.fees.distance_rider" type="number" dense label="Rider Fee" outlined placeholder="Fee(Rider)"></v-text-field>
                                            </v-flex>
                                            <v-flex xs4 md4>
                                                <v-text-field v-model.number="area.fees.min_distance" type="number" dense label="Min. Distance" outlined placeholder="Min. Distance"></v-text-field>
                                            </v-flex>
                                            <v-flex xs4 md4>
                                                <v-text-field v-model.number="area.fees.min_df" type="number" dense label="Min. Delivery Fee" outlined placeholder="Delivery Fee(min)"></v-text-field>
                                            </v-flex>
                                            <v-flex xs4 md4>
                                                <v-text-field v-model.number="area.fees.sc_min_value" type="number" dense label="Min. SC" outlined placeholder="SC(Min)"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-tab-item>
                                    <v-tab-item key="biller" value="biller">
                                        <v-layout wrap>
                                            <v-flex xs6 md6>
                                                <v-text-field v-model.number="area.fees.biller.distance_platform" type="number" dense label="Platform Fee" outlined placeholder="Fee(Platform)" /></v-flex>
                                            <v-flex xs6 md6>
                                                <v-text-field v-model.number="area.fees.biller.distance_rider" type="number" dense label="Rider Fee" outlined placeholder="Fee(Rider)"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-tabs>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn tile outlined color="red" @click="sendNewPayload(), newAreaSheet = false , orderSheet = false"> Apply Changes </v-btn>
                    </v-card-actions>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-flex>
</template>
<script>
import {
    GeoFirestore
} from 'geofirestore'
import cloneDeep from 'lodash.clonedeep'
export default {
    props: {
        item: Object
    },
    computed: {
        area() {
            return this.item
        },
        mylocation() {
            return {
                lat: this.item.coordinates.latitude,
                lng: this.item.coordinates.longitude,
            }
        },
        geocenter() {
            return {
                lat: this.item.coordinates.latitude,
                lng: this.item.coordinates.longitude,
            }
        }
    },
    watch: {
        newAreaSheet(val) {
            if (val) {
                setTimeout(() => {
                    this.dragEnd()
                }, 1000)
            }
        }
    },
    data() {
        return {
            tab_fees: 'map',
            tagText: '',
            orderSheet: false,
            newAreaSheet: false,
            circleOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                radius: 8000
            },
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
        }
    },
    mounted() {
        console.log(this.item)
    },
    methods: {
        removeTag(txt) {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('areas').doc(this.area.id)
            geocollection.update({
                tags: this.$fireStoreObj.FieldValue.arrayRemove(txt)
            })
        },
        addTag() {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('areas').doc(this.area.id)
            geocollection.update({
                tags: this.$fireStoreObj.FieldValue.arrayUnion(this.tagText)
            })
            this.tagText = ''
        },
        deleteArea() {
            const firestore = this.$fireStoreObj()
            firestore.collection('areas').doc(this.item.id).delete()
            this.orderSheet = false
        },
        sendNewPayload() {
            var area = cloneDeep(this.area)
            const coordinates = this.$refs.gMap.map.getCenter()
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('areas').doc(area.id)
            area.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.lat(), coordinates.lng())
            delete area.id
            geocollection.update(area)
        },
        dragEnd() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapcircle.circle.setCenter({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        mapLoaded() {
            this.isLoading = false
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        }
    }
}
</script>
<style scoped>
      .mapcontainer,
.GMap,
.GMap__Wrapper {
    height: auto !important;
    width: 100% !important;
  }
  
  @media screen and (min-width: 320px) and (max-width: 768px) {
      *>>>.mapcontainer,
      *>>>.GMap,
      *>>>.GMap__Wrapper {
          height: 70vw !important;
          width: 100vw !important;
          max-width: 100% !important;
        }
      }
</style>
