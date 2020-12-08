<template>
    <v-card>
        <v-layout text-center align-center fill-height justify-center>
            <v-flex xs4 sm4 md4>
                <v-list dense>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{balance|toPHP}}</v-list-item-title>
                            <v-list-item-subtitle>Current</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
            <v-flex xs4 sm4 md4>
                <v-list dense>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{ongoing_balance|toPHP}}</v-list-item-title>
                            <v-list-item-subtitle>On Hold</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
            <v-flex xs4 sm4 md4>
                <v-list dense>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{balance-ongoing_balance|toPHP}}</v-list-item-title>
                            <v-list-item-subtitle>Available</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
        </v-layout>
        <v-card-text>
            <v-tabs background-color="deep-purple accent-4" class="elevation-2" dark centered show-arrows>
                <v-tabs-slider></v-tabs-slider>
                <v-tab>Open</v-tab>
                <v-tab>Current</v-tab>
                <v-tab>Completed</v-tab>
                <v-tab-item>
                    <v-layout wrap justify-center fill-height align-center text-left>
                        <job-preview v-for="(job,index) in open " :item="job" :id="`job_open_`+job.id+`_`+index" v-show="index<1" :key="`job_open_`+job.id+`_`+index"></job-preview>
                    </v-layout>
                </v-tab-item>
                </v-tab-item>
                <v-tab-item>
                    <v-layout wrap justify-center fill-height align-center text-left>
                        <job-card v-for="(job,index) in accepted" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card>
                    </v-layout>
                </v-tab-item>
                <v-tab-item>
                    <v-layout wrap justify-center align-center text-left>
                        <job-card v-for="(job,index) in completed" :item="job" :id="`job_com_`+job.id+`_`+index" :key="`job_com_`+job.id+`_`+index"></job-card>
                    </v-layout>
                </v-tab-item>
            </v-tabs>
        </v-card-text>
    </v-card>
</template>
<script>
import JobCard from '~/components/JobCard.vue'
import JobPreview from '~/components/JobPreview.vue'
import clonedeep from 'lodash.clonedeep'
import {
    GeoFirestore
} from 'geofirestore'
export default {
    components: {
        JobCard,
        JobPreview
    },
    computed: {
        ongoing_balance() {
            return this.$store.getters['rider/getAccBalance']
        },
        balance() {
            return this.$store.getters['auth/getBalance']
        },
        user() {
            return this.$store.getters['auth/getUser']
        },
        jobs() {
            return this.$store.getters['rider/getJobs']
        },
        open() {
            return this.jobs.open
        },
        accepted() {
            return this.jobs.accepted
        },
        completed() {
            return this.jobs.completed
        }
    },
    created() {
        this.updateJobs()
    },
    methods: {
        JobReset(ids) {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            ids.forEach(id => {
                const geocollection = geofirestore.collection('orders').doc(id)
                geocollection.update({
                    'delivery.date': '2020-07-05',
                    assign_rider: 'unassigned',
                    status: 'placed',
                    logs: []
                })
            })
        },
        updateJobs() {
            this.$store.dispatch('rider/getJobs', {
                rider: 'unassigned',
                status: 'placed',
                bindTo: 'openjobs'
            })
            this.$store.dispatch('rider/getJobs', {
                rider: this.user.id,
                status: 'accepted',
                bindTo: 'acceptedjobs'
            })
            this.$store.dispatch('rider/getJobs', {
                rider: this.user.id,
                status: 'completed',
                bindTo: 'completedjobs'
            })
        },
    }
}
</script>
