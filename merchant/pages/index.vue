<template>
    <v-card>
        <v-card-title>Today's Order</v-card-title>
        <v-card-text>
            <v-layout wrap justify-center align-center text-left>
                <order-summary v-for="(order, index) in orders.today" :key="order.id" :item="order"></order-summary>
            </v-layout>
        </v-card-text>
    </v-card>
</template>
<script>
import OrderSummary from '~/components/OrderSummary'
export default {
    layout: 'default',
       components: {
        OrderSummary
    },
    mounted() {
        this.getStores()
    },
    computed: {
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
    methods: {
        getStores() {
            let stores = this.$fireStoreObj().collection('merchant').where('d.managed_by', 'array-contains', this.getCurrentBusiness.id)
            this.$bind('restos', stores)
        },
        getOrdersToday() {
            console.log(this.orders)
            this.$store.dispatch('auth/getTodaysOrder', {
                ids: this.store_ids
            })
        },
    }
};
</script>
