<template>
    <v-app id="e3">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
        <v-app-bar color="#00aff0" dark shrink-on-scroll prominent :src="business.backdrop" fade-img-on-scroll scroll-target="#scrolling-techniques-3" scroll-threshold="300" fixed app>
            <template #img="{ props }">
                <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)" /> </template>
            <v-btn icon to="/food">
                <v-icon> mdi-arrow-left-bold</v-icon>
            </v-btn>
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
            <client-only>
                <v-btn v-if="cartSize > 0" id="cart" icon to="/cart">
                    <v-badge color="red">
                        <template #badge overlap> {{ cartSize }} </template>
                        <v-icon color="white" dense> mdi-cart-outline </v-icon>
                    </v-badge>
                </v-btn>
            </client-only>
            <template #extension>
                <v-tabs v-model="tab" show-arrows center-active centered dense background-color="transparent" color="basil" grow>
                    <v-tab v-for="item in business.menu.filter(i=>i.values.length>0)" :key="item.name" dense @click.stop="scrollTo()"> {{ item.name }} </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="100vh">
            <v-container fluid>
                <v-content>
                    <v-tabs-items v-model="tab">
                        <v-tab-item v-for="item in business.menu.filter(i=>i.values.length>0)" :key="item.name">
                            <client-only>
                                <food-item :data="item" :merchant="business" /> </client-only>
                        </v-tab-item>
                    </v-tabs-items>
                </v-content>
            </v-container>
        </v-sheet>
    </v-app>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoCollectionReference
} from 'geofirestore'
import FoodItem from '~/components/FoodItem.vue'
export default {
    components: {
        FoodItem,
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
            const geocollection = new GeoCollectionReference(db.collection('merchant'))
            return geocollection.where('url', '==', params.id).get().then((data) => {
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
                            menu: d.menu.sort((a, b) => {
                                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                            }),
                            rates: d.rates,
                            location: d.coordinates,
                            delivery
                        },
                        sharing: {
                            url: 'https://m.jiffyfavors.com/resto/' + params.id,
                            title: `Order your ${d.business_name} - ${d.branch} Food Online at Jiffy Favors`,
                            description: `${d.business_name} - ${d.branch} Food Menu & Online Ordering`,
                            hashtags: 'jiffyfavors,food,delivery,onlineorder'
                        },
                        networks: [
                        {
                            network: 'facebook',
                            name: 'Facebook',
                            icon: 'mdi-facebook',
                            color: '#1877f2'
                        },
                        {
                            network: 'email',
                            name: 'Email',
                            icon: 'mdi-gmail',
                            color: 'red'
                        },
                        {
                            network: 'skype',
                            name: 'Skype',
                            icon: 'mdi-skype-business',
                            color: '#00aff0'
                        },
                        {
                            network: 'sms',
                            name: 'SMS',
                            icon: 'mdi-android-messages',
                            color: '#333333'
                        },
                        {
                            network: 'telegram',
                            name: 'Telegram',
                            icon: 'mdi-telegram',
                            color: '#0088cc'
                        },
                        {
                            network: 'twitter',
                            name: 'Twitter',
                            icon: 'mdi-twitter',
                            color: '#1da1f2'
                        },
                        {
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
            business: null,
            dialog: false,
            tab: null
        }
    },
    head() {
        const business = this.business
        const url = 'https://m.jiffyfavors.com' + this.$route.fullPath
        return {
            title: `${business.business_name} - Menu and Food Delivery`,
            meta: [
            {
                hid: `description`,
                name: 'description',
                content: `${business.business_name} ${business.branch}- Online Food Ordering`
            },
            {
                hid: 'og:type',
                name: 'og:type',
                content: 'restaurant.menu'
            },
            {
                hid: 'og:title',
                name: 'og:title',
                content: `Food Menu|Order Online - ${business.business_name} ${business.branch}`
            },
            {
                hid: 'og:description',
                name: 'og:description',
                content: `Menu for ${business.business_name} ${business.branch}- Order Now. Pay COD!`
            },
            {
                hid: 'og:image',
                name: 'og:image',
                content: `${business.logo}`
            },
            {
                hid: 'og:url',
                name: 'og:url',
                content: url
            }],
            link: [
            {
                rel: 'icon',
                type: 'image/png',
                href: `${business.logo}`
            }]
        }
    },
    computed: {
        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        itemCount() {
            return this.$store.getters['cart/getCartItemCount']
        },
        totalPrice() {
            return this.$store.getters['cart/getTotal']
        }
    },
    watch: {
        cartSize() {
            if (this.cartSize > 0) {
                this.$nextTick(() => {
                    this.shake()
                })
            }
        }
    },
    mounted(){
         this.$fireAnalytics.logEvent('page_view')
    },
    methods: {
        scrollTo() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },
        shake() {
            document.getElementById('cart').classList.add('shake')
            setTimeout(() => {
                document.getElementById('cart').classList.remove('shake')
            }, 1500)
        }
    }
}
</script>
<style scoped>
  .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }
</style>
