<template>
    <v-container fluid>
        <v-layout wrap justify-center align-center text-left v-if="activeBtn===0">
            <order-summary v-for="(order, index) in orders.today" :key="order.id" :item="order"></order-summary>
        </v-layout>
        <v-layout wrap justify-center align-center text-left v-if="activeBtn===1">
            <order-summary v-for="(order, index) in orders.advance" :key="order.id" :item="order"></order-summary>
        </v-layout>
        <v-layout wrap justify-center align-center text-left v-if="activeBtn===2">
            <order-summary v-for="(order, index) in orders.history" :key="order.id" :item="order"></order-summary>
            <v-fab-transition>
                <v-btn fab small fixed bottom right @click.stop="modal = true" class="fabicon mb-10">
                    <v-icon color="blue">mdi-calendar</v-icon>
                </v-btn>
            </v-fab-transition>
        </v-layout>
        <v-bottom-navigation v-model="activeBtn" color="indigo" fixed bottom grow>
            <v-btn @click.stop="getOrdersToday()">
                <span>Today</span>
            </v-btn>
            <v-btn @click.stop="getAdvanceOrder()">
                <span>Advanced</span>
            </v-btn>
            <v-btn>
                <span>History</span>
            </v-btn>
        </v-bottom-navigation>
        <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
            <v-date-picker v-model="date" scrollable :max="max">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
            </v-date-picker>
        </v-dialog>
    </v-container>
</template>
<script>
import {
    GeoCollectionReference,
    GeoFirestore
} from 'geofirestore'
import OrderSummary from '~/components/OrderSummary'
export default {
    layout: 'default',
    components: {
        OrderSummary
    },
    data() {
        return {
            activeBtn: 0,
            type: null,
            dialog: false,
            date: this.$getNow(),
            modal: false
        }
    },
    computed: {
        max() {
            return this.$getNow(1).substring(0, 10)
        },
        orders() {
            return this.$store.getters['auth/getOrders']
        },
        store_ids() {
            let resto = []
            this.restos.forEach(biz => {
                resto.push(biz.id)
            })
            return resto
        },
        getCurrentBusiness() {
            return this.$store.getters['auth/getDefaultBusiness']
        },
        resto() {
            let resto = []
            this.restos.forEach(biz => {
                resto.push({
                    id: biz.id,
                    data: biz.d
                })
            })
            return resto
        },
    },
    watch: {
        date(val) {
            this.$store.dispatch('auth/getOrderHistory', {
                ids: this.store_ids,
                date: val
            })
        },
        getCurrentBusiness(val) {
            this.getStores()
        }
    },
    mounted() {
        this.getStores()
    },
    methods: {
        getStores() {
            let stores = this.$fireStoreObj().collection('merchant').where('d.managed_by', 'array-contains', this.getCurrentBusiness.id)
            this.$bind('restos', stores)
        },
        getOrdersToday() {
            this.$store.dispatch('auth/getTodaysOrder', {
                ids: this.store_ids
            })
        },
        getAdvanceOrder() {
            this.$store.dispatch('auth/getAdvanceOrder', {
                ids: this.store_ids
            })
        }
    }
};
</script>
<style scoped>
          .fabicon {
    position: fixed;
    bottom: 15%;
    right: 5%;
  }
  
  .v-input--selection-controls {
      padding: 0px !important;
      margin: 0px !important;
    }
    
    .v-messages {
        display: none;
      }
      
      #create .v-speed-dial {
          position: absolute;
        }
        
        #create .v-btn--floating {
            position: relative;
          }
</style>
