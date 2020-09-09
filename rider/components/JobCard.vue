<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card max-width="400">
            <span class="bestseller">{{ item.id}}</span>
            <v-card-text>
                <v-expansion-panels popout>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Breakdown</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout wrap>
                                <v-flex xs8 sm8 md8>
                                    <strong>Collect Cash</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ computeDeduction.total|toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>For Merchant</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>- {{computeDeduction.merchant|toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Balance Deduction </strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>- {{ balance |toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8> Distance </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ item.delivery.distance.actual }}
                                        <small>km</small>
                                    </strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Job Earning</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>
                                        <div class="ml-2 red--text">
                                            <strong>{{ item.amount.delivery.rider|toPHP }}</strong>
                                        </div>
                                    </strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8> Tip </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ item.amount.tip|toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Prep. Change</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>
                                        <div class="ml-2 blue--text">
                                            <strong>{{item.amount.money - item.amount.grandtotal|toPHP }}</strong>
                                        </div>
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
                                        <v-list-item-title>{{item.order.by.name}}</v-list-item-title>
                                        <v-list-item-subtitle>{{item.order.by.contact}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-btn icon :href="getSMS()">
                                        <v-icon color="blue"> mdi-message-bulleted</v-icon>
                                    </v-btn>
                                    <v-btn icon dense :href="`tel:`+item.order.by.contact">
                                        <v-icon color="pink"> mdi-phone </v-icon>
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.delivery.to.address}}</v-list-item-title>
                                        <v-list-item-subtitle>Deliver Address</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon @click.stop="openMap()">
                                            <v-icon color="pink"> mdi-navigation </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.delivery.to.unit}} {{item.delivery.rider_note}}</v-list-item-title>
                                        <v-list-item-subtitle>Unit/Landmark/Notation</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-btn block @click.stop="listDiag = true"> {{item.order.items.length}} {{ item.order.items.length>1 ? 'View Items':'View Item'}}</v-btn>
                <v-list-item dense class="grow" v-if="item.status!='completed'">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.order.merchant.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.order.merchant.name }}
                            <small>{{ item.order.merchant.branch }}</small>
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="item.delivery.time!='ASAP'">Must deliver before
                            <strong>
                                <span class="red--text">{{item.delivery.time}}</span>
                            </strong>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item.delivery.time=='ASAP'">Must Deliver
                            <strong>
                                <span class="red--text">{{item.delivery.time}}</span>
                            </strong>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-if="item.status!='completed'">
                <v-btn tile @click.stop="timer = 5 , isCommit = true, beforeCommitDiag=true, beforeSetStatus()" block color="success">{{status.text}}</v-btn>
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
        <v-dialog fullscreen v-model="listDiag" max-widht="500px">
            <v-card width="100%">
                <v-app-bar app fixed dark color="#00aff0">
                    <v-btn icon @click.stop="listDiag = false">
                        <v-icon> mdi-arrow-left-bold</v-icon>
                    </v-btn>
                    <v-toolbar-title>List of Orders for {{item.id}}</v-toolbar-title>
                </v-app-bar>
                <v-card-text>
                    <v-sheet class="overflow-y-auto">
                        <v-content>
                            <v-list two-line>
                                <v-list-item-group v-for="(_item, index) in item.order.items" :key="_item.index">
                                    <v-divider />
                                    <v-list-item dense>
                                        <v-list-item-avatar color="grey darken-3">
                                            <v-img v-if="_item.info.img != ''" class="elevation-6" :src="_item.info.img" />
                                            <v-avatar v-else class="white--text" color="blue"> {{ _item.info.name .match(/\b(\w)/g) .join('') .substr(0, 2) }} </v-avatar>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="_item.info.name" />
                                            <v-list-item-subtitle class="red--text"> {{ computeTotal(_item) | toPHP }} </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-list-item-action-text> {{ (computeTotal(_item) / _item.qty) | toPHP }} x {{ _item.qty }} </v-list-item-action-text>
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-simple-table dense v-if="computeAddOns(
                                _item.add_ons,
                                _item.info.base_price
                              ).length>0">
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
                                _item.add_ons,
                                _item.info.base_price
                              )" :key="addon.name + `_` + i + `_` + index">
                                                    <td>{{ addon.name }}</td>
                                                    <td>{{ addon.values }}</td>
                                                    <td v-if="addon.price>0">{{ addon.price | toPHP }}</td>
                                                    <td v-if="addon.price<1">-</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                    <v-alert type="info" v-if="_item.instructions.length>0" dense>{{_item.instructions}}</v-alert>
                                </v-list-item-group>
                            </v-list>
                        </v-content>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-dialog>
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
    </v-flex>
</template>
<script>
import {
    GeoFirestore
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
            listDiag: false,
            timer: 0,
            total: 0,
            isCommit: false,
            beforeCommitDiag: false,
            actionSheet: false,
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
        computeDeduction() {
            let merchant = this.item.amount.order_value
            let total = this.item.amount.grandtotal
            if (this.item.amount.hasOwnProperty('deduction')) {
                if (this.item.amount.deduction.charged_to === 'merchant') {
                    merchant = merchant - this.item.amount.deduction.computed
                    total = total - this.item.amount.deduction.computed
                } else if (this.item.amount.deduction.charged_to === 'platform') {
                    total = total - this.item.amount.deduction.computed
                }
            }
            if (this.item.amount.sc.store > 0) {
                merchant = merchant - this.item.amount.sc.store
            }
            return {
                merchant: merchant,
                total: total
            }
        },
        statuses() {
            return [{
                icon: 'mdi-pencil',
                text: 'Enroute to Store',
                event: 'Rider enroute to Store',
                fcm: `${this.rider.firstname} is enroute to  ${ this.item.order.merchant.name} - ${ this.item.order.merchant.branch}`,
            }, {
                icon: 'mdi-pencil',
                text: 'I\'m at the Store',
                event: 'Rider arrived at Store',
                fcm: `${this.rider.firstname} arrived  ${ this.item.order.merchant.name} - ${ this.item.order.merchant.branch}`
            }, {
                icon: 'mdi-pencil',
                text: 'Confirmed Order Picked Up',
                event: 'Rider picked up your order.',
                fcm: `${this.rider.firstname} done ordering.`
            }, {
                icon: 'mdi-pencil',
                text: 'Out for Delivery',
                event: 'Rider is on the way to your Location',
                fcm: `${this.rider.firstname} is on the way to deliver your order.`
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived at Location',
                event: 'Your rider arrived at your selected location.',
                fcm: `${this.rider.firstname} has arrived.`
            }, {
                icon: 'mdi-pencil',
                text: 'Order Delivered',
                event: 'Successful order delivery',
                fcm: `Thank you for ordering with us. `
            }]
        },
        rider() {
            return this.$store.getters['auth/getProfile']
        },
        balance() {
            return parseFloat(this.item.amount.delivery.platform + this.item.amount.sc.markup + this.item.amount.sc.store)
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
        getSMS() {
            var sms = `Hello,

I'm ` + this.$store.getters['auth/getProfile'].firstname + ` , your rider for today. You can contact me using this number if you need anything.

Thank you'`
            var href = 'sms:' + this.item.order.by.contact + '?body=' + sms
            if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) href = 'sms:' + this.item.order.by.contact + ';body=' + sms
            return href
        },
        findStatus(status) {
            var nextIndex = this.statuses.indexOf(status)
            this.item.logs.forEach(a => {
                if (a.event === status.event) {
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
            const geocollection = geofirestore.collection('orders').doc(this.item.id)
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
                        name: 'Order Event',
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
        openMap() {
            const coord = this.$store.getters['rider/getLocation']
            var ioslink = 'maps://maps.google.com/maps?/dir/?api=1&origin=' + coord.lat + ',' + coord.lng + '&destination=' + this.item.delivery.to.coord.lat + ',' + this.item.delivery.to.coord.lng + '&amp;ll=';
            var other_link = 'https://www.google.com/maps/dir/?api=1&origin=' + coord.lat + ',' + coord.lng + '&destination=' + this.item.delivery.to.coord.lat + ',' + this.item.delivery.to.coord.lng + '&amp;ll='
            if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) window.open(ioslink, '_blank');
            else window.open(other_link, '_blank');
        },
        capitalize(s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
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
    },
}
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
