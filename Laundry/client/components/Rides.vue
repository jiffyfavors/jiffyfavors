<template>
    <v-layout>
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue"> </loading>
        <nav-drawer v-model="drawer"></nav-drawer>
        <v-card flat width="100%" class="cardhyt mb-10">
            <v-app-bar color="rgba(100,115,201)" app dark flat>
                <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
                <v-avatar class="mr-2" rounded size="35">
                    <v-img src="/icon.png"> </v-img>
                </v-avatar>
                <v-toolbar-title> Jiffy Favors </v-toolbar-title>
            </v-app-bar>
            <v-content>
                <v-card>
                    <v-card-title> Humanap ng rider</v-card-title>
                    <v-card-text>
                        <v-list nav outlined tile width="100%" dense>
                            <v-list-item dense @click.stop="mode = {mode:'pickup', text:'Select Pickup Location', btnText:'Set Pickup'}, mapSheet = true">
                                <v-list-item-icon>
                                    <v-icon color="red"> mdi-map-marker </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Select origin</v-list-item-title>
                                    <v-list-item-subtitle>Pickup</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item id="needDeli" @click.stop="mode = {mode:'dropoff', text:'Select Destination', btnText:'Set Destination'}, mapSheet = true">
                                <v-list-item-icon>
                                    <v-icon color="blue"> mdi-navigation </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Select destination</v-list-item-title>
                                    <v-list-item-subtitle>Destination</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-textarea rows="3" outlined dense hint="e.g Blue ang sout na damit." class="mt-1" placeholder="Describe instruction. e.g nakaWhite T-Shirt"></v-textarea>
                        <timer></timer>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn outlined @click.stop="findRider()" color="blue" width="45%" class="ma-1" block>Calculate Fare</v-btn>
                    </v-card-actions>
                </v-card>
            </v-content>
        </v-card>
        <v-row justify="center">
            <v-bottom-sheet v-model="mapSheet">
                <v-card>
                    <v-card-title>{{mode.text}}</v-card-title>
                    <v-card-text>
                        <div class="mapcontainer">
                            <GMap id="gmap" ref="gMap" :center="mylocation" :options="options" :zoom="15" @center_changed="centerChange">
                                <GMapMarker ref="gmapmarker" :position="mylocation" :options="{ icon: selectedmarker }"> </GMapMarker>
                            </GMap>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn outlined text color="blue" @click.stop="setLocation()" block class="ma-1">{{mode.btnText}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-bottom-sheet>
            <v-bottom-sheet inset v-model="rideType" persistent scrollable>
                <v-card>
                    <v-card-title>
                        <v-icon @click.stop="rideType = false">mdi-close</v-icon>Calculated Fare Matrix </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 400px;">
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>Distance</v-list-item-subtitle>
                                    <v-list-item-title>{{ride.distance}} km</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title> Back Ride</v-list-item-title>
                                    <v-list-item-subtitle>Solo Angkas</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        <span class="caption grey--text">Fare</span>
                                        <span class="red--text subtitle-2">{{ ride.fares.back_ride | toPHP }}</span>
                                    </v-list-item-action-text>
                                    <v-btn color="red" small outlined @click.stop="">Select</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Tricycle</v-list-item-title>
                                    <v-list-item-subtitle>Book entire tricycle </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        <span class="caption grey--text">Fare</span>
                                        <span class="red--text subtitle-2">{{ ride.fares.tricycle_hire | toPHP }}</span>
                                    </v-list-item-action-text>
                                    <v-btn color="red" small outlined @click.stop="">Select</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Tricycle - Shared</v-list-item-title>
                                    <v-list-item-subtitle>Pickup is allowed </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        <span class="caption grey--text">Fare</span>
                                        <span class="red--text subtitle-2">{{ride.fares.tricycle_shared | toPHP }}</span>
                                    </v-list-item-action-text>
                                    <v-btn color="red" small outlined @click.stop="">Select</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Car or Sedan</v-list-item-title>
                                    <v-list-item-subtitle>Rent entire car </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        <span class="caption grey--text">Fare</span>
                                        <span class="red--text subtitle-2">{{ride.fares.car_hire| toPHP }}</span>
                                    </v-list-item-action-text>
                                    <v-btn color="red" small outlined @click.stop="">Select</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <!-- <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Car - Shared</v-list-item-title>
                                    <v-list-item-subtitle>Car Pool-Pickup allowed </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        <span class="caption grey--text">Fare</span>
                                        <span class="red--text subtitle-2">{{ride.fares.car_shared| toPHP }}</span>
                                    </v-list-item-action-text>
                                    <v-btn color="red" small outlined @click.stop="">Select</v-btn>
                                </v-list-item-action>
                            </v-list-item> --></v-list>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-layout>
</template>
<script>
import Loading from 'vue-loading-overlay'
import Timer from '~/components/Timer'
import 'vue-loading-overlay/dist/vue-loading.css'
export default {
    components: {
        Loading,
        Timer
    },
    computed: {
        fares() {
            return this.$store.getters['admin/getFare'].service_fees.rides
        }
    },
    data() {
        return {
            options: {
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: true,
                zoomControl: true,
                gestureHandling: 'greedy'
            },
            mapSheet: false,
            mode: {
                mode: '',
                text: '',
                btnText: '',
            },
            coords: {
                pickup: {
                    lat: 0,
                    lng: 0
                },
                dropoff: {
                    lat: 0,
                    lng: 0,
                }
            },
            ride: {
                distance: 0,
                fares: {
                    back_ride: 0,
                    tricycle_hire: 0,
                    tricycle_shared: 0,
                    car_hire: 0,
                    car_shared: 0
                }
            },
            rideType: false,
            drawer: false,
            isLoading: false,
            mylocation: {
                lat: 9.7941185,
                lng: 118.7322599
            },
            origin: {
                lat: 9.7941185,
                lng: 118.7322599
            },
            distanceMatrix: null,
            directionsService: null,
            directionsRenderer: null,
            markerA: 'http://maps.google.com/mapfiles/kml/paddle/A.png',
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
        }
    },
    mounted() {
        this.getArea()
    },
    methods: {
        setLocation() {
            let coordinates = this.$refs.gMap.map.getCenter()
            if (this.mode.mode === 'pickup') {
                this.coords.pickup = {
                    lat: coordinates.lat(),
                    lng: coordinates.lng()
                }
            } else {
                this.coords.dropoff = {
                    lat: coordinates.lat(),
                    lng: coordinates.lng()
                }
            }
            this.mapSheet = false
        },
        mapLoaded() {},
        getArea() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(() => {
                    this.$getLocation({
                        enableHighAccuracy: true,
                        timeout: 10000
                    }).then(
                        (coordinates) => {
                            if (coordinates.accuracy < 500) {
                                this.$store.dispatch('admin/getArea', {
                                    lat: coordinates.lat,
                                    lng: coordinates.lng
                                }, {
                                    root: true
                                })
                                this.origin = {
                                    lat: coordinates.lat,
                                    lng: coordinates.lng
                                }
                            }
                        })
                })
            }
        },
        findRider() {
            console.log(this.coords)
            this.distanceMatrix = new google.maps.DistanceMatrixService()
            this.distanceMatrix.getDistanceMatrix({
                origins: [this.coords.pickup],
                destinations: [this.coords.dropoff],
                travelMode: 'DRIVING',
            }, (res) => {
                if (res.rows[0].elements[0].status === 'OK') {
                    let distance = parseFloat(parseFloat((500 + res.rows[0].elements[0].distance.value) / 1000).toFixed(2))
                    this.ride.distance = distance
                    let fares = this.fares
                    this.ride.fares.back_ride = this.fareGenerator(fares.backride.base, fares.backride.base_distance, fares.backride.distance)
                    this.ride.fares.tricycle_shared = this.fareGenerator(fares.trike.shared.base, fares.trike.shared.base_distance, fares.trike.shared.distance)
                    this.ride.fares.tricycle_hire = this.fareGenerator(fares.trike.hired.base, fares.trike.hired.base_distance, fares.trike.hired.distance)
                    this.ride.fares.car_hire = this.fareGenerator(fares.cars.hired.base, fares.cars.hired.base_distance, fares.cars.hired.distance)
                    this.ride.fares.car_shared = this.fareGenerator(fares.cars.shared.base, fares.cars.shared.base_distance, fares.cars.shared.distance)
                    this.rideType = true
                }
            })
        },
        fareGenerator(base, base_distance, fare_distance) {
            let backridefare = this.ride.distance <= base_distance ? base : (base + ((this.ride.distance - base_distance)) * fare_distance)
            let dec = parseInt(backridefare)
            let booking_fee = Math.round(backridefare * 0.10)
            let checker = backridefare - dec
            if (checker < 0.5) backridefare += ((0.5 - checker) + 0.1)
            console.log('Fare', Math.round(backridefare))
            console.log('Booking Fee', Math.round(booking_fee))
            console.log('Rider Revenue', Math.round(backridefare * 0.85))
            console.log('Platform Revenue', Math.round(backridefare * 0.15))
            return Math.round(backridefare + booking_fee)
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.$refs.gmapmarker.marker.setAnimation(google.maps.Animation.BOUNCE)
        },
    }
};
</script>
<style scoped>
    @media screen and (min-width: 320px) and (max-width: 768px) {
    .mapcontainer,
    .GMap,
    .GMap__Wrapper {
        height: 80vh !important;
        width: 100vw !important;
        max-height: 100vw !important;
        max-width: 100% !important;
      }
    }
</style>
