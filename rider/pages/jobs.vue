<template>
    <v-layout wrap text-left align-left fill-height justify-left>
   <loading :active.sync="loading" loader="bars" :is-full-page="true" color="blue" />
        <v-flex xs4 sm4 md4 lg4>
            <v-list dense>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>{{balance|toPHP}}</v-list-item-title>
                        <v-list-item-subtitle>Current</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-flex>
        <v-flex xs4 sm4 md4 lg4>
            <v-list dense>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>{{ongoing_balance|toPHP}}</v-list-item-title>
                        <v-list-item-subtitle>On Hold</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-flex>
        <v-flex xs4 sm4 md4 lg4>
            <v-list dense>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>{{balance-ongoing_balance|toPHP}}</v-list-item-title>
                        <v-list-item-subtitle>Available</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
            <v-tabs class="white--text"  centered center-active >
                <v-tabs-slider></v-tabs-slider>
                <v-tab @click.stop="$store.dispatch('rider/getAvailableJobs')">Available</v-tab>
                <v-tab @click.stop="$store.dispatch('rider/getJobs')">Ongoing</v-tab>
                <v-tab @click.stop="$store.dispatch('rider/getCompeletedJobs')">Completed</v-tab>
                <v-tab-item>
                    <v-layout wrap justify-center fill-height align-center text-left>
                        <job-preview v-for="(job,index) in open.food " type="food" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-preview>
                        <job-preview v-for="(job,index) in open.asap_food " type="food" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-preview>
                        <job-prev-shop v-for="(job,index) in open.shop" type="shop" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-prev-shop>
                        <job-prev-shop v-for="(job,index) in open.asap_shop" type="shop" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-prev-shop>
                        <job-prev-bills v-for="(job,index) in open.billspay" type="bills payment" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-prev-bills>
                        <job-prev-bills v-for="(job,index) in open.asap_billspay" type="bills_payment" :item="job" :id="`job_open_`+job.id+`_`+index" :key="`job_open_`+job.id+`_`+index"></job-prev-bills>
                    </v-layout>
                </v-tab-item>
                <v-tab-item>
                    <v-layout wrap justify-center fill-height align-center text-left>
                        <job-card v-for="(job,index) in accepted.food" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card>
                        <job-card-bills v-for="(job,index) in accepted.billspay" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card-bills>
                         <job-card-shop v-for="(job,index) in accepted.shop" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card-shop>
                    </v-layout>
                </v-tab-item>
                <v-tab-item>
                    <v-layout wrap justify-center align-center text-left>
                        <job-card v-for="(job,index) in completed.food" :item="job" :id="`job_com_`+job.id+`_`+index" :key="`job_com_`+job.id+`_`+index"></job-card>
                        <job-card-bills v-for="(job,index) in completed.billspay" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card-bills>
                            <job-card-shop v-for="(job,index) in completed.shop" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card-shop>
                    </v-layout>
                </v-tab-item>
            </v-tabs>
        </v-flex>
    </v-layout>
</template>
<script>
import JobCard from '~/components/JobCard.vue'
import JobPreview from '~/components/JobPreview.vue'
import JobPrevShop from '~/components/JobPrevShop.vue'
import JobPrevBills from '~/components/JobPrevBills.vue'
import JobCardBills from '~/components/JobCardBills.vue'
import JobCardShop from '~/components/JobCardShop.vue'
import clonedeep from 'lodash.clonedeep'
import {
    GeoFirestore
} from 'geofirestore'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
    components: {
        Loading,
        JobCard,
        JobPreview,
        JobPrevShop,
        JobPrevBills,
        JobCardBills,
        JobCardShop
    },
    mounted(){
        this.$store.commit('rider/setLoading',false)
    },
    computed: {
        loading(){
              return this.$store.getters['rider/isLoading']
        },
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
    beforeMount() {
        if (this.user) 
            this.$store.dispatch('auth/getProfile')
        //     this.$store.dispatch('rider/getAvailableJobs')
        //     this.$store.dispatch('rider/getCompeletedJobs')
        //     this.$store.dispatch('rider/getJobs')
        // }
    },
    methods: {},
};
</script>
