<template>
    <v-layout>
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
          <nav-drawer v-model="drawer" ></nav-drawer>
        <v-card flat width="100%" class="cardhyt mb-10">
            <v-app-bar color="rgba(100,115,201)" app dark flat>
                   <v-app-bar-nav-icon  v-if="!isSearch" @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
                <v-avatar v-if="!isSearch" class="mr-2" rounded size="35">
                    <v-img src="/icon.png" /> </v-avatar>
                <v-toolbar-title v-if="!isSearch"> Jiffy Favors </v-toolbar-title>
                <v-spacer v-if="!isSearch" />
                <client-only>
                    <v-autocomplete v-if="isSearch" :items="getRestos('all')" item-key="url" autofocus prepend-inner-icon="mdi-magnify" solo hide-details hide-selected dense light label="Select" item-value="id" item-text="business_name" @blur="isSearch = false">
                        <template #item="data">
                            <v-list dense>
                                <v-list-item-group>
                                    <v-list-item :to="'/bills_payment/' + data.item.url">
                                        <v-list-item-avatar>
                                            <v-img :src="data.item.logo" /> </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title> {{ data.item.business_name }} </v-list-item-title>
                                            <v-list-item-subtitle> {{ data.item.branch }} </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </template>
                    </v-autocomplete>
                    <v-btn v-if="!isSearch" icon @click.stop="isSearch = true">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                     <v-btn v-if="cartSize > 0" icon to="/cart">
                        <v-badge color="red">
                            <template #badge overlap> {{ cartSize }} </template>
                            <v-icon color="white" dense> mdi-cart-outline </v-icon>
                        </v-badge>
                    </v-btn>
                </client-only>
                <template #extension>
                    <client-only>
                        <v-tabs v-if="!isHide" v-model="currentItem" slider-color="white" dense grow center-active centered show-arrows>
                            <v-tab key="all" href="#tab-all"> All </v-tab>
                            <v-tab v-for="item in tags" :key="item.name" :href="'#tab-' + item.name"> {{ item.name }} </v-tab>
                        </v-tabs>
                    </client-only>
                </template>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto fill-height">
                <v-container fluid>
                    <v-content v-if="isHide">
                        <v-layout wrap justify-center align-center text-left>
                            <v-flex xs12 md4 sm4 lg3 class="text-center">
                                <v-icon class="mb-2" color="error" size="200"> mdi-map-marker </v-icon>
                                <blockquote class="blockquote mb-5">
                                    <span style="font-size:50px;">&#128546;</span>
                                    <h4>No Biller in Your Location</h4> </blockquote>
                                <footer>
                                    <v-btn outlined text block color="red" @click.stop="coordiag = true"> Select Location </v-btn>
                                </footer>
                            </v-flex>
                        </v-layout>
                    </v-content>
                    <v-content v-if="!isHide">
                        <client-only>
                            <v-tabs-items v-model="currentItem">
                                <v-tab-item key="all" value="tab-all">
                                    <v-layout wrap justify-center align-center text-left>
                                        <resto-card v-for="i in getRestos('all')" :key="i.id" class="review-card" style="white-space:initial;" :data="i" :url="/biller/+i.url" /> </v-layout>
                                </v-tab-item>
                                <v-tab-item v-for="item in tags" :key="item.name" :value="'tab-' + item.name">
                                    <v-layout wrap justify-center align-center text-left>
                                        <resto-card v-for="i in item.values" :key="i.id" class="review-card" style="white-space:initial;" :data="i" :url="/biller/+i.url" /> </v-layout>
                                </v-tab-item>
                            </v-tabs-items>
                        </client-only>
                    </v-content>
                </v-container>
            </v-sheet>
        </v-card>
        <v-bottom-sheet v-model="coordiag" persistent max-width="400px">
            <v-card>
                <v-card-title primary-title> Confirmed Location </v-card-title>
                <v-card-text>
                    <div class="mapcontainer">
                        <GMap id="gmap" ref="gMap" :center="mylocation" :options="{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: true,
                zoomControl: true,
                gestureHandling: 'greedy'
              }" :zoom="15" @center_changed="centerChange">
                            <GMapMarker ref="gmapmarker" :position="mylocation" :options="{ icon: selectedmarker }" /> </GMap>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text class="white--text" block outlined @click="updateMapLocation"> Find Biller </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-layout>
</template>
<script>
import clonedeep from 'lodash.clonedeep'
import Loading from 'vue-loading-overlay'
import RestoCard from '~/components/RestoCard.vue'
import 'vue-loading-overlay/dist/vue-loading.css'
export default {
    components: {
        RestoCard,
        Loading
    },
    data() {
        return {
            drawer:false,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            coordiag: false,
            isLoading: true,
            isHide: false,
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
    computed: {
         cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        resto() {
            return this.$store.getters['map/getBillers']
        },
        tags() {
            const tags = ['Electric', 'Water', 'Telcos', 'Loans', 'Motorcycle', 'Insurane', 'Real Estate'].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
            const menu = []
            tags.forEach(tag => {
                const foods = this.getRestos(tag)
                if (foods.length > 0) menu.push({
                    name: tag,
                    values: foods
                })
            })
          
            return menu
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
         this.isLoading = false
       this.$getLocation({
            enableHighAccuracy: true,
            timeout: 10000
        }).then(
            (coordinates) => {
                if (coordinates.accuracy < 100) {
                    this.findStores({
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    })
                } else {
                
                    this.isHide = true
                }
            }, (error) => {
                console.log(error)
               
                this.isHide = true
            })
    },
    methods: {
        findStores(coordinates) {
            this.$store.commit('map/setLocation', {
                lat: coordinates.lat,
                lng: coordinates.lng
            })
            this.$store.dispatch('map/getNearbyBiller', {
                lat: coordinates.lat,
                lng: coordinates.lng
            }).then(() => {
                this.isLoading = false
                this.isHide = false
                this.coordiag = false
            })
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        updateMapLocation() {
            this.isLoading = true
            const coordinates = this.$refs.gMap.map.getCenter()
            this.findStores({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        getRestos(item) {
            try {
                if (item !== 'all') return clonedeep(this.resto.filter((a) => a.tags.includes(item))).sort((a, b) => a.business_name < b.business_name ? -1 : a.business_name > b.business_name ? 1 : 0)
                else return clonedeep(this.resto).sort((a, b) => a.business_name < b.business_name ? -1 : a.business_name > b.business_name ? 1 : 0)
            } catch (e) {
                console.log(e)
            }
        },
        checkIfExist(item) {
            const c = this.resto.filter((a) => a.tags.includes(item))
            console.log(c, item)
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
