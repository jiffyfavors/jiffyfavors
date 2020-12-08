<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card class="mx-auto" max-width="400">
            <span class="bestseller">{{ item.status.toUpperCase() }}</span>
            <v-card-text>
                <v-layout wrap class="mt-5">
                    <v-flex xs4 sm4 md4>
                        <strong>Order Reference</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>{{ item.id }}</strong>
                    </v-flex>
                    <v-divider></v-divider>
            
                    <v-flex xs4 sm4 md4>
                        <strong>Collect to Rider</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>{{total |toPHP }} </strong>
                        <v-btn class="mr-1" color="info" dense text @click.stop="breakdownDiag = true" small>Breakdown</v-btn>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>Delivery Time</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>{{item.delivery.date}} {{item.delivery.time}}</strong>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <strong>Items</strong>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                        <strong>{{item.order.items.length}} items</strong>
                        <v-btn class="mr-2" color="info" dense text @click.stop="listDiag = true" small>View</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.order.merchant.logo" /> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title> {{ item.order.merchant.name }} </v-list-item-title>
                        <v-list-item-subtitle> {{ item.order.merchant.branch }} </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="breakdownDiag" max-width="500px">
            <v-card width="100%">
                <v-toolbar fixed dark color="#00aff0">
                    <v-btn icon @click.stop="breakdownDiag = false">
                        <v-icon> mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Breakdown</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-simple-table dense>
                        <template #default>
                            <tbody>
                                <tr v-for="(i,index) in computeDeduction()" :key="index">
                                    <td>{{i.name}}</td>
                                    <td>{{i.value|toPHP}}</td>
                                </tr>
                                
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog fullscreen v-model="listDiag" max-width="500px">
            <v-toolbar fixed dark color="#00aff0">
                    <v-btn icon @click.stop="listDiag = false">
                        <v-icon> mdi-arrow-left-bold</v-icon>
                    </v-btn>
                    <v-toolbar-title>List of Orders for {{item.id}}</v-toolbar-title>
             </v-toolbar>
            <v-card width="100%">
                
                <v-card-text>
                    <v-sheet class="overflow-y-auto">
                        <v-content>
                            <v-list two-line>
                                <v-list-item-group v-for="(_item, index) in item.order.items" :key="_item.index">
                                    <v-divider />
                                    <v-list-item dense>
                                        <v-list-item-avatar color="grey darken-3">
                                            <v-img v-if="_item.info.img != ''" class="elevation-6" :src="_item.info.img" />
                                            <v-avatar v-else class="white--text" color="blue"> {{ _item.info.name .match(/\b(\w)/g) .join('') .substr(0, 2) }} </v-avatar>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="_item.info.name" />
                                            <v-list-item-subtitle class="red--text"> {{ computeTotal(_item) | toPHP }} </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-list-item-action-text> {{ (computeTotal(_item) / _item.qty) | toPHP }} x {{ _item.qty }} </v-list-item-action-text>
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-simple-table dense>
                                        <template #default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left"> Item </th>
                                                    <th class="text-left"> Value </th>
                                                    <th class="text-left"> Price </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(addon, i) in computeAddOns(
                                _item.add_ons,
                                _item.info.base_price
                              )" :key="addon.name + `_` + i + `_` + index">
                                                    <td>{{ addon.name }}</td>
                                                    <td>{{ addon.values }}</td>
                                                    <td v-if="addon.price>0">{{ addon.price | toPHP }}</td>
                                                    <td v-if="addon.price<1">-</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-list-item-group>
                            </v-list>
                        </v-content>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
export default {
    data() {
            return {
                listDiag: false,
                breakdownDiag: false,
                total:0
            }
        },
        props: {
            item: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        mounted() {
      this.computeDeduction()
        },
        methods: {
            computeDeduction(){
                let deductions = []
                let total = this.item.amount.order_value
                deductions.push({
                    name:'Order Value',
                    value: this.item.amount.order_value
                })
                if(this.item.amount.hasOwnProperty('deduction')){
                    if(this.item.amount.deduction.charged_to==='merchant'){
                        deductions.push({
                            name: 'Merchant Code',
                            value:''
                        })
                        deductions.push({
                            name: '      '+this.item.amount.deduction.code + '-'+ this.item.amount.deduction.value ,
                            value: this.item.amount.deduction.computed * -1
                        })
                        total = total - this.item.amount.deduction.computed
                    }
                        

                }
                if(this.item.amount.sc.store>0){
                    deductions.push({
                        name:'Platform Commission',
                        value: this.item.amount.sc.store * -1
                    })
                    total = total - this.item.amount.sc.store
                }
                this.total = total
                deductions.push({
                    name:'Net',
                    value: total
                })
                return deductions
            },
            computeAddOns(item, price) {
                const ads = []
                const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
                ads.push({
                    name: 'Base Price',
                    values: '',
                    price
                })
                let total = parseFloat(price)
                Object.entries(item).map(([key, val]) => {
                    if (Array.isArray(val)) {
                        ads.push({
                            name: capitalize(key),
                            values: '',
                            price: 0
                        })
                        val.forEach((i) => {
                            total = total + parseFloat(i.price)
                            ads.push({
                                name: '',
                                values: i.name,
                                price: i.price
                            })
                        })
                    } else {
                        total = total + parseFloat(val.price)
                        ads.push({
                            name: capitalize(key),
                            values: val.name,
                            price: val.price
                        })
                    }
                })
                ads.push({
                    name: '',
                    values: 'Total',
                    price: parseFloat(total)
                })
                return ads
            },
            computeTotal(item) {
                let total = 0
                total = total + item.info.base_price * item.qty
                const addons = Object.values(item.add_ons)
                addons.forEach((a) => {
                    if (Array.isArray(a)) {
                        a.forEach((b) => {
                            total = total + b.price * item.qty
                        })
                    } else {
                        total = total + a.price * item.qty
                    }
                })
                return total
            }
        }
};
</script>
