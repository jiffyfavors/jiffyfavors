<template>
    <v-flex xs12 md4 sm4 lg3>
        <v-card class="mx-auto" max-width="400" flat>
            <span class="bestseller">{{ type.toUpperCase()}}</span>
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
                <v-divider></v-divider>
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
                        <strong>{{item.fees.delivery.platform|toPHP}} + {{item.fees.sc * 0.4}}%</strong>
                    </v-flex>
                    <v-flex xs7 sm7 md7>
                        <strong>Est Job Earning</strong>
                    </v-flex>
                    <v-flex xs5 sm5 md5>
                        <strong>
                            <div class="red--text">
                                <strong>{{ item.fees.delivery.rider|toPHP }} + {{item.fees.sc * 0.6}}%</strong>
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
            return parseFloat(this.item.fees.delivery.platform)
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
            const geocollection = geofirestore.collection('shop_request').doc(this.item.id)
            geocollection.update({
                rider: this.$store.getters['auth/getUser'].id,
                status: 'accepted',
                logs: this.$fireStoreObj.FieldValue.arrayUnion({
                    time: Date.now(),
                    event: 'Order assigned to rider'
                })
            }).then(() => {
              if(this.item.token){
                
                this.$fireFunc.httpsCallable('sendFCMbyToken')({
                    name: 'Shopping Event',
                    title: 'Yey we found your rider!',
                    body: `${this.rider.firstname} will be your rider shopper for ${ this.item.store.name} shopping list.`,
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
