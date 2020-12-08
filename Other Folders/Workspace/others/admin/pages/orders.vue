<template>
    <v-card flat class="overflow-hidden">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue"></loading>
        <v-app-bar absolute color="#43a047" dark fixed app>
            <template v-slot:img="{ props }">
                <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
            </template>
            <v-toolbar-title>Orders</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs dense v-model="tab" center-active background-color="transparent" color="basil" grow>
                    <v-tab v-for="item in areas" :key="item.id" dense> {{ item.name }} </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-sheet class="overflow-y-auto mb-10" min-height="80vh" max-height="100vh">
            <v-content>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-for="item in areas" :key="item.id">
                        <v-card color="basil" flat>
                            <v-tabs centered dense v-model="areatab" center-active background-color="transparent" color="basil" grow>
                                <v-tab v-for="area in item.areas" :key="area.id" dense> {{ area.name }} </v-tab>
                            </v-tabs>
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
                                <v-tab-item>
                                    <v-layout wrap justify-center fill-height align-center text-left>
                                        <job-card v-for="(job,index) in accepted" :item="job" :id="`job_acc_`+job.id+`_`+index" :key="`job_acc_`+job.id+`_`+index"></job-card>
                                    </v-layout>
                                </v-tab-item>
                                <v-tab-item>
                                    <v-layout wrap justify-center align-center text-left>
                                        <completed-job v-for="(job,index) in completed" :item="job" :id="`job_com_`+job.id+`_`+index" :key="`job_com_`+job.id+`_`+index"></completed-job>
                                    </v-layout>
                                </v-tab-item>
                            </v-tabs>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-content>
        </v-sheet>
    </v-card>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import JobCard from '~/components/JobCard.vue'
import JobPreview from '~/components/JobPreview.vue'
import CompletedJob from '~/components/CompletedJob.vue'
export default {
    layout: 'menu',
    components: {
        Loading,
        JobPreview,
        JobCard,
        CompletedJob
    },
    data() {
        return {
            tab: null,
            areatab: null,
            isLoading: false,
            db_areas: [],
            isFetch: false,
        }
    },
    mounted() {
        const firestore = this.$fireStoreObj()
        var q = firestore.collection('areas')
        this.$bind('db_areas', q)
    },
    computed: {
        current_area() {
            return this.$store.getters['admin/getCurrentArea']
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
        },
        areas() {
            var areas = []
            var c = Object.assign({}, {
                name: 'Philippines',
                id: 'PHP',
                areas: []
            })
            this.db_areas.forEach(a => {
                var d = a.d
                d.id = a.id
                c.areas.push(d)
            })
            c.areas.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            areas.push(c)
            return areas
        }
    },
    watch: {
        isFetch(val) {
            if (val) this.updateJobs()
        },
        areatab() {
            var area = this.areas[this.tab].areas[this.areatab]
            this.$store.commit('admin/setCurrentArea', area)
            this.isFetch = false
            setTimeout(() => {
                this.isFetch = true
            }, 3500)
        }
    },
    methods: {
        updateJobs() {
            this.isLoading = true
            this.$store.dispatch('rider/getJobs', {
                status: 'placed',
                bindTo: 'openjobs',
                lat: this.current_area.coordinates.latitude,
                lng: this.current_area.coordinates.longitude
            }).then(() => {
                this.$store.dispatch('rider/getJobs', {
                    status: 'accepted',
                    bindTo: 'acceptedjobs',
                    lat: this.current_area.coordinates.latitude,
                    lng: this.current_area.coordinates.longitude
                }).then(() => {
                    this.$store.dispatch('rider/getJobs', {
                        status: 'completed',
                        bindTo: 'completedjobs',
                        lat: this.current_area.coordinates.latitude,
                        lng: this.current_area.coordinates.longitude
                    }).then(()=>{
                        this.isLoading = false
                    })
                })
            })
        }
    }
}
</script>
