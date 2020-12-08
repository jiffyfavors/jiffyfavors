 <v-row justify="center">
      <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="sheet = false">
              <v-icon>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>{{data.type}} - {{data.name}} Booking Form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="bookForm" lazy-validation @submit="bookingSubmit">
            <v-layout align="center" column wrap>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-list two-line subheader>
                  
                 
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
                        <v-text-field v-if="data.schedule.length<1" name="name" type="time" :rules="timeRules" placeholder="Time" required v-model="depart_time" label="Time" id="id"></v-text-field>
                        <v-select v-if="data.schedule.length>0" flat :rules="timeRules" label="Time" placeholder="Time" required v-model="depart_time" :items="data.schedule">
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
                        <v-select flat dense :disabled="(data.origin==='PBT' || data.desti==='SAB') && data.type.includes('Shared')" label="Pickup Area" single-line required v-model="pickup" :items="locations.find(x=>x.code==data.origin).locations" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="pickup.rate>0" dense text type="warning">
                          <small> Additional Pickup Charge of <strong><span style='color:red;'>{{pickup.rate|toPHP}}</span></strong> for the whole group</small>
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="data.origin==='PBT' && data.type.includes('Shared')" dense text type="warning">
                        <small> All Pickup on Shared Transfer is set to <strong>Port Barton Common Terminal</strong></small>
                      </v-alert>
                      <v-alert v-if="data.desti==='SAB' && data.type.includes('Shared')" dense text type="warning">
                        <small>  All Pickup on Shared Transfer going to Sabang Beach is infront of <strong>Jolibee, Robinsons Place Palawan</strong></small>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-layout wrap>
                      <v-flex xs12 md12 sm12>
                        <v-select flat dense :disabled="(data.desti==='PBT' || data.origin=='SAB') &&  data.type.includes('Shared')" label="Drop Area" single-line required v-model="dropoff" :items="locations.find(x=>x.code==data.desti).locations" item-text="name" return-object>
                        </v-select>
                        <v-alert v-if="dropoff.rate>0" dense text type="warning">
                          <small>  Additional Drop Off Charge of <strong><span style='color:red;'>{{dropoff.rate|toPHP}}</span></strong> for the whole group</small>
                        </v-alert>
                      </v-flex>
                      <v-alert v-if="data.desti==='PBT' && data.type.includes('Shared')" dense text type="warning">
                        <small>All Drop Off on Shared Transfer is set to <strong>Port Barton Common Terminal</strong></small>
                      </v-alert>
                      <v-alert v-if="data.desti==='PPS' && data.origin==='SAB' && data.type.includes('Shared')" dense text type="warning">
                        <small> All Drop off on Shared Transfer from  Sabang Beach is set to <strong>Jolibee Robinsons Place Palawan</strong></small>
                      </v-alert>
                    </v-layout>
                  </v-list-item>
                </v-list>
                <v-alert dense text type="success">
                  <small>You will add Pickup/Drop Off Address later at <strong>Checkout</strong></small>
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
    <v-snackbar v-model="snackbar" color="success">
      Item added to Cart
      <v-btn dark text @click="snackbar = false, sheet = !sheet">
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="wishlist" color="success">
      Item {{proc}} to Wishlist
      <v-btn dark text @click="wishlist = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="contactSheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-layout column align-center class="fill-height">
          <v-card height="100%" width="500">
            <v-toolbar dark color="primary">
              <v-btn icon dark type="submit" @click="contactSheet = false">
                <v-icon>fas fa-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title>Contact Information</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-alert dense class="mt-2" type="success">
              We will use this information to send your ticket and contact you.
            </v-alert>
            <v-form ref="cartForm" lazy-validation @submit="cartFormSubmit">
              <v-card>
              <v-layout wrap mx-5 my-2 justify-space-around>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="fullname" :rules="nameRules" label="Primary Contact Person" placeholder="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="email" label="Email" :rules="emailRules" placeholder="Email"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field required v-model="phone" label="Phone" :rules="phoneRules" placeholder="Phone"></v-text-field>
                </v-flex>
              </v-layout>
            </v-card>
              <v-toolbar dense width="100%" max-width="100%" class="full-width shopresponsive">
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