<template>
  <v-card class="mx-auto" height="100%" outlined>
    <v-container>
      <v-layout wrap mx-5>
        <v-layout column align-center>
          <v-card v-show="isShow">
            <v-card-text>
         
              <v-list dense flat two-line>
                  <v-subheader>Payment Summary</v-subheader>
                <v-list-item-group color="primary">

                   <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="red">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{getCartTotal|toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Total Amount Due</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="green">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{getCartTotal>15000? getCartTotal*0.40: getCartTotal |toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Due Now</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="blue">far fa-money-bill-alt</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{getCartTotal>15000? getCartTotal*0.60: getCartTotal*0 |toPHP}}</v-list-item-title>
                    <v-list-item-subtitle>Payable by Cash on arrival</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

              </v-list-item-group>
              </v-list>
<v-subheader>    We use Paypal as our payment processor. </v-subheader>
               
            <v-subheader>   Paypal account is not required. You can pay using your Debit or Credit Card</v-subheader>
           
              <v-divider></v-divider>
              <v-flex xs12 sm12 md12>
                <v-icon color="red">fab fa-cc-mastercard</v-icon>
                <v-icon color="blue">fab fa-cc-visa</v-icon>
                <v-icon color="yellow">fab fa-cc-jcb</v-icon>
                <v-icon color="orange">fab fa-cc-amex</v-icon>
                <v-icon color="amber">fab fa-cc-discover</v-icon>
                <v-icon color="green">fab fa-cc-diners-club</v-icon>
                <v-icon color="indigo">fab fa-cc-paypal</v-icon>
              </v-flex>
              <div id="paymentSuccess" @click="paymentSuccess"></div>
            </v-card-text>
            <v-card-actions>
              <v-flex xs6 sm6 md6>
                <v-btn @click="isShow = false" tile outlined color="red">
                  Back
                </v-btn>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <div ref="paypal" id="paypal-button"></div>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-layout>
      <v-layout v-show="!isShow" column align-center>
        <template v-if="cartSize==0">
          <v-icon>fas fa-cart-arrow-down</v-icon>
          Cart is empty
        </template>
        <template v-if="cartSize>0">
          <CartItem v-for="(data,index) in getCart" :key="index" :index="index" :data="data">
          </CartItem>
          <v-card outlined>
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
              <v-toolbar dense width="500" max-width="100%" class="shopresponsive">
                <v-chip class="white--text" color="blue">
                  Total {{getCartTotal|toPHP}}
                </v-chip>
                <v-spacer></v-spacer>
                <v-btn type="submit" tile outlined color="red">
                  Checkout
                </v-btn>
              </v-toolbar>
            </v-form>
          </v-card>
        </template>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { bookings, users } from '../firebase'
import { mapState, mapGetters } from 'vuex'
import CartItem from '../components/CartItem'
export default {
  name: 'Cart',
  data() {
    return {
      data: [],
      isRendered: false,
      isShow: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 5) || 'Name must be more than 5 characters',
      ],
      phoneRules: [
        v => !!v || 'Phone is required',
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
    ...mapGetters(["getCart", "cartSize", "getCartTotal", "getCurrentUser"])
  },
  mounted() {

    setTimeout(() => { this.renderPaypal() }, 1500)

  },
  methods: {
    cartFormSubmit: function(e) {

      if (this.$refs.cartForm.validate()) {
        this.isShow = true
      }
      e.preventDefault()
      return false
    },
    generateBookingId: function() {
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = 'BW-' + new Date().getFullYear().toString() + '-'
      for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

      return result

    },

    newBooking() {
      var ref = this.generateBookingId()
      users.add(this.getCurrentUser).then(d => {
        var user = this.getCurrentUser
        user.id = d.id
        user.mybookings = []
        user.payments = []

        var pay = {
          date: new Date().toISOString().substr(0, 10),
          mode: 'Card',
          amount: this.getCartTotal
        }
        user.payments.push(pay)

        this.getCart.forEach(o => {
          o.booked_by = user.id
          o.ref = ref
          bookings.add(o).then((b) => {
            user.mybookings.push(b.id)
          }).then(() => {
            this.$store.commit('updateCurrentUser', user)
            users.doc(user.id).set(user)
              // this.$store.commit('emptyCart')
          })
        })
      })
    },

    saveToDb(){
      var prepay = this.getCartTotal>15000? this.getCartTotal*0.40 : this.getCartTotal

      var ref = this.generateBookingId()
      if (typeof this.getCurrentUser.id === 'undefined') {


        users.add(this.getCurrentUser).then(d => {
          var user = this.getCurrentUser
          user.id = d.id
          user.mybookings = []
          user.payments = []

          var pay = {
            date: new Date().toISOString().substr(0, 10),
            mode: 'Card',
            amount: prepay
          }
          user.payments.push(pay)

          this.getCart.forEach(o => {
            o.booked_by = user.id
            o.ref = ref
            bookings.add(o).then((b) => {
              user.mybookings.push(b.id)
            }).then(() => {
              this.$store.commit('updateCurrentUser', user)
              users.doc(user.id).set(user)
              this.$store.commit('emptyCart')
              this.$router.push('/manage-booking')
            })
          })
        })

      } else {


        var user = this.getCurrentUser


        this.getCart.forEach(o => {

          o.booked_by = user.id
          o.ref = ref
          bookings.add(o).then(d => {
            user.mybookings.push(d.id)
          }).then(() => {
            var pay = {
              date: new Date().toISOString().substr(0, 10),
              mode: 'Card',
              amount:prepay
            }
            user.payments.push(pay)
            this.$store.commit('updateCurrentUser', user)
            users.doc(user.id).set(user)
            this.$store.commit('emptyCart')
            this.$router.push('/manage-booking')
          })
        })
      }
    },
    paymentSuccess() {
      gtag_report_conversion(this.getCartTotal, this.saveToDb())
    },
    renderPaypal() {
      var paypalitem = []
      this.getCart.forEach((data) => {
        paypalitem.push({
          name: data.service,
          description: data.type + ' ' + data.service + ' ' + data.traveldate + ' ' + data.time,
          quantity: 1,
          price: parseFloat(data.rates.base + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate),
          currency: 'PHP'

        })
      })
      RenderPaypal(this.getCartTotal, paypalitem)
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
</style>
