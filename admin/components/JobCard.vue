<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card max-width="400" > <span class="bestseller">{{ item.id}}</span>
            <v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel dense  v-if="item.status!='completed'">
                        <v-expansion-panel-header> {{item.order.items.length}} {{ item.order.items.length>1 ? 'Order Items':'Order Item'}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list dense>
                                <v-list-item-group v-for="(i, index) in item.order.items" :key="index">
                                    <v-list-item>
                                        <v-list-item-avatar v-if="i.info.img!=''" tile color="grey darken-3">
                                            <v-img class="elevation-6" :src="i.info.img"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{i.info.name}} x {{ i.qty }}</v-list-item-title>
                                            <v-simple-table dense>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">Option</th>
                                                            <th class="text-left">Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="addon in  computeAddOns(i.add_ons)" :key="addon.name">
                                                            <td>{{ addon.name }}</td>
                                                            <td>{{ addon.values }}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                            <v-alert type="info" v-if="i.instructions.length>0" dense>{{i.instructions}}</v-alert>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider v-if="index <=item.order.items" :key="`divide_`+index" /> </v-list-item-group>
                            </v-list>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Breakdown</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout wrap>
                                <v-flex xs8 sm8 md8> <strong>Cash Collection </strong> </v-flex>
                                <v-flex xs4 sm4 md4> <strong>{{ item.amount.grandtotal|toPHP }}</strong> </v-flex>
                                <v-flex xs8 sm8 md8> <strong>Payable to Merchant </strong> </v-flex>
                                <v-flex xs4 sm4 md4> <strong>- {{ item.amount.order_value - item.amount.sc.store|toPHP }}</strong> </v-flex>
                                <v-flex xs8 sm8 md8> <strong>Credit Balance Deduction </strong> </v-flex>
                                <v-flex xs4 sm4 md4> <strong>- {{ balance |toPHP }}</strong> </v-flex>
                                <v-flex xs8 sm8 md8> Distance </v-flex>
                                <v-flex xs4 sm4 md4> <strong>{{ item.delivery.distance.computed }} <small>km</small> </strong> </v-flex>
                                <v-flex xs8 sm8 md8> <strong>Job Earning</strong> </v-flex>
                                <v-flex xs4 sm4 md4> <strong>   <div class="ml-2 red--text"> <strong>{{ item.amount.delivery.rider|toPHP }}</strong> </div>
                                    </strong>
                                </v-flex>
                                <v-flex xs8 sm8 md8> Tip </v-flex>
                                <v-flex xs4 sm4 md4> <strong>{{ item.amount.tip|toPHP }}</strong> </v-flex>
                                <v-flex xs8 sm8 md8> <strong>Prep. Change</strong> </v-flex>
                                <v-flex xs4 sm4 md4> <strong> <div class="ml-2 blue--text"> <strong>{{item.amount.money - item.amount.grandtotal|toPHP }}</strong> </div>
                                    </strong>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel  v-if="item.status!='completed'">
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
                <v-list-item dense class="grow"  v-if="item.status!='completed'">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.order.merchant.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.order.merchant.name }} <small>{{ item.order.merchant.branch }}</small></v-list-item-title>
                        <v-list-item-subtitle v-if="item.delivery.time!='ASAP'">Must deliver before <strong><span class="red--text">{{item.delivery.time}}</span></strong></v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item.delivery.time=='ASAP'">Must Deliver <strong><span class="red--text">{{item.delivery.time}}</span></strong></v-list-item-subtitle>
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
        <v-bottom-sheet v-model="beforeCommitDiag">
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
            statuses: [{
                icon: 'mdi-pencil',
                text: 'Enroute to Store',
                event: 'Rider enroute to Store'
            }, {
                icon: 'mdi-pencil',
                text: 'I\'m at the Store',
                event: 'Rider arrived at Store',
            }, {
                icon: 'mdi-pencil',
                text: 'Confirmed Order Picked Up',
                event: 'Rider picked up your order.',
            }, {
                icon: 'mdi-pencil',
                text: 'Out for Delivery',
                event: 'Rider is on the way to your Location',
            }, {
                icon: 'mdi-pencil',
                text: 'Arrived at Location',
                event: 'Your rider arrived at your selected location.',
            }, {
                icon: 'mdi-pencil',
                text: 'Order Delivered',
                event: 'Successful order delivery',
            }]
        }
    },
    mounted() {
if(this.item.status!='completed')
        this.status = this.statuses[0]
     
    },
    computed: {
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
        getSMS(){

            var sms = `Hello,

I'm `+this.$store.getters['auth/getProfile'].firstname+` , your rider for today. You can contact me using this number if you need anything.

Thank you'`

var href = 'sms:'+this.item.order.by.contact+'?body='+ sms

 if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) 
        href =  'sms:'+this.item.order.by.contact+';body='+ sms
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
                })
            }
            var ifComplete = false
            if (this.statuses.indexOf(this.status) === this.statuses.length - 1) {
                ifComplete = true
                updatedata.status = 'completed'
            }
            geocollection.update(updatedata).then(() => {
                if (ifComplete) {
                    this.updateBalance()}
                    else{
                          this.findStatus(this.status)
                    }
              
            })
        },
        updateBalance() {
            const firestore = this.$fireStoreObj()
            firestore.collection('riders').doc(this.$store.getters['auth/getUser'].id).update({
                balance: this.$fireStoreObj.FieldValue.increment(this.balance * -1)
            }).then(()=>{

                    this.$store.commit('rider/removeAccJob', this.item.id)

                               this.$store.dispatch('rider/getJobs', {
            rider: this.user.id,
            status:'accepted',
            bindTo:'acceptedjobs'
        })
        

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
        computeAddOns(item) {
            const txt = []
            for (const [key, value] of Object.entries(item)) {
                if (Array.isArray(value)) {
                    var vals = ''
                    value.forEach((a) => {
                        vals = vals + this.capitalize(a.name) + ','
                    })
                    txt.push({
                        name: this.capitalize(key),
                        values: vals.substring(0, vals.length - 1)
                    })
                } else {
                    txt.push({
                        name: this.capitalize(key),
                        values: this.capitalize(value.name)
                    })
                }
            }
            return txt
        }
    },
}
</script>