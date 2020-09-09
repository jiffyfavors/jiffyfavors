<template>
    <v-card width="100%" height="100%">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="#00aff0" /> <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2320510864924437&ev=PageView&noscript=1" />
        <v-app-bar app fixed dark color="#00aff0">
            <v-btn icon @click.stop="$router.go(-1)">
                <v-icon> mdi-arrow-left-bold</v-icon>
            </v-btn>
            <v-toolbar-title>Cart</v-toolbar-title>
        </v-app-bar>
        <client-only>
            <v-sheet class="overflow-y-auto" max-height="85vh">
                <v-content>
                    <v-container>
                        <v-layout wrap justify-center align-center text-left>
                            <v-flex v-if="isHide && cartSize < 1" xs12 md4 sm4 lg3 class="text-center">
                                <v-icon class="mb-2" color="success" size="200"> mdi-checkbox-marked-circle </v-icon>
                                <blockquote class="blockquote mb-5">
                                    <span style="font-size:50px;">&#128523;</span>
                                    <h4>Order Completed</h4> </blockquote>
                                <footer>
                                    <v-btn outlined text block to="/transactions" color="red"> View Orders </v-btn>
                                </footer>
                            </v-flex>
                            <v-flex v-if="!isHide && cartSize < 1" xs12 md4 sm4 lg3 class="text-center">
                                <v-icon class="mb-2" color="red" size="200"> mdi-cart-off </v-icon>
                                <blockquote class="blockquote">
                                    <span style="font-size:50px;">&#128546;</span>
                                    <h4>Your cart is lonely</h4> </blockquote>
                                <footer>
                                    <v-btn outlined text block to="/" color="red"> Shop Now </v-btn>
                                </footer>
                            </v-flex>
                            <v-flex v-if="!isHide && cartSize > 0" xs12 sm6 md6 lg4>
                                <v-card width="100%">
                                    <v-list two-line>
                                        <v-list-item-group v-for="(item, index) in cartItem" :key="item.index">
                                            <v-divider />
                                            <v-list-item dense>
                                                <v-list-item-avatar color="grey darken-3">
                                                    <v-img v-if="item.info.img != ''" class="elevation-6" :src="item.info.img" />
                                                    <v-avatar v-else class="white--text" color="blue"> {{ item.info.name .match(/\b(\w)/g) .join('') .substr(0, 2) }} </v-avatar>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title v-text="item.info.name" />
                                                    <v-list-item-subtitle class="red--text"> {{ computeTotal(item) | toPHP }} </v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-list-item-action-text> {{ (computeTotal(item) / item.qty) | toPHP }} x {{ item.qty }} </v-list-item-action-text>
                                                    <v-icon small color="red" @click.stop="removeCart(item)"> mdi-delete </v-icon>
                                                </v-list-item-action>
                                            </v-list-item>
                                            <v-simple-table dense>
                                                <template #default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left"> Item </th>
                                                            <th class="text-left"> Value </th>
                                                            <th class="text-left"> Price </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(addon, i) in computeAddOns(
                                item.add_ons,
                                item.info.base_price
                              )" :key="addon.name + `_` + i + `_` + index">
                                                            <td>{{ addon.name }}</td>
                                                            <td>{{ addon.values }}</td>
                                                            <td v-if="addon.price>0">{{ addon.price | toPHP }}</td>
                                                            <td v-if="addon.price<1">-</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                            <v-divider v-if="index + 1 <= cartItem.length" :key="index" /> </v-list-item-group>
                                    </v-list>
                                </v-card>
                            </v-flex>
                            <v-flex v-if="isHide && cartSize > 0" xs12 md4 sm4 lg3 class="ma-1">
                                <v-card>
                                    <v-card-text>
                                        <v-layout wrap>
                                            <v-flex xs8 sm8 md8 class="subtitle-2"> Order Value </v-flex>
                                            <v-flex xs4 sm4 md4> {{ checkoutPayload.amount.order_value | toPHP }} </v-flex>
                                            <v-flex xs8 sm8 md8> Delivery Fee -
                                                <small> {{ checkoutPayload.delivery.distance.computed }} km </small>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4 class="text-end"> {{ (checkoutPayload.amount.delivery.platform + checkoutPayload.amount.delivery.rider) | toPHP }} </v-flex>
                                            <v-flex xs8 sm8 md8> Convenience Fee </v-flex>
                                            <v-flex xs4 sm4 md4 class="text-end"> {{ checkoutPayload.amount.sc.markup |toPHP}} </v-flex>
                                              <v-divider></v-divider>
                                            <v-flex xs8 sm8 md8>
                                                <v-text-field text append-icon="mdi-ticket-percent" v-model="promoCode" solo dense small class="mr-2" placeholder="Promo Code" label="Promo Code"></v-text-field>
                                            </v-flex>
                                          
                                            <v-flex xs4 sm4 md4>
                                                <v-btn outlined color="green" @click.stop="findVoucher()">Apply</v-btn>
                                            </v-flex>
                                            <v-flex xs8 sm8 md8 v-if="promoCodeStatus.accepted" class="subtitle-2">Discount - {{promoCodeStatus.status.code}} </v-flex>
                                            <v-flex xs4 sm4 md4 v-if="promoCodeStatus.accepted"> {{promoCodeStatus.status.value }} </v-flex>
                                            <v-flex xs8 sm8 md8 v-if="promoCodeStatus.accepted">
                                                <span class="subheading">Subtotal</span>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4 v-if="promoCodeStatus.accepted"> {{ checkoutPayload.amount.grandtotal | toPHP }} </v-flex>
                                            <v-flex xs8 sm8 md8 class="subtitle-2" v-if="promoCodeStatus.accepted"> Amount </v-flex>
                                            <v-flex xs4 sm4 md4 v-if="promoCodeStatus.accepted"> - {{promoCodeStatus.status.computed|toPHP}} </v-flex>
                                            <v-flex xs12 v-if="promoCodeStatus.accepted == false">
                                                <v-alert type="error">{{promoCodeStatus.status}}</v-alert>
                                            </v-flex>
                                            <v-flex xs8 sm8 md8 v-if="!promoCodeStatus.accepted">
                                                <span class="subheading">Grandtotal</span>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4 v-if="!promoCodeStatus.accepted">
                                                <div class="ml-2 red--text">
                                                    <strong>{{ checkoutPayload.amount.grandtotal | toPHP }}</strong>
                                                </div>
                                            </v-flex>
                                            <v-flex xs8 sm8 md8 v-if="promoCodeStatus.accepted">
                                                <span class="subheading">Grandtotal</span>
                                            </v-flex>
                                            <v-flex xs4 sm4 md4 v-if="promoCodeStatus.accepted">
                                                <div class="ml-2 red--text">
                                                    <strong>{{ checkoutPayload.amount.grandtotal - promoCodeStatus.status.computed | toPHP }}</strong>
                                                </div>
                                            </v-flex>
                                            <v-list nav outlined tile width="100%" dense>
                                                <v-divider />
                                                <v-list-item id="needAuth" dense>
                                                    <v-list-item-icon>
                                                        <v-icon color="red"> mdi-cellphone </v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{ checkoutPayload.order.by.name }} {{ checkoutPayload.order.by.contact }} </v-list-item-title>
                                                        <v-list-item-subtitle> Contact Information </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <v-list-item-action @click.stop="authDiag = true">
                                                        <v-icon color="red"> mdi-chevron-right </v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                                <v-divider />
                                                <v-list-item id="needAddr">
                                                    <v-list-item-icon>
                                                        <v-icon color="red"> mdi-map </v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{ checkoutPayload.delivery.to.address }} </v-list-item-title>
                                                        <v-list-item-subtitle> Delivery Address </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <v-list-item-action @click.stop="addressDiag = true">
                                                        <v-icon color="red"> mdi-chevron-right </v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                                <v-divider />
                                                <v-list-item id="needDeli">
                                                    <v-list-item-icon>
                                                        <v-icon color="red"> mdi-clock </v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{ delivery_date.label }}, {{ delivery_date.day_name.substring(0, 3) }} {{ delivery_date.name }} {{ delivery_date.day }} {{ checkoutPayload.delivery.time }} </v-list-item-title>
                                                        <v-list-item-subtitle> Delivery Time </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <v-list-item-action @click.stop="generateDates(), (timediag = true)">
                                                        <v-icon color="red"> mdi-chevron-right </v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                                <v-divider />
                                                <v-list-item id="needMoney">
                                                    <v-list-item-icon>
                                                        <v-icon color="red"> mdi-cash-multiple </v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{ checkoutPayload.amount.money | toPHP }} </v-list-item-title>
                                                        <v-list-item-subtitle> Your money
                                                            <v-tooltip v-model="moneytooltip" bottom>
                                                                <template #activator="{ on, attrs }">
                                                                    <v-icon color="blue" small v-bind="attrs" @click="moneytooltip = !moneytooltip" v-on="on"> mdi-alert-circle-outline </v-icon>
                                                                </template>
                                                                <span> So our rider can prepare exact change for you. </span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <v-list-item-action @click.stop="moneydiag = true">
                                                        <v-icon color="red"> mdi-chevron-right </v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                                <v-divider />
                                                <v-list-item>
                                                    <v-list-item-icon>
                                                        <v-icon color="red"> mdi-cash-100 </v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{ checkoutPayload.amount.tip | toPHP }} </v-list-item-title>
                                                        <v-list-item-subtitle> Rider tip(Optional)
                                                            <v-tooltip v-model="ridertooltip" bottom>
                                                                <template #activator="{ on, attrs }">
                                                                    <v-icon color="blue" small v-bind="attrs" @click="ridertooltip = !ridertooltip" v-on="on"> mdi-alert-circle-outline </v-icon>
                                                                </template>
                                                                <span> Appreciate your rider effort. Give him tip. </span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <v-list-item-action @click.stop="tipdiag = true">
                                                        <v-icon color="red"> mdi-chevron-right </v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                                <v-divider /> </v-list>
                                            <v-alert type="info">We accept CASH on Delivery, GCASH, Paymaya, Coins.ph. Your rider will instruct you how to Pay on non COD payment.</v-alert>
                                        </v-layout>
                                        <v-btn block color="red" class="shopresponsive" outlined @click="confirmOrder()"> Confirm Order </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-content>
            </v-sheet>
            <v-row justify="center">
                <v-bottom-sheet v-model="addressDiag" scrollable>
                    <v-card tile height="600px">
                        <v-card-title primary-title> Delivery Address </v-card-title>
                        <v-card-text>
                            <v-flex xs12 md12 sm12>
                                <v-textarea v-model="checkoutPayload.delivery.to.address" a hint="Pls type 'NA' if not applicable" label="Address" outlined placeholder="Address" /> </v-flex>
                            <v-flex xs12 md12 sm12>
                                <v-text-field v-model="checkoutPayload.delivery.to.unit" a hint="Pls type 'NA' if not applicable" label="Floor/Unit/Room No." persistent-hint outlined /> </v-flex>
                            <v-flex xs12 md12 sm12>
                                <v-textarea v-model="checkoutPayload.delivery.to.rider_note" hint="Pls type 'NA' if not applicable" label="Note to rider" outlined placeholder="eg. Landmark/ Building" /> </v-flex>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn tile outlined color="red" @click="addressDiag = false"> Apply Changes </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="timediag" width="500px" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Delivery Date & Time</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-layout wrap>
                                    <v-flex xs12 md6 lg6 sm6>
                                        <v-select v-model="delivery_date" flat :items="dates" return-object label="Delivery Date">
                                            <template #selection="data"> {{ data.item.label }}, {{ data.item.day_name }} {{ data.item.name }} {{ data.item.day }} </template>
                                            <template #item="data"> {{ data.item.label }}, {{ data.item.day_name }} {{ data.item.name }} {{ data.item.day }} </template>
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 md6 lg6 sm6>
                                        <v-select v-model="checkoutPayload.delivery.time" flat :items="delivery_date.delivery_time" label="Delivery Time" /> </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="blue darken-1" text @click="timediag = false"> Save </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="mapSheet" inset>
                    <v-card flat>
                        <v-card-title>Select Delivery Location</v-card-title>
                        <v-card-text>
                            <div class="mapcontainer">
                                <GMap id="gmap" ref="gMap" :center="location" :options="{
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  zoomControl: true,
                  gestureHandling: 'greedy'
                }" :zoom="15" @center_changed="centerChange">
                                    <GMapMarker ref="gmapmarker" :position="location" :options="{ icon: selectedmarker }" /> </GMap>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="red" block outlined @click.stop="preCheckout"> Set Delivery Location </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="moneydiag" width="500px" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Your money</span>
                        </v-card-title>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12 md12 sm12>
                                    <v-text-field v-model="checkoutPayload.amount.money" right type="number" dense solo label="Your Money" outlined placeholder="Your Money" /> </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn tile outlined :disabled="
                checkoutPayload.amount.money < checkoutPayload.amount.grandtotal - promoCodeStatus.value
              " color="red" @click="moneydiag = false"> Apply Changes </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="authDiag">
                    <v-card flat>
                        <v-card-title>Contact Info</v-card-title>
                        <v-card-text>
                            <fire-ui /> </v-card-text>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="tipdiag" width="500px" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Rider Tip</span>
                        </v-card-title>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12 md12 sm12>
                                    <v-text-field v-model="checkoutPayload.amount.tip" right type="number" dense solo label="Rider Tip" outlined placeholder="Amount of tip" /> </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn tile outlined :disabled="checkoutPayload.amount.tip < 0" color="red" @click="tipdiag = false"> Apply Changes </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
            </v-row>
            <v-snackbar v-model="snackbar" color="blue" :timeout="3000"> Item removed from cart </v-snackbar>
            <v-card class="shopresponsive" v-if="!isHide && cartSize > 0" width="100%">
                <permission></permission>
                <v-divider />
                <v-list-item dense>
                    <v-list-item-avatar color="grey darken-3">
                        <v-img contain v-if="merchant.logo != ''" class="elevation-6" :src="merchant.logo" />
                        <v-avatar v-else class="white--text" color="blue"> {{ merchant.business_name .match(/\b(\w)/g) .join('') .substr(0, 2) }} </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <small>Sold by</small>
                        </v-list-item-subtitle>
                        <v-list-item-title> {{ merchant.business_name }} </v-list-item-title>
                        <v-list-item-subtitle> {{ merchant.branch }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-list-item-action-text>
                            <span class="caption grey--text">Total</span>
                            <span class="red--text subtitle-2">{{ grandtotal | toPHP }}</span>
                        </v-list-item-action-text>
                        <v-btn color="red" small outlined @click.stop="initCheckout()"> Checkout </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card>
        </client-only>
    </v-card>
</template>
<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoFirestore
} from 'geofirestore'
import FireUi from '~/components/FireUi.vue'
import Permission from '~/components/Permission.vue'
export default {
    components: {
        FireUi,
        Loading,
        Permission
    },
    layout: 'area',
    data() {
        return {
            userProfile: {},
            isLoading: false,
            moneytooltip: false,
            ridertooltip: false,
            promoCode: '',
            delivery_date: {
                delivery_time: [],
                label: 'Today',
                day_name: ''
            },
            promoCodeStatus: {
                accepted: null,
                status: '',
                value: 0,
            },
            isValid: false,
            dates: [],
            showtooltip: false,
            authDiag: false,
            timediag: false,
            moneydiag: false,
            tipdiag: false,
            isHide: false,
            addressDiag: false,
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
                        store: 0
                    },
                    tip: 0
                },
                rider: 'unassigned',
                coordinates: null,
                status: 'placed',
                delivery: {
                    date: '',
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
                    rider_note: '',
                    time: '',
                    to: {
                        address: '',
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
        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        user() {
            return this.$store.getters['auth/getUser']
        },
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
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
        }
    },
    watch: {
        isAuth() {
            if (this.isAuth) {
                this.checkoutPayload.order.by = {
                    contact: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
                this.$bind('userProfile', this.$fireStoreObj().collection('users').doc(this.user.id))
                this.authDiag = false
            }
        },
        user() {
            if (this.isAuth) {
                this.checkoutPayload.order.by = {
                    contact: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
                this.authDiag = false
            }
        },
        authDiag() {
            if (this.isAuth) {
                this.checkoutPayload.order.by = {
                    contact: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
            }
        },
        delivery_date(val) {
            this.checkoutPayload.delivery.date = val.date
        }
    },
    mounted() {
        this.$fireAnalytics.logEvent('page_view')
        if (this.isAuth) {
            this.checkoutPayload.order.by = {
                contact: this.user.phoneNumber,
                id: this.user.id,
                name: this.user.displayName
            }
            this.authDiag = false
        }
        const GMapSettings = {
            apiKey: this.$GMaps.apiKey,
            language: this.language
        }
        const google = GoogleMapsApiLoader(GMapSettings)
        this.$GMaps.google = google
        if (("Notification" in window) && Notification.permission === "granted") {
            this.$getLocation({
                enableHighAccuracy: true,
                timeout: 10000
            }).then((coordinates) => {
                this.$store.commit('map/setLocation', {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                })
            }, (error) => {
                this.isLoading = false
                console.log(error)
            })
        }
        else {
            this.isLoading = false
        }
    },
    methods: {
        findVoucher() {
            this.promoCode = this.promoCode.toUpperCase().replace(/ /g, '')
            this.$fireStoreObj().collection('voucher_codes').where('promoCode', '==', this.promoCode).get().then((snap) => {
                if (snap.empty) {
                    delete this.checkoutPayload.amount.deduction
                    this.promoCodeStatus = {
                        accepted: false,
                        status: 'Promo Code is invalid',
                        value: 0
                    }
                }
                else {
                    snap.docs.forEach(codes => {
                        if (codes.data().merchantCode && (codes.data().stores).indexOf(this.merchant.id) > -1) {
                            if (this.checkoutPayload.amount.order_value >= codes.data().MOV) {
                                this.checkoutPayload.amount.deduction = {
                                    type: 'Promo Code',
                                    charged_to: 'merchant',
                                    value: codes.data().type == 'Percent' ? codes.data().value + '%' : 'Less P ' + codes.data().value,
                                    code: codes.data().promoCode,
                                    computed: codes.data().type == 'Percent' ? (this.checkoutPayload.amount.order_value * (codes.data().value / 100)) : (codes.data().value)
                                }
                                this.promoCodeStatus = {
                                    accepted: true,
                                    status: this.checkoutPayload.amount.deduction,
                                    value: codes.data().type == 'Percent' ? (this.checkoutPayload.amount.order_value * (codes.data().value / 100)) : (codes.data().value)
                                }
                            } else {
                                this.promoCodeStatus = {
                                    accepted: false,
                                    status: 'Below Minimum Order Value. Order atleast P' + codes.data().MOV,
                                    value: 0
                                }
                            }
                        } else if (codes.data().platformCode) {
                            if (this.checkoutPayload.amount.order_value >= codes.data().MOV) {
                                this.checkoutPayload.amount.deduction = {
                                    type: 'Promo Code',
                                    charged_to: 'platform',
                                    value: codes.data().type == 'Percent' ? codes.data().value + '%' : 'Less P ' + codes.data().value,
                                    code: codes.data().promoCode,
                                    computed: codes.data().type == 'Percent' ? (this.checkoutPayload.amount.order_value * (codes.data().value / 100)) : (codes.data().value)
                                }
                                this.promoCodeStatus = {
                                    accepted: true,
                                    status: this.checkoutPayload.amount.deduction,
                                    value: codes.data().type == 'Percent' ? (this.checkoutPayload.amount.order_value * (codes.data().value / 100)) : (codes.data().value)
                                }
                            } else {
                                this.promoCodeStatus = {
                                    accepted: false,
                                    status: 'Below Minimum Order Value. Order atleast P' + codes.data().MOV,
                                    value: 0
                                }
                            }
                        }
                        else {
                            this.promoCodeStatus = {
                                accepted: false,
                                status: 'Promo Code is invalid',
                                value: 0,
                            }
                        }
                    })
                }
            })
        },
        initCheckout() {
            if (!this.isAuth) this.authDiag = true
            else this.mapSheet = true
        },
        attemptLogin() {
            if (!this.isAuth) {
                this.authDiag = true
            }
        },
        confirmOrder() {
            this.isValid = true
            if (!this.isAuth) this.shaker('needAuth')
            if (this.checkoutPayload.delivery.to.address === '' || this.checkoutPayload.delivery.to.unit === '') this.shaker('needAddr')
            if (this.checkoutPayload.delivery.date === '' || this.checkoutPayload.delivery.time === '') this.shaker('needDeli')
            if (this.checkoutPayload.amount.money < this.grandtotal - this.promoCodeStatus.value) this.shaker('needMoney')
            if (this.isValid) {
                this.isLoading = true
                const firestore = this.$fireStoreObj()
                const geofirestore = new GeoFirestore(firestore)
                const geocollection = geofirestore.collection('orders')
                this.checkoutPayload.area = this.df.id
                this.checkoutPayload.timestamp = this.$generateTimestamp(this.checkoutPayload.delivery.date, this.checkoutPayload.delivery.time)
                this.checkoutPayload.token = this.$store.getters['auth/getFCMToken']
                this.checkoutPayload.order.by = {
                    contact: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
                let tid = this.generateBookingId()
                geocollection.doc(tid).set(this.checkoutPayload).then((d) => {
                    this.$fireAnalytics.logEvent('purchase', {
                        transaction_id: tid,
                        value: this.grandtotal,
                        currency: 'PHP',
                        items: this.cartItem
                    })
                    this.$store.commit('cart/clearCart')
                    this.isLoading = false
                }).catch((e) => {
                    this.isLoading = false
                })
            }
        },
        shaker(id) {
            this.isValid = false
            document.getElementById(id).classList.add('shake')
            setTimeout(() => {
                document.getElementById(id).classList.remove('shake')
            }, 1500)
        },
        generateDates() {
            const today = this.addDays(new Date(), 0)
            const tomorrow = this.addDays(new Date(), 1)
            const nextday = this.addDays(new Date(), 2)
            let now = new Date(this.$getNow()).getTime()
            let close = new Date(this.$getNow().substring(0, 10) + ' ' + this.merchant.delivery.close)
            if (now < close) {
                this.dates = [today, tomorrow, nextday]
            } else {
                this.dates = [tomorrow, nextday]
            }
            for (let i = 3; i <= 6; i++) this.dates.push(this.addDays(new Date(), i))
        },
        addDays(date, days) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            const label = ['Today', 'Tomorrow', 'Advanced Order']
            const result = new Date(date)
            result.setDate(result.getDate() + days)
            if (days === 2) {
                label.push(dayNames[result.getDay()])
            }
            let delivery_time = []
            let now = new Date(this.$getNow()).getTime()
            let close = new Date(this.$getNow().substring(0, 10) + ' ' + this.merchant.delivery.close)
            let open = new Date(this.$getNow().substring(0, 10) + ' ' + this.merchant.delivery.open)
            if (days === 0) {
                if (now < close && now > open) delivery_time = this.$timeRange(this.$formatAMPM(new Date()), this.merchant.delivery.close, 45)
                else delivery_time = this.$timeRange(this.merchant.delivery.open, this.merchant.delivery.close, 45)
                delivery_time.unshift('ASAP')
            } else {
                delivery_time = this.$timeRange(this.merchant.delivery.open, this.merchant.delivery.close, 45)
            }
            return {
                date: result.toISOString().slice(0, 10),
                name: monthNames[result.getMonth()],
                day: result.getDate(),
                day_name: dayNames[result.getDay()],
                label: days < 2 ? label[days] : label[2],
                delivery_time
            }
        },
        preCheckout() {
            this.isLoading = true
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$store.commit('map/setLocation', {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.$store.dispatch('admin/getArea', {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            }).then(() => {
                let sl = {
                    lat: 0,
                    lng: 0
                }
                if (this.merchant.location.hasOwnProperty('Ac')) {
                    sl = {
                        lat: this.merchant.location.Rc,
                        lng: this.merchant.location.Ac
                    }
                }
                if (this.merchant.location.hasOwnProperty('_lat')) {
                    sl = {
                        lat: this.merchant.location._lat,
                        lng: this.merchant.location._long
                    }
                }
                if (this.merchant.location.hasOwnProperty('latitude')) {
                    sl = {
                        lat: this.merchant.location.latitude,
                        lng: this.merchant.location.longitude
                    }
                }
                const dl = {
                    lat: coordinates.lat(),
                    lng: coordinates.lng()
                }
                this.calculateFees(dl, sl)
            })
        },
        generateBookingId() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let result = 'OR-'
            for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
            return result
        },
        calculateFees(dl, sl) {
            console.log(dl, sl)
            this.$axios.$get('/distance/', {
                params: {
                    origins: sl.lat + ',' + sl.lng,
                    destinations: dl.lat + ',' + dl.lng,
                    key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then((d) => {
                this.isLoading = false
                const platform = parseFloat(this.df.fees.food.distance_platform)
                const rider = parseFloat(this.df.fees.food.distance_rider)
                const scv = parseFloat(this.df.fees.food.sc_min_value)
                const md = parseFloat(this.df.fees.food.min_distance)
                const min_df = parseFloat(this.df.fees.food.min_df)
                const fixed_rider_fee = parseFloat(this.df.fees.food.rider_fixed_fee)
                const distance = d.rows[0].elements[0].distance.value
                let df = 0
                let ds = distance / 1000
                if (distance / 1000 < md) {
                    df = min_df
                } else {
                    let multiplier = distance / 1000 - md
                    if (multiplier < 1) {
                        multiplier = 1
                    }
                    multiplier = Math.floor(multiplier) + 1
                    df = (rider + platform) * multiplier + min_df
                }
                ds = Math.floor(ds) + 1
                const distance_actual = parseFloat(d.rows[0].elements[0].distance.value / 1000).toFixed(2)
                let rider_df = 0
                if (distance_actual <= md) rider_df = fixed_rider_fee
                else rider_df = fixed_rider_fee + ((distance_actual - md) * rider)
                rider_df = Math.floor(rider_df)
                let platform_df = Math.floor(df - rider_df)
                let sc = Math.floor(parseFloat(
                    (this.merchant.rates.sc * this.grandtotal) / 100).toFixed(2))
                if (sc < scv) sc = scv
                const total = parseFloat(this.grandtotal) + rider_df + platform_df + sc
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
                            markup: sc,
                            store: Math.floor(parseFloat(
                                (this.merchant.rates.cr * this.grandtotal) / 100).toFixed(2))
                        },
                        tip: 0
                    },
                    rider: 'unassigned',
                    coordinates: new this.$fireStoreObj.GeoPoint(dl.lat, dl.lng),
                    status: 'placed',
                    delivery: {
                        date: '',
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
                        rider_note: '',
                        time: '',
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
                        time: new Date()
                    }
                }
                console.log(this.checkoutPayload)
                if (this.isAuth) {
                    this.checkoutPayload.order.by = {
                        contact: this.user.phoneNumber,
                        id: this.user.id,
                        name: this.user.displayName
                    }
                }
                this.$fireAnalytics.logEvent('begin_checkout', {
                    value: this.grandtotal,
                    currency: 'PHP',
                    items: this.cartItem
                })
                this.mapSheet = false
                this.isHide = true
            }).catch((e) => {
                console.log(e)
                this.mapSheet = false
                this.isHide = true
            })
        },
        computeAddOns(item, price) {
            const ads = []
            const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
            ads.push({
                name: 'Base Price',
                values: '',
                price
            })
            let total = parseFloat(price)
            Object.entries(item).map(([key, val]) => {
                if (Array.isArray(val)) {
                    ads.push({
                        name: capitalize(key),
                        values: '',
                        price: 0
                    })
                    val.forEach((i) => {
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
            let total = 0
            total = total + item.info.base_price * item.qty
            const addons = Object.values(item.add_ons)
            addons.forEach((a) => {
                if (Array.isArray(a)) {
                    a.forEach((b) => {
                        total = total + b.price * item.qty
                    })
                } else {
                    total = total + a.price * item.qty
                }
            })
            return total
        }
    }
};
</script>
<style scoped>
  .shake {
    border: 2px solid red;
  }
</style>
