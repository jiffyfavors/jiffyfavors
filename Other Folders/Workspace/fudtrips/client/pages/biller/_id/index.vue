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
                                <h4>Appointment Confirmed</h4> </blockquote>
                            <footer>
                                <v-btn outlined text block to="/transactions" color="red"> View Appoinments</v-btn>
                            </footer>
                        </v-flex>
                    </v-layout>
                </v-content>
            </v-container>
            <v-container v-if="!aptconfimed" fluid>
                <v-content>
                    <h3>Pay your {{business.business_name}} bills with Jiffy Favors</h3>
                    <v-row justify="center">
                        <v-expansion-panels v-model="faq" inset>
                            <v-expansion-panel value="0">
                                <v-expansion-panel-header>How it works?</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>Pay your {{business.business_name}} bill without leaving the comfort of your home or office. Let our
                                        <strong>Jiffy Riders</strong> handle the payment for you.
                                        <strong>No more waiting in line.</strong>
                                    </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>Payment Procedure</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <ol>
                                        <li value="1">Request an appointment by encoding necessary info(e.g. pickup location, account no., account name, etc.) thru here.</li>
                                        <li>See the cost of breakdown of rates.</li>
                                        <li>Confirm your appointment</li>
                                        <li>Your rider will come to you to get the receipt & payment.</li>
                                        <li>Your rider will go to Biller office to settle your bill.</li>
                                        <li>After payment, your rider will deliver the payment receipt to your selected location.</li>
                                        <li>Pay your rider the service fee and the errand's is completed.</li>
                                    </ol>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>Cut Off</v-expansion-panel-header>
                                <v-expansion-panel-content> Your rider will come to your location on or before your appoinment time.
                                    <strong>See the table below.</strong>
                                    <v-simple-table dense>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left">Event</th>
                                                    <th class="text-left"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Apppointment Time</td>
                                                    <td>Today, 8am-12noon</td>
                                                </tr>
                                                <tr>
                                                    <td>Payment of Bill</td>
                                                    <td>Today, Afternoon</td>
                                                </tr>
                                                <tr>
                                                    <td>Receipt Delivery</td>
                                                    <td>Today or Tommorow Morning</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Request Time</td>
                                                    <td>Today, 1pm-5pm</td>
                                                </tr>
                                                <tr>
                                                    <td>Bill Payment</td>
                                                    <td>Tomorrow Morning</td>
                                                </tr>
                                                <tr>
                                                    <td>Receipt Delivery</td>
                                                    <td>Tommorrow Afternoon</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>Service Fee</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>The cost of service is
                                        <strong>{{business.rates.sf|toPHP}}</strong> plus
                                        <strong>per km rate</strong> for travelled distance from/to pickup/drop off location of receipt. You can see the breakdown by clicking
                                        <strong>Request a Qoute</strong>
                                    </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <v-card v-if="calculated" width="100%">
                            <v-card-subtitle>Your Quotation</v-card-subtitle>
                            <v-card-text>
                                <v-simple-table dense>
                                    <template #default>
                                        <tbody>
                                            <tr>
                                                <td>Service Fee</td>
                                                <td>{{business.rates.sf|toPHP}}</td>
                                            </tr>
                                            <tr>
                                                <td>Pickup Fee ({{fees.pickup.distance}} km)</td>
                                                <td>{{fees.pickup.fees.rider + fees.pickup.fees.platform|toPHP}}</td>
                                            </tr>
                                            <tr>
                                                <td>Delivery Fee ({{fees.dropoff.distance}} km)</td>
                                                <td>{{fees.dropoff.fees.rider + fees.dropoff.fees.platform|toPHP}}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="red--text">
                                                        <strong>Total</strong>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="red--text">
                                                        <strong>{{fees.pickup.fees.rider + fees.pickup.fees.platform + business.rates.sf + fees.dropoff.fees.rider + fees.dropoff.fees.platform |toPHP}}</strong>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-row>
                </v-content>
            </v-container>
        </v-sheet>
        <v-bottom-sheet v-model="mapSheet">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                    <v-radio-group v-if="currentMode!='pickup'" v-model="mode">
                        <v-radio label="Same as Pickup Location" value="same"></v-radio>
                        <v-radio label="Select Location" value="location"></v-radio>
                    </v-radio-group>
                    <div class="mapcontainer" v-if="mode==='location' || currentMode === 'pickup'">
                        <GMap id="gmap" ref="gMap" :center="mylocation" :options="options" :zoom="15" @center_changed="centerChange">
                            <GMapMarker ref="gmapmarker" :position="mylocation" :options="{ icon: selectedmarker }" /> </GMap>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined @click.stop="locationSetter()" text color="blue" block class="ma-1">Next</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="bsAppointment">
            <v-card>
                <v-card-title>Request Appointment </v-card-title>
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
                        <v-list-item id="billdiv" dense>
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-account-cash </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{bill_info.name}} {{bill_info.accountNo}}</v-list-item-title>
                                <v-list-item-subtitle>Bill Information </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon @click.stop="billdiag = true" color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="pickup" dense>
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{fees.pickup.address}}</v-list-item-title>
                                <v-list-item-subtitle> Pickup Location </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon @click.stop="currentLocation = fees.pickup, addrText ='Pickup' , addressDiag = true" color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="dropoff" dense>
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{fees.dropoff.address}}</v-list-item-title>
                                <v-list-item-subtitle> Delivery Location </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon color="red" @click.stop="currentLocation = fees.dropoff , addrText='Delivery', addressDiag = true"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="needDeli">
                            <v-list-item-icon>
                                <v-icon color="blue"> mdi-clock </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title> {{ delivery_date.label }}, {{ delivery_date.day_name.substring(0, 3) }} {{ delivery_date.name }} {{ delivery_date.day }} {{locations.pickup.time}} </v-list-item-title>
                                <v-list-item-subtitle>Appoinment Time</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon color="red" @click.stop="generateDates(), (timediag = true)"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-simple-table dense>
                        <template #default>
                            <tbody>
                                <tr>
                                    <td>Service Fee</td>
                                    <td>{{business.rates.sf|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>Pickup Fee ({{fees.pickup.distance}} km)</td>
                                    <td>{{fees.pickup.fees.rider + fees.pickup.fees.platform|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>Delivery Fee ({{fees.dropoff.distance}} km)</td>
                                    <td>{{fees.dropoff.fees.rider + fees.dropoff.fees.platform|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="red--text">
                                            <strong>Total</strong>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="red--text">
                                            <strong>{{fees.pickup.fees.rider + fees.pickup.fees.platform + business.rates.sf + fees.dropoff.fees.rider + fees.dropoff.fees.platform |toPHP}}</strong>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text color="blue" @click.stop="preConfirmAppointment()" block class="ma-1">Confirm Appointment</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="bsQoute">
            <v-card v-if="!calculated">
                <v-card-title>Request a Qoutation </v-card-title>
                <v-card-text>
                    <v-list nav outlined tile width="100%" dense>
                        <v-list-item id="pickup" dense>
                            <v-list-item-icon>
                                <v-icon :color="locations.pickup.value.lat!=0 ? 'green' : 'red'"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{locations.pickup.text}}</v-list-item-title>
                                <v-list-item-subtitle> Pickup Location </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action @click.stop="currentMode ='pickup', mapSheet = true">
                                <v-icon color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="dropoff" dense>
                            <v-list-item-icon>
                                <v-icon :color="locations.dropoff.value.lat!=0 ? 'green' : 'red'"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{locations.dropoff.text}}</v-list-item-title>
                                <v-list-item-subtitle> Delivery Location </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action @click.stop="currentMode ='dropoff', mapSheet = true">
                                <v-icon color="red"> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text color="blue" @click.stop="reqQoute()" block class="ma-1">Calculate</v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-if="calculated" width="100%">
                <v-card-title>
                    <v-btn @click.stop="calculated = false" icon>
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn> You Quotation</v-card-title>
                <v-card-text>
                    <v-simple-table dense>
                        <template #default>
                            <tbody>
                                <tr>
                                    <td>Service Fee</td>
                                    <td>{{business.rates.sf|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>Pickup Fee ({{fees.pickup.distance}} km)</td>
                                    <td>{{fees.pickup.fees.rider + fees.pickup.fees.platform|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>Delivery Fee ({{fees.dropoff.distance}} km)</td>
                                    <td>{{fees.dropoff.fees.rider + fees.dropoff.fees.platform|toPHP}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="red--text">
                                            <strong>Total</strong>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="red--text">
                                            <strong>{{fees.pickup.fees.rider + fees.pickup.fees.platform + business.rates.sf + fees.dropoff.fees.rider + fees.dropoff.fees.platform |toPHP}}</strong>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text color="blue" @click.stop="bsAppointment = true" block class="ma-1">Request Appointment</v-btn>
                </v-card-actions>
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
                                <v-select v-model="locations.pickup.time" flat :items="delivery_date.delivery_time" label="Delivery Time" /> </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="timediag = false"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="billdiag" persistent>
            <v-card tile>
                <v-card-title primary-title>Bill Information</v-card-title>
                <v-card-text>
                    <v-flex xs12 md12 sm12>
                        <v-text-field v-model="bill_info.name" label="Account Name" persistent-hint outlined /> </v-flex>
                    <v-flex xs12 md12 sm12>
                        <v-text-field v-model="bill_info.accountNo" label="Account No." persistent-hint outlined /> </v-flex>
                    <v-text-field v-model="bill_info.amount_due" label="Amount Due" type="number" persistent-hint outlined /> </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-btn tile outlined block color="red" @click="billdiag = false"> Apply Changes </v-btn>
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
                    <v-btn tile outlined block color="red" @click="addressSetter()"> Apply Changes </v-btn>
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
        <v-card class="shopresponsive" v-if="!aptconfimed" width="100%">
            <v-card-subtitle>Request:</v-card-subtitle>
            <v-card-text>
                <v-btn outlined @click.stop="bsQoute = true" color="blue" width="45%" class="ma-1">Qoute</v-btn>
                <v-btn outlined @click.stop="bsAppointment = true" color="blue" width="45%" class="ma-1">Appointment</v-btn>
            </v-card-text>
        </v-card>
    </v-app>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoCollectionReference
} from 'geofirestore'
import FireUi from '~/components/FireUi.vue'
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
            const geocollection = new GeoCollectionReference(db.collection('billers'))
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
                        url: 'https://m.jiffyfavors.com/biller/' + params.id,
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
            if (!this.calculated && this.bsAppointment) {
                alert('Need to Request a Qoutation First')
                this.bsQoute = true
                this.bsAppointment = false
            }
            if (this.isAuth) {
                this.contact = {
                    number: this.user.phoneNumber,
                    id: this.user.id,
                    name: this.user.displayName
                }
                this.authDiag = false
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
        this.$getLocation({
            enableHighAccuracy: true,
            timeout: 10000
        }).then(
            (coordinates) => {
                this.mylocation = {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                }
            }, (error) => {
                this.isLoading = false
                console.log(error)
            })
    },
    computed: {
        checkoutPayload() {
            return {
                token: this.$store.getters['auth/getFCMToken'],
                timestamp: this.$generateTimestamp(this.delivery_date.date, this.locations.pickup.time),
                bill_info: this.bill_info,
                biller: {
                    id: this.business.id,
                    name: this.business.business_name,
                    branch: this.business.branch,
                    logo: this.business.logo
                },
                appointment: {
                    date: this.delivery_date.date,
                    time: this.locations.pickup.time
                },
                coordinates: new this.$fireStoreObj.GeoPoint(this.locations.pickup.value.lat, this.locations.pickup.value.lng),
                fees: this.fees,
                locations: {
                    pickup: this.locations.pickup.value,
                    dropoff: this.locations.dropoff.value
                },
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
            billdiag: false,
            bill_info: {
                name: '',
                accountNo: '',
                amount_due: 0,
            },
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
            locations: {
                pickup: {
                    time: '',
                    text: 'Please select location',
                    value: {
                        lat: 0,
                        lng: 0,
                    }
                },
                dropoff: {
                    text: 'Please select location',
                    value: {
                        lat: 0,
                        lng: 0,
                    }
                }
            },
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
                sf: 0,
                pickup: {
                    fees: {
                        rider: 0,
                        platform: 0
                    },
                    distance: 0,
                    address: '',
                    landmark: '',
                },
                dropoff: {
                    fees: {
                        rider: 0,
                        platform: 0
                    },
                    distance: 0,
                    address: '',
                    landmark: ''
                }
            }
        }
    },
    head() {
        const business = this.business
        const url = 'https://m.jiffyfavors.com' + this.$route.fullPath
        return {
            title: `${business.business_name} - Bills Payment`,
            meta: [{
                hid: `description`,
                name: 'description',
                content: `Pay your ${business.business_name} ${business.branch} with Jiffy Favors`
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
                content: `Bills Payment & Collection for ${business.business_name} ${business.branch}- Jiffy Favors.`
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
        generateBookingId() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let result = 'BP-'
            for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
            return result
        },
        addressSetter() {
            console.log(this.mode)
            if (this.mode === 'same') {
                this.fees.dropoff.address = this.fees.pickup.address
                this.fees.dropoff.landmark = this.fees.pickup.landmark
                console.log(this.fees)
            }
            this.addressDiag = false
        },
        attemptLogin() {
            if (!this.isAuth) {
                this.authDiag = true
            }
        },
        preConfirmAppointment() {
            this.isValid = true
            if (!this.isAuth) this.shake('needAuth')
            console.log(this.locations)
            if (this.fees.pickup.address.length === 0 || this.fees.pickup.landmark.length === 0) this.shake('pickup')
            if (this.fees.dropoff.address.length === 0 || this.fees.dropoff.landmark.length === 0) this.shake('dropoff')
            if (this.bill_info.name.length === 0 || this.bill_info.accountNo.length === 0 || this.bill_info.amount_due === 0) this.shake('billdiv')
            if (this.locations.pickup.time.length === 0) this.shake('needDeli')
            if (this.isValid) {
                this.bsAppointment = false
                this.isLoading = true
                const firestore = this.$fireStoreObj()
                this.checkoutPayload.fees.sf = this.business.rates.sf
                this.checkoutPayload.appointment.status = 'placed'
                this.checkoutPayload.appointment.rider = 'unassigned'
                const geocollection = new GeoCollectionReference(firestore.collection('billspay_request'))
                geocollection.doc(this.generateBookingId()).set(this.checkoutPayload).then((d) => {
                    this.aptconfimed = true
                    this.isLoading = false
                }).catch((e) => {
                    this.isLoading = false
                })
            }
        },
        reqQoute() {
            this.isValid = true
            if (this.locations.pickup.value.lat === 0) this.shake('pickup')
            if (this.locations.dropoff.value.lat === 0) this.shake('dropoff')
            if (this.isValid) {
                this.bsQoute = false
                this.isLoading = true
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
                this.$store.dispatch('admin/getArea', sl).then(() => {
                    this.reqApi(this.locations.pickup.value, sl, 'pickup')
                })
            }
        },
        reqApi(dl, location, setdata) {
            this.isLoading = true
            this.bsQoute = false
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
                const platform = parseFloat(this.df.fees.biller.distance_platform)
                const rider = parseFloat(this.df.fees.biller.distance_rider)
                const distance = d.rows[0].elements[0].distance.value
                let ds = parseFloat(parseFloat(distance / 1000).toFixed(2))
                if (setdata === 'pickup') {
                    this.fees.pickup.fees.rider = parseFloat(parseFloat(rider * ds).toFixed(2))
                    this.fees.pickup.fees.platform = parseFloat(parseFloat(platform * ds).toFixed(2))
                    this.fees.pickup.distance = ds
                    this.fees.pickup.address = d.destination_addresses[0]
                    if (this.mode === 'same') {
                        this.fees.dropoff.fees.rider = parseFloat(parseFloat(rider * ds).toFixed(2))
                        this.fees.dropoff.fees.platform = parseFloat(parseFloat(platform * ds).toFixed(2))
                        this.fees.dropoff.distance = ds
                        this.fees.dropoff.address = d.destination_addresses[0]
                        this.calculated = true
                        this.bsQoute = true
                    } else {
                        this.reqApi(this.locations.dropoff.value, location, 'dropoff')
                    }
                } else {
                    this.fees.dropoff.fees.rider = parseFloat(parseFloat(rider * ds).toFixed(2))
                    this.fees.dropoff.fees.platform = parseFloat(parseFloat(platform * ds).toFixed(2))
                    this.fees.dropoff.distance = ds
                    this.fees.dropoff.address = d.destination_addresses[0]
                    this.calculated = true
                    this.bsQoute = true
                }
                console.log(this.fees)
                this.isLoading = false
            }).catch(e => {
                this.isLoading = false
                this.bsQoute = false
                return new Error({
                    statusCode: 500,
                    message: 'Blog not found'
                })
            })
        },
        locationSetter() {
            if (this.currentMode === 'pickup') {
                const coordinates = this.$refs.gMap.map.getCenter()
                this.locations.pickup = {
                    time: '',
                    text: 'Location Selected',
                    value: {
                        lat: coordinates.lat(),
                        lng: coordinates.lng()
                    }
                }
            } else {
                if (this.mode === 'location') {
                    const coordinates = this.$refs.gMap.map.getCenter()
                    this.locations.dropoff = {
                        text: 'Location Selected',
                        value: {
                            lat: coordinates.lat(),
                            lng: coordinates.lng()
                        }
                    }
                } else {
                    this.locations.dropoff = {
                        text: 'Location Selected',
                        value: {
                            lat: this.locations.pickup.value.lat,
                            lng: this.locations.pickup.value.lng
                        }
                    }
                }
            }
            this.mapSheet = false
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
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
        },
        generateDates() {
            const today = this.addDays(new Date(), 0)
            const tomorrow = this.addDays(new Date(), 1)
            const nextday = this.addDays(new Date(), 2)
            const close = new Date(new Date().toISOString().slice(0, 10).replace(/-/g, '/') + ' ' + this.business.delivery.close)
            if (new Date().getHours() < close.getHours()) {
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
            const delivery_time = []
            const open = new Date(date.toISOString().slice(0, 10).replace(/-/g, '/') + ' ' + this.business.delivery.open)
            const close = new Date(date.toISOString().slice(0, 10).replace(/-/g, '/') + ' ' + this.business.delivery.close).getHours() + 1
            let time = open
            if (days === 0 && time.getHours() < close) {
                delivery_time.push('ASAP')
                time = new Date()
            }
            let hour = time.getHours()
            do {
                time = time.setSeconds(time.getSeconds() + 2400)
                time = new Date(time)
                hour = time.getHours() * 100 + time.getMinutes()
                if (hour <= close * 100) {
                    delivery_time.push(this.formatAMPM(time))
                }
            } while (hour < close * 100)
            return {
                date: result.toISOString().slice(0, 10),
                name: monthNames[result.getMonth()],
                day: result.getDate(),
                day_name: dayNames[result.getDay()],
                label: label[days],
                delivery_time
            }
        },
        formatAMPM(date) {
            try {
                let hours = date.getHours()
                let minutes = Math.ceil(date.getMinutes() / 5) * 5
                if (minutes === 60) {
                    hours = hours + 1
                    minutes = 0
                }
                const ampm = hours >= 12 ? 'PM' : 'AM'
                hours = hours % 12
                hours = hours || 12 // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes
                const strTime = hours + ':' + minutes + ' ' + ampm
                return strTime
            } catch (e) {
                console.log(e)
            }
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
