<template>
    <v-layout wrap align-center>
        <v-flex xs12 md4 sm4 lg4 class="pa-1" v-for="item in data.values" :key="item.name">
            <v-card class="mx-auto" max-width="100%" outlined @click.stop="current_data = item, generateAddOns(), dialog = true">
                <v-list-item three-line dense>
                    <v-list-item-content>
                        <div>
                            <h3>{{item.name}}</h3></div>
                        <div class="pl-2 subtitle-1 red--text"> <span class="caption grey--text">
         From
          </span>
                            <div class="ml-2"><strong>{{item.base_price|toPHP}}</strong></div>
                        </div>
                    </v-list-item-content>
                    <v-list-item-avatar tile size="100">
                        <v-img :src="item.img"></v-img>
                    </v-list-item-avatar>
                </v-list-item>
            </v-card>
        </v-flex>
        <v-row justify="center" v-if="!isEmpty(current_data)">
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Customize</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{current_data.name}}</v-list-item-title>
                            <v-list-item-subtitle>From {{current_data.base_price|toPHP}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list dense subheader v-for="(item,index) in current_data.options" :key="index">
                        <v-list-item v-if="item.min==1 && item.max==1">
                            <v-list-item-content>
                                <v-list-item-title>{{item.name}}</v-list-item-title>
                                <v-list-item-subtitle>One is required</v-list-item-subtitle>
                                <v-radio-group mandatory v-model="add_on_data[item.name.replace(' ','').toLowerCase()]">
                                    <v-radio v-for="(i,e) in item.values" :label="generateFilter(i)" :value="i" :key="e"></v-radio>
                                </v-radio-group>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="item.max>1">
                            <v-list-item-content>
                                <v-list-item-title>{{item.name}} - Optional</v-list-item-title>
                                <v-list-item-subtitle>Select up to {{item.max }}</v-list-item-subtitle>
                                <v-col cols="12" sm="6" md="6" xs="12">
                                    <v-checkbox dense multiple v-for="(i,e) in item.values" v-model="add_on_data[item.name.replace(' ','').toLowerCase()]" :label="generateFilter(i)" :value="i" :disabled="add_on_data[item.name.replace(' ','').toLowerCase()].length===item.max && add_on_data[item.name.replace(' ','').toLowerCase()].indexOf(i)===-1" :key="e"></v-checkbox>
                                </v-col>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Special Instruction</v-list-item-title>
                            <v-list-item-subtitle>e.g Allergy to some ingredients</v-list-item-subtitle>
                            <v-textarea outlined v-model="instructions" name="input-7-4" label="Instruction" value="" placeholder="Please provide instruction if any"></v-textarea>
                        </v-list-item-content>
                    </v-list-item>
                    </v-list>
                    <v-toolbar dense max-width="100%" class="shopresponsive"> <span class="caption grey--text">
         Qty
          </span>
                        <v-icon @click="qty = qty<1? 1 : qty - 1" class="ma-2 white--text" color="green">mdi-minus</v-icon> {{qty}}
                        <v-icon @click="qty = qty + 1" class="ma-2 white--text" color="green">mdi-plus</v-icon>
                        <v-spacer></v-spacer>
                        <v-btn tile :disabled="qty<1" outlined color="red" @click.stop="addToCart"> Add to Cart </v-btn>
                    </v-toolbar>
                </v-card>
            </v-dialog>
        </v-row>
        <v-snackbar color="blue" v-model="snackbar" :timeout="timeout"> Item added to cart </v-snackbar>
        <v-row justify="center">
            <v-dialog v-model="isExist" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Different Store</v-card-title>
                    <v-card-text>There are items in your cart from different merchant. Do you want to replace cart item?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="isExist = false">Cancel</v-btn>
                        <v-btn color="green darken-1" text @click="saveIsExist">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-layout>
</template>
<script>
import deepclone from 'lodash.clonedeep'
export default {
    data() {
            return {
                current_data: {},
                qty: 1,
                snackbar: false,
                add_on_data: {},
                timeout: 2500,
                dialog: false,
                notifications: false,
                sound: true,
                widgets: false,
                radios: true,
                instructions: '',
                isExist: false,
            }
        },
        computed: {
            cartMerchant() {
                return this.$store.getters['cart/getStoreID']
            },
        },
        methods: {
            addClean(data) {
                data = deepclone(data)
                Object.entries(data).map(([key, val]) => {
                    if (Array.isArray(val) && val.length <= 0) delete data[key]
                    if (Object.keys(val).length === 0 && val.constructor === Object) delete data[key]
                })
                return data
            },
            isEmpty(obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) return false;
                }
                return true;
            },
            saveIsExist() {
                this.isExist = false
                this.$store.commit('cart/clearCart')
                var data = {
                    business: this.merchant,
                    item: {
                        info: this.current_data,
                        qty: this.qty,
                        add_ons: this.addClean(this.add_on_data),
                        instructions: this.instructions
                    }
                }
                this.$store.commit('cart/add', data);
                this.snackbar = true
            },
            addToCart() {
                this.dialog = false
                if (this.merchant.id == this.cartMerchant.id) {
                    var data = {
                        business: this.merchant,
                        item: {
                            info: this.current_data,
                            qty: this.qty,
                            add_ons: this.addClean(this.add_on_data),
                            instructions: this.instructions
                        }
                    }
                    this.$store.commit('cart/add', data);
                    this.snackbar = true
                } else {
                    this.isExist = true
                }
            },
            generateFilter(i) {
                var value = parseFloat(i.price)
                var formatter = new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 2,
                    currencyDisplay: 'symbol'
                });
                var vv = formatter.format(Math.round(value));
                return i.name + '(+ ' + vv + ')'
            },
            generateAddOns() {
                var addons = new Object();
                for (var i = 0; i < this.current_data.options.length; i++) {
                    addons[this.current_data.options[i].name.replace(' ', '').toLowerCase()] = []
                }
                this.add_on_data = addons
            }
        },
        props: {
            data: {
                type: Object,
                default: {
                    category: '',
                    items: [{
                        name: '',
                        base_price: 0
                    }]
                }
            },
            merchant: Object
        }
}
</script>
