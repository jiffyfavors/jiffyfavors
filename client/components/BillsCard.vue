<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card class="mx-auto" max-width="400">
            <span class="bestseller mb-5">{{ item.status.toUpperCase() }}</span>
            <v-card-text>
                <v-card-actions v-if="item.rider !== 'unassigned' && checkIfOngoing(item.status)">
                    <v-list dense>
                        <v-list-item dense class="grow">
                            <v-list-item-content>
                                <v-list-item-title>{{rider_profile.profile.firstname}} {{rider_profile.profile.lastname}} </v-list-item-title>
                                <v-list-item-subtitle>Your rider</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-btn icon dense :href="`tel:`+rider_profile.contact">
                                <v-icon color="blue"> mdi-phone </v-icon>
                            </v-btn>
                        </v-list-item>
                        <v-list-item dense class="grow">
                            <v-list-item-content>
                                <v-list-item-title>{{$getNow(item.logs[item.logs.length-1].time).substring(10)}} {{item.logs[item.logs.length-1].event}}</v-list-item-title>
                                <v-list-item-subtitle>Latest Status Update</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-actions>
                <v-layout wrap class="mt-5">
                    <v-list-item dense class="grow" v-if="item.rider === 'unassigned' && checkIfOngoing(item.status)">
                        <v-list-item-content>
                            <v-list-item-title> Waiting for rider to accept the job... </v-list-item-title>
                            <v-progress-linear indeterminate color="cyan" />
                            <v-list-item-subtitle>Your rider</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-flex xs6 sm6 md6>
                        <strong>Request No.</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.id }}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>Appoinment Time</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.appointment.date }} {{item.appointment.time}}</strong>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-flex xs6 sm6 md6>
                        <strong>Service Fee</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.fees.sf | toPHP }}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>Pickup Fee -
                        <small>{{ item.fees.pickup.distance}} km</small>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.fees.pickup.fees.platform + item.fees.pickup.fees.rider | toPHP }}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>Delivery Fee -
                        <small>{{ item.fees.dropoff.distance}} km</small>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.fees.dropoff.fees.platform + item.fees.dropoff.fees.rider | toPHP }}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <span class="subheading">
                            <strong>Total</strong>
                        </span>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <div class="ml-2 red--text">
                            <strong>{{ item.fees.pickup.fees.platform + item.fees.pickup.fees.rider + item.fees.dropoff.fees.platform + item.fees.dropoff.fees.rider + item.fees.sf | toPHP }}</strong>
                        </div>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.biller.logo" /> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title> {{ item.biller.name }} </v-list-item-title>
                        <v-list-item-subtitle> {{ item.biller.branch }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn small dense v-if="checkIfOngoing(item.status)" text color="red" @click.stop="dialog = true"> Cancel </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card-actions>
        </v-card>
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Appointment Cancellation</v-card-title>
                    <v-card-text>You can cancel your appointment as long as no rider accepted the job.</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="green darken-1" text @click="dialog = false"> Close </v-btn>
                        <v-btn color="green darken-1" text @click="cancelAppointment(), (dialog = false)">Yes, Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-flex>
</template>
<script>
//Manage Biller
//Change Pickup Address
//Change Drop Off Address
//Change Appointment  Time
import {
    GeoCollectionReference
} from 'geofirestore'
export default {
    props: {
        item: Object
    },
    data() {
        return {
            orderSheet: false,
            info: '',
            snackbar: false,
            dialog: false,
            rider_profile: {
                contact: '',
                profile: {
                    firstname: ''
                }
            },
        }
    },
    mounted() {
        if (this.item.rider !== 'unassigned') {
            this.getRiderInfo()
        }
    },
    methods: {
        getRiderInfo() {
            var rider = new GeoCollectionReference(this.$fireStoreObj().collection('riders'))
            this.$bind('rider_profile', rider.doc(this.item.rider))
        },
        checkIfOngoing(val) {
            if (val === 'placed' || val === 'ongoing' || val === 'accepted' || val === 'enroute') {
                return true
            } else {
                return false
            }
        },
        cancelAppointment() {
            this.$fireStoreObj().collection('billspay_request').doc(this.item.id).update({
                'd.status': 'cancelled'
            }).then(() => {
                this.orderSheet = false
                this.info = 'Appointment is now cancelled'
                this.snackbar = true
            })
        },
    },
};
</script>
