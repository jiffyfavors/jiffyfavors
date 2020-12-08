<template>
    <v-card flat>
        <v-layout wrap align-center>
            <v-flex v-for="item in data.values" :key="data.name + '_' + item" xs12 md4 sm4 lg4 class="pa-1">
                <v-lazy v-model="isActive" :options="{threshold: .6}" transition="fade-transition">
                    <food-card :id="item" :merchant="merchant"></food-card>
                </v-lazy>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>

import FoodCard from '~/components/FoodCard'
export default {
    components: {
        FoodCard
    },
    props: {
        data: {
            type: Object,
            default: null
        },
        merchant: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            isActive: false
        }
    },
};
</script>
