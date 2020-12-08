<template>
  <v-card class="mx-auto" height="100%" outlined>
    <div v-if="loading" class="loading"></div>
    <v-container>
      <v-layout wrap mx-5>
        <v-layout column align-center>
          <v-container>
            <div class="toursection eln"  v-if="ifComplete">
              <div class="rg-img rg-img-bg bg-img-van">
              </div>
              <article class="article">
                <p style="margin: 10px 0; font-size:24px;">Booking Completed</p>
                <p style="margin: 10px 0; white-space: normal;">Please check your email for ticket
                </p>
              </article>
            </div>
          </v-container>
          <v-card v-show="isShow">
            <v-card-text>
              <v-flex xs6 sm6 md6>
                <v-btn @click="isShow = false" tile outlined color="red">
                  Back
                </v-btn>
              </v-flex>
              <v-list dense flat two-line>
                <v-subheader>Payment Summary</v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon color="red">far fa-money-bill-alt</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title><strong>Total {{cartTotal|setCurrency(getCurrency)}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Total Amount Due</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="!cardMode">
                    <v-radio-group label="Payment Option" v-model="paymentOption">
                      <v-radio label="Debit Card, Credit Card or Paypal" value="CARD"></v-radio>
                      <v-radio label="Book Now & Pay Later" value="CASH"></v-radio>
                    </v-radio-group>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <span v-if="paymentOption==='CARD'"> Paypal account is not required. Please click the logo of your card-issuer if you want to pay with your Debit or Credit Card</span>
              <v-divider></v-divider>
              <div v-if="paymentOption==='CARD'" id="paymentSuccess" @click="paymentSuccess"></div>
            </v-card-text>
            <v-card-actions>
              <v-flex xs12 sm12 md12 v-if="paymentOption==='CARD'">
                <div ref="paypal" id="paypal-button"></div>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex x6 sm6 md6 v-if="paymentOption==='CASH'">
                <v-btn @click="paymentSuccess" tile outlined color="red">
                  Process Booking
                </v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-layout>
      <v-layout v-show="!isShow" column align-center class="mb-8">
        <template v-if="cartSize==0 && !ifComplete">
          <v-icon>fas fa-cart-arrow-down</v-icon>
          Cart is empty
        </template>
        <template v-if="cartSize>0">
          <CartItem v-for="(data,index) in getCart" :id="'item'+index" :key="index" :index="index" :data="data">
          </CartItem>
          <v-row justify="center">
            <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
              <v-layout column align-center class="fill-height">
                <v-card height="100%" width="500">
                  <v-toolbar dark color="primary">
                    <v-btn icon dark type="submit
" @click="sheet = false">
                      <v-icon>fas fa-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>Contact Information</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-form ref="cartForm" lazy-validation @submit="cartFormSubmit">
                    <v-layout wrap mx-5 my-2 justify-space-around>
                      <v-flex xs12 sm12 md12>
                        <v-text-field required v-model="getCurrentUser.name" :rules="nameRules" label="Primary Contact Person" placeholder="Name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field required v-model="getCurrentUser.email" label="Email" :rules="emailRules" placeholder="Email"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field required v-model="getCurrentUser.phone" label="Phone" :rules="phoneRules" placeholder="Phone"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-toolbar dense width="100%" max-width="100%" class="full-width shopresponsive">
                      <v-chip class="white--text" color="blue">
                        Total {{cartTotal|setCurrency(getCurrency)}}
                      </v-chip>
                      <v-spacer></v-spacer>
                      <v-btn type="submit" tile outlined color="red">
                        Continue
                      </v-btn>
                    </v-toolbar>
                  </v-form>
                </v-card>
              </v-layout>
            </v-dialog>
          </v-row>
          <v-toolbar dense width="500" max-width="100%" class="shopresponsive">
            <v-chip class="white--text" color="blue">
              Total {{cartTotal|setCurrency(getCurrency)}}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn @click="checkout" tile outlined color="red">
              Checkout
            </v-btn>
          </v-toolbar>
        </template>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CartItem from '../components/CartItem'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Cart',
  filters: {
    setCurrency: function(value, cur) {
      if (typeof value !== "number") {
        return value;
      }


      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 0,
        currencyDisplay: 'code'
      });
      return formatter.format(Math.round(value))
    }
  },
  data() {
    return {
      data: [],
      bookingInfo: {},
      ifComplete:false,
      loading: false,
      sheet: false,
      paymentOption: "CARD",
      isRendered: false,
      isShow: false,
      grandtotal: 0,
      cartTotal: 0,
      emailRules: [
        v => !!v || 'E-mail is required to received your ticket',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 5) || 'Name must be more than 5 characters',
      ],
      phoneRules: [
        v => !!v || 'Phone/Mobile/WhatsApp is required to contact you',
        v => (v && v.length >= 5) || 'Phone must be more than 2 characters. Type NA if not applicable',
      ]
    }
  },
  components: {
    CartItem
  },
  computed: {
    ...mapState([
      "cart",
      "cartSize"
    ]),
    ...mapGetters(["getCart", "cartSize", "getCartTotal", "getCurrentUser", "cardMode", "getCurrency"])
  },
  watch: {
    paymentOption(val) {
      if (val === 'CARD')
        setTimeout(() => { this.renderPaypal() }, 300)
    },
    getCart(cart) {
      var self = this
      var total = 0;
      cart.forEach(data => {
        var price = data.pax < data.rateinfo.ceil ? parseFloat((data.rateinfo.base)) : (parseFloat(data.rateinfo.base) + ((parseInt(data.pax) - parseInt(data.rateinfo.ceil)) * parseFloat(data.rateinfo.price)))

        price = price + parseFloat(data.rates.extra.pickup.rate) + parseFloat(data.rates.extra.dropoff.rate)

        total = total + self.filterReturn(price)

      })

      this.cartTotal = total

    }

  },
  mounted() {
  document.title ='Cart - Diskubre Palawan'

  },
  methods: {
    filterReturn(val) {
      return parseFloat(this.$options.filters.toPHP(val).replace(/^\D+/g, '').replace(',', ''))
    },
    cartFormSubmit: function(e) {

      if (this.$refs.cartForm.validate()) {
        this.isShow = true
        this.sheet = false


        var user = {
          name: this.getCurrentUser.name,
          email: this.getCurrentUser.email,
          phone: this.getCurrentUser.phone
        }
      
        this.$store.commit('updateCurrentUser', user)
        setTimeout(() => { this.renderPaypal() }, 300)
      }
      e.preventDefault()
      return false
    },
    generateBookingId: function() {
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = 'BR-'
      for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

      return result

    },

    checkout() {
      var isTrue = true
      this.getCart.forEach((d, i) => {

        if (d.requiredInfo) {
          isTrue = false
          document.getElementById('item' + i).classList.add('shake')
          setTimeout(() => {
            document.getElementById('item' + i).classList.remove('shake')
          }, 1500);
        }
      })
      this.sheet = isTrue
    },



    saveToDb() {
      var payload = []
      var payment = []

      this.getCart.forEach((d) => {
        var data = cloneDeep(d)
        data.ref = this.generateBookingId()
        data.booking_date = new Date().toISOString().substr(0, 10)
        data.contactInfo = {
          booked_by: this.getCurrentUser.name,
          email: this.getCurrentUser.email,
          phone: this.getCurrentUser.phone
        }
        delete data.isNameRequired
        delete data.requiredInfo
        delete data.rateinfo.thumb
        delete data.rateinfo.listing_id

        data.payment = []
        if (this.paymentOption === 'CARD') {
          var baseprice = data.pax < data.rateinfo.ceil ? parseFloat((data.rateinfo.base)) : (parseFloat(data.rateinfo.base) + ((parseInt(data.pax) - parseInt(data.rateinfo.ceil)) * parseFloat(data.rateinfo.price)))

          var itemprice = parseFloat(baseprice + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate)

          data.payment.push({
            mode: 'CARD',
            amount: this.$options.filters.toPHP(itemprice).replace(/^\D+/g, '').replace(',', ''),
            date: new Date().toISOString().substr(0, 10),
            currency: this.getCurrency
          })

        }

        data.rateinfo.base = this.$options.filters.toPHP(data.rateinfo.base).replace(/^\D+/g, '').replace(',', '')
        data.rateinfo.price = this.$options.filters.toPHP(data.rateinfo.price).replace(/^\D+/g, '').replace(',', '')
        data.rates.base = this.$options.filters.toPHP(data.rates.base).replace(/^\D+/g, '').replace(',', '')
        data.rates.extra.dropoff.rate = this.$options.filters.toPHP(data.rates.extra.dropoff.rate).replace(/^\D+/g, '').replace(',', '')
        data.rates.extra.pickup.rate = this.$options.filters.toPHP(data.rates.extra.pickup.rate).replace(/^\D+/g, '').replace(',', '')
        data.currency = this.getCurrency

        payload.push(data)

      })

      this.loading = true
      fetch('https://www.diskubrepalawan.com/index_dev.php/encode-ds-online', {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ payload: payload })
      }).then((data) => {
        return data.json()
      }).then((data) => {
     
        this.loading = false
        this.ifComplete = true
        this.isShow = false
        this.$store.commit('emptyCart', []);

      })


    },
    paymentSuccess() {
      gtag_report_conversion(this.getCartTotal, this.saveToDb())
    },
    renderPaypal() {
      var paypalitem = []
      var cur = this.getCurrency
      this.grandtotal = 0
      this.getCart.forEach((data) => {

        var baseprice = data.pax < data.rateinfo.ceil ? parseFloat((data.rateinfo.base)) : (parseFloat(data.rateinfo.base) + ((parseInt(data.pax) - parseInt(data.rateinfo.ceil)) * parseFloat(data.rateinfo.price)))

        var itemprice = parseFloat(baseprice + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate)
        paypalitem.push({
          name: data.type + ' ' + data.service + '(' + data.srv_code + ')',
          description: data.type + '\n' + data.service + '\n' + data.traveldate + ' ' + data.time + '\n' + data.pax + ' person',
          quantity: 1,
          price: this.$options.filters.toPHP(itemprice).replace(/^\D+/g, '').replace(',', ''),
          currency: cur

        })

      })

      RenderPaypal(cur, paypalitem)

    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 480px) {
  .shopresponsive {
    position: fixed;
    width: 100%;
    display: block;
    z-index: 100;
    bottom: 0;
    right: 0;
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  border: 2px solid red;
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
