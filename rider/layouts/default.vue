<template>
    <v-app id="e3">
        <v-app-bar color="white" dense fixed app>
            <v-app-bar-nav-icon color="blue" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="black--text text-center">Jiffy Rider</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="statusSheet = true">
                <v-icon color="green">mdi-check</v-icon>
            </v-btn>
            <v-btn icon @click.stop="Logout()">
                <v-icon color="red">mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" clipped floating temporary app color="blue" app dark>
            <v-list dense nav class="py-0">
                <v-list-item two-line>
                    <v-list-item-avatar rounded size="35" class="mr-2"> <img src="/icon.png"> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{profile.firstname}} {{profile.lastname}}</v-list-item-title>
                        <v-list-item-subtitle>Rider</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item to="/">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/account">
                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Account</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/vehicles">
                    <v-list-item-icon>
                        <v-icon>mdi-motorbike</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Vehicle</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item to="/reviews">
                    <v-list-item-icon>
                        <v-icon>mdi-account-star-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>My Ratings</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item to="/support">
                    <v-list-item-icon>
                        <v-icon>mdi-account-alert-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Support</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <v-container class="mb-10">
                <nuxt /> </v-container>
        </v-content>
        <v-bottom-navigation grow color="teal" fixed>
            <v-btn to="/">
                <span>Dashboard</span>
                <v-icon>mdi-view-dashboard</v-icon>
            </v-btn>
            <v-btn to="/jobs">
                <span>Jobs</span>
                <v-icon>mdi-view-carousel</v-icon>
            </v-btn>
        </v-bottom-navigation>
        <v-row justify="center">
            <v-bottom-sheet v-model="coordiag" persistent max-width="400px">
                <v-card>
                    <v-card-title primary-title>Confirmed Location</v-card-title>
                    <v-card-text>
                        <div class="mapcontainer">
                            <GMap id="gmap" ref="gMap" :center="location" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: true, zoomControl: true, gestureHandling: 'greedy'}" :zoom="15" @center_changed="centerChange">
                                <GMapMarker ref="gmapmarker" :position="location" :options="{icon:selectedmarker}"> </GMapMarker>
                            </GMap>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="coordiag = false"> Cancel </v-btn>
                        <v-btn color="blue darken-1" text @click="updateMapLocation"> Save </v-btn>
                    </v-card-actions>
                </v-card>
            </v-bottom-sheet>
            <v-bottom-sheet v-model="statusSheet">
                <v-card>
                    <v-card-title>Set Status</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item @click.stop="statusSheet = false">
                                <v-list-item-icon>
                                    <v-icon color="green">mdi-check</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Accepting Job</v-list-item-title>
                                    <v-list-item-subtitle>Free to accept Job</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click.stop="statusSheet = false">
                                <v-list-item-icon>
                                    <v-icon color="red">mdi-close</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Not Accepting Job</v-list-item-title>
                                    <v-list-item-subtitle>Go Offline - Not Accepting</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-app>
</template>
<script>
import {
    GeoFirestore,
    GeoCollectionReference
} from 'geofirestore'
export default {
    middleware: 'auth',
    data() {
        return {
            drawer: false,
            statusSheet: false,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            coordiag: false,
        }
    },
    computed: {
        status() {
            return this.$store.getters['auth/getStatus']
        },
        profile() {
            return this.$store.getters['auth/getProfile']
        },
        getArea() {
            return this.$store.getters['rider/getArea']
        },
        lastUpdateArea() {
            return this.$store.getters['rider/getLastUpdateArea']
        },
        lastUpdate() {
            return this.$store.getters['rider/getLastUpdate']
        },
        notifs() {
            return this.$store.getters['notif/getNotifs']
        },
        user() {
            return this.$store.getters['auth/getUser']
        },
        location() {
            return this.$store.getters['rider/getLocation']
        }
    },
    mounted() {
        if (!this.user) return
        this.$watchLocation({
            enableHighAccuracy: true,
            timeout: Infinity
        }).then((coordinates) => {
            this.$store.commit('rider/setLocation', {
                lat: coordinates.lat,
                lng: coordinates.lng
            })
            if (Date.now() - this.lastUpdate > 30000) {
                let user = new GeoCollectionReference(this.$fireStoreObj().collection('riders'))
                user.doc(this.user.id).update({
                    coordinates: new this.$fireStoreObj.GeoPoint(coordinates.lat, coordinates.lng)
                }).then(() => {
                    this.$store.dispatch('rider/getAvailableJobs', {
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    })
                })
            }
            if (Date.now() - this.lastUpdateArea > 24 * 60 * 60 * 1000 || !this.getArea) {
                this.$store.dispatch('rider/getArea', {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                })
            }
        }).catch(e => {
            console.log(e)
        })
    },
    watch: {
        status() {
            if (this.status) {
                if (this.status.job === 'AWAY' || this.status.profile === 'SUSPENDED')
                {
                    console.log('Suspending Account')
                    this.$store.dispatch('rider/suspendAccount')
                }
            }
        },
        notifs(val) {
            val.forEach(notif => {
                this.$toast.open({
                    message: notif.message,
                    position: 'top-right',
                    type: notif.type,
                    duration: 3500,
                    dismissible: true
                })
                this.$store.commit('notif/removeNotif', notif)
            })
        }
    },
    methods: {
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        Logout() {
            this.$fireAuth.signOut().then(() => {
                this.$router.push('/login')
            }, 1500)
        },
        updateMapLocation() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$store.dispatch('rider/getAvailableJobs', {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.$store.dispatch('rider/getArea', {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.coordiag = false
        }
    }
};
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
