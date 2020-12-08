<template>
  <v-container fluid>
    <textarea class="nakatago" id="smsField"></textarea>
    <v-layout wrap>
      <v-flex xs6 md3 lg3 sm3>
        <v-text-field dense v-model="traveldate" class="white--text" type="month" label="Month"></v-text-field>
      </v-flex>
      <v-flex xs6 md3 lg3 sm3>
        <v-text-field v-model="search" class="white--text" label="Search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-data-iterator :page="page" class="mb-10" :items="items" :search="search" single-expand :custom-filter="customFilter" :items-per-page.sync="itemsPerPage" hide-default-footer>
      <template v-slot:default="{ items, isExpanded, expand }">
        <v-row>
          <v-col v-for="item in items" :key="item.ref" cols="12" sm="4" md="3" lg="3" xs="3">
            <v-card class="pa-1">
              <span :class="item.internal_status.toLowerCase() + ` transtype`"><small>{{item.internal_status.replace('_',' ')}}</small></span>
              <v-list-item @click="isexpand = !isExpanded(item), expand(item, isexpand) ">
                <v-list-item-content>
                  <small>{{item.ref}}</small>
                  <v-list-item-title> <strong>{{item.participants[0].name}}</strong></v-list-item-title>
                  <v-list-item-subtitle>{{item.traveldate}} {{item.time}} {{item.pax}} pax</v-list-item-subtitle>
                  <v-list-item-subtitle>{{item.service}}</v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{item.type}}</small></v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{item.srv_code}}</small></v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{item.booked_by}}</small></v-list-item-subtitle>
                  <v-list-item-subtitle v-if="computeBalance(item)>0"><small>Balance: {{computeBalance(item)|setCurrency(item.currency)}}</small></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list v-if="isExpanded(item)" @click="isexpand = !isExpanded(item)" dense>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pickup</v-list-item-title>
                    <v-list-item-subtitle>{{item.rates.extra.pickup.location}}</v-list-item-subtitle>
                    <v-list-item-subtitle><small>{{item.rates.extra.pickup.area}}</small></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Drop Off</v-list-item-title>
                    <v-list-item-subtitle>{{item.rates.extra.dropoff.location}}</v-list-item-subtitle>
                    <v-list-item-subtitle><small>{{item.rates.extra.dropoff.area}}</small></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-simple-table dense width="100%" v-if="Object.keys(item.contactInfo).length >0 && item.contactInfo.constructor === Object">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td style="font-size:10px;">Email : </td>
                          <td style="font-size:10px;"><a target="_blank" :href="`mailto:` + item.contactInfo.email">{{item.contactInfo.email}}</a></td>
                        </tr>
                        <tr>
                          <td style="font-size:10px;">Phone :</td>
                          <td style="font-size:10px;"><a target="_blank" :href="`tel:` + item.contactInfo.phone">{{item.contactInfo.phone}}</a></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-list-item>
                <v-list-item v-if="item.request!=''">
                  <v-list-item-content>
                    <v-list-item-title>Request</v-list-item-title>
                    <span><small style="font-size:10px;">{{item.request}}</small></span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-simple-table dense v-if="item.type.includes('Tour')">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Participants</th>
                            <th class="text-left"></th>
                            <th class="text-left"></th>
                            <th class="text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="part in item.participants" :key="part.name">
                            <td style="font-size:10px;">{{ part.name }}</td>
                            <td style="font-size:10px;">{{ part.age }}</td>
                            <td style="font-size:10px;">{{ part.gender }}</td>
                            <td style="font-size:10px;">{{ part.nationality }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-layout wrap>
                    <v-btn small icon>
                      <v-icon text color="blue" class="white--text mx-1" @click="sendSMS(item)">far fa-comment-alt</v-icon>
                    </v-btn>
                    <v-icon dense text color="indigo" class="white--text mx-1" @click="payRecord(item)">fab fa-cc-amazon-pay</v-icon>
                    <v-icon dense text color="green" class="white--text mx-1" @click="sendSMS(item)">fas fa-share-square</v-icon>
                    <v-btn small icon>
                      <v-icon dense text color="red" class="white--text mx-1" @click="deleteBooking(item)">fas fa-window-close</v-icon>
                    </v-btn>
                    <v-icon dense text color="orange" class="white--text mx-1" @click="sendSMS(item)">fas fa-edit</v-icon>
                    <v-icon dense text color="purple" class="white--text mx-1" @click="sendSMS(item)">fas fa-external-link-square-alt</v-icon>
                  </v-layout>
                </v-list-item>
                <v-list-item>
                  <v-layout wrap>
                    <v-btn small icon>
                      <v-icon dense text color="green" class="white--text mx-1" @click="setStatus(item,'APPROVED')">far fa-thumbs-up</v-icon>
                    </v-btn>
                    <v-btn small icon>
                      <v-icon dense text color="red" class="white--text mx-1" @click="setStatus(item,'PENDING')">far fa-thumbs-down</v-icon>
                    </v-btn>
                    <v-btn small icon>
                      <v-icon dense text color="orange" class="white--text mx-1" @click="setStatus(item,'CANCELLED')">fas fa-window-close</v-icon>
                    </v-btn>
                    <v-btn small icon>
                      <v-icon text color="grey" class="white--text mx-1" @click="setStatus(item,'NEED_PAYMENT')">fas fa-money-check-alt</v-icon>
                    </v-btn>
                  </v-layout>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-toolbar small dense text class="mt-2 shopresponsive" align="center" justify="center">
          <v-row>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn small dense text color="primary" class="ml-2" v-on="on">
                  {{ itemsPerPage }}
                  <v-icon small dense>fas fa-arrow-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn dense small text color="green" @click="fetchBookings(traveldate)">
              <v-icon small dense>fas fa-sync-alt</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <small class="mr-4
            grey--text">
            {{ items.length }} Records
          </small>
            <small class="mr-4
            grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </small>
            <v-btn dense small text color="primary" @click="formerPage">
              <v-icon small dense>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-btn small dense color="primary" text @click="nextPage">
              <v-icon small dense>fas fa-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
      </template>
    </v-data-iterator>
    <v-snackbar v-model="snackbar" color="success">
      Ready to send for SMS
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog persistent v-model="paydiag" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Payments Record - {{itemrecord.ref}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs3 sm3 md3>
              <v-text-field flat v-model="payment_date" :max="new Date().toISOString().substr(0, 10)" type="date" label="Date"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-select flat label="Mode" v-model="payment_mode" :items="['BANK','CASH','CARD','COLLECT','CHARGE','CREDIT','DISCOUNT','ADJUSTMENT']"></v-select>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-text-field flat v-model="payment_amount" type="number" label="Amount"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-btn small @click="addPayment(itemrecord)" icon dense>
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-list two-line dense subheader>
            <v-list-item v-for="(item,i) in itemrecord.payment" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{parseFloat(item.amount)|setCurrency(item.currency)}}</v-list-item-title>
                <v-list-item-subtitle>{{item.date}} by {{item.mode}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="itemrecord.payment.splice(itemrecord.payment.indexOf(item),1)">fas fa-window-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="recordPayment">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Bookings',
  data: () => {
    return {
      paydiag: false,
      expand: false,
      payment_mode: 'CASH',
      isexpand: false,
      itemrecord: {},
      snackbar: false,
      payment_amount: 0,
      payment_date: new Date().toISOString().substr(0, 10),
      itemsPerPage: 12,
      page: 1,
      itemsPerPageArray: [12, 24, 30],
      search: '',
      traveldate: new Date().toISOString().substr(0, 7),
      items: []
    }
  },
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
  computed: {
    ...mapGetters(['getBookings', 'getPartners']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.items = this.getBookings
    this.fetchBookings(this.traveldate)
  },

  methods: {
    addPayment(item) {
      this.itemrecord = item
      this.itemrecord.payment.push({
        date: this.payment_date,
        mode: this.payment_mode,
        amount: this.payment_amount,
        currency: item.currency
      })

    },
    recordPayment() {

      var payload = {
        id: this.itemrecord.id,
        payment: this.itemrecord.payment
      }
      fetch('https://api.diskubrepalawan.com/index_dev.php/record-ds-payment', {

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
      }).then(() => {



        this.paydiag = false
      })

    },
    payRecord(item) {
      this.payment_amount = this.computeBalance(item)
      this.itemrecord = item

      this.paydiag = true
    },
    deleteBooking(item) {
      fetch('https://www.diskubrepalawan.com/index_dev.php/delete-booking-by-ref?br=' + item.ref)
      this.items.splice(this.items.indexOf(item), 1)

    },
    getSource(id) {

      if (id === 'DS-ONLINE') {
        return 'Direct Booking'
      } else {
        console.log(this.getPartners.find((x) => x.id === id).business_name)

        return this.getPartners.find((x) => x.id === id).business_name


      }
    },
    setStatus(item, status) {
      item.internal_status = status

      fetch('https://www.diskubrepalawan.com/index_dev.php/update-booking-status?br=' + item.ref + '&status=' + status)
    },
    sendSMS(item) {

      var bal = ''
      if (item.currency != 'PHP')
        bal = item.currency + ' ' + this.computeBalance(item) + '\n(Please convert to Philippine Pesos)';
      else
        bal = item.currency + ' ' + this.computeBalance(item)
      var sms = item.participants[0].name + '\n' + item.traveldate + ' ' + item.time + ' ' + item.pax + ' pax\n' + item.srv_code + '\n' + 'Balance: ' + bal + '\nPickup:' + item.rates.extra.pickup.location + '\nDrop Off:' + item.rates.extra.dropoff.location + '\n';
      if (item.request.length > 0) {
        sms = sms + 'Guest Request:' + item.request + '\n'
      }
      if (item.type.includes('Tour')) {
        sms = sms + '\nTour Participants:\n'
        item.participants.forEach(a => {
          sms = sms + a.name + ' ' + a.age + ' ' + a.gender + ' ' + a.nationality + '\n'
        })

      }
      var smsF = document.getElementById("smsField");
      smsF.value = sms
      smsF.select()
      smsF.setSelectionRange(0, sms.length)
      document.execCommand('copy')
      this.snackbar = true

    },
    computeBalance(item) {
    var balance = 0
      balance = item.pax < item.rateinfo.ceil ? parseFloat((item.rateinfo.base)) : (parseFloat(item.rateinfo.base) + ((parseInt(item.pax) - parseInt(item.rateinfo.ceil)) * parseFloat(item.rateinfo.price)))

      balance = balance + parseFloat(item.rates.extra.pickup.rate) + parseFloat(item.rates.extra.dropoff.rate)
      if(typeof item.rates.extra.fees !=='undefined'){
              item.rates.extra.fees.forEach(a => {
        balance = balance + (parseFloat(a.rate) * parseInt(item.pax))
      })

      }

      var collect = 0
      var ifWithCollect = false
      item.payment.forEach(d => {
        if (d.mode === 'COLLECT') {
          collect = collect = parseFloat(d.amount)
          ifWithCollect = true
        } else {
          balance = balance - parseFloat(d.amount)
        }

      })

      return ifWithCollect ? collect : balance

    },
    nextPage() {
      window.scrollTo(0, 0)
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      window.scrollTo(0, 0)
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    customFilter(items, search) {
      return items.filter(o =>
        Object.keys(o).some(k => {
          if (typeof o[k] === 'string') {
            return o[k].toLowerCase().includes(search.toLowerCase())

          } else {
            var c = o[k]
            return Object.keys(c).some(l => {

              if (typeof c[l] == 'string' || typeof c[l] == 'number') {
                return c[l].toString().toLowerCase().includes(search.toLowerCase())
              } else {
                var d = c[l]

                return Object.keys(d).some(f => d[f].toString().toLowerCase().includes(search.toLowerCase()))
              }


            })
          }
        }));

    },
    fetchBookings(val) {
      fetch('https://www.diskubrepalawan.com/index_dev.php/get-ds-bookings?date=' + val).then((data) => {
        return data.json()
      }).then((data) => {
        this.items = [];
        data.forEach(d => {
          delete d.booking_date
          console.log(d)
          this.items.push(d)
        })



      }).catch(() => {
        alert('error')
        this.items = this.getBookings
      })
    }
  },
  watch: {
    itemrecord(val) {
      console.log(val)
    },
    items(val) {
      val.forEach(a => {
        a.booked_by = this.getSource(a.src)
      })
      this.$store.commit('setBookings', val)
    },
    traveldate(val) {
      this.items = []
      this.fetchBookings(val)

    }
  }
}
</script>

<style scoped>
.nakatago {
  position: absolute;
  left: -9999px
}

.shopresponsive {
  position: fixed;
  width: 100%;
  display: block;
  bottom: 0;
  right: 0;
}

td {
  padding: 0px !important;
}

.v-list-item {
  padding: 0 5px;
}

.v-list-item {
  padding: 0 5px;
}

.approved {
  background-color: #4caf50;
}

.cancelled {
  background-color: #9E9E9E
}

.pending {
  background-color: #f44336
}

.need_payment {
  background-color: #2196f3
}

.transtype {
  padding-right: 5px;
  padding-left: 5px;
  color: white !important;
  font-size: 10px !important;
  top: 0;
  right: 0;
  position: absolute;
}
</style>
