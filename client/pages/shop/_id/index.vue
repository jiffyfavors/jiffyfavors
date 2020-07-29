<template>
    <v-app id="e3">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
        <v-app-bar color="#00aff0" dark shrink-on-scroll prominent :src="business.backdrop" fade-img-on-scroll scroll-target="#scrolling-techniques-3" scroll-threshold="300" fixed app>
            <template #img="{ props }">
                <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)" /> </template>
            <v-btn icon to="/bills_payment">
                <v-icon> mdi-arrow-left-bold</v-icon>
            </v-btn>
            <v-toolbar-title>{{ business.business_name }}
                <small>{{business.branch}}</small>
            </v-toolbar-title>
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
        </v-app-bar>
        <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="100vh">
            <v-container v-if="aptconfimed" fluid>
                <v-content>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12 md4 sm4 lg3 class="text-center">
                            <v-icon class="mb-2" color="success" size="200"> mdi-checkbox-marked-circle </v-icon>
                            <blockquote class="blockquote mb-5">
                                <span style="font-size:50px;">&#128523;</span>
                                <h4>List Submitted. Thank You for Shopping</h4> </blockquote>
                            <footer>
                                <v-btn outlined text block to="/transactions" color="red">Track Shopping</v-btn>
                            </footer>
                        </v-flex>
                    </v-layout>
                </v-content>
            </v-container>
            <v-container v-if="!aptconfimed" fluid>
                <v-content>
                    <h3>Shop at {{business.business_name}} <small>{{business.branch}}</small> with Jiffy Rider Shopper.</h3>
                    <v-row justify="center">
                        <v-expansion-panels v-model="faq" inset>
                            <v-expansion-panel value="0">
                                <v-expansion-panel-header>How it works?</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>Shop at {{business.business_name}} bill without leaving the comfort of your home or office. Let our
                                        <strong>Jiffy Rider Shopper</strong> handle the buying for you.
                                        <strong>No more waiting in line.</strong>
                                        <strong>You can see the prices in realtime while your rider shop for you.</strong>
                                    </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>Shopping Procedure</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <ol>
                                        <li value="1">Create a List of Items you want to buy at {{business.business_name}} using the create list below.</li>
                                        <li>Submit your list and wait for the rider to accept the job.</li>
                                        <li>Your rider will proceed to
                                            <strong>{{business.business_name}}</strong> to buy item on the list.</li>
                                        <li>You will see the price real time as your rider shop for you.</li>
                                        <li>You can add or remove item from the list as long as the rider not yet paid the item.</li>
                                        <li>The rider will proceed with the payment and head your delivery location.</li>
                                        <li>Pay your rider with the total item on the list plus the computed service and delivery fee.</li>
                                    </ol>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>Service Fee</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>The cost of service is
                                        <strong>{{business.rates.sc}} %</strong> plus
                                        <strong>per km rate</strong> for travelled distance from {{business.business_name}}-{{business.branch}} to your delivery location. </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </v-content>
            </v-container>
        </v-sheet>
        <v-bottom-sheet :persistent="calculated" v-model="bsAppointment">
            <v-card v-if="!calculated">
                <v-card-title>Delivery Location</v-card-title>
                <v-card-text>
                    <div class="mapcontainer">
                        <GMap id="gmap" ref="gMap" :center="mylocation" :options="options" :zoom="15" @center_changed="centerChange">
                            <GMapMarker ref="gmapmarker" :position="mylocation" :options="{ icon: selectedmarker }" /> </GMap>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined @click.stop="reqQoute()" text color="blue" block class="ma-1">Next</v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-if="calculated">
                <v-card-title>
                    <v-btn icon @click.stop="calculated = false" small>
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>Submit List </v-card-title>
                <v-card-text>
                    <v-list nav outlined tile width="100%" dense>
                        <v-list-item id="needAuth" dense>
                            <v-list-item-icon>
                                <v-icon color="red"> mdi-cellphone </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title> {{ contact.name }} {{ contact.number }} </v-list-item-title>
                                <v-list-item-subtitle> Contact Information </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action @click.stop="attemptLogin()">
                                <v-icon color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="needDeli">
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-clock </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title> {{ delivery_date.label }}, {{ delivery_date.day_name.substring(0, 3) }} {{ delivery_date.name }} {{ delivery_date.day }} {{delivery_date.time}} </v-list-item-title>
                                <v-list-item-subtitle>Time</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon color="red" @click.stop="generateDates(), (timediag = true)"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="needEst" dense>
                            <v-list-item-icon>
                                <v-icon color="red"> mdi-cash-multiple </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{estimate|toPHP}} </v-list-item-title>
                                <v-list-item-subtitle>Your shopping estimate</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action @click.stop="needEst = true">
                                <v-icon color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="dropoff" dense>
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{fees.address}}</v-list-item-title>
                                <v-list-item-subtitle> Delivery Location </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon color="red" @click.stop="currentLocation = fees , addrText='Delivery', addressDiag = true"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-simple-table dense>
                        <template #default>
                            <tbody>
                                <tr>
                                    <td>Service Fee</td>
                                    <td>{{business.rates.sc}} % plus Total</td>
                                </tr>
                                <tr>
                                    <td>Delivery Fee ({{fees.distance.computed}} km)</td>
                                    <td>{{fees.fees.rider + fees.fees.platform|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="red--text">
                                            <strong>Total</strong>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="red--text">
                                            <strong>{{fees.fees.rider + fees.fees.platform|toPHP}}</strong> plus
                                            <strong>{{business.rates.sc}} %</strong> of Total Item Values </span>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined @click.stop="bsQoute = true" color="blue" width="45%" class="ma-1">View List</v-btn>
                    <v-btn outlined @click.stop="preConfirmAppointment()" color="blue" width="45%" class="ma-1">Submit List</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="addNewItem">
            <v-card>
                <v-card-title>{{mode=='add' ? 'Add Item to List' : 'Edit Item'}}</v-card-title>
                <v-card-text>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12 md12 sm12 lg12 class="text-center">
                            <v-textarea rows="3" label="Item description" outlined v-model="shopitem.desc" placeholder="eg. Brand, Color, etc."></v-textarea>
                        </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <v-text-field type="number" label="Measure" v-model="shopitem.measure" dense></v-text-field>
                        </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <v-select dense v-model="shopitem.unit" flat :items="units" label="Unit" item-text="name" item-value="value" /> </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <span class="caption grey--text"> Qty </span>
                            <v-icon class="white--text" color="red" @click="shopitem.qty = shopitem.qty < 1 ? 1 : shopitem.qty - 1"> mdi-minus </v-icon> {{shopitem.qty}}
                            <v-icon class="white--text" color="green" @click="shopitem.qty = shopitem.qty + 1"> mdi-plus </v-icon>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="addItem()" block>{{mode=='add' ? 'Add Item to List' : 'Update Item'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="bsQoute" fullscreen persistent>
            <v-card style="height: 100vh;">
                <v-card-title>Create Shopping List</v-card-title>
                <v-card-text>
                    <v-list two-line>
                        <v-list-item-group v-for="(item, index) in list" :key="index">
                            <v-list-item dense>
                                <v-list-item-content @click.stop="item_copy = Object.assign({},item), shopitem = Object.assign({},item), mode= 'edit', editIndex = index, addNewItem = true">
                                    <v-list-item-title v-text="item.desc"></v-list-item-title>
                                    <v-list-item-subtitle class="red--text"> {{item.measure}} {{item.unit}} x {{item.qty}} = {{item.measure * item.qty}} {{item.unit}} ({{item.measure}} {{item.unit}}/unit ) </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-icon small color="red" @click.stop="$store.commit('cart/removeFromList', index)"> mdi-delete </v-icon>
                                </v-list-item-action>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-list-item-group>
                    </v-list>
                    <v-fab-transition>
                        <v-btn color="pink" dark small @click.stop="mode='add' ,addNewItem = true" absolute bottom right style="margin-bottom: 100px;" fab>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="bsQoute=false" block>I'm Finish</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="addressDiag" scrollable>
            <v-card tile>
                <v-card-title primary-title> {{addrText}} Address </v-card-title>
                <v-card-text>
                    <v-flex xs12 md12 sm12>
                        <v-textarea v-model="currentLocation.address" a hint="Pls type 'NA' if not applicable" label="Address" outlined placeholder="Address" /> </v-flex>
                    <v-flex xs12 md12 sm12>
                        <v-text-field v-model="currentLocation.landmark" a hint="Pls type 'NA' if not applicable" label="Floor/Unit/Room No. or Landmark" persistent-hint outlined /> </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-btn tile outlined block color="red" @click="addressDiag=false"> Apply Changes </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="needEst" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Your shopping Estimate</span>
                </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 md12 sm12>
                            <v-text-field v-model="estimate" right type="number" dense solo label="Your shopping estimate" outlined placeholder="Estimate" /> </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn tile outlined :disabled="
                 estimate <0
              " color="red" @click="needEst = false"> Apply Changes </v-btn>
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
        <v-bottom-sheet v-model="timediag" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Appointment Time</span>
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
                                <v-select v-model="delivery_date.time" flat :items="delivery_date.delivery_time" label="Delivery Time" /> </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="timediag = false"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-card v-show="isLoaded" v-if="!aptconfimed" class="shopresponsive" width="100%">
            <v-card-text>
                <v-btn outlined @click.stop="bsQoute = true" color="blue" width="45%" class="ma-1">Create List</v-btn>
                <v-btn outlined @click.stop="bsAppointment = true" color="blue" width="45%" class="ma-1">Submit List</v-btn>
            </v-card-text>
        </v-card>
    </v-app>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoCollectionReference
}
from 'geofirestore'
import FireUi from '~/components/FireUi.vue'
import GoogleMapsApiLoader from 'google-maps-api-loader'
export default {
    components: {
        FireUi,
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
            const geocollection = new GeoCollectionReference(db.collection('shops'))
            return geocollection.where('url', '==', params.id).get().then((data) => {
                const d = data.docs[0].data()
                let delivery = d.delivery_time
                if (delivery === undefined) {
                    delivery = {
                        open: '9:00:00',
                        close: '19:00:00'
                    }
                }
                const biz = {
                    isLoaded: true,
                    isLoading: false,
                    business: {
                        id: data.docs[0].id,
                        business_name: d.business_name,
                        branch: d.branch,
                        backdrop: d.backdrop,
                        logo: d.logo,
                        rates: d.rates,
                        location: d.coordinates,
                        delivery
                    },
                    sharing: {
                        url: 'https://m.jiffyfavors.com/shop/' + params.id,
                        title: `Pay your ${d.business_name} - ${d.branch} with Jiffy Favors`,
                        description: `${d.business_name} - ${d.branch} Bill Payment & Collection`,
                        hashtags: 'jiffyfavors,bills,paybills,onlineorder'
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
    watch: {
        bsAppointment() {
            this.bsQoute = false
            if (this.list.length === 0 && this.bsAppointment) {
                alert('Create a List First')
                this.bsQoute = true
                this.bsAppointment = false
            } else {
                if (this.isAuth) {
                    this.contact = {
                        number: this.user.phoneNumber,
                        id: this.user.id,
                        name: this.user.displayName
                    }
                    this.authDiag = false
                }
            }
        },
        isAuth() {
            if (this.isAuth) {
                this.contact = {
                    number: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
                this.authDiag = false
            }
        },
    },
    mounted() {
         this.$fireAnalytics.logEvent('page_view')
        const GMapSettings = {
            apiKey: this.$GMaps.apiKey,
            language: this.language
        }
        this.mylocation = this.sl()
        const google = GoogleMapsApiLoader(GMapSettings)
        this.$GMaps.google = google
        this.$getLocation({
            enableHighAccuracy: true,
            timeout: 10000
        }).then(
            (coordinates) => {
                if (coordinates.accuracy < 100) {
                    this.mylocation = {
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    }
                }
            }, (error) => {
                this.isLoading = false
                console.log(error)
            })
    },
    computed: {
        list() {
            return this.$store.getters['cart/getList']
        },
        checkoutPayload() {
            return {
                token: this.$store.getters['auth/getFCMToken'],
                timestamp: this.$generateTimestamp(this.delivery_date.date, this.delivery_date.time),
                store: {
                    id: this.business.id,
                    name: this.business.business_name,
                    branch: this.business.branch,
                    logo: this.business.logo
                },
                deliver: {
                    address: this.fees.address,
                    landmark: this.fees.landmark,
                    distance: this.fees.distance
                },
                coordinates: new this.$fireStoreObj.GeoPoint(this.mylocation.lat, this.mylocation.lng),
                fees: {
                    delivery: this.fees.fees,
                    sc: this.business.rates.sc
                },
                date: {
                    date: this.delivery_date.date,
                    time: this.delivery_date.time
                },
                estimate: this.estimate,
                items: this.list,
                contact: this.contact
            }
        },
        user() {
            return this.$store.getters['auth/getUser']
        },
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
        df() {
            return this.$store.getters['admin/getFare']
        }
    },
    data() {
        return {
            mode: 'add',
            item_copy: {},
            timediag: false,
            delivery_date: {
                delivery_time: [],
                label: 'Today',
                day_name: '',
                time: '',
            },
            dates: [],
            isLoaded: false,
            addNewItem: false,
            estimate: 0,
            needEst: false,
            shopitem: {
                desc: '',
                qty: 1,
                price: 0,
                measure: 1,
                unit: 'pc',
                status: 'unpaid',
            },
            units: [{
                name: 'Pieces(pc)',
                value: 'pc'
            }, {
                name: 'Liter(L)',
                value: 'L'
            }, {
                name: 'Milliliter(mL)',
                value: 'mL'
            }, {
                name: 'Pack(pack)',
                value: 'pack'
            }, {
                name: 'Kilogram(kg)',
                value: 'kg'
            }, {
                name: 'Grams(g)',
                value: 'g'
            }, {
                name: 'Milligram(mg)',
                value: 'mg'
            }, {
                name: 'Ounce(oz)',
                value: 'oz'
            }, {
                name: 'Inches(in)',
                value: 'in'
            }, {
                name: 'Meter(m)',
                value: 'm'
            }, {
                name: 'Feet(ft)',
                value: 'ft'
            }],
            faq: 0,
            aptconfimed: false,
            authDiag: false,
            contact: {
                name: '',
                number: '',
            },
            currentLocation: {},
            addrText: '',
            bsAppointment: false,
            timediag: false,
            delivery_date: {
                delivery_time: [],
                label: 'Today',
                day_name: ''
            },
            dates: [],
            addressDiag: false,
            calculated: false,
            mapSheet: false,
            currentMode: 'pickup',
            mode: 'same',
            options: {
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: true,
                zoomControl: true,
                gestureHandling: 'greedy'
            },
            steps: 0,
            mylocation: {
                lat: 9.7941185,
                lng: 118.7322599
            },
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            isLoading: true,
            bsQoute: false,
            business: null,
            e1: 1,
            isValid: false,
            fees: {
                fees: {
                    rider: 0,
                    platform: 0
                },
                distance: {
                    computed: 0,
                    actual: 0
                },
                address: '',
                landmark: '',
            }
        }
    },
    head() {
        const business = this.business
        const url = 'https://m.jiffyfavors.com' + this.$route.fullPath
        return {
            title: `${business.business_name} - Online Shopping`,
            meta: [{
                hid: `description`,
                name: 'description',
                content: `Shop at ${business.business_name} ${business.branch} with Jiffy Favors Rider Shopper`
            }, {
                hid: 'og:type',
                name: 'og:type',
                content: 'product'
            }, {
                hid: 'og:title',
                name: 'og:title',
                content: `Bills Payment|${business.business_name} ${business.branch}`
            }, {
                hid: 'og:description',
                name: 'og:description',
                content: `Shopping for  ${business.business_name} ${business.branch} with Jiffy Favors Rider Shopper`
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
    methods: {
        addItem() {
            if (this.mode === 'add') {
                this.$store.commit('cart/addList', this.shopitem)
                
            } else {
                this.$store.commit('cart/updateItemList', {
                    data: this.shopitem,
                    index: this.editIndex
                })
            }
            this.shopitem = {
                    desc: '',
                    qty: 1,
                    price: 0,
                    measure: 1,
                    unit: 'pc',
                    status: 'unpaid'
                }
            this.editIndex = -1
            this.mode = 'add'
            this.addNewItem = false
           
        },
        generateBookingId() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let result = 'SR-'
            for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
            return result
        },
        attemptLogin() {
            if (!this.isAuth) {
                this.authDiag = true
            }
        },
        generateDates() {
            const today = this.addDays(new Date(), 0)
            const tomorrow = this.addDays(new Date(), 1)
            const nextday = this.addDays(new Date(), 2)
            let now = new Date(this.$getNow()).getTime()
            let close = new Date(this.$getNow().substring(0, 10) + ' ' + this.business.delivery.close)
            if (now < close) {
                this.dates = [today, tomorrow, nextday]
            } else {
                this.dates = [tomorrow, nextday]
            }
        },
        addDays(date, days) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            const label = ['Today', 'Tomorrow']
            const result = new Date(date)
            result.setDate(result.getDate() + days)
            if (days === 2) {
                label.push(dayNames[result.getDay()])
            }
            let delivery_time = []
            let now = new Date(this.$getNow()).getTime()
            let close = new Date(this.$getNow().substring(0, 10) + ' ' + this.business.delivery.close)
            let open = new Date(this.$getNow().substring(0, 10) + ' ' + this.business.delivery.open)
            if (days === 0) {
                if (now < close && now > open) delivery_time = this.$timeRange(this.$formatAMPM(new Date()), this.business.delivery.close, 45)
                else delivery_time = this.$timeRange(this.business.delivery.open, this.business.delivery.close, 45)
                delivery_time.unshift('ASAP')
            } else {
                delivery_time = this.$timeRange(this.business.delivery.open, this.business.delivery.close, 45)
            }
            return {
                date: result.toISOString().slice(0, 10),
                name: monthNames[result.getMonth()],
                day: result.getDate(),
                day_name: dayNames[result.getDay()],
                label: label[days],
                delivery_time
            }
        },
        preConfirmAppointment() {
            this.isValid = true
            if (!this.isAuth) this.shake('needAuth')
            if (this.estimate < 1) this.shake('needEst')
            if (this.fees.address.length === 0 || this.fees.landmark.length === 0) this.shake('dropoff')
            if (this.isValid) {
                this.bsAppointment = false
                this.isLoading = true
                const firestore = this.$fireStoreObj()
                this.checkoutPayload.status = 'placed'
                this.checkoutPayload.rider = 'unassigned'
                this.checkoutPayload.area = this.df.id
                const geocollection = new GeoCollectionReference(firestore.collection('shop_request'))
                geocollection.doc(this.generateBookingId()).set(this.checkoutPayload).then((d) => {
                    this.aptconfimed = true
                    this.isLoading = false
                    this.$store.commit('cart/clearList')
                }).catch((e) => {
                    this.isLoading = false
                })
            }
        },
        sl() {
            let sl = {
                lat: 0,
                lng: 0
            }
            if (this.business.location.hasOwnProperty('Ac')) {
                sl = {
                    lat: this.business.location.Rc,
                    lng: this.business.location.Ac
                }
            }
            if (this.business.location.hasOwnProperty('_lat')) {
                sl = {
                    lat: this.business.location._lat,
                    lng: this.business.location._long
                }
            }
            if (this.business.location.hasOwnProperty('latitude')) {
                sl = {
                    lat: this.business.location.latitude,
                    lng: this.business.location.longitude
                }
            }
            return sl
        },
        reqQoute() {
            const coordinates = this.$refs.gMap.map.getCenter()
            const dl = {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            }
            this.calculated = false
            this.bsQoute = false
            this.isLoading = true
            this.bsAppointment = false
            let sl = this.sl()
            this.$store.dispatch('admin/getArea', sl).then(() => {
                this.reqApi(dl, sl)
            })
        },
        reqApi(dl, location) {
            this.calculated = false
            this.$axios.$get('/distance/', {
                progress: true,
                params: {
                    origins: location.lat + ',' + location.lng,
                    destinations: dl.lat + ',' + dl.lng,
                    key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then((d) => {
                try {
                    const platform = parseFloat(this.df.fees.distance_platform)
                    const rider = parseFloat(this.df.fees.distance_rider)
                    const distance = d.rows[0].elements[0].distance.value
                    const md = parseFloat(this.df.fees.min_distance)
                    const min_df = parseFloat(this.df.fees.min_df)
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
                    const distance_actual = parseFloat((d.rows[0].elements[0].distance.value / 1000).toFixed(2))
                    const rider_df = Math.floor(rider * distance_actual)
                    const platform_df = Math.floor(df - rider_df)
                    this.fees.fees.rider = rider_df
                    this.fees.fees.platform = platform_df
                    this.fees.distance = {
                        computed: ds,
                        actual: distance_actual
                    }
                    this.fees.address = d.destination_addresses[0]
                    this.calculated = true
                    this.isLoading = false
                    this.bsAppointment = true
                } catch (e) {
                    console.log(e)
                }
            }).catch(e => {
                this.calculated = false
                this.isLoading = false
                this.bsAppointment = false
                return new Error({
                    statusCode: 500,
                    message: 'Blog not found'
                })
            })
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
            this.mylocation = {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            }
        },
        scrollTo() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },
        shake(id) {
            this.isValid = false
            document.getElementById(id).classList.add('shake')
            setTimeout(() => {
                document.getElementById(id).classList.remove('shake')
            }, 1500)
        }
    }
};
</script>
<style scoped>
    .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }
  
  .shake {
      border: 2px solid red;
    }
</style>
