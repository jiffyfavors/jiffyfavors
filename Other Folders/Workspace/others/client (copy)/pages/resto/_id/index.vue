<template>

        <v-card flat>
            <v-app-bar absolute color="rgba(100,115,201)" dark shrink-on-scroll prominent :src="business.backdrop" fade-img-on-scroll scroll-target="#scrolling-techniques-3" scroll-threshold="300" fixed app>
                <template v-slot:img="{ props }">
                    <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
                </template>
                <v-btn icon @click.stop="$router.go(-1)">
                    <v-icon> mdi-arrow-left-bold</v-icon>
                </v-btn>
                <v-toolbar-title>{{business.business_name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon> mdi-share-variant</v-icon>
                </v-btn>
                <v-btn icon id="cart" to="/cart" v-if="cartSize > 0">
                    <v-badge color="red">
                        <template v-slot:badge overlap>{{cartSize}} </template>
                        <v-icon color="white" dense>mdi-cart-outline</v-icon>
                    </v-badge>
                </v-btn>
                <template v-slot:extension>
                    <v-tabs show-arrows center-active centered dense v-model="tab" background-color="transparent" color="basil" grow>
                        <v-tab dense v-for="item in business.menu" @click.stop="scrollTo()" :key="item.name"> {{ item.name}} </v-tab>
                    </v-tabs>
                </template>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="100vh">
                <v-container fluid>
                    <v-content>
                        <v-tabs-items v-model="tab">
                            <v-tab-item v-for="item in business.menu" :key="item.name">
                                <v-card flat>
                                    <v-card-text>
                                        <food-item :data="item" :merchant="business"></food-item>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-content>
                </v-container>
            </v-sheet>
        </v-card>
   
</template>
<script>
import {
    GeoCollectionReference,
    GeoFirestore
} from 'geofirestore'
import FoodItem from '~/components/FoodItem.vue'
export default {
    layout: 'area',
    components: {
        FoodItem
    },
    // head() {
    //     let biz = this.business;
    //     return {
    //         title: `${biz.business_name} - Online Delivery`,
    //         meta: [{
    //             hid: `description`,
    //             name: 'description',
    //             content: `Order Online at ${biz.business_name} ${biz.branch}`
    //         }]
    //     }
    // },
    computed: {
        cartSize() {
            return this.$store.getters['cart/getCartItemCount']
        },
        itemCount() {
            return this.$store.getters['cart/getCartItemCount']
        },
        totalPrice() {
            return this.$store.getters['cart/getTotal']
        }
    },
    watch: {
        cartSize() {
            if (this.cartSize > 0) {
                this.$nextTick(() => {
                    this.shake()
                })
            }
        }
    },
    asyncData({
        app,
        params,
        error
    }) {
        const db = app.$fireStore
        try {
            var geocollection = new GeoCollectionReference(db.collection('merchant'))
            return geocollection.where('url', '==', params.id).get().then(data => {
                var d = data.docs[0].data()
                return db.collection('foods').where('owner', '==', data.docs[0].id).get().then(food => {
                    var foods = []
                    food.docs.forEach(f => {
                        var fooditem = f.data()
                        fooditem.id = f.id
                        fooditem.owner = data.docs[0].id
                        foods.push(fooditem)
                    })
                    var menu = []
                    d.menu.forEach(m => {
                        var values = []
                        m.values.forEach(f => {
                            foods.forEach(fi => {
                                if (fi.id === f) values.push(fi)
                            })
                        })
                        menu.push({
                            name: m.name,
                            values: values
                        })
                    })
                    var biz = {
                        business: {
                            id: data.docs[0].id,
                            business_name: d.business_name,
                            branch: d.branch,
                            backdrop: d.backdrop,
                            logo: d.logo,
                            menu: menu,
                            rates: d.rates,
                            location: d.coordinates,
                            foods: foods
                        }
                    }
                    console.log(biz)
                    return biz
                })
            })
        } catch (e) {
            error({
                statusCode: 404,
                message: 'Blog not found'
            })
        }
    },
    methods: {
        scrollTo() {
            document.getElementById('scrolling-techniques-3').scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },
        shake() {
            document.getElementById('cart').classList.add('shake')
            setTimeout(() => {
                document.getElementById('cart').classList.remove('shake')
            }, 1500);
        }
    },
    data() {
        return {
            business: null,
            dialog: false,
            tab: null,
            business_id: '',
            resto: {
                name: 'JB'
            },
            menu: []
        }
    },
};
</script>
<style scoped>
.shake {
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
