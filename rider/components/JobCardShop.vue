<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card max-width="400">
            <span class="bestseller">{{ item.id}}</span>
            <v-card-text>
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.store.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.store.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.store.branch }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-expansion-panels popout>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Breakdown</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout wrap class="text-left">
                                <v-flex xs7 sm7 md7>Job Identifier </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>{{ item.id}}</strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7>Delivery Time </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>{{ item.date.time}}</strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7>List Count </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>{{ item.items.length}} Items</strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7>Est. Budget</v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>~ {{item.estimate |toPHP}}</strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7>
                                    <strong>Balance Required </strong>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>{{item.fees.delivery.platform + (((item.fees.sc * 0.4)/100) * getTotal().total) |toPHP}}</strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7>
                                    <strong>Est Job Earning</strong>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>
                                        <div class="red--text">
                                            <strong>{{ item.fees.delivery.rider + (((item.fees.sc * 0.6)/100) * getTotal().total) |toPHP}}</strong>
                                        </div>
                                    </strong>
                                </v-flex>
                                <v-flex xs7 sm7 md7> Distance </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <strong>{{ item.deliver.distance.actual }}
                                        <small>km</small>
                                    </strong>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel v-if="item.status!='completed'">
                        <v-expansion-panel-header>Contact/Address</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list dense>
                                <v-list-item id="contact">
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.contact.name}}</v-list-item-title>
                                        <v-list-item-subtitle>{{item.contact.number}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-btn icon :href="getSMS()">
                                        <v-icon color="blue"> mdi-message-bulleted</v-icon>
                                    </v-btn>
                                    <v-btn icon dense :href="`tel:`+item.contact.number">
                                        <v-icon color="pink"> mdi-phone </v-icon>
                                    </v-btn>
                                </v-list-item>
                                <v-list-item dense class="grow">
                                    <v-list-item-content>
                                        <v-list-item-title> {{item.deliver.landmark}} {{item.deliver.address}}</v-list-item-title>
                                        <v-list-item-subtitle>Delivery Address</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon @click.stop="openMap(item.coordinates)">
                                            <v-icon color="pink"> mdi-navigation </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-list-item dense class="grow" v-if="item.status!='completed'">
                    <v-list-item-content>
                        <v-list-item-subtitle v-if="item.date.time!='ASAP'">Must Deliver Before
                            <strong>
                                <span class="red--text">{{item.date.time}}</span>
                            </strong>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item.date.time=='ASAP'">Must Deliver
                            <strong>
                                <span class="red--text">{{item.date.time}}</span>
                            </strong>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
            <v-divider></v-divider>
            <v-btn tile @click.stop="" block color="info" v-if="currentStep===2" @click.stop="bsQoute = true">View List</v-btn>
            <v-card-actions v-if="item.status!='completed'">
                <v-btn tile :disabled="currentStep==2 && !isAllPaid" @click.stop="timer = 5 , isCommit = true, beforeCommitDiag=true, beforeSetStatus()" block color="success">{{status.text}}</v-btn>
            </v-card-actions>
        </v-card>
        <v-bottom-sheet inset v-model="actionSheet">
            <v-list single-line dense>
                <v-subheader>Action</v-subheader>
                <v-list-item-group>
                    <v-list-item @click.stop="setStatus()">
                        <v-list-item-icon>
                            <v-icon small color="blue">{{status.icon}} </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{status.text}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="beforeCommitDiag" persistent>
            <v-card>
                <v-card-title primary-title> {{status.text}} </v-card-title>
                <v-card-text>
                    <h1 style="text-aling:center"> Job <span class="red--text">{{item.id}}</span> <span class="blue--text">{{timer}}</span> sec</h1> </v-card-text>
                <v-card-actions>
                    <v-btn tile @click.stop="isCommit = false, timer =0" block color="success">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="bsQoute" fullscreen persistent>
            <v-card style="height: 100vh;">
                <v-card-title>Shopping List</v-card-title>
                <v-card-subtitle>Tap or Click Item to Edit</v-card-subtitle>
                <v-card-text>
                    <v-list three-line>
                        <v-list-item-group v-for="(_item, index) in item.items" :key="index">
                            <span class="bestseller">{{ _item.status.toUpperCase() }}</span>
                            <v-list-item dense>
                                <v-list-item-content @click.stop="item_copy = Object.assign({},_item), shopitem = Object.assign({},_item), mode= 'edit', addNewItem = true">
                                    <v-list-item-title v-text="_item.desc"></v-list-item-title>
                                    <v-list-item-subtitle class="blue--text"> {{_item.measure}} {{_item.unit}} x {{_item.qty}} = {{_item.measure * _item.qty}} {{_item.unit}} ({{_item.measure}} {{_item.unit}}/unit ) </v-list-item-subtitle>
                                    <v-list-item-subtitle class="red--text"> {{_item.price|toPHP}} / {{_item.measure}} {{_item.unit}} = {{_item.price * _item.qty |toPHP}} </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action-text>
                                    <v-icon small color="red" @click.stop="shopitem = Object.assign({},_item), mode= 'delete', addItem()"> mdi-delete </v-icon>
                                </v-list-item-action-text>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-list-item-group>
                    </v-list>
                    <v-list dense single-line>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title> {{getTotal().total|toPHP}}</v-list-item-title>
                                <v-list-item-subtitle>Shopping Total</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{item.fees.delivery.platform + (((item.fees.sc * 0.4)/100) * getTotal().total) |toPHP}}</v-list-item-title>
                                <v-list-item-subtitle>Balance Required</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{(((item.fees.sc * 0.6)/100) * getTotal().total)|toPHP}}</v-list-item-title>
                                <v-list-item-subtitle>Service Fee Earning</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ item.fees.delivery.rider|toPHP}}</v-list-item-title>
                                <v-list-item-subtitle>Delivery Fee({{ item.deliver.distance.computed}} km)</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="subtitle-1 red--text">{{ item.fees.delivery.platform + item.fees.delivery.rider + getTotal().sc + getTotal().total | toPHP }}</v-list-item-title>
                                <v-list-item-subtitle>Grandtotal</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="bsQoute=false" block>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="addNewItem">
            <v-card>
                <v-card-title>Item Live Pricing</v-card-title>
                <v-card-text>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12 md12 sm12 lg12 class="text-center">
                            <v-textarea disabled rows="3" label="Item description" outlined v-model="shopitem.desc" placeholder="eg. Brand, Color, etc."></v-textarea>
                        </v-flex>
                        <v-flex xs12 md12 sm12 lg12 class="text-center">
                            <v-chip-group mandatory v-model="shopitem.status" active-class="error--text">
                                <v-chip label color="info" value="looking">Looking</v-chip>
                                <v-chip label color="info" value="na">NA</v-chip>
                                <v-chip label color="info" value="unpaid">Unpaid</v-chip>
                                <v-chip label color="info" value="paid">Paid</v-chip>
                            </v-chip-group>
                        </v-flex>
                        <v-flex xs12 md12 sm12 lg12 class="text-center">
                            <v-text-field type="number" label="Price" v-model="shopitem.price" dense></v-text-field>
                        </v-flex>
                    </v-layout>
                    <!-- <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <v-select dense v-model="shopitem.unit" flat :items="units" label="Unit" item-text="name" item-value="value" /> </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <span class="caption grey--text"> Qty </span>
                            <v-icon class="white--text" color="red" @click="shopitem.qty = shopitem.qty < 1 ? 1 : shopitem.qty - 1"> mdi-minus </v-icon> {{shopitem.qty}}
                            <v-icon class="white--text" color="green" @click="shopitem.qty = shopitem.qty + 1"> mdi-plus </v-icon>
                        </v-flex></v-layout> --></v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="addItem(), addNewItem = false" block>{{mode=='add' ? 'Add To List' : 'Update Item'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-flex>
</template>
<script>
import {
    GeoFirestore,
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
            item_copy: {},
            mode: 'edit',
            bsQoute: false,
            addNewItem: false,
            timer: 0,
            isCommit: false,
            currentStep: 0,
            beforeCommitDiag: false,
            actionSheet: false,
            shopitem: {
                desc: '',
                qty: 1,
                price: 0,
                measure: 1,
                unit: 'pcs',
                status: 'unpaid',
            },
            status: {
                icon: '',
                text: '',
                event: ''
            },
        }
    },
    mounted() {
        if (this.item.status != 'completed') this.status = this.statuses[0]
    },
    computed: {
        statuses() {
            return [{
                icon: 'mdi-pencil',
                text: 'Enroute to Store',
                event: 'Rider enroute to store',
                fcm: `${this.rider.firstname} is on the way to ${ this.item.store.name} - ${ this.item.store.branch}`,
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived at Store',
                event: 'Rider arrived at store',
                fcm: `${this.rider.firstname} arrived at ${ this.item.store.name} - ${ this.item.store.branch}`,
            }, {
                icon: 'mdi-pencil',
                text: 'Start Shopping',
                event: 'Rider Start Shopping',
                fcm: `${this.rider.firstname}  will now start shopping at ${ this.item.store.name} - ${ this.item.store.branch}`,
            }, {
                icon: 'mdi-pencil',
                text: 'Payment Confirmed',
                event: 'Rider Paid All Items in Shopping List',
                fcm: `${this.rider.firstname} paid your shopping list.`,
            }, {
                icon: 'mdi-pencil',
                text: 'Enroute for Shopping Delivery',
                event: 'Your rider is enroute to deliver your item',
                fcm: `${this.rider.firstname} is on the way to delivery your items.`,
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived at Location',
                event: 'Your rider arrived at your location',
                fcm: `${this.rider.firstname} arrived at your location.`,
            },
            {
                icon: 'mdi-pencil',
                text: 'Job Complete',
                event: 'Thank you for choosing us. Shopping Transaction Completed.',
                fcm: 'Thank you for choosing us for your shopping need. Transaction Complete.',
            }]
        },
        rider() {
            return this.$store.getters['auth/getProfile']
        },
        units() {
            let units = [{
                name: 'Pieces(pcs)',
                value: 'pcs'
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
            },
            {
                name: 'Pad(pad)',
                value: 'pad'
            },
            {
                name: 'Bundle(bundle)',
                value: 'bundle'
            },
            {
                name: 'Bottle(bot)',
                value: 'bot'
            }]
            return units.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        },
        isAllPaid() {
            let index = this.item.items.findIndex((val) => {
                return val.status != 'paid' && val.status != 'na'
            })
            return index < 0
        },
        sf_total() {
            return this.item.fees.pickup.fees.platform + this.item.fees.dropoff.fees.platform + this.item.fees.pickup.fees.rider + this.item.fees.dropoff.fees.rider + this.item.fees.sf
        },
        balance() {
            return this.item.fees.delivery.platform + (((this.item.fees.sc * 0.4) / 100) * this.getTotal().total)
        },
        user() {
            return this.$store.getters['auth/getUser']
        }
    },
    watch: {
        status(val) {
            this.findStatus(val)
        },
        timer(val) {
            if (val <= 0 && this.isCommit === true) {
                this.beforeCommitDiag = false
                this.isCommit = true
                this.setStatus()
            } else if (val <= 0 && this.isCommit === false) {
                this.beforeCommitDiag = false
                this.isCommit = false
            }
        }
    },
    methods: {
        addItem() {
            const firestore = this.$fireStoreObj()
            const geocollection = new GeoCollectionReference(firestore.collection('shop_request'))
            geocollection.doc(this.item.id).update({
                items: this.$fireStoreObj.FieldValue.arrayRemove(this.item_copy)
            }).then(() => {
                geocollection.doc(this.item.id).update({
                    items: this.$fireStoreObj.FieldValue.arrayUnion(this.shopitem)
                }).then(() => {
                    this.$fireFunc.httpsCallable('sendFCMbyToken')({
                        name: 'Shop Event',
                        title: 'Realtime update on ' + this.shopitem.desc,
                        body: 'Price: P' + this.shopitem.price + 'per ' + this.shopitem.unit + ' and marked as ' + this.shopitem.status,
                        image: null,
                        link: '/transactions',
                        token: this.item.token
                    }).then(() => {
                        this.shopitem = {
                            desc: '',
                            qty: 1,
                            price: 0,
                            measure: 1,
                            unit: 'pcs',
                            status: 'unpaid'
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                })
            })
        },
        getTotal() {
            let total = 0
            let withprice = 0;
            this.item.items.forEach(item => {
                total = total + (item.qty * item.price)
                if (item.price > 0 || item.status == 'paid') withprice++
            })
            return {
                sc: parseFloat(((total * this.item.fees.sc) / 100).toFixed(2)),
                total: total,
                done: withprice
            }
        },
        getSMS() {
            var sms = `Hello,

I'm ` + this.$store.getters['auth/getProfile'].firstname + ` , your rider for today. You can contact me using this number if you need anything.

Thank you'`
            var href = 'sms:' + this.item.contact.number + '?body=' + sms
            if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) href = 'sms:' + this.item.order.by.contact + ';body=' + sms
            return href
        },
        findStatus(status) {
            var nextIndex = this.statuses.indexOf(status)
            this.item.logs.forEach(a => {
                if (a.event === status.event) {
                    this.currentStep = nextIndex
                    if (nextIndex < this.statuses.length) {
                        this.status = this.statuses[++nextIndex]
                    }
                }
            })
        },
        beforeSetStatus() {
            setTimeout(() => {
                if (this.timer > 0) {
                    this.timer--
                        this.beforeSetStatus()
                }
            }, 1000);
        },
        setStatus() {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('shop_request').doc(this.item.id)
            var updatedata = {
                logs: this.$fireStoreObj.FieldValue.arrayUnion({
                    time: Date.now(),
                    event: this.status.event
                }),
                status: this.item.status
            }
            if (this.statuses.indexOf(this.status) === this.statuses.length - 1) {
                updatedata.status = 'completed'
                this.updateBalance()
                updatedata.completion_time = new Date().getTime()
            }
            geocollection.update(updatedata).then(() => {
                if (this.item.token) {
                    this.$fireFunc.httpsCallable('sendFCMbyToken')({
                        name: 'Shop Event',
                        title: this.status.event,
                        body: this.status.fcm,
                        image: null,
                        link: '/transactions',
                        token: this.item.token
                    }).then(() => {
                        this.findStatus(this.status)
                    }).catch(e => {
                        this.findStatus(this.status)
                        console.log(e)
                    })
                } else {
                    this.findStatus(this.status)
                }
            })
        },
        updateBalance() {
             this.$fireStoreObj().collection('riders').doc(this.$store.getters['auth/getUser'].id).collection('balances').add({
                desc:'Hold-Balance: Commission Fee',
                amount: this.balance * -1,
                timestamp: new Date().getTime()
              })
        },
        openMap(_location) {
            let location = {
                lat: _location.Rc,
                lng: _location.Ac
            }
            const coord = this.$store.getters['rider/getLocation']
            var ioslink = 'maps://maps.google.com/maps?/dir/?api=1&origin=' + coord.lat + ',' + coord.lng + '&destination=' + location.lat + ',' + location.lng + '&amp;ll=';
            var other_link = 'https://www.google.com/maps/dir/?api=1&origin=' + coord.lat + ',' + coord.lng + '&destination=' + location.lat + ',' + location.lng + '&amp;ll='
            if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) window.open(ioslink, '_blank');
            else window.open(other_link, '_blank');
        },
        capitalize(s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        },
    },
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
    z-index: 2;
  }
</style>
