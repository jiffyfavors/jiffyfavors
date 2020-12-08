<template>
    <v-app id="e3">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
        <v-app-bar color="#00aff0" dark shrink-on-scroll prominent :src="business.backdrop" fade-img-on-scroll scroll-target="#scrolling-techniques-3" scroll-threshold="300" fixed app>
            <template #img="{ props }">
                <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)" /> </template>
            <v-toolbar-title>{{ business.business_name }}</v-toolbar-title>
            <v-spacer />
            <v-menu bottom left>
                <template #activator="{ on, attrs }">
                    <v-btn dark icon v-bind="attrs" v-on="on">
                        <v-icon> mdi-share-variant</v-icon>
                    </v-btn>
                </template>
                <v-list nav flat single-line dense>
                    <ShareNetwork v-for="network in networks" :key="network.network" :network="network.network" :style="{ backgroundColor: network.color }" :url="sharing.url" :title="sharing.title" :description="sharing.description" :hashtags="sharing.hashtags">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon small :color="network.color"> {{ network.icon }} </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ network.name }}</v-list-item-title>
                        </v-list-item>
                    </ShareNetwork>
                </v-list>
            </v-menu>
            <template #extension>
                <v-tabs v-model="tab" show-arrows center-active centered dense background-color="transparent" color="basil" grow>
                    <v-tab href="#services" dense @click.stop="scrollTo()"> Services </v-tab>
                    <v-tab href="#mylaundry" dense @click.stop="scrollTo()">My Transaction</v-tab>
                    <v-tab href="#contact" dense @click.stop="scrollTo()">Contact Us </v-tab>
                    <v-tab dense href="#address" @click.stop="scrollTo()">Address</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="100vh">
            <v-container fluid>
                <client-only>
                    <v-content>
                        <v-tabs-items v-model="tab">
                            <v-tab-item value="services" v-if="services.length>0">
                                <v-card flat>
                                    <v-layout wrap align-center>
                                        <v-flex v-for="item in services" :key="item.name + '_' + item" xs12 md4 sm4 lg4 class="pa-1">
                                            <v-lazy v-model="isActive" :options="{threshold: .6}" transition="fade-transition">
                                                <service-card :item="item"></service-card>
                                            </v-lazy>
                                        </v-flex>
                                    </v-layout>
                                    <v-toolbar dense max-width="100%" class="shopresponsive">
                                        <v-btn tile block outlined color="red" @click.stop="actionSheet=true">{{callToActionGetter()}}</v-btn>
                                    </v-toolbar>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item value="mytrans">
                                <v-card flat> My Transaction </v-card>
                            </v-tab-item>
                            <v-tab-item value="contact">
                                <v-card flat>
                                    <v-card-title>Contact Us</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item v-for="(c,i) in business.contact" :key="i" :href="getHref(c)">
                                                <v-list-item-icon>
                                                    <v-icon>{{getIcon(c)}}</v-icon>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{c.value}}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item value="address">
                                <div class="mapcontainer">
                                    <GMap id="gmap" ref="gMap" :center="business.location" :options="mapoption" :zoom="15">
                                        <GMapMarker ref="gmapmarker" :position="business.location" :options="{ icon: selectedmarker }" /> </GMap>
                                </div>
                                <v-toolbar dense max-width="100%" class="shopresponsive">
                                    <v-btn tile block outlined color="red">Get Direction</v-btn>
                                </v-toolbar>
                            </v-tab-item>
                            <!--  <v-tab-item v-for="item in business.menu.filter(i=>i.values.length>0)" :key="item.name">
                            <client-only>
                                <food-item :data="item" :merchant="business" /> </client-only>
                        </v-tab-item> --></v-tabs-items>
                    </v-content>
                </client-only>
            </v-container>
            <v-bottom-sheet v-model="actionSheet">

                <v-list nav outlined tile width="100%" dense>
                      <v-subheader>Booking Form</v-subheader>
                    <v-list-item dense>
                        <v-list-item-icon>
                            <v-icon color="red"> mdi-cellphone </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title></v-list-item-title>
                            <v-list-item-subtitle> Contact Information </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action @click.stop="">
                            <v-icon color="red"> mdi-chevron-right </v-icon>
                        </v-list-item-action>
                    </v-list-item>
                     <v-list-item dense>
                        <v-list-item-icon>
                            <v-icon color="red"> mdi-cellphone </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title></v-list-item-title>
                            <v-list-item-subtitle> Pickup Time </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action @click.stop="">
                            <v-icon color="red"> mdi-chevron-right </v-icon>
                        </v-list-item-action>
                    </v-list-item>

                        <v-list-item dense>
                        <v-list-item-icon>
                            <v-icon color="red"> mdi-cellphone </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title></v-list-item-title>
                            <v-list-item-subtitle> Pickup Addresss </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action @click.stop="">
                            <v-icon color="red"> mdi-chevron-right </v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-bottom-sheet>
        </v-sheet>
    </v-app>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoCollectionReference
} from 'geofirestore'
import ServiceCard from '~/components/ServiceCard.vue'
export default {
    components: {
        ServiceCard,
        Loading
    },
    layout: 'area',
    asyncData({
        app,
        params,
        error
    }) {
        try {
            const db = app.$fireStore
            return db.collection('shops').where('url', '==', params.id).get().then((data) => {
                const d = data.docs[0].data()
                let delivery = d.delivery_time
                if (delivery === undefined) {
                    delivery = {
                        open: '09:00:00',
                        close: '19:00:00'
                    }
                }
                const biz = {
                    isLoading: false,
                    business: {
                        id: data.docs[0].id,
                        business_name: d.business_name,
                        branch: d.branch,
                        backdrop: d.backdrop,
                        logo: d.logo,
                        storeType: d.storeType,
                        contact: d.contact,
                        location: {
                            lat: d.location.latitude,
                            lng: d.location.longitude
                        }
                    },
                    sharing: {
                        url: 'https://m.jiffyfavors.com/resto/' + params.id,
                        title: `Order your ${d.business_name} - ${d.branch} Food Online at Jiffy Favors`,
                        description: `${d.business_name} - ${d.branch} Food Menu & Online Ordering`,
                        hashtags: 'jiffyfavors,food,delivery,onlineorder'
                    },
                    networks: [{
                        network: 'facebook',
                        name: 'Facebook',
                        icon: 'mdi-facebook',
                        color: '#1877f2'
                    }, {
                        network: 'email',
                        name: 'Email',
                        icon: 'mdi-gmail',
                        color: 'red'
                    }, {
                        network: 'skype',
                        name: 'Skype',
                        icon: 'mdi-skype-business',
                        color: '#00aff0'
                    }, {
                        network: 'sms',
                        name: 'SMS',
                        icon: 'mdi-android-messages',
                        color: '#333333'
                    }, {
                        network: 'telegram',
                        name: 'Telegram',
                        icon: 'mdi-telegram',
                        color: '#0088cc'
                    }, {
                        network: 'twitter',
                        name: 'Twitter',
                        icon: 'mdi-twitter',
                        color: '#1da1f2'
                    }, {
                        network: 'whatsapp',
                        name: 'Whatsapp',
                        icon: 'mdi-whatsapp',
                        color: '#25d366'
                    }]
                }
                return biz
            }).catch((e) => {
                console.log(e)
                return error({
                    statusCode: 404,
                    message: 'Blog not found'
                })
            })
        } catch (e) {
            console.log(e)
            return error({
                statusCode: 404,
                message: 'Blog not found'
            })
        }
    },
    data() {
        return {
            isLoading: true,
            actionSheet: false,
            business: null,
            dialog: false,
            tab: null,
            services: [],
            isActive: false,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            mylocation: {
                lat: 0,
                lng: 0
            },
            mapoption: {
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: true,
                gestureHandling: 'greedy'
            }
        }
    },
    head() {
        const business = this.business
        const url = 'https://m.jiffyfavors.com' + this.$route.fullPath
        return {
            title: `${business.business_name} - Menu and Food Delivery`,
            meta: [{
                hid: `description`,
                name: 'description',
                content: `${business.business_name} ${business.branch}- Online Food Ordering`
            }, {
                hid: 'og:type',
                name: 'og:type',
                content: 'restaurant.menu'
            }, {
                hid: 'og:title',
                name: 'og:title',
                content: `Food Menu|Order Online - ${business.business_name} ${business.branch}`
            }, {
                hid: 'og:description',
                name: 'og:description',
                content: `Menu for ${business.business_name} ${business.branch}- Order Now. Pay COD!`
            }, {
                hid: 'og:image',
                name: 'og:image',
                content: `${business.logo}`
            }, {
                hid: 'og:url',
                name: 'og:url',
                content: url
            }],
            link: [{
                rel: 'icon',
                type: 'image/png',
                href: `${business.logo}`
            }]
        }
    },
    mounted() {
        console.log(this.business.location)
        this.$fireStore.collection('shops').doc(this.business.id).collection('services').get().then((data) => {
            data.docs.forEach(d => {
                this.services.push(d.data())
            })
        })
    },
    methods: {
        callToActionGetter() {
            console.log(this.business.storeType)
            if (this.business.storeType === 'Laundry Shop') return 'Book a Laundry Pickup'
        },
        getHref(val) {
            if (val.type === 'mobile') return 'tel:' + val.value
            else if (val.type === 'messenger') return 'https://m.me/' + val.value
            else if (val.type === 'email') return 'mailto:' + val.value
        },
        getIcon(val) {
            if (val.type === 'mobile') return 'mdi-phone'
            else if (val.type === 'messenger') return 'mdi-facebook-messenger'
            else if (val.type === 'email') return 'mdi-email'
        },
        scrollTo() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },
    }
};
</script>
<style scoped>
  .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }
</style>
