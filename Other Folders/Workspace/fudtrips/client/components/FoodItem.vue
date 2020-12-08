<template>
  <v-card flat>
    <v-layout wrap align-center>
      <v-flex
        v-for="item in data.values"
        :key="data.name + '_' + item.id"
        xs12
        md4
        sm4
        lg4
        class="pa-1"
      >
        <v-card
          max-width="100%"
          outlined
          @click.stop="
            ;(current_data = item), generateAddOns(), (dialog = true)
          "
        >
          <v-list-item dense>
            <v-list-item-content>
              <h3>
                <strong>{{ item.name }}</strong>
              </h3>
              <span style="font-style:italic;">
                <small>{{ item.desc }}</small>
              </span>
              <span class="caption grey--text">From</span>
              <div class="ml-2 red--text subtitle-1">
                <strong>{{ item.base_price | toPHP }} </strong>
              </div>
            </v-list-item-content>
            <v-list-item-avatar v-if="item.img.length > 0" tile size="100">
              <v-img :src="item.img" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
    <v-row v-if="!isEmpty(current_data)" justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="rgba(100,115,201)">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Add to Cart</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ current_data.name }}</strong>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="caption grey--text">From</span>
                <span class="red--text">{{
                  current_data.base_price | toPHP
                }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list
            v-for="(item, index) in current_data.options"
            :key="index"
            dense
            subheader
          >
            <v-list-item v-if="item.min == 1 && item.max == 1">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>One is required</v-list-item-subtitle>
                <v-radio-group
                  v-model="
                    add_on_data[item.name.replace(' ', '').toLowerCase()]
                  "
                  mandatory
                >
                  <v-radio
                    v-for="(i, e) in item.values"
                    :key="e"
                    :label="generateFilter(i)"
                    :value="i"
                  />
                </v-radio-group>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="item.max > 1">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }} - Optional
                </v-list-item-title>
                <v-list-item-subtitle>
                  Select up to {{ item.max }}
                </v-list-item-subtitle>
                <v-col cols="12" sm="6" md="6" xs="12">
                  <v-checkbox
                    v-for="(i, e) in item.values"
                    :key="e"
                    v-model="
                      add_on_data[item.name.replace(' ', '').toLowerCase()]
                    "
                    dense
                    multiple
                    :label="generateFilter(i)"
                    :value="i"
                    :disabled="
                      add_on_data[item.name.replace(' ', '').toLowerCase()]
                        .length === item.max &&
                        add_on_data[
                          item.name.replace(' ', '').toLowerCase()
                        ].indexOf(i) === -1
                    "
                  />
                </v-col>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </v-list>
          <v-divider />
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Special Instruction</v-list-item-title>
                <v-list-item-subtitle>
                  e.g Allergy to some ingredients
                </v-list-item-subtitle>
                <v-textarea
                  v-model="instructions"
                  outlined
                  name="input-7-4"
                  label="Instruction"
                  value=""
                  placeholder="Please provide instruction if any"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-toolbar dense max-width="100%" class="shopresponsive">
            <span class="caption grey--text"> Qty </span>
            <v-icon
              class="ma-2 white--text"
              color="green"
              @click="qty = qty < 1 ? 1 : qty - 1"
            >
              mdi-minus
            </v-icon>
            {{ qty }}
            <v-icon
              class="ma-2 white--text"
              color="green"
              @click="qty = qty + 1"
            >
              mdi-plus
            </v-icon>
            <v-spacer />
            <v-btn
              tile
              :disabled="qty < 1"
              outlined
              color="red"
              @click.stop="addToCart"
            >
              Add to Cart
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" color="blue" :timeout="timeout">
      Item added to cart
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="isExist" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            Different Store
          </v-card-title>
          <v-card-text>
            There are items in your cart from different merchant. Do you want
            replace cart item?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" text @click="isExist = false">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click="saveIsExist">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
</template>
<script>
import deepclone from 'lodash.clonedeep'
export default {
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
      isExist: false
    }
  },
  computed: {
    cartMerchant() {
      return this.$store.getters['cart/getStoreID']
    },
    cartSize() {
      return this.$store.getters['cart/getCartItemCount']
    }
  },
  methods: {
    addClean(data) {
      data = deepclone(data)
      Object.entries(data).map(([key, val]) => {
        if (Array.isArray(val) && val.length <= 0) delete data[key]
        if (Object.keys(val).length === 0 && val.constructor === Object)
          delete data[key]
      })
      return data
    },
    isEmpty(obj) {
      const ob = Object.assign({}, obj)
      for (const key in ob) {
        if (obj.hasOwnProperty(key)) return false
      }
      return true
    },
    saveIsExist() {
      this.isExist = false
      this.$store.commit('cart/clearCart')
      const data = {
        business: this.merchant,
        item: {
          info: this.current_data,
          qty: this.qty,
          add_ons: this.addClean(this.add_on_data),
          instructions: this.instructions
        }
      }
      this.$store.commit('cart/add', data)
      this.snackbar = true
    },
    addToCart() {
      this.dialog = false
      if (this.merchant.id === this.cartMerchant.id || this.cartSize < 1) {
        const data = {
          business: this.merchant,
          item: {
            info: this.current_data,
            qty: this.qty,
            add_ons: this.addClean(this.add_on_data),
            instructions: this.instructions
          }
        }
        this.$store.commit('cart/add', data)
        this.snackbar = true
      } else {
        this.isExist = true
      }
    },
    generateFilter(i) {
      const value = parseFloat(i.price)
      const formatter = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol'
      })
      const vv = formatter.format(Math.round(value))
      return i.name + '(+ ' + vv + ')'
    },
    generateAddOns() {
      const addons = {}
      for (let i = 0; i < this.current_data.options.length; i++) {
        addons[
          this.current_data.options[i].name.replace(' ', '').toLowerCase()
        ] = []
      }
      this.add_on_data = addons
    }
  }
}
</script>
