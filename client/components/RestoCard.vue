<template>
    <v-flex xs12 md4 sm6 lg3 class="pa-2">

        <v-lazy v-model="isActive" :options="{
          threshold: .6
        }" min-height="200" transition="fade-transition">

     
            <v-card width="100%" :to="url" :disabled="data.draft">
                <v-img :src="data.backdrop" height="200px" min-width="100%" width="100%">
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
                isActive: false
            }
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
        }
};
</script>
<style scoped>

  
  .onsale {
      float: right;
      padding-right: 20px;
      padding-left: 20px;
      color: white !important;
      background-color: red;
      font-size: 16px !important;
      margin-top: 5px;
      position: relative;
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
