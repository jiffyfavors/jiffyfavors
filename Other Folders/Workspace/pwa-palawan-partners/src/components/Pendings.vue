<template>
  
 
     <v-card min-height="100%">
      
        <small>Booking for <strong>Approval</strong> or <strong>Need Payments</strong></small>
      
      <v-divider></v-divider>
     
      <v-data-iterator  no-data-text="No pending bookings" :page="page" class="mb-10" :items="items" :search="search" single-expand :custom-filter="customFilter" :items-per-page.sync="itemsPerPage" hide-default-footer>
        <template v-slot:default="{ items, isExpanded, expand }">
          <v-row>
            <v-col v-for="item in items" :key="item.ref" cols="12" sm="6" md="6" lg="6" xs="12">
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
         
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
        <template v-slot:footer>
          <v-toolbar small dense text class="mt-2 bottom" align="center" justify="center">
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
               <v-btn dense small text color="green" @click="fetchBookings">
                <v-icon small dense>fas fa-sync-alt</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
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
    </v-card>


</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Pendings',
  data: () => {
    return {
      expand: false,
      isexpand: false,
      snackbar: false,
      itemsPerPage: 4,
      page: 1,
      itemsPerPageArray: [12, 24, 30],
      search: '',

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
    ...mapGetters(['getBookings', 'getPartners','getCurrentUser']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },

  mounted() {
  
    this.fetchBookings()
  },

  methods: {
    deleteBooking(item) {
      fetch('https://www.diskubrepalawan.com/index_dev.php/delete-booking-by-ref?br=' + item.ref)
      this.items.splice(this.items.indexOf(item), 1)

    },
    setStatus(item, status) {
      item.internal_status = status

      fetch('https://www.diskubrepalawan.com/index_dev.php/update-booking-status?br=' + item.ref + '&status=' + status).then(() => {
        this.fetchBookings()
      })
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
    fetchBookings() {
      fetch('https://www.diskubrepalawan.com/index_dev.php/get-ds-pendings?agent_id='+this.getCurrentUser.entity.id).then((data) => {
        return data.json()
      }).then((data) => {
        this.items = data


      }).catch((e) => {
        console.log(e)
        alert('Server connection failed')
      })
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
  z-index: 100;
  bottom: 0;
  right: 0;
}


.bottom {
  position: absolute;
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
