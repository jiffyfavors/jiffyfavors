<template>
    <v-app id="e3">
        <nuxt />
        <v-bottom-navigation grow color="blue" fixed app>
            <v-btn icon class="btndense" to="/">
                <span>Home</span>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-btn icon class="btndense" to="/food">
                <span>Food</span>
                <v-icon>mdi-food</v-icon>
            </v-btn>
            <v-btn icon class="btndense" to="/rides">
                <span>Ride</span>
                <v-icon>mdi-motorbike</v-icon>
            </v-btn>
            <v-btn icon class="btndense" to="/bills_payment">
                <span>Bills</span>
                <v-icon>mdi-account-cash</v-icon>
            </v-btn>
            <v-btn icon class="btndense" to="/shopping">
                <span>Shop</span>
                <v-icon>mdi-cart-arrow-right</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>
<style scoped>
.btndense{
    min-width: 50px !important;
}
</style>