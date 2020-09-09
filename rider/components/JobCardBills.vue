<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card max-width="400">
            <span class="bestseller">{{ item.id}}</span>
            <v-card-text>
                <v-expansion-panels popout>
                    <v-expansion-panel dense v-if="item.status!='completed'">
                        <v-expansion-panel-header>Biller Info</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list dense>
                                <v-list-item-group>
                                    <v-list-item>
                                        <v-list-item-avatar v-if="item.biller.logo!=''" tile color="grey darken-3">
                                            <v-img class="elevation-6" :src="item.biller.logo"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{item.biller.name}}</v-list-item-title>
                                            <v-list-item-subtitle>{{item.biller.branch}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.bill_info.accountNo}}</v-list-item-title>
                                        <v-list-item-subtitle>Account Number</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.bill_info.name}}</v-list-item-title>
                                        <v-list-item-subtitle>Account Name</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.bill_info.amount_due|toPHP}}</v-list-item-title>
                                        <v-list-item-subtitle>Amount Due</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Breakdown</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout wrap>
                                <v-flex xs8 sm8 md8>
                                    <strong>Collect Cash</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ item.bill_info.amount_due |toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Service Fee</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{sf_total|toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Balance Deduction </strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>- {{ balance |toPHP }}</strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <strong>Job Earning</strong>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>
                                        <div class="red--text">
                                            <strong>{{ item.fees.pickup.fees.platform + item.fees.dropoff.fees.platform + item.fees.sf * 0.6 |toPHP}}</strong>
                                        </div>
                                    </strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8> Distance Pickup </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ item.fees.pickup.distance }}
                                        <small>km</small>
                                    </strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8> Distance DropOff </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <strong>{{ item.fees.dropoff.distance }}
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
                                        <v-list-item-title> {{item.fees.pickup.landmark}} {{item.fees.pickup.address}}</v-list-item-title>
                                        <v-list-item-subtitle>Pickup Address</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon @click.stop="openMap(item.locations.pickup)">
                                            <v-icon color="pink"> mdi-navigation </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item dense class="grow">
                                    <v-list-item-content>
                                        <v-list-item-title> {{item.fees.dropoff.landmark}} {{item.fees.dropoff.address}}</v-list-item-title>
                                        <v-list-item-subtitle>Delivery Address</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon @click.stop="openMap(item.locations.dropoff)">
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
                        <v-list-item-subtitle v-if="item.appointment.time!='ASAP'">Must Pickup Before
                            <strong>
                                <span class="red--text">{{item.appointment.time}}</span>
                            </strong>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item.appointment.time=='ASAP'">Must Pickup
                            <strong>
                                <span class="red--text">{{item.appointment.time}}</span>
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
            timer: 0,
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
        statuses() {
            return [{
                icon: 'mdi-pencil',
                text: 'Enroute to pickup receipt',
                event: 'Rider enroute to your location',
                fcm: `${this.rider.firstname} is enroute your location to pickup receipt for the bill.`,
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived at Location',
                event: 'Rider arrived at your location',
                fcm: `${this.rider.firstname} has arrived at your location.`,
            }, {
                icon: 'mdi-pencil',
                text: 'I\'m at Payment Center',
                event: 'Rider arrived at Payment Center.',
                fcm: `${this.rider.firstname} arrived at   ${ this.item.biller.name} - ${ this.item.biller.branch}`,
            }, {
                icon: 'mdi-pencil',
                text: 'Payment Confirmed',
                event: 'Rider Paid Your Bill',
                fcm: `${this.rider.firstname} paid your   ${ this.item.biller.name} bill at  ${ this.item.biller.branch} branch.`,
            }, {
                icon: 'mdi-pencil',
                text: 'Enroute for Receipt Delivery',
                event: 'Your rider is enroute to deliver the receipt',
                fcm: `${this.rider.firstname} is on the way to deliver your payment receipt.`,
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived for Receipt Delivery',
                event: 'Your rider arrived to deliver receipt',
                fcm: `${this.rider.firstname} has arrived at  with  your ${ this.item.biller.name} payment receipt.`,
            },
            {
                icon: 'mdi-pencil',
                text: 'Job Complete',
                event: 'Thank you for choosing us. Bills Payment Appointment Completed.',
                fcm: `Thank you for choosing us. Bills Payment Appointment Completed.`,
            }]
        },
        rider() {
            return this.$store.getters['auth/getProfile']
        },
        sf_total() {
            return this.item.fees.pickup.fees.platform + this.item.fees.dropoff.fees.platform + this.item.fees.pickup.fees.rider + this.item.fees.dropoff.fees.rider + this.item.fees.sf
        },
        balance() {
            return this.item.fees.pickup.fees.platform + this.item.fees.dropoff.fees.platform + (this.item.fees.sf * 0.4)
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
            var href = 'sms:' + this.item.contact.number + '?body=' + sms
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
            const geocollection = geofirestore.collection('billspay_request').doc(this.item.id)
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
                } else
                {
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
        openMap(location) {
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
