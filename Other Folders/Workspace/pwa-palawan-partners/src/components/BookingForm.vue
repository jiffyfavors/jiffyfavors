<template>
  <v-container>
    <v-row justify="center">
      <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="sheet = false">
              <v-icon>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>{{item.type}} {{item.name}} Booking</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="bookForm" lazy-validation @submit="bookingSubmit">
            <v-layout align="center" column wrap>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-list two-line subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{item.name}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.type}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Select Date & Time</v-list-item-title>
                      <v-flex xs4 md4 sm4>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="traveldate" persistent full-width width="290px">
                          <template v-slot:activator="{ on }">
                            <v-text-field required v-model="traveldate" label="Travel Date" readonly v-on="on"></v-text-field>
                          </template>
                          <v-date-picker full-width :min="min" v-model="traveldate" :allowed-dates="allowedDates" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.dialog.save(traveldate)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs4 md4 sm4>
                        <v-text-field v-if="rateinfo.sched.length<1" name="name" type="time" :rules="timeRules" placeholder="Time" required v-model="depart_time" label="Time" id="id"></v-text-field>
                        <v-select v-if="rateinfo.sched.length>0" flat :rules="timeRules" label="Time" placeholder="Time" required v-model="depart_time" :items="rateinfo.sched">
                        </v-select>
                      </v-flex>
                      <v-flex xs4 md4 sm4>
                        <v-layout>
                          <v-text-field name="name" readonly type="number" text-center required step=1 min=1 max=12 v-model="pax" label="Persons" id="id"></v-text-field>
                          <v-icon @click="pax = pax - 1" class="ma-2 white--text" color="green">far fa-minus-square</v-icon>
                          <v-icon @click="pax = pax + 1" class="ma-2 white--text" color="green">far fa-plus-square</v-icon>
                        </v-layout>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense  :disabled="item.origin==='PBT' && item.type.includes('Shared')" label="Pickup Area" single-line required v-model="pickup" :items="rateinfo.pickup.filter(x=>x.rate>-1)" item-text="name" return-object :rules="selectRules">
                        </v-select>
                        <v-alert v-if="pickup.rate>0" dense text type="warning">
                          Additional Pickup Charge of <strong><span style='color:red;'>{{pickup.rate|toPHP}}</span></strong> for the whole group
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="item.origin==='PBT' && item.type.includes('Shared')" dense text type="warning">
                        All Pickup on Shared Transfer is set to <strong>Port Barton  Terminal</strong>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense  :disabled="item.desti==='PBT' && item.type==='Ride Sharing'" label="Drop Area" single-line required v-model="dropoff" :items="rateinfo.dropoff.filter(x=>x.rate>-1)" item-text="name" return-object :rules="selectRules">
                        </v-select>
                        <v-alert v-if="dropoff.rate>0" dense text type="warning">
                          Additional Drop Off Charge of <strong><span style='color:red;'>{{dropoff.rate|toPHP}}</span></strong> for the whole group
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="item.desti==='PBT' && item.type==='Ride Sharing'" dense text type="warning">
                        All Drop Off on Shared Transfer is set to <strong>Port Barton Terminal</strong>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                </v-list>
                <v-alert dense text type="success">
                  You will add Pickup/Drop Off Address later at <strong>Checkout</strong>
                </v-alert>
                <v-toolbar dense min-width="100%" max-width="100%" class="shopresponsive">
                  <v-chip class="white--text" color="blue">
                    Total {{price|toPHP}}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" tile outlined color="red">
                    Add to Cart
                  </v-btn>
                </v-toolbar>
              </v-card>
            </v-layout>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BookingForm',
  props: {
    item: Object,
    rateinfo: Object,
    sheet: Boolean,
  },
  data() {
    return {
      price: 0,
      
      modal: false,
      pax: 1,
      pickup: {},
      dropoff: {},
      pickup_location: '',
      drop_location: '',
      depart_time: '',
      traveldate: new Date().toISOString().substr(0, 10),
      min: new Date().toISOString().substr(0, 10),
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
      ],
      textAreaRule: [
        v => !!v || 'Location is required',
        v => (v && v.length >= 3) || 'Field must be more than 3 characters',
      ],
      selectRules: [
        v => !!v || 'Location is required'

      ],
      timeRules: [
        v => !!v || 'Time is required',
        v => (v && v.length >= 1) || 'Time is required'
      ]
    }
  },

  watch: {

 
    sheet() {
     
      this.pickup = this.rateinfo.pickup.filter(x=>x.rate>-1)[0]
        this.dropoff = this.rateinfo.dropoff.filter(x=>x.rate>-1)[0]
      
     
    },
    pickup(val) {
    
      this.recomputeTotal()
    },
    pax(val) {
      if (val > 12) {
        alert('Maximum 12 per booking')
        this.pax = 12
      } else if (val < 1) {
        this.pax = 1
      }
      this.recomputeTotal()

    },
    dropoff() {
      this.recomputeTotal()
    }
  },


  methods: {
    recomputeTotal() {
      this.price =0 
     
      this.price = this.pax < parseInt(this.rateinfo.rates.ceil) ? parseFloat((this.rateinfo.rates.base)) : (parseFloat(this.rateinfo.rates.base) + ((parseInt(this.pax) - parseInt(this.rateinfo.rates.ceil)) * parseFloat(this.rateinfo.rates.rate)))

      this.price = this.price + parseFloat(this.pickup.rate) + parseFloat(this.dropoff.rate)
    },
    bookingSubmit: function(e) {
      if (this.$refs.bookForm.validate()) {
        this.sheet = false
        this.addToCart()
      }
      e.preventDefault()
      return false
    },
    allowedDates(val) {

      var c = val.split('-')[1] + val.split('-')[2]




      return c != '1231' && c != '0101'
    },

    addToCart: function() {


      var party = {
        id: 'guest_0',
        name: '',
        age: 18,
        gender: 'M',
        nationality: 'Filipino'
      }
      var participants = []
 participants.push(party)



      var payload = {
        src: this.rateinfo.agent_id,
        service: this.item.name,
        type: this.item.type,
        srv_code: this.item.code,
        traveldate: this.traveldate,
        time: this.depart_time,
        isNameRequired: false,
        participants: participants,
        pax: this.pax,
        request: '',
        rateinfo: {
          listing_id: this.item.id,
          thumb: 'https://firebasestorage.googleapis.com/v0/b/palawan-van.appspot.com/o/grandia-1.jpg?alt=media&token=d2a2ce76-061a-4306-ba96-6ae85ed5bb39',
          base: this.rateinfo.rates.base,
          ceil: this.rateinfo.rates.ceil,
          price: this.rateinfo.rates.rate
        },
        rates: {
          base: this.price,
          extra: {
            fees:[],
            pickup: {
              location: this.pickup_location,
              area: this.pickup.name,
              rate: this.pickup.rate
            },
            dropoff: {
              location: this.drop_location,
              area: this.dropoff.name,
              rate: this.dropoff.rate
            }
          }
        }
      }

      this.$store.commit('addToCart', payload)
    
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
.shopresponsive {
  position: fixed;
  width: 100%;
  display: block;
  z-index: 100;
  bottom: 0;
  right: 0;
}
</style>
