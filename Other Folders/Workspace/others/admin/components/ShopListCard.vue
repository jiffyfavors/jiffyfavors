<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card class="mx-auto" max-width="400">
            <span class="bestseller">{{ item.status.toUpperCase() }}</span>
            <v-card-text>
                <v-layout wrap class="mt-5">
                    <v-list-item dense class="grow" v-if="item.rider === 'unassigned' && checkIfOngoing(item.status)">
                        <v-list-item-content>
                            <v-list-item-title> Waiting for rider to accept the job... </v-list-item-title>
                            <v-progress-linear indeterminate color="cyan" />
                            <v-list-item-subtitle>Your rider</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-flex xs6 sm6 md6>
                        <strong>Request No.</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.id }}</strong>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-flex xs6 sm6 md6> With Price </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{getTotal().total|toPHP}}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6> Progress </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>
                            <span class="red--text">{{getTotal().done}}/{{item.items.length}}</span> items finish</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>Delivery Fee -
                        <small>{{ item.deliver.distance.computed}} km</small>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{ item.fees.delivery.platform + item.fees.delivery.rider | toPHP }}</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>Service Fee</strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <strong>{{getTotal().sc|toPHP}} ({{ item.fees.sc}} %) </strong>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <span class="subheading">
                            <strong>Total</strong>
                        </span>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                        <div class="ml-2 red--text">
                            <strong>{{ item.fees.delivery.platform + item.fees.delivery.rider + getTotal().sc + getTotal().total | toPHP }}</strong>
                        </div>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.store.logo" /> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title> {{ item.store.name }} </v-list-item-title>
                        <v-list-item-subtitle> {{ item.store.branch }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn small dense v-if="checkIfOngoing(item.status)" text color="blue" @click.stop="orderSheet = true"> Manage </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card-actions>
        </v-card>
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Appointment Cancellation</v-card-title>
                    <v-card-text>You can cancel your appointment as long as no rider accepted the job.</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="green darken-1" text @click="dialog = false"> Close </v-btn>
                        <v-btn color="green darken-1" text @click="cancelAppointment(), (dialog = false)">Yes, Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-bottom-sheet v-model="orderSheet" inset>
            <v-list dense>
                <v-subheader>Manage Shopping</v-subheader>
                <v-list-item :disabled="item.status != 'placed'" @click.stop="dialog = true">
                    <v-list-item-title>Cancel Shopping</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="item.status == 'placed'" @click.stop="bsQoute = true">
                    <v-list-item-title>Track Item Prices</v-list-item-title>
                </v-list-item>
                <!--  <v-list-item :disabled="item.status == 'placed'" @click.stop="">
                    <v-list-item-title>Track Rider</v-list-item-title>
                </v-list-item> --></v-list>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="addNewItem">
            <v-card>
                <v-card-title>{{mode=='add' ? 'Add Item to List' : 'Edit Item'}}</v-card-title>
                <v-card-text>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12 md12 sm12 lg12 class="text-center">
                            <v-textarea rows="3" label="Item description" outlined v-model="shopitem.desc" placeholder="eg. Brand, Color, etc."></v-textarea>
                        </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <v-text-field type="number" label="Measure" v-model="shopitem.measure" dense></v-text-field>
                        </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <v-select dense v-model="shopitem.unit" flat :items="units" label="Unit" item-text="name" item-value="value" /> </v-flex>
                        <v-flex xs4 md4 sm4 lg4 class="text-center">
                            <span class="caption grey--text"> Qty </span>
                            <v-icon class="white--text" color="red" @click="shopitem.qty = shopitem.qty < 1 ? 1 : shopitem.qty - 1"> mdi-minus </v-icon> {{shopitem.qty}}
                            <v-icon class="white--text" color="green" @click="shopitem.qty = shopitem.qty + 1"> mdi-plus </v-icon>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="addItem(), addNewItem = false" block>{{mode=='add' ? 'Add To List' : 'Update Item'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="bsQoute" fullscreen persistent>
            <v-card style="height: 100vh;">
                <v-card-title>Price Tracking</v-card-title>
                <v-card-subtitle>Tap or Click Item to Edit</v-card-subtitle>
                <v-card-text>
                    <small>You cannot remove or edit items marked as
                        <strong>
                            <span class="red--text">PAID</span>
                        </strong>
                    </small>
                    <v-list three-line>
                        <v-list-item-group v-for="(_item, index) in item.items" :key="index">
                            <span class="bestseller">{{ _item.status.toUpperCase() }}</span>
                            <v-list-item dense :disabled="_item.status==='paid'">
                                <v-list-item-content @click.stop="item_copy = Object.assign({},_item), shopitem = Object.assign({},_item), mode= 'edit', addNewItem = true">
                                    <v-list-item-title v-text="_item.desc"></v-list-item-title>
                                    <v-list-item-subtitle class="blue--text"> {{_item.measure}} {{_item.unit}} x {{_item.qty}} = {{_item.measure * _item.qty}} {{_item.unit}} ({{_item.measure}} {{_item.unit}}/unit ) </v-list-item-subtitle>
                                    <v-list-item-subtitle class="red--text"> {{_item.price|toPHP}} / {{_item.measure}} {{_item.unit}} = {{_item.price * _item.qty |toPHP}} </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action-text v-if="_item.status!=='paid'">
                                    <v-icon small color="red" @click.stop="shopitem = Object.assign({},_item), mode= 'delete', addItem()"> mdi-delete </v-icon>
                                </v-list-item-action-text>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Total</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action-text> {{getTotal().total|toPHP}} </v-list-item-action-text>
                        </v-list-item>
                    </v-list>
                    <v-fab-transition>
                        <v-btn color="pink" dark small @click.stop="mode='add', addNewItem = true" absolute bottom right style="margin-bottom: 100px;" fab>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined text class="shopresponsive" color="blue" @click.stop="bsQoute=false" block>Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-flex>
</template>
<script>
import {
    GeoCollectionReference
}
from 'geofirestore'
export default {
    props: {
        item: Object
    },
    computed: {
        units() {
            let units =  [{
                name: 'Pieces(pcs)',
                value: 'pcs'
            }, {
                name: 'Liter(L)',
                value: 'L'
            }, {
                name: 'Milliliter(mL)',
                value: 'mL'
            }, {
                name: 'Pack(pack)',
                value: 'pack'
            }, {
                name: 'Kilogram(kg)',
                value: 'kg'
            }, {
                name: 'Grams(g)',
                value: 'g'
            }, {
                name: 'Milligram(mg)',
                value: 'mg'
            }, {
                name: 'Ounce(oz)',
                value: 'oz'
            }, {
                name: 'Inches(in)',
                value: 'in'
            }, {
                name: 'Meter(m)',
                value: 'm'
            }, {
                name: 'Feet(ft)',
                value: 'ft'
            },
            {
                name: 'Pad(pad)',
                value: 'pad'
            },
            {
                name: 'Bundle(bundle)',
                value: 'bundle'
            },
            {
                name: 'Bottle(bot)',
                value: 'bot'
            }]
            return units.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        }
    },
    data() {
        return {
            item_copy: {},
            mode: 'add',
            orderSheet: false,
            info: '',
            snackbar: false,
            dialog: false,
            addNewItem: false,
            bsQoute: false,
            shopitem: {
                desc: '',
                qty: 1,
                price: 0,
                measure: 1,
                unit: 'pcs',
                status: 'unpaid',
            }
        }
    },
    methods: {
        addItem() {
            items: this.$fireStoreObj.FieldValue.arrayRemove(this.item_copy)
            const firestore = this.$fireStoreObj()
            const geocollection = new GeoCollectionReference(firestore.collection('shop_request'))
            if (this.mode === 'add') {
                geocollection.doc(this.item.id).update({
                    items: this.$fireStoreObj.FieldValue.arrayUnion(this.shopitem)
                }).then(() => {
                    this.info = 'Item added to your shopping list'
                    this.snackbar = true
                    this.shopitem = {
                        desc: '',
                        qty: 1,
                        price: 0,
                        measure: 1,
                        unit: 'pcs',
                        status: 'unpaid'
                    }
                })
            } else if (this.mode === 'edit') {
                this.shopitem.status = 'changed'
                geocollection.doc(this.item.id).update({
                    items: this.$fireStoreObj.FieldValue.arrayUnion(this.shopitem)
                }).then(() => {
                    geocollection.doc(this.item.id).update({
                        items: this.$fireStoreObj.FieldValue.arrayRemove(this.item_copy)
                    }).then(() => {
                        this.shopitem = {
                            desc: '',
                            qty: 1,
                            price: 0,
                            measure: 1,
                            unit: 'pcs',
                            status: 'unpaid'
                        }
                        this.info = 'Updated in your list'
                        this.snackbar = true
                    })
                })
            } else {
                geocollection.doc(this.item.id).update({
                    items: this.$fireStoreObj.FieldValue.arrayRemove(this.shopitem)
                }).then(() => {
                    this.info = 'Item removed from your list'
                    this.snackbar = true
                    this.shopitem = {
                        desc: '',
                        qty: 1,
                        price: 0,
                        measure: 1,
                        unit: 'pcs',
                        status: 'unpaid'
                    }
                })
            }
        },
        getTotal() {
            let total = 0
            let withprice = 0;
            this.item.items.forEach(item => {
                total = total + (item.qty * item.price)
                if (item.price > 0 || item.status == 'paid') withprice++
            })
            return {
                sc: parseFloat(((total * this.item.fees.sc) / 100).toFixed(2)),
                total: total,
                done: withprice
            }
        },
        checkIfOngoing(val) {
            if (val === 'placed' || val === 'ongoing' || val === 'accepted' || val === 'enroute') {
                return true
            } else {
                return false
            }
        },
        cancelAppointment() {
            this.$fireStoreObj().collection('billspay_request').doc(this.item.id).update({
                'd.appointment.status': 'cancelled'
            }).then(() => {
                this.orderSheet = false
                this.info = 'Appointment is now cancelled'
                this.snackbar = true
            })
        },
    },
};
</script>
