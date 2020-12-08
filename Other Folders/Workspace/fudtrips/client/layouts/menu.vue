<template>
    <v-app id="e3">
        <nuxt />
        <v-bottom-navigation dense color="blue" grow fixed app>
            <v-btn icon to="/">
                <span>Home</span>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-btn icon to="/food">
                <span>Food</span>
                <v-icon>mdi-food</v-icon>
            </v-btn>
            <v-btn icon to="/bills_payment">
                <span>Bills</span>
                <v-icon>mdi-account-cash</v-icon>
            </v-btn>
            <v-btn icon to="/shopping">
                <span>Shop</span>
                <v-icon>mdi-cart-arrow-right</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>
<script>
