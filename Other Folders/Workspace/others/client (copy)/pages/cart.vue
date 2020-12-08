<template>
    <v-app id="e3">
        <v-app-bar app fixed dark color="blue">
            <v-btn icon @click.stop="$router.go(-1)">
                <v-icon> mdi-arrow-left-bold</v-icon>
            </v-btn>
            <v-toolbar-title>Cart</v-toolbar-title>
        </v-app-bar>
        <v-sheet class="overflow-y-auto" max-height="85vh">
            <v-content>
                <v-container>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12 sm6 md6 lg4 v-if="!isHide">
                            <v-card width="100%">
                                <v-list two-line>
                                    <v-list-item-group v-for="(item, index) in cartItem" :key="item.index">
                                        <v-divider></v-divider>
                                        <v-list-item dense>
                                            <v-list-item-avatar color="grey darken-3">
                                                <v-img class="elevation-6" v-if="item.info.img!=''" :src="item.info.img"></v-img>
                                                <v-avatar class="white--text" v-else color="blue"><strong>{{item.info.name.match(/\b(\w)/g).join('').substr(0,2)}}</strong></v-avatar>
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item.info.name"></v-list-item-title>
                                                <v-list-item-subtitle class="text--primary"><strong>{{computeTotal(item)|toPHP}}</strong></v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-icon @click.stop="removeCart(item)" color="red"> mdi-delete </v-icon>
                                                <v-list-item-action-text><strong>{{computeTotal(item)/item.qty|toPHP}} x {{item.qty}}</strong></v-list-item-action-text>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-simple-table dense>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">Item</th>
                                                        <th class="text-left">Value</th>
                                                        <th class="text-left">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(addon,i) in  computeAddOns(item.add_ons,item.info.base_price)" :key="addon.name+`_`+i+`_`+index">
                                                        <td><strong>{{ addon.name }}</strong></td>
                                                        <td>{{ addon.values }}</td>
                                                        <td>{{ addon.price |toPHP }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                        <v-divider v-if="index + 1 <=cartItem.length" :key="index"></v-divider>
                                    </v-list-item-group>
                                </v-list>
                                <v-card class="shopresponsive" flat width="100%">
                                    <v-divider></v-divider>
                                    <v-list-item dense>
                                        <v-list-item-avatar color="grey darken-3">
                                            <v-img class="elevation-6" v-if="merchant.logo!=''" :src="merchant.logo"></v-img>
                                            <v-avatar class="white--text" v-else color="blue"><strong>{{merchant.business_name.match(/\b(\w)/g).join('').substr(0,2)}}</strong></v-avatar>
                                            <v-img class="elevation-6" :src="merchant.logo"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>Sold by</v-list-item-subtitle>
                                            <v-list-item-title>{{ merchant.business_name }} - <small>{{ merchant.branch }}</small></v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-card-actions> <span class="caption grey--text">Total</span> <span class="red--text"><strong>{{grandtotal|toPHP}}</strong></span>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red" @click.stop="mapSheet=true" outlined>Checkout</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 md4 sm4 lg3 v-if="isHide" class="ma-1">
                            <v-card>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs8 sm8 md8> <strong>Order Value</strong> </v-flex>
                                        <v-flex xs4 sm4 md4> <strong>{{ checkoutPayload.amount.order_value|toPHP }}</strong> </v-flex>
                                        <v-flex xs8 sm8 md8> Delivery Fee - <small>{{ checkoutPayload.delivery.distance.computed }} km</small> </v-flex>
                                        <v-flex xs4 sm4 md4 class="text-end">{{ checkoutPayload.amount.delivery.platform + checkoutPayload.amount.delivery.rider|toPHP }}</v-flex>
                                        <v-flex xs8 sm8 md8> Convenience Fee
                                            <v-tooltip v-model="showtooltip" bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon color="blue" small v-bind="attrs" @click="showtooltip =!showtooltip" v-on="on">mdi-alert-circle-outline</v-icon>
                                                </template> <span>We charging certain amount base on your total order value in order for us to improve our service, provide rider incentives, and give perks and discount to customer.</span> </v-tooltip>
                                        </v-flex>
                                        <v-flex xs4 sm4 md4>{{ checkoutPayload.amount.sc.markup|toPHP }}</v-flex>
                                        <v-divider></v-divider>
                                        <v-flex xs8 sm8 md8> <span class="subheading"><strong>Total</strong></span> </v-flex>
                                        <v-flex xs4 sm4 md4>
                                            <div class="ml-2 red--text"> <strong>{{ checkoutPayload.amount.grandtotal|toPHP }}</strong> </div>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-sheet>
        <v-bottom-sheet inset v-model="mapSheet">
            <v-card flat width="100%">
                <v-card-title>Select Delivery Location</v-card-title>
                <v-card-text>
                    <div class="mapcontainer">
                        <GMap id="gmap" ref="gMap" :center="location" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy'}" :zoom="15" @center_changed="centerChange">
                            <GMapMarker ref="gmapmarker" :position="location" :options="{icon:selectedmarker}"> </GMapMarker>
                        </GMap>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" block @click.stop="preCheckout" outlined>Set Delivery Location</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-snackbar color="blue" v-model="snackbar" :timeout="3000">Item removed from cart</v-snackbar>
    </v-app>
</template>
<script>
export default {
    layout: 'area',
    data() {
        return {
            showtooltip: false,
            isHide: true,
            qty: 1,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            snackbar: false,
            mapSheet: false,
            checkoutPayload: {
                amount: {
                    delivery: {
                        platform: 0,
                        rider: 0
                    },
                    grandtotal: 0,
                    money: 0,
                    order_value: 0,
                    sc: {
                        markup: 0,
                        store: 0,
                    },
                    tip: 0
                },
                assing_rider: 'unassigned',
                coordinates: null,
                status: 'placed',
                delivery: {
                    date: new Date().toISOString().slice(0, 10),
                    distance: {
                        actual: 0,
                        computed: 0
                    },
                    from: {
                        address: '',
                        coord: {
                            lat: 0,
                            lng: 0
                        }
                    },
                    rider_note: "",
                    time: '9:00 AM',
                    to: {
                        address: 0,
                        coord: {
                            lat: 0,
                            lng: 0
                        },
                        unit: ''
                    }
                },
                order: {
                    by: {
                        contact: null,
                        id: null,
                        name: ''
                    },
                    items: [],
                    merchant: {
                        branch: '',
                        id: '',
                        logo: '',
                        name: ''
                    },
                    text: '',
                    time: null
                }
            }
        }
    },
    computed: {
        df() {
            return this.$store.getters['admin/getFare']
        },
        location() {
            return this.$store.getters['map/getLocation']
        },
        grandtotal() {
            return this.$store.getters['cart/getTotal']
        },
        merchant() {
            return this.$store.getters['cart/getStoreID']
        },
        cartItem() {
            return this.$store.getters['cart/getCartData'].items
        },
        storeLocation() {
            return this.$store.getters['cart/getStoreLocation']
        },
    },
    methods: {
        preCheckout() {
            var coordinates = this.$refs.gMap.map.getCenter()
            this.$store.commit('map/setLocation', {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.calculateFees({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        calculateFees(dl) {
            const sl = this.merchant.location
            this.$axios.$get('/distance/', {
                params: {
                    origins: sl.Rc + ',' + sl.Ac,
                    destinations: dl.lat + ',' + dl.lng,
                    key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then((d) => {
                const platform = parseFloat(this.df.fees.distance_platform)
                const rider = parseFloat(this.df.fees.distance_rider)
                const scv = parseFloat(this.df.fees.sc_min_value)
                const md = parseFloat(this.df.fees.min_distance)
                const min_df = parseFloat(this.df.fees.min_df)
                const distance = d.rows[0].elements[0].distance.value
                let df = 0
                let ds = distance / 1000
                if ((distance / 1000) < md) {
                    df = min_df
                } else {
                    let multiplier = (distance / 1000) - md
                    if (multiplier < 1) {
                        multiplier = 1
                    }
                    multiplier = Math.floor(multiplier) + 1
                    df = ((rider + platform) * multiplier) + min_df
                }
                ds = Math.floor(ds) + 1
                var distance_actual = parseFloat(d.rows[0].elements[0].distance.value / 1000).toFixed(2)
                var rider_df = Math.floor(rider * distance_actual)
                var platform_df = Math.floor(df - rider_df)
                var total = parseFloat(this.grandtotal) + rider_df + platform_df + Math.floor(parseFloat((this.merchant.rates.sc * this.grandtotal) / 100).toFixed(2))
                this.checkoutPayload = {
                    amount: {
                        delivery: {
                            platform: platform_df,
                            rider: rider_df
                        },
                        grandtotal: total,
                        money: 0,
                        order_value: this.grandtotal,
                        sc: {
                            markup: Math.floor(parseFloat((this.merchant.rates.sc * this.grandtotal) / 100).toFixed(2)),
                            store: Math.floor(parseFloat((this.merchant.rates.cr * this.grandtotal) / 100).toFixed(2)),
                        },
                        tip: 0
                    },
                    assing_rider: 'unassigned',
                    coordinates: new this.$fireStoreObj.GeoPoint(dl.lat, dl.lng),
                    status: 'placed',
                    delivery: {
                        date: new Date().toISOString().slice(0, 10),
                        distance: {
                            actual: distance_actual,
                            computed: ds
                        },
                        from: {
                            address: d.origin_addresses[0],
                            coord: {
                                lat: sl.lat,
                                lng: sl.lng
                            }
                        },
                        rider_note: "",
                        time: '9:00 AM',
                        to: {
                            address: d.destination_addresses[0],
                            coord: {
                                lat: dl.lat,
                                lng: dl.lng
                            },
                            unit: ''
                        }
                    },
                    order: {
                        by: {
                            contact: null,
                            id: null,
                            name: ''
                        },
                        items: this.cartItem,
                        merchant: {
                            branch: this.merchant.branch,
                            id: this.merchant.id,
                            logo: this.merchant.logo,
                            name: this.merchant.business_name
                        },
                        text: '',
                        time: null
                    }
                }
                console.log(this.checkoutPayload)
                this.isHide = true
            })
        },
        computeAddOns(item, price) {
            var ads = []
            const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
            ads.push({
                name: 'Base Price',
                values: '',
                price: price
            })
            var total = parseFloat(price)
            Object.entries(item).map(([key, val]) => {
                if (Array.isArray(val)) {
                    ads.push({
                        name: capitalize(key),
                        values: '',
                        price: ''
                    })
                    val.forEach(i => {
                        total = total + parseFloat(i.price)
                        ads.push({
                            name: '',
                            values: i.name,
                            price: i.price
                        })
                    })
                } else {
                    total = total + parseFloat(val.price)
                    ads.push({
                        name: capitalize(key),
                        values: val.name,
                        price: val.price
                    })
                }
            })
            ads.push({
                name: '',
                values: 'Total',
                price: parseFloat(total)
            })
            return ads
        },
        removeCart(item) {
            this.$store.commit('cart/remove', item)
            this.snackbar = true
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        computeTotal(item) {
            var total = 0;
            total = total + (item.info.base_price * item.qty)
            var addons = Object.values(item.add_ons)
            addons.forEach(a => {
                if (Array.isArray(a)) {
                    a.forEach(b => {
                        total = total + (b.price * item.qty)
                    })
                } else {
                    total = total + (a.price * item.qty)
                }
            })
            return total
        }
    }
};
</script>
<style scoped>
.mapcontainer,
.GMap,
.GMap__Wrapper {
    max-height: 400px !important;
    width: 100% !important;
}

@media screen and (min-width: 320px) and (max-width: 768px) {
    *>>>.mapcontainer,
    *>>>.GMap,
    *>>>.GMap__Wrapper {
        height: 100vw !important;
        width: 100vw !important;
        max-height: 100vw !important;
        max-width: 100% !important;
    }
}
</style>
