<template>
  <v-app id="e3">
        <v-card flat width="100%" class="cardhyt mb-10">
            <v-app-bar color="blue" app dark flat>
                <v-toolbar-title v-if="!isSearch">Jiffy Favors</v-toolbar-title>
                <v-spacer v-if="!isSearch"></v-spacer>
                <v-autocomplete v-if="isSearch" :items="getRestos('all')" autofocus @blur="isSearch = false" prepend-inner-icon="mdi-magnify" solo hide-details hide-selected dense light label="Select" item-text="business_name">
                    <template v-slot:item="data">
                        <v-list dense>
                            <v-list-item-group>
                                <v-list-item>
                                    <v-list-item-avatar> <img :src="data.item.logo"> </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.business_name"></v-list-item-title>
                                        <v-list-item-subtitle v-html="data.item.branch"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </template>
                </v-autocomplete>
                <v-btn @click.stop="isSearch = true" v-if="!isSearch" icon>
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon to="/cart" v-if="cartSize > 0">
                    <v-badge color="red">
                        <template v-slot:badge overlap>{{cartSize}} </template>
                        <v-icon color="white" dense>mdi-cart-outline</v-icon>
                    </v-badge>
                </v-btn>
                <template v-slot:extension>
                    <v-tabs v-model="currentItem" slider-color="white" dense grow center-active centered show-arrows>
                        <v-tab key="all" href="#tab-all">All</v-tab>
                        <v-tab v-for="item in tags" :key="item" :href="'#tab-' + item" v-if="resto.filter(a=>a.tags.indexOf(item)>-1).length>0"> {{ item }} </v-tab>
                    </v-tabs>
                </template>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto fill-height">
                <v-container fluid>
                    <v-content>
                        <v-tabs-items v-model="currentItem">
                            <v-tab-item key="all" value="tab-all">
                                <v-layout wrap justify-start align-start text-left>
                                    <resto-card v-for="i in getRestos('all')" class="review-card" style="white-space:initial;" :key="i.id" :data="i"> </resto-card>
                                </v-layout>
                            </v-tab-item>
                            <v-tab-item v-for="item in tags" :key="item" :value="'tab-' + item" v-if="getRestos(item).length>0">
                                <v-layout wrap justify-center align-center text-left>
                                    <resto-card v-for="i in getRestos(item)" class="review-card" style="white-space:initial;" :key="i.id" :data="i"> </resto-card>
                                </v-layout>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-content>
                </v-container>
            </v-sheet>
        </v-card>
        <v-bottom-navigation dense color="blue" app>
            <v-btn icon to="/"> <span>Search</span>
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn icon to="/riders"> <span>Orders</span>
                <v-icon>mdi-food</v-icon>
            </v-btn>
            <v-btn icon to="/merchants"> <span>Account</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-bottom-navigation>
     </v-app>
</template>
<script>
import RestoCard from '~/components/RestoCard.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import clonedeep from 'lodash.clonedeep'
export default {
    components: {
        RestoCard,
        Loading
    },
    computed: {
        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        resto() {
            return this.$store.getters['map/getStores']
        },
        tags() {
            var fare = this.$store.getters['admin/getFare']
            if (fare !== null && fare.hasOwnProperty('tags')) {
                return clonedeep(fare.tags).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
            } else {
                return []
            }
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
            isSearch: false,
            currentItem: null,
            partners: [],
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
    watch: {
        currentItem() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
    },
    mounted() {
         this.$store.commit('map/setLocation', {
                    lat: 9.794104800000001,
                    lng: 118.73219650000001
                })
         
            this.$store.dispatch('map/getNearbyStore', {
                lat: 9.794104800000001,
                lng: 118.73219650000001
            }).then(() => {
            
                console.log(this.resto)
                this.isLoading = false
                this.isHide = true
            });
        
        // var options = {
        //     enableHighAccuracy: true, //defaults to false
        //     timeout: Infinity, //defaults to Infinity
        // }
        // this.$watchLocation(options).then(coordinates => {
        //     console.log(coordinates)
        //     this.$store.dispatch('map/getNearbyStore', {
        //         lat: coordinates.lat,
        //         lng: coordinates.lng
        //     }).then(() => {
        //         console.log(this.resto)
        //         this.isLoading = false
        //         this.isHide = true
        //     });
        // })
    },
    update() {
        this.$refs.gMap.initMarkers()
    },
    methods: {
        getRestos(item) {
            try{ if (item != 'all') return clonedeep(this.resto.filter(a => a.tags.indexOf(item) > -1)).sort((a, b) => a.business_name < b.business_name ? -1 : a.business_name > b.business_name ? 1 : 0)
            else return clonedeep(this.resto).sort((a, b) => a.business_name < b.business_name ? -1 : a.business_name > b.business_name ? 1 : 0)}catch(e){console.log(e)}
           
        },
        checkIfExist(item) {
            var c = this.resto.filter(a => a.tags.indexOf(item) > -1)
            console.log(c, item)
        },
        dragEnd() {},
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
            }).then(() => {
                console.log(this.resto)
                this.isLoading = false
                this.isHide = true
            });
        }
    }
};
</script>
<style scoped>
.cardhyt {
    height: 90vh;
}

.GMap,
.GMap__Wrapper {
    height: calc(90vh - 100px);
    margin-top: 10px;
}
</style>
