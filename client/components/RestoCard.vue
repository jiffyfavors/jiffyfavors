<template>
    <v-flex xs12 md4 sm6 lg3 class="pa-2">
        <v-lazy v-model="isActive" :options="{
          threshold: .6
        }" min-height="200" transition="fade-transition">
            <v-card width="100%" :to="url" :disabled="data.draft">
                <v-img :src="data.backdrop" height="200px" min-width="100%" width="100%">
                    <span class="onsale" v-if="delivery_fee>0"> {{delivery_fee|toPHP}} Delivery</span>
                    <span v-if="data.rates.cr>0" class="bestseller">Recommended</span>
                    <span class="transtype" v-if="data.draft">Not Accepting Order</span>
                </v-img>
                <v-card-actions>
                    <v-list-item dense>
                        <v-list-item-avatar color="grey darken-3">
                            <v-img class="elevation-6" :src="data.logo" /> </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ data.business_name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <small>{{ data.branch }}</small>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-actions>
            </v-card>
        </v-lazy>
    </v-flex>
</template>
<script>
export default {
    data() {
            return {
                isActive: false,
            }
        },
        computed: {
            currentLocation() {
                return this.$store.getters['map/getLocation']
            },
            delivery_fee() {
                let index = this.delivery_fees.findIndex(x => x.id === this.data.id)
                if (index > -1) return this.delivery_fees[index].amount
                else return 0
            },
            delivery_fees() {
                return this.$store.getters['map/getDeliveryFees']
            },
            df() {
                return this.$store.getters['admin/getFare']
            },
        },
        watch: {
            isActive(val) {
                if (val && !this.data.draft) {
                    let sl = {
                        lat: this.data.coordinates.latitude,
                        lng: this.data.coordinates.longitude
                    }
                    let dl = this.currentLocation
                    if (this.delivery_fee===0) {
                        this.calculateFees(dl, sl)
                    }
                }
            },
        },
        props: {
            data: {
                type: Object,
                default () {
                    return {}
                }
            },
            url: {
                type: String,
                default: '',
            }
        },
        methods: {
            calculateFees(dl, sl) {
                this.$axios.$get('/distance/', {
                    params: {
                        origins: sl.lat + ',' + sl.lng,
                        destinations: dl.lat + ',' + dl.lng,
                        key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
                    },
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then((d) => {
                    const platform = parseFloat(this.df.fees.food.distance_platform)
                    const rider = parseFloat(this.df.fees.food.distance_rider)
                    const scv = parseFloat(this.df.fees.food.sc_min_value)
                    const md = parseFloat(this.df.fees.food.min_distance)
                    const min_df = parseFloat(this.df.fees.food.min_df)
                    const fixed_rider_fee = parseFloat(this.df.fees.food.rider_fixed_fee)
                    const distance = d.rows[0].elements[0].distance.value
                    let df = 0
                    let ds = distance / 1000
                    if (distance / 1000 < md) {
                        df = min_df
                    } else {
                        let multiplier = distance / 1000 - md
                        if (multiplier < 1) {
                            multiplier = 1
                        }
                        multiplier = Math.floor(multiplier) + 1
                        df = (rider + platform) * multiplier + min_df
                    }
                    ds = Math.floor(ds) + 1
                    const distance_actual = parseFloat(d.rows[0].elements[0].distance.value / 1000).toFixed(2)
                    let rider_df = 0
                    if (distance_actual <= md) rider_df = fixed_rider_fee
                    else rider_df = fixed_rider_fee + ((distance_actual - md) * rider)
                    rider_df = Math.floor(rider_df)
                    let platform_df = Math.floor(df - rider_df)
                    this.$store.commit('map/addDeliveryFees', {
                        id: this.data.id,
                        amount: platform_df + rider_df
                    })
                });
            }
        },
};
</script>
<style scoped>
      .onsale {
    float: left;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    color: white !important;
    background-color: red;
    font-size: 16px !important;
    margin-top: 5px;
    position: relative;
    font-weight: bold;
    z-index: 99;
  }
  
  .transtype {
      padding-right: 20px;
      padding-left: 20px;
      color: white !important;
      background-color: #3f51b5;
      font-size: 12px !important;
      bottom: 0;
      right: 0;
      position: absolute;
      margin-bottom: 10px;
      margin-right: 10px;
    }
    
    .v-card__title {
        font-size: 14px;
      }
</style>
