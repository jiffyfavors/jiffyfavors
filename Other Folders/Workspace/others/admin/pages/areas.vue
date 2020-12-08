<template>
    <v-layout>
        <v-container fluid>
            <v-tabs v-model="tab" color="blue" center-active background-color="transparent" grow>
                <v-tab v-for="item in areas" :key="item.id" dense> {{ item.name }} </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in areas" :key="item.id">
                    <v-card color="basil" flat>
                        <v-card-text>
                            <v-layout wrap justify-start align-start text-left>
                                <area-card v-for="area in item.areas" :item="area" :key="area.id"></area-card>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
                    

            <v-fab-transition>
                <v-btn small dense color="pink" class="fabicon" @click.stop="newAreaSheet = true" dark fab>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-fab-transition>
     
        </v-container>

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
    </v-layout>
</template>
<script>
import {
    GeoFirestore
} from 'geofirestore'
import AreaCard from '~/components/AreaCard.vue'
export default {
    layout: 'default',
    components: {
        AreaCard
    },
    data: () => ({
        tab_fees: null,
        circleOptions: {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            radius: 8000
        },
        db_areas: [],
        tab: null,
        areatab: null,
        selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
        geocenter: {
            lat: 9.7941185,
            lng: 118.7322599
        },
        mylocation: {
            lat: 9.7941185,
            lng: 118.7322599
        },
        newAreaSheet: false,
        area: {
            coordinates: {
                lat: 0,
                lng: 0
            },
            fees: {
                distance_platform: 0,
                distance_rider: 0,
                min_df: 60,
                min_distance: 0,
                sc_min_value: 0,
                biller: {
                    distance_platform: 0,
                    distance_rider: 0
                }
            },
            isActive: false,
            locale: 'en-PH',
            currency: 'PHP',
            name: '',
            country: {
                code: 'PH',
                name: 'Philippines'
            }
        },
        default_area: {
            coordinates: {
                lat: 0,
                lng: 0
            },
            fees: {
                distance_platform: 0,
                distance_rider: 0,
                min_df: 60,
                min_distance: 0,
                sc_min_value: 0
            },
            locale: 'en-PH',
            currency: 'PHP',
            name: 'Puerto Princesa City',
            country: {
                code: 'PH',
                name: 'Philippines'
            }
        }
    }),
    computed: {
        areas() {
            var areas = []
            var values = []
            this.db_areas.forEach(area => {
                areas.push(area.d.country)
                var a = Object.assign({}, area.d)
                a.id = area.id
                values.push(a)
            })
            const result = [];
            const map = new Map();
            for (const item of areas) {
                if (!map.has(item.code)) {
                    map.set(item.code, true); // set any value to Map
                    result.push({
                        code: item.code,
                        name: item.name,
                        areas: []
                    });
                }
            }
            result.forEach((country, index) => {
                values.forEach(area => {
                    if (country.code == area.country.code) result[index].areas.push(area)
                })
                country.areas = country.areas.sort((a, b) => {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                })
            })
            console.log(result)
            return result
        },
    },
    mounted() {
        // this.getAreas()
        const firestore = this.$fireStoreObj()
        var q = firestore.collection('areas')
        this.$bind('db_areas', q)
    },
    methods: {
        sendNewPayload() {
            const coordinates = this.$refs.gMap.map.getCenter()
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('areas')
            this.area.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.lat(), coordinates.lng())
            geocollection.add(this.area)
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
        },
    }
}
</script>
<style scoped>
        .fabicon {
    position: fixed;
    bottom: 15%;
    right: 5%;
  }
  
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
