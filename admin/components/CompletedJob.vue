<template>
    <v-flex xs12 md4 sm4 lg3 class="ma-1">
        <v-card max-width="400"> <span class="bestseller">{{ item.id}}</span>

            <v-card-text>

                <v-layout wrap class="mt-5">
                    <v-flex xs8 sm8 md8> <strong>Cash Collection </strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ item.amount.grandtotal|toPHP }}</strong> </v-flex>
                    <v-flex xs8 sm8 md8> <strong>Paid to Merchant </strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ item.amount.order_value - item.amount.sc.store|toPHP }}</strong> </v-flex>
                    <v-flex xs8 sm8 md8> <strong>Revenue</strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ balance |toPHP }}</strong> </v-flex>
                    <v-flex xs8 sm8 md8> Distance </v-flex>
                    <v-flex xs4 sm4 md4> <strong>{{ item.delivery.distance.computed }} <small>km</small> </strong> </v-flex>
                    <v-flex xs8 sm8 md8> <strong>Rider Share</strong> </v-flex>
                    <v-flex xs4 sm4 md4> <strong>   <div class="ml-2 red--text"> <strong>{{ item.amount.delivery.rider|toPHP }}</strong> </div>
                        </strong>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                   <v-list-item dense class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="item.order.merchant.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.order.merchant.name }} <small>{{ item.order.merchant.branch }}</small></v-list-item-title>
                        <v-list-item-subtitle v-if="item.delivery.time!='ASAP'">Must deliver before <strong><span class="red--text">{{item.delivery.time}}</span></strong></v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item.delivery.time=='ASAP'">Must Deliver <strong><span class="red--text">{{item.delivery.time}}</span></strong></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: {
                order: {
                    merchant: {
                        name: 'NA',
                        logo: '',
                        branch: ''
                    }
                },
                status: 'placed'
            }
        }
    },
    computed: {
        balance() {
            return parseFloat(this.item.amount.delivery.platform + this.item.amount.sc.markup + this.item.amount.sc.store)
        }
    }
}
</script>
