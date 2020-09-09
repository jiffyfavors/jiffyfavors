<template>
    <v-container fluid>
        <v-layout wrap justify-center align-center text-left v-show="activeBtn===0">
              <v-row align="center"
      justify="center">
            <v-flex xs12 sm6 md4>
                <v-card class="ma-2">
                    <v-card-title>Monthly Revenue</v-card-title>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Order Value</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Released Credits</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Total Revenue</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Revenue Share</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>For Remittance</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-list-item-title>{{0|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Unpaid Remittance</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card class="ma-2">
                    <v-card-title>Partners</v-card-title>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{storeCount.active}}</v-list-item-title>
                                    <v-list-item-subtitle>Active Stores</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-list-item-title>{{storeCount.inactive}}</v-list-item-title>
                                    <v-list-item-subtitle>Inactive Stores</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-row>
        </v-layout>
        <v-card v-if="orders.today.length>0 && activeBtn ===1">
            <v-card-title>Today's Order</v-card-title>
            <v-card-text>
                <v-layout wrap justify-center align-center text-left>
                    <order-summary v-for="(order, index) in orders.today" :key="order.id" :item="order"></order-summary>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-bottom-navigation v-model="activeBtn" color="indigo" fixed bottom dense grow>
            <v-btn @click.stop="getStores()">
                <span>Dashboard</span>
            </v-btn>
            <v-btn @click.stop="getOrdersToday()">
                <span>Orders</span>
            </v-btn>
<!--             <v-btn @click.stop="">
                <span>Revenue</span>
            </v-btn> -->
        </v-bottom-navigation>
    </v-container>
</template>
<script>
import OrderSummary from '~/components/OrderSummary'
export default {
    layout: 'default',
    data() {
        return {
            activeBtn: 0,
            restos: []
        }
    },
    components: {
        OrderSummary
    },
    mounted() {
        this.getReport()
            // this.getOrdersToday()
            //  this.getAreas()
    },
    computed: {
        storeCount() {
            let inactive = this.restos.filter(x => x.d.draft === true).length
            let active = this.restos.filter(x => x.d.draft === false).length
            return {
                active: active,
                inactive: inactive
            }
        },
        defaultArea() {
            return this.$store.getters['auth/getDefaultArea']
        },
        orders() {
            return this.$store.getters['auth/getOrders']
        },
    },
    watch: {
        defaultArea() {
            this.getReport()
        }
    },
    methods: {
        
        getReport() {
            if (this.activeBtn === 1) this.getOrdersToday()
            this.getStores()
        },
        getOrdersToday() {
            this.$store.dispatch('auth/getTodaysOrder', {
                area: this.defaultArea.id
            })
        },
        getStores() {
            let stores = this.$fireStoreObj().collection('merchant').where('d.area', '==', this.defaultArea.id)
            this.$bind('restos', stores)
        },
    }
};
</script>
