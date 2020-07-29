<template>
    <v-app id="e3">
        <v-app-bar color="white" class="black--text text-center" fixed app>Jiffy Riders
            <v-spacer />
        <!--     <v-btn icon @click.stop="testFN">
                <v-icon color="blue">mdi-history</v-icon>
            </v-btn>
            <v-btn icon @click.stop="resetJob">
                <v-icon color="green">mdi-refresh</v-icon>
            </v-btn>
            <v-btn icon @click.stop="coordiag = true">
                <v-icon color="green">mdi-navigation</v-icon>
            </v-btn> -->
            <v-btn icon @click.stop="Logout()">
                <v-icon color="red">mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
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
            if (Date.now() - this.lastUpdate > 120000) {
                console.log('must update')
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
            if (Date.now() - this.lastUpdateArea > 24 * 60 * 60 * 1000) {
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
        testFN() {
            console.log('Calling FireFunc')
            this.$fireFunc.httpsCallable('testFN')({
                name: 'Order Event',
                title: 'Yey we found your rider!',
                body: 'Jayjay is on the way to Jolibee Robinsons Now.',
                image: null,
                link: '/track/order/12334',
                token: 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            }).catch(e => {
                console.log(e)
            })
        },
        resetJob() {
            const firestore = this.$fireStoreObj()
            firestore.collection('shop_request').doc('SR-GKGFGQ').update({
                'd.status': 'placed',
                'd.rider': 'unassigned',
                'd.logs': [],
                'd.timestamp': new Date('2020-07-20 04:00 PM').getTime(),
                'd.token': 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            })
            firestore.collection('shop_request').doc('SR-ILD4XU').update({
                'd.status': 'placed',
                'd.rider': 'unassigned',
                'd.logs': [],
                'd.timestamp': new Date('2020-07-20 04:00 PM').getTime(),
                'd.token': 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            })
            firestore.collection('billspay_request').doc('BP-RI205V').update({
                'd.status': 'placed',
                'd.rider': 'unassigned',
                'd.logs': [],
                'd.timestamp': new Date('2020-07-20 04:00 PM').getTime(),
                'd.token': 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            })
            firestore.collection('orders').doc('OR-RV38OO').update({
                'd.status': 'placed',
                'd.rider': 'unassigned',
                'd.logs': [],
                'd.timestamp': new Date('2020-07-20 04:00 PM').getTime(),
                'd.token': 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            })
            firestore.collection('orders').doc('OR-TMUAHJ').update({
                'd.status': 'placed',
                'd.rider': 'unassigned',
                'd.logs': [],
                'd.timestamp': new Date('2020-07-20 04:00 PM').getTime(),
                'd.token': 'fgi9ElrMTz6qtySR92t2UP:APA91bGqhg-qaBi7cKoH9HaByAqFDF8dVaHshUZDS-1a8_pArVOpRqyE1Bppe1kQFDhtOll5Jyc3r6_E2_aJwfhXR3F2FpQreN4_e_L35h8GXA9hup1sdQNhxj1UmRHyBNOFQGLRQJnh'
            })
        },
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
