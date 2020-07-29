<template>
    <v-layout>
        <v-card flat width="100%" class="cardhyt mb-10">
            <nav-drawer v-model="drawer" ></nav-drawer>
            <v-app-bar  color="rgba(100,115,201)" app dark flat>
                <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
                   <v-avatar class="mr-2" rounded size="35">
                    <v-img src="/icon.png" /> </v-avatar>
                <v-toolbar-title>Jiffy Favors </v-toolbar-title>
                <v-spacer></v-spacer>
                <client-only>
                    <v-btn v-if="cartSize > 0" icon to="/cart">
                        <v-badge color="red">
                            <template #badge overlap> {{ cartSize }} </template>
                            <v-icon color="white" dense> mdi-cart-outline </v-icon>
                        </v-badge>
                    </v-btn>
                </client-only>
                  
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto fill-height">
                <v-container fluid>
                    <v-content>
                        <v-layout wrap justify-center align-center text-left>
                            <v-flex xs6 md4 sm4 lg3 class="text-left pa-1">
                                <v-card color="red" dark to="/food">
                                    <v-card-title>
                                        <v-icon size="30">mdi-food-fork-drink</v-icon>Food</v-card-title>
                                    <v-card-subtitle>Order your food online and have it delivered to you</v-card-subtitle>
                                </v-card>
                            </v-flex>
                            <v-flex xs6 md4 sm4 lg3 class="text-left pa-1">
                                <v-card color="green" dark to="/bills_payment">
                                    <v-card-title>
                                        <v-icon size="30">mdi-account-cash</v-icon>Pay Bills</v-card-title>
                                    <v-card-subtitle>Pay your bills without going out and waiting in line</v-card-subtitle>
                                </v-card>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap justify-center align-center text-left>
                            <v-flex xs12 md6 sm6 lg6 class="text-left pa-1">
                                <v-card color="blue" dark to="/shopping">
                                    <v-card-title>
                                        <v-icon size="30">mdi-cart-arrow-right</v-icon>Groceries, Market & Meds</v-card-title>
                                    <v-card-subtitle>Shop household supplies, medicine,local market (meat,fish & veggies) without going out</v-card-subtitle>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-content>
                </v-container>
            </v-sheet>
        </v-card>
    </v-layout>
</template>
<script>
export default {
    data() {
        return {
            drawer: false,
        }
    },
    computed: {
        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        }
    }
};
</script>
