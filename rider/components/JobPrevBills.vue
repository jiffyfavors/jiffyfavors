<template>
    <v-flex xs12 md4 sm4 lg3>
        <v-card class="mx-auto" max-width="400" flat>
            <span class="bestseller">{{ type.toUpperCase()}}</span>
            <v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Addresses</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-card>
                                <v-card-actions>
                                    <v-list-item dense class="grow">
                                        <v-list-item-avatar color="grey darken-3">
                                            <v-img class="elevation-6" :src="item.biller.logo"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.biller.name }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ item.biller.branch }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-actions>
                            </v-card>
                            <span class="text-center">Address Address</span>
                            <v-card>
                                <v-card-text>
                                    <v-list>
                                        <v-list-item dense class="grow">
                                            <v-list-item-content>
                                                <v-list-item-title> {{item.fees.pickup.landmark}} {{item.fees.pickup.address}}</v-list-item-title>
                                                <v-list-item-subtitle>Pickup Address</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item dense class="grow">
                                            <v-list-item-content>
                                                <v-list-item-title> {{item.fees.dropoff.landmark}} {{item.fees.dropoff.address}}</v-list-item-title>
                                                <v-list-item-subtitle>Delivery Address</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                                <v-card-actions>
                                    <v-list-item dense class="grow">
                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.contact.name }}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-actions>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-divider></v-divider>
                <v-layout wrap class="text-left">
                    <v-flex xs8 sm8 md8>Job Identifier </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{ item.id}}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>Appointment Time</v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{ item.appointment.time}}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Amount Needed</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{ item.bill_info.amount_due |toPHP }}</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>Balance Required </strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{ required_credit |toPHP }}</strong>
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
                    <!--    <v-flex xs8 sm8 md8> Tip </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>{{ item.amount.tip|toPHP }}</strong>
                    </v-flex> --></v-layout>
            </v-card-text>
            <v-card-actions>
                <v-btn color="info" @click.stop="AcceptJob" :disabled="isAllowed.allow" block>{{isAllowed.text}}</v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="timeout"> Job Accepted
            <v-btn flat color="primary" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-flex>
</template>
<script>
import {
    GeoFirestore
} from 'geofirestore'
export default {
    props: {
        item: Object,
        type: String
    },
    data() {
        return {
            snackbar: false,
            timeout: 3500,
            current_id: '',
        }
    },
    computed: {
        rider() {
            return this.$store.getters['auth/getProfile']
        },
        jobs() {
            return this.$store.getters['rider/getJobs']
        },
        accepted() {
            return this.$store.getters['rider/getCurrentJobCount']
        },
        balance() {
            return this.$store.getters['auth/getBalance']
        },
        required_credit() {
            return parseFloat(this.item.fees.pickup.fees.platform + this.item.fees.dropoff.fees.platform + this.item.fees.sf * 0.4)
        },
        ongoing_balance() {
            return this.$store.getters['rider/getAccBalance']
        },
        isAllowed() {
            var allow = true
            var text = ''
            if (this.balance - this.required_credit - this.ongoing_balance >= 0 && this.accepted < 5) {
                allow = false
                text = 'Accept Job'
            } else if (this.balance - this.required_credit - this.ongoing_balance > 0 && this.accepted > 4) {
                text = 'Max of 5 Jobs Allowed'
                allow = true
            } else {
                allow = true
                text = "Insufficient Balance"
            }
            return {
                allow: allow,
                text: text
            }
        }
    },
    mounted() {
        this.current_id = this.item.id
    },
    methods: {
        AcceptJob() {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('billspay_request').doc(this.item.id)
            geocollection.update({
                rider: this.$store.getters['auth/getUser'].id,
                status: 'accepted',
                logs: this.$fireStoreObj.FieldValue.arrayUnion({
                    time: Date.now(),
                    event: 'Order assigned to rider'
                })
            }).then(() => {
                if (this.item.token) {
                    this.$fireFunc.httpsCallable('sendFCMbyToken')({
                        name: 'Appointment Event',
                        title: 'Yey we found your rider!',
                        body: `${this.rider.firstname} will be your rider for ${ this.item.biller.name} bills payment appointment `,
                        image: null,
                        link: '/transactions',
                        token: this.item.token
                    }).catch(e => {
                        console.log(e)
                    })
                }
                this.$store.commit('notif/addNotif', {
                    message: 'Job ' + this.current_id + ' accepted succesfully',
                    type: 'success',
                    id: Date.now()
                })
            })
        }
    }
}
</script>
