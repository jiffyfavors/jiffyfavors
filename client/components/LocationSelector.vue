<template>
    <v-layout>
        <nav-drawer v-model="drawer"></nav-drawer>
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="#00aff0" />
        <v-card flat width="100%" class="cardhyt mb-10">
            <v-app-bar color="rgba(100,115,201)" app dark flat>
                <v-app-bar-nav-icon v-if="!isSearch" @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
                <v-avatar v-if="!isSearch" class="mr-2" rounded size="35">
                    <v-img src="/icon.png" /> </v-avatar>
                <v-toolbar-title v-if="!isSearch"> Jiffy Favors </v-toolbar-title>
                <v-spacer v-if="!isSearch" />
                <client-only>
                    <v-autocomplete v-if="isSearch" :items="getRestos('all')" autofocus prepend-inner-icon="mdi-magnify" solo hide-details hide-selected dense light label="Select" item-value="id" item-text="business_name" @blur="isSearch = false">
                        <template #item="data">
                            <v-list flat dense :to="'/resto/' + data.item.url">
                                <v-list-item-group>
                                    <v-list-item :to="'/resto/' + data.item.url">
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
                        <v-tabs v-if="!isHide" v-model="currentItem" slider-color="white" dense grow show-arrows center-active centered>
                            <v-tab key="all" href="#tab-all"> All </v-tab>
                            <v-tab v-for="item in initialTab" :key="item.name" :href="'#tab-' + item.name"> {{ item.name }} </v-tab>
                            <v-btn text class="align-self-center mr-4" @click.stop="moreBS=true"> more
                                <v-icon right>mdi-menu-down</v-icon>
                            </v-btn>
                        </v-tabs>
                    </client-only>
                </template>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto fill-height">
                <v-container fluid>
                    <v-content v-if="isHide">
                        <v-layout wrap justify-center align-center text-left>
                            <v-flex xs12 md4 sm4 lg3 class="text-center">
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
                                <v-btn color="blue darken-1" text class="white--text mt-5" block outlined @click="updateMapLocation"> Find Restaurant </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-content>
                    <v-content v-if="!isHide">
                        <client-only>
                            <v-tabs-items v-model="currentItem">
                                <v-tab-item key="all" value="tab-all">
                                    <v-layout wrap justify-center align-center text-left>
                                        <resto-card v-for="i in getRestos('all')" :key="i.id" class="review-card" style="white-space:initial;" :data="i" :url="/resto/+i.url" /> </v-layout>
                                </v-tab-item>
                                <v-tab-item v-for="item in initialTab.concat(moreTab)" :key="item.name" :value="'tab-' + item.name">
                                    <v-layout wrap justify-center align-center text-left>
                                        <resto-card v-for="i in item.values" :key="i.id" class="review-card" style="white-space:initial;" :data="i" :url="/resto/+i.url" /> </v-layout>
                                </v-tab-item>
                            </v-tabs-items>
                        </client-only>
                    </v-content>
                </v-container>
            </v-sheet>
        </v-card>
        <v-row justify="center">
            <v-bottom-sheet v-model="moreBS" v-if="moreTab.length" inset scrollable max-width="400">
                <v-card>
                    <v-card-title>More Options</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                        <v-list dense>
                            <v-list-item v-for="item in moreTab" :key="item.name" @click="addItem(item)">
                                <v-list-item-title> {{ item.name }}</v-list-item-title>
                                <v-divider></v-divider>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-layout>
</template>
<script>
import clonedeep from 'lodash.clonedeep'
import Loading from 'vue-loading-overlay'
import RestoCard from '~/components/RestoCard.vue'
import 'vue-loading-overlay/dist/vue-loading.css'
import shuffle from 'lodash.shuffle'
export default {
    components: {
        RestoCard,
        Loading
    },
    data() {
        return {
            drawer: false,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            coordiag: false,
            isLoading: true,
            isHide: false,
            isSearch: false,
            initialTab: [],
            moreTab: [],
            currentItem: null,
            partners: [],
            moreBS: false,
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
            return this.$store.getters['map/getStores']
        },
        tags() {
            const fare = this.$store.getters['admin/getFare']
            const menu = []
            if (fare !== null && fare.hasOwnProperty('tags')) {
                const tags = clonedeep(fare.tags).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                tags.forEach(tag => {
                    const foods = this.getRestos(tag)
                    if (foods.length > 0) menu.push({
                        name: tag,
                        values: foods
                    })
                })
                return menu
            } else {
                return []
            }
        }
    },
    watch: {
        tags() {
            if (this.tags.length > 5) {
                this.initialTab = clonedeep(this.tags).splice(0, 3)
                this.moreTab = clonedeep(this.tags).splice(4, this.tags.length - 1)
            }
        },
        currentItem() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
    },
    mounted() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(() => {
                this.$getLocation({
                    enableHighAccuracy: true,
                    timeout: 10000
                }).then(
                    (coordinates) => {
                        if (coordinates.accuracy < 500) {
                            this.findStores({
                                lat: coordinates.lat,
                                lng: coordinates.lng
                            })
                        } else {
                            this.isLoading = false
                            this.isHide = true
                        }
                    }, (error) => {
                        console.log(error)
                        this.isLoading = false
                        this.isHide = true
                    })
            }, () => {
                this.isLoading = false
                this.isHide = true
            });
        } else {
            this.isLoading = false
            this.isHide = true
        }
    },
    methods: {
        addItem(item) {
              window.scrollTo(0,0);
            const removed = this.initialTab.splice(0, 1)
            this.initialTab.push(...this.moreTab.splice(this.moreTab.indexOf(item), 1))
            this.moreTab.push(...removed)
            this.$nextTick(() => {
                this.moreBS = false
                this.currentItem = 'tab-' + item.name
                this.moreTab = this.moreTab.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))


            })
        },
        findStores(coordinates) {
            this.$store.commit('map/setLocation', {
                lat: coordinates.lat,
                lng: coordinates.lng
            })
            this.$store.dispatch('map/getNearbyStore', {
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
                if (item !== 'all') {
                    let resto = clonedeep(this.resto.filter((a) => a.tags.includes(item)))
                    let featured = shuffle(resto.filter((a) => a.rates.cr > 0))
                    let notFeatured = shuffle(resto.filter((a) => a.rates.cr == 0))
                    return featured.concat(notFeatured.sort((a, b) => a.draft - b.draft))
                }
                else {
                    let resto = clonedeep(this.resto)
                    let featured = shuffle(resto.filter((a) => a.rates.cr > 0))
                    let notFeatured = shuffle(resto.filter((a) => a.rates.cr == 0))
                    return featured.concat(notFeatured.sort((a, b) => a.draft - b.draft))
                }
            } catch (e) {
                return []
            }
        },
        checkIfExist(item) {
            const c = this.resto.filter((a) => a.tags.includes(item))
            console.log(c, item)
        }
    }
};
</script>
