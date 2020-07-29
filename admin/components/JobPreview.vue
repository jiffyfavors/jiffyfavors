<template>
  
        <v-flex xs12 md4 sm4 lg3>
            <v-card class="mx-auto" max-width="400" flat>
                <v-card-text>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Addresses</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                                    <v-card-text>{{item.delivery.from.address}}</v-card-text>
                                    <v-card-actions>
                                        <v-list-item dense class="grow">
                                            <v-list-item-avatar color="grey darken-3">
                                                <v-img class="elevation-6" :src="item.order.merchant.logo"></v-img>
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ item.order.merchant.name }}</v-list-item-title>
                                                <v-list-item-subtitle>{{ item.order.merchant.branch }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-actions>
                                </v-card> <span class="text-center"> To</span>
                                <v-card>
                                    <v-card-text>{{item.delivery.to.unit}} {{item.delivery.to.address}} </v-card-text>
                                    <v-card-actions>
                                        <v-list-item dense class="grow">
                                            <v-list-item-content>
                                                <v-list-item-title>{{ item.order.by.name }}</v-list-item-title>
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
                        <v-flex xs4 sm4 md4> <strong>{{ item.id}}</strong> </v-flex>
                        <v-flex xs8 sm8 md8>Delivery Time </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ item.delivery.time}}</strong> </v-flex>
                        <v-flex xs8 sm8 md8> Order Count </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ item.order.items.length}} Items</strong> </v-flex>
                        <v-flex xs8 sm8 md8> <strong>Cash on Hand Required </strong> </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ item.amount.order_value - item.amount.sc.store|toPHP }}</strong> </v-flex>
                        <v-flex xs8 sm8 md8> <strong>Balance Required </strong> </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ required_credit |toPHP }}</strong> </v-flex>
                        <v-flex xs8 sm8 md8> <strong>Job Earning</strong> </v-flex>
                        <v-flex xs4 sm4 md4> <strong><div class="ml-2 red--text"> <strong>{{ item.amount.delivery.rider|toPHP }}</strong> </div>
                            </strong>
                        </v-flex>
                        <v-flex xs8 sm8 md8> Distance </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ item.delivery.distance.computed }} <small>km</small> </strong> </v-flex>
                        <v-flex xs8 sm8 md8> Tip </v-flex>
                        <v-flex xs4 sm4 md4> <strong>{{ item.amount.tip|toPHP }}</strong> </v-flex>
                    </v-layout>
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
        item: Object
    },
    data() {
        return {
            snackbar: false,
            timeout: 3500,
            current_id: '',
        }
    },
    computed: {
        jobs() {
            return this.$store.getters['rider/getJobs']
        },
        accepted() {
            return this.jobs.accepted.length
        },
        balance() {
            return this.$store.getters['auth/getBalance']
        },
        required_credit() {
            return parseFloat(this.item.amount.delivery.platform + this.item.amount.sc.markup + this.item.amount.sc.store)
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
            const geocollection = geofirestore.collection('orders').doc(this.item.id)
            geocollection.update({
                assign_rider: this.$store.getters['auth/getUser'].id,
                status: 'accepted',
                logs: this.$fireStoreObj.FieldValue.arrayUnion({
                    time: Date.now(),
                    event: 'Order assigned to rider'
                })
            }).then(() => {
                this.$store.commit('rider/removeJob', this.current_id)
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
