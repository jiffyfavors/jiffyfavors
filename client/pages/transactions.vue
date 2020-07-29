<template>
    <v-layout>
        <v-card flat width="100vw" class="overflow-hidden">
              <nav-drawer v-model="drawer" ></nav-drawer>
            <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
            <v-app-bar color="rgba(100,115,201)"  style="z-index:2" dark fixed app>
               <v-app-bar-nav-icon   @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
                <v-avatar  class="mr-2" rounded size="35">
                    <v-img src="/icon.png" /> </v-avatar>
                <v-toolbar-title>Jiffy Favors</v-toolbar-title>
                <v-spacer></v-spacer>
                   <client-only>
                      <v-btn v-if="cartSize > 0" icon to="/cart">
                        <v-badge color="red">
                            <template #badge overlap> {{ cartSize }} </template>
                            <v-icon color="white" dense> mdi-cart-outline </v-icon>
                        </v-badge>
                    </v-btn>
                   </client-only>
                <template #extension>
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
                </template>
            </v-app-bar>
            <v-sheet class="overflow-y-auto mb-10" min-height="80vh" max-height="100vh">
                <v-content>
                    <v-tabs-items v-model="type">
                        <v-tab-item>
                            <v-layout flat v-if="trans.orders.size < 1" wrap justify-center align-center text-left>
                                <v-flex xs12 md4 sm4 lg3 class="text-center">
                                    <v-icon class="mb-2" color="error" size="200"> mdi-cart-off </v-icon>
                                    <blockquote class="blockquote mb-5">
                                        <span style="font-size:50px;">&#128546;</span>
                                        <h4>There's nothing here. Want to order something?</h4> </blockquote>
                                    <footer>
                                        <v-btn outlined text block to="/food" color="red"> View Menus</v-btn>
                                    </footer>
                                </v-flex>
                            </v-layout>
                            <v-tabs v-if="trans.orders.size > 0" v-model="tab" center-active centered background-color="transparent" color="blue">
                                <v-tab dense> Ongoing </v-tab>
                                <v-tab dense> History </v-tab>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item>
                                        <v-layout wrap justify-center align-center text-left>
                                            <order-card v-for="(order, index) in trans.orders.data.filter(
                          (o) => (o.status !=='cancelled' && o.status !== 'completed')
                        )" :key="index" :item="order" /> </v-layout>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-layout wrap justify-center fill-height align-center text-left>
                                            <order-card v-for="(order, index) in trans.orders.data.filter(
                          (o) => (o.status !== 'placed' && o.status !== 'accepted')
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
                                        <h4>There's nothing here. Want to shop something?</h4> </blockquote>
                                    <footer>
                                        <v-btn outlined text block to="/shopping" color="red">Shop Now</v-btn>
                                    </footer>
                                </v-flex>
                            </v-layout>
                            <v-tabs v-if="trans.shops.size > 0" v-model="tab" center-active centered background-color="transparent" color="blue">
                                <v-tab dense> Ongoing </v-tab>
                                <v-tab dense> History </v-tab>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item>
                                        <v-layout wrap justify-center align-center text-left>
                                            <shop-list-card v-for="(shop, index) in trans.shops.data.filter(
                          (o) =>
                            o.status !== 'cancelled' && o.status !== 'completed'
                        )" :key="index" :item="shop" /> </v-layout>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-layout wrap justify-center fill-height align-center text-left>
                                            <shop-list-card v-for="(shop, index) in trans.shops.data.filter(
                          (o) =>
                            o.status !== 'placed' && o.status !== 'accepted'
                        )" :key="index" :item="shop" /> </v-layout>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-tabs>
                        </v-tab-item>
                        <v-tab-item>
                            <v-layout flat v-if="trans.bills.size < 1" wrap justify-center align-center text-left>
                                <v-flex xs12 md4 sm4 lg3 class="text-center">
                                    <v-icon class="mb-2" color="error" size="200"> mdi-cart-off </v-icon>
                                    <blockquote class="blockquote mb-5">
                                        <span style="font-size:50px;">&#128546;</span>
                                        <h4>
                      There's nothing here. You want to pay your bill with us?
                    </h4> </blockquote>
                                    <footer>
                                        <v-btn outlined text block to="/bills_payment" color="red">Show Biller</v-btn>
                                    </footer>
                                </v-flex>
                            </v-layout>
                            <v-tabs v-if="trans.bills.size > 0" v-model="tab" center-active centered background-color="transparent" color="blue">
                                <v-tab dense> Ongoing </v-tab>
                                <v-tab dense> History </v-tab>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item>
                                        <v-layout wrap justify-center align-center text-left>
                                            <bills-card v-for="(bill, index) in trans.bills.data.filter(
                          (o) => o.status !== 'completed' && o.status != 'cancelled'
                        )" :key="index" :item="bill" /> </v-layout>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-layout wrap justify-center fill-height align-center text-left>
                                            <bills-card v-for="(bill, index) in trans.bills.data.filter(
                          (o) => o.status != 'placed' && o.status != 'accepted'
                        )" :key="index" :item="bill" /> </v-layout>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-tabs>
                        </v-tab-item>
                    </v-tabs-items>
                </v-content>
            </v-sheet>
        </v-card>
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
    layout: 'menu',
    data() {
        return {
            drawer:false,
            tab: null,
            type: null,
            isLoading: true
        }
    },
    computed: {

        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        trans() {
            return this.$store.getters['auth/getMyTransaction']
        }
    },
    mounted() {
        var ot = this.trans.shops.data.filter(
            (o) => o.status != 'cancelled' && o.status != 'completed')
        console.log(ot)
        this.$store.dispatch('auth/getMyTransaction').then(() => {
            this.isLoading = false
        }).catch((e) => {
            this.isLoading = false
        })
    },
    methods: {
        isOngoing(status) {
            return status === 'placed' || status === 'accepted'
        }
    }
}
</script>
