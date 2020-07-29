<template>
    <v-layout wrap align-center>
        <v-flex xs12 md4 sm4 lg4 class="pa-1" v-for="fooditem in food" :key="fooditem.id">
            <v-lazy v-model="isActive" :options="{
          threshold: .6
        }" min-height="200" transition="fade-transition">
                <v-card class="mx-auto" max-width="100%" outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <h3>{{ fooditem.name }}</h3>
                            <small>
                                <p style="font-style:italic" v-html="fooditem.desc"></p>
                            </small>
                            <div class="pl-2 subtitle-1 red--text">
                                <span class="caption grey--text"> From</span>
                                <div class="ml-2">
                                    <strong>{{ fooditem.base_price|toPHP }}</strong>
                                </div>
                            </div>
                        </v-list-item-content>
                        <v-list-item-avatar tile size="100">
                            <v-img :src="fooditem.img" @error="errorLoader(fooditem.id)"></v-img>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-lazy>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    data() {
            return {
                food: [],
                isActive: false,
            }
        },
        methods: {
            errorLoader(id) {
                console.log('Updating', id)
                this.$fireStoreObj().collection('foods').doc(id).update({
                    img: ''
                })
            }
        },
        mounted() {
            const firestore = this.$fireStoreObj()
            var q = firestore.collection('foods')
            this.$bind('food', q)
        }
};
</script>
