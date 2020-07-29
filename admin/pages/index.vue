<template>
    <v-layout>
        <v-container fluid>
            <v-tabs grow background-color="rgba(100,115,201)" v-model="type" center-active icons-and-text centered color="white">
                <v-tab dense>Food
                    <v-icon dense>mdi-food</v-icon>
                </v-tab>
                <v-tab dense>Shopping
                    <v-icon dense>mdi-cart-arrow-right</v-icon>
                </v-tab>
                <v-tab dense>Bills
                    <v-icon dense>mdi-account-cash</v-icon>
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="type">
                <v-tab-item>
                    <v-layout flat v-if="trans.orders.size < 1" wrap justify-center align-center text-left>
                        <v-flex xs12 md4 sm4 lg3 class="text-center">
                            <v-icon class="mb-2" color="error" size="200"> mdi-food </v-icon>
                            <blockquote class="blockquote mb-5">
                                <span style="font-size:50px;">&#128546;</span>
                                <h4>No Food Order</h4> </blockquote>
                        </v-flex>
                    </v-layout>
                    <v-tabs v-if="trans.orders.size > 0" v-model="tab" center-active centered background-color="transparent" color="blue">
                        <v-tab dense> Ongoing </v-tab>
                        <v-tab dense> History </v-tab>
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-layout wrap justify-center align-center text-left>
                                    <order-card v-for="(order, index) in trans.orders.data.filter(
                      (o) => o.status == 'placed' || o.status == 'accepted'
                    )" :key="index" :item="order" /> </v-layout>
                            </v-tab-item>
                            <v-tab-item>
                                <v-layout wrap justify-center fill-height align-center text-left>
                                    <order-card v-for="(order, index) in trans.orders.data.filter(
                      (o) => o.status != 'placed' && o.status != 'accepted'
                    )" :key="index" :item="order" /> </v-layout>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-tab-item>
                <v-tab-item>
                    <v-layout flat v-if="trans.shops.size < 1" wrap justify-center align-center text-left>
                        <v-flex xs12 md4 sm4 lg3 class="text-center">
                            <v-icon class="mb-2" color="error" size="200"> mdi-cart-off </v-icon>
                            <blockquote class="blockquote mb-5">
                                <span style="font-size:50px;">&#128546;</span>
                                <h4>No Shopping Request</h4> </blockquote>
                        </v-flex>
                    </v-layout>
                    <v-tabs v-if="trans.shops.size >0" v-model="tab" center-active centered background-color="transparent" color="blue">
                        <v-tab dense> Ongoing </v-tab>
                        <v-tab dense> History </v-tab>
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-layout wrap justify-center align-center text-left>
                                    <shop-list-card v-for="(shop, index) in trans.shops.data.filter(
                      (o) => o.status != 'cancelled' || o.status != 'completed'
                    )" :key="index" :item="shop" /> </v-layout>
                            </v-tab-item>
                            <v-tab-item>
                                <v-layout wrap justify-center fill-height align-center text-left>
                                    <shop-list-card v-for="(shop, index) in trans.shops.data.filter(
                      (o) => o.status == 'completed' || o.status == 'cancelled'
                    )" :key="index" :item="shop" /> </v-layout>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-tab-item>
                <v-tab-item>
                    <v-layout flat v-if="trans.bills.size < 1" wrap justify-center align-center text-left>
                        <v-flex xs12 md4 sm4 lg3 class="text-center">
                            <v-icon class="mb-2" color="error" size="200"> mdi-account-cash </v-icon>
                            <blockquote class="blockquote mb-5">
                                <span style="font-size:50px;">&#128546;</span>
                                <h4>No Bills Payment</h4> </blockquote>
                        </v-flex>
                    </v-layout>
                    <v-tabs v-if="trans.bills.size >0" v-model="tab" center-active centered background-color="transparent" color="blue">
                        <v-tab dense> Ongoing </v-tab>
                        <v-tab dense> History </v-tab>
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-layout wrap justify-center align-center text-left>
                                    <bills-card v-for="(bill, index) in trans.bills.data.filter(
                      (o) => o.appointment.status == 'placed' || o.appointment.status == 'accepted'
                    )" :key="index" :item="bill" /> </v-layout>
                            </v-tab-item>
                            <v-tab-item>
                                <v-layout wrap justify-center fill-height align-center text-left>
                                    <bills-card v-for="(bill, index) in trans.bills.data.filter(
                      (o) => o.appointment.status != 'placed' && o.appointment.status != 'accepted'
                    )" :key="index" :item="bill" /> </v-layout>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-layout>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import OrderCard from '~/components/OrderCard.vue'
import BillsCard from '~/components/BillsCard'
import ShopListCard from '~/components/ShopListCard'
export default {
    components: {
        Loading,
        OrderCard,
        BillsCard,
        ShopListCard
    },
    layout: 'default',
    data() {
        return {
            tab: null,
            type: null
        }
    },
    computed: {
        trans() {
            return this.$store.getters['auth/getMyTransaction']
        }
    },
    methods: {
        isOngoing(status) {
            return status === 'placed' || status === 'accepted'
        }
    }
};
</script>
