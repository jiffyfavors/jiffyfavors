<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card class="mx-auto" max-width="400"> <span class="bestseller">{{ item.status.toUpperCase() }}</span>
            <v-card-text>
                <v-list dense>
                    <v-list-item-group v-for="(i, index) in item.order.items" :key="index">
                        <v-list-item>
                            <v-list-item-avatar tile color="grey darken-3">
                                <v-img class="elevation-6" :src="i.info.img"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="i.info.name" />
                                <v-list-item-subtitle> <small>{{ computeAddOns(i.add_ons) }}</small> </v-list-item-subtitle>
                                <v-list-item-subtitle class="text--primary"> <strong>{{ computeTotal(i)/i.qty|toPHP }} x {{ i.qty }} = {{ computeTotal(i)|toPHP }}</strong> </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider v-if="index <=item.order.items" :key="`divide_`+index" /> </v-list-item-group>
                </v-list>
                <v-divider />
                <v-layout wrap>
                    <v-flex xs8 sm8 md8> <strong>Order Reference</strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ item.id }}</strong> </v-flex>
                    <v-divider></v-divider>
                    <v-flex xs8 sm8 md8> <strong>Order Value</strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ item.amount.order_value|toPHP }}</strong> </v-flex>
                    <v-flex xs8 sm8 md8> Delivery Fee - <small>{{ item.delivery.distance.computed }} km</small> </v-flex>
                    <v-flex xs4 sm4 md4 class="text-end">{{ item.amount.delivery.platform + item.amount.delivery.rider|toPHP }}</v-flex>
                    <v-flex xs8 sm8 md8> Convenience Fee
                        <v-tooltip v-model="showtooltip" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" small v-bind="attrs" @click="showtooltip =!showtooltip" v-on="on">mdi-alert-circle-outline</v-icon>
                            </template> <span>We charging certain amount base on your total order value in order for us to improve our service, provide rider incentives, and give perks and discount to customer.</span> </v-tooltip>
                    </v-flex>
                    <v-flex xs4 sm4 md4>{{ item.amount.sc.markup|toPHP }}</v-flex>
                    <v-divider></v-divider>
                    <v-flex xs8 sm8 md8> <span class="subheading"><strong>Total</strong></span> </v-flex>
                    <v-flex xs4 sm4 md4>
                        <div class="ml-2 red--text"> <strong>{{ item.amount.grandtotal|toPHP }}</strong> </div>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-divider />
            <v-card-actions v-if="item.assign_rider==='unassigned' && checkIfOngoing(item.status)">
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" </v-img> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Finding...</v-list-item-title>
                        <v-progress-linear indeterminate color="cyan"></v-progress-linear>
                        <v-list-item-subtitle>Your rider</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-actions>
            <v-card-actions>
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.order.merchant.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.order.merchant.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.order.merchant.branch }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-row align="center" justify="end" v-if="checkIfOngoing(item.status)">
                        <v-btn text color="blue darken-1" @click.stop="orderSheet = true">Manage</v-btn>
                    </v-row>
                </v-list-item>
            </v-card-actions>
        </v-card>
        <v-bottom-sheet inset v-model="orderSheet">
            <v-list dense>
                <v-subheader>Manage Order</v-subheader>
                <v-list-item :disabled="item.status!='placed'" @click.stop="dialog = true">
                    <v-list-item-title>Cancel Order</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="mapSheet = true">
                    <v-list-item-title>Change Delivery Address</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="timediag = true">
                    <v-list-item-title>Change Delivery Time</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="dialog = false, contactsheet = true">
                    <v-list-item-title>Update Contact Information</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="tipdiag = true">
                    <v-list-item-title>Change/Add Rider Tip</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-bottom-sheet>
        <v-bottom-sheet persistent v-model="contactsheet">
            <v-card tile>
                <v-card-title primary-title>Contact Information</v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 md12>
                            <v-text-field v-model="otherContact.name" dense label="Fullname" outlined placeholder="Fullname" /> </v-flex>
                        <v-flex xs12 md12>
                            <v-text-field v-model="otherContact.number" dense label="Your number" outlined placeholder="Your number" /> </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile outlined color="red" @click="setContactInfo(), contactsheet = false">Apply Changes</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-row justify="center">
            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">Cancel your order?</v-card-title>
                    <v-card-text>You can cancel your order without charges as long as the restaurant is not processi ng your order.</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
                        <v-btn color="green darken-1" text @click="cancelOrder(), dialog = false">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-bottom-sheet scrollable v-model="mapSheet">
            <v-card tile height="600px">
                <v-card-title primary-title> Update Delivery Address <small>
            This will recompute your
            <strong>Delivery Fee</strong>
          </small> </v-card-title>
                <v-card-text>
                    <div class="mapcontainer">
                        <GMap id="gmap" ref="gMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: true, zoomControl: true, gestureHandling: 'greedy'}" :zoom="20" @center_changed="centerChange">
                            <GMapMarker ref="gmapmarker" :position="mylocation" :options="{icon:selectedmarker}"></GMapMarker>
                        </GMap>
                    </div>
                    <v-flex xs12 md12 sm12>
                        <v-textarea v-model="fare.delivery_address" label="Address" outlined placeholder="Address"></v-textarea>
                    </v-flex>
                    <v-flex xs12 md12 sm12>
                        <v-text-field hint="Type 'NA' if not applicable" v-model="fare.units" label="Floor/Unit/Room No." persistent-hint outlined></v-text-field>
                    </v-flex>
                    <v-flex xs12 md12 sm12>
                        <v-textarea v-model="fare.notetorider" label="Note to rider" outlined placeholder="eg. Landmark/ Building"></v-textarea>
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile outlined color="red" @click="recalculateFees(), mapSheet = false">Apply Changes</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet persistent v-model="timediag">
            <v-card>
                <v-card-title> <span class="headline">Delivery Date & Time</span> </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-layout wrap>
                            <v-flex xs12 md6 lg6 sm6>
                                <v-select v-model="delivery_date" flat :items="dates" return-object label="Delivery Date">
                                    <template v-slot:selection="data">{{ data.item.label }}, {{ data.item.day_name }} {{ data.item.name }} {{ data.item.day }}</template>
                                    <template v-slot:item="data">{{ data.item.label }}, {{ data.item.day_name }} {{ data.item.name }} {{ data.item.day }}</template>
                                </v-select>
                            </v-flex>
                            <v-flex xs12 md6 lg6 sm6>
                                <v-select v-model="delivery_time" flat :items="delivery_date.delivery_time" label="Delivery Time" /> </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="timediag = false">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="saveNewTime(), timediag = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet persistent v-model="tipdiag">
            <v-card>
                <v-card-title> <span class="headline">Rider Tip</span> </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 md12 sm12>
                            <v-text-field right v-model="rider_tip" type="number" dense solo label="Rider Time" outlined placeholder="Amount of tip"></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile outlined :disabled="rider_tip<0" color="red" @click="saveTip">Apply Changes</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-snackbar color="success" v-model="snackbar" bottom :timeout="timeout"> {{info}} </v-snackbar>
    </v-flex>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import {
    GeoCollectionReference
} from 'geofirestore'
export default {
    props: {
        item: {
            type: Object,
            default: {
                order: {
                    merchant: {
                        name: 'NA',
                        logo: '',
                        branch: ''
                    }
                },
                status: 'placed'
            }
        }
    },
    data() {
        return {
            snackbar: false,
            info: '',
            timeout:3500,
            timediag: false,
            delivery_date: {
                delivery_time: []
            },
            dates: [],
            delivery_time: '',
            mapSheet: false,
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            otherContact: {
                name: '',
                number: ''
            },
            tiptooltip: false,
            rider_tip: 0,
            tipdiag: false,
            fare: {
                delivery_address: '',
                units: '',
                notetorider: ''
            },
            contactsheet: false,
            dialog: false,
            orderSheet: false,
            showtooltip: false,
            mylocation: {
                lat: 9.7941185,
                lng: 118.7322599
            }
        }
    },
    computed: {
        df() {
            return this.$store.getters['admin/getFare']
        }
    },
    mounted() {
        this.generateDates()
        this.mylocation = {
            lat: this.item.delivery.to.coord.lat,
            lng: this.item.delivery.to.coord.lng
        }
        this.rider_tip = this.item.amount.tip
        this.fare = {
            delivery_address: this.item.delivery.to.address,
            units: this.item.delivery.to.unit,
            notetorider: this.item.delivery.rider_note,
            coord: Object.assign({}, this.item.delivery.to.coord)
        }
     
        try {
            this.otherContact = {
                name: this.item.order.by.otherContact.name,
                number: this.item.order.by.otherContact.number
            }
        } catch (e) {
            this.otherContact = {
                name: this.item.order.by.name,
                number: this.item.order.by.contact
            }
        }
    },
    methods: {
        checkIfOngoing(val) {
            if (val === 'placed' || val === 'ongoing' || val === 'accepted') {
                return true
            } else {
                return false
            }
        },
        saveTip() {
            this.$fireStoreObj().collection('orders').doc(this.item.id).update({
                'd.amount.tip': Math.round(this.rider_tip)
            }).then(() => {
                this.tipdiag = false
                this.orderSheet = false
                this.info = "Tip amount recorded. Thank you!"
                this.snackbar = true
            })
        },
        saveNewTime() {
            this.$fireStoreObj().collection('orders').doc(this.item.id).update({
                'd.delivery.date': this.delivery_date.date,
                'd.delivery.time': this.delivery_time
            }).then(() => {
                this.orderSheet = false
                this.info = "Delivery Time & Date updated"
                this.snackbar = true
            })
        },
        generateDates() {
            const today = this.addDays(new Date(), 0)
            const tomorrow = this.addDays(new Date(), 1)
            const nextday = this.addDays(new Date(), 2)
            if (new Date().getHours() < 21) {
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
            let time = new Date(date)
            if (days === 0 && time.getHours() < 21) {
                delivery_time.push('ASAP')
                time = time.setSeconds(time.getSeconds() + 1800)
            } else {
                time = new Date(date.toISOString().slice(0, 10).replace(/-/g, '-') + ' 9:00:00 AM')
                delivery_time.push(this.formatAMPM(time))
            }
            time = new Date(time)
            let hour = time.getHours()
            do {
                time = time.setSeconds(time.getSeconds() + 2400)
                time = new Date(time)
                hour = time.getHours() * 100 + time.getMinutes()
                if (hour <= 2100) {
                    delivery_time.push(this.formatAMPM(time))
                }
            } while (hour < 2100)
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
        },
        recalculateFees() {
            const coordinates = this.$refs.gMap.map.getCenter()
            const dl = {
                lat: coordinates.lat(),
                lng: coordinates.lng()
            }
            const sl = {
                lat: this.item.delivery.from.coord.lat,
                lng: this.item.delivery.from.coord.lng
            }
            this.$store.dispatch('admin/getAreaByLocation', {
                lat: this.item.delivery.from.coord.lat,
                lng: this.item.delivery.from.coord.lng
            }).then(() => {
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
                    var total = parseFloat(this.item.amount.order_value) + rider_df + platform_df + parseFloat(this.item.amount.sc.markup)
                    var update_data = cloneDeep(this.item)
                    delete update_data.id
                    update_data.amount.tip = Math.round(this.rider_tip)
                    update_data.amount.delivery = {
                        platform: platform_df,
                        rider: rider_df
                    }
                    update_data.amount.grandtotal = total
                    update_data.delivery.distance = {
                        computed: parseFloat(Math.floor(d.rows[0].elements[0].distance.value / 1000) + 1).toFixed(2),
                        actual: parseFloat(d.rows[0].elements[0].distance.value / 1000).toFixed(2)
                    }
                    update_data.delivery.to = {
                        address: this.fare.delivery_address,
                        coord: {
                            lat: dl.lat,
                            lng: dl.lng
                        },
                        unit: this.fare.units
                    }
                    update_data.delivery.rider_note = this.fare.notetorider
                    update_data.coordinates = new this.$fireStoreObj.GeoPoint(dl.lat, dl.lng)
                    const firestore = this.$fireStoreObj()
                    const geocollection = new GeoCollectionReference(firestore.collection('orders'))
                    geocollection.doc(this.item.id).update(update_data).then(() => {
                        this.orderSheet = false
                        this.info = "Delivery details and fees updated."
                        this.snackbar = true
                    })
                }).catch((e) => {
                    console.log(e)
                })
            })
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        setContactInfo() {
            this.$fireStoreObj().collection('orders').doc(this.item.id).update({
                'd.order.by.otherContact': this.otherContact
            }).then(() => {
                this.orderSheet = false
                this.info = "Contact Information updated"
                this.snackbar = true
            })
        },
        cancelOrder() {
            this.$fireStoreObj().collection('orders').doc(this.item.id).update({
                'd.status': 'cancelled'
            }).then(() => {
                this.orderSheet = false
                this.info = "Order is now cancelled"
                this.snackbar = true
            })
        },
        computeAddOns(item) {
            const txt = []
            for (const [key, value] of Object.entries(item)) {
                if (Array.isArray(value)) {
                    value.forEach((a) => {
                        txt.push(a.name)
                    })
                } else {
                    txt.push(value.name)
                }
            }
            let res = 'w/ '
            for (let i = 0; i < txt.length; i++) {
                res = res + txt[i] + ','
            }
            return res.substring(0, res.length - 1)
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
        .bestseller {
    float: right;
    padding-right: 20px;
    padding-left: 20px;
    color: white !important;
    background-color: #f44336;
    font-size: 16px !important;
    margin-top: 10px;
    margin-left: 10px;
    text-align: center;
    border-top-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
    position: absolute;
    top: 0;
    right: 0;
  }
  
  .mapcontainer,
  .GMap,
  .GMap__Wrapper {
      max-width: 100%;
      height: auto !important;
      width: 100% !important;
    }
    
    @media screen and (min-width: 320px) and (max-width: 768px) {
        .mapcontainer,
        .GMap,
        .GMap__Wrapper {
            display: inline-block;
            max-width: 100%;
            height: 100vw !important;
          }
        }
</style>
