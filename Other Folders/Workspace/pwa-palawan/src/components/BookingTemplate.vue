 <v-bottom-sheet inset v-model="sheet" scrollable>
      <v-card max-height="100%">
        <v-card-text>
          <v-stepper v-model="e6" vertical>
            <v-stepper-step :complete="e6 > 1" step="1">
              Travel Information
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="step1" lazy-validation @submit="step1Submit">
                <v-layout wrap mx-5>
                  <template v-if="isCurrent">
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="fullname" :rules="nameRules" label="Primary Contact Person" placeholder="Name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="email" label="Email" :rules="emailRules" placeholder="Email"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field required v-model="phone" label="Phone" :rules="phoneRules" placeholder="Phone"></v-text-field>
                    </v-flex>
                    <v-divider></v-divider>
                  </template>
                  <v-flex xs12 sm12 md12>
                    <v-text-field required :value="fullname" v-model="leadguest" :rules="nameRules" label="Lead Passenger's Name" placeholder="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="traveldate" persistent full-width width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field required v-model="traveldate" label="Travel Date" readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="traveldate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(traveldate)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs6 md6 sm6>
                    <v-text-field v-if="data.schedule.length<1" name="name" type="time" placeholder="Time" required v-model="depart_time" label="Time" id="id"></v-text-field>
                    <v-select v-if="data.schedule.length>0" flat :rules="timeRules" label="Time" placeholder="Time" single-line required v-model="depart_time" :items="data.schedule">
                    </v-select>
                  </v-flex>
                 <v-flex xs6 md6 sm6>
                    <v-text-field name="name" type="number" required step="1" min="1" max="12" v-model="pax" label="Passengers" id="id"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 sm6>
                    <v-chip  class="ma-2 white--text" color="green">
                      Total {{price|toPHP}} for {{pax}} people
                    </v-chip>
                  </v-flex>
                </v-layout>
                <v-col align="end">
                  <v-btn color="primary" type="submit" text outlined small>Continue</v-btn>
                </v-col>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 2" step="2">
              Pickup & Drop Off Location
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-form ref="step2" lazy-validation @submit="step2Submit">
                <v-layout wrap mx-5>
                  <v-row>
                    <span>Departure</span>
                  </v-row>
                  <v-flex xs12 md12 sm12>
                    <v-select flat dense label="Pickup Area" single-line required v-model="pickup" :items="locations.find(x=>x.code==data.origin).locations" item-text="name" :hint="`Additional Charge of PHP ${pickup.rate} for the whole group`" persistent-hint return-object>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 md12 sm12 class="mt-2" v-if="locations.find(x=>x.code==data.origin).locations.length>1">
                    <v-textarea :rules="textAreaRule" outlined v-model="pickup_location" required label="Address" v-if="pickup.rate>-1" placeholder="Hotel or Flight Number"></v-textarea>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-select flat dense label="Drop Area" single-line required v-model="dropoff" :items="locations.find(x=>x.code==data.desti).locations" item-text="name" :hint="`Additional Charge of PHP ${dropoff.rate} for the whole group`" persistent-hint return-object>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 md12 sm12 class="mt-2" v-if="locations.find(x=>x.code==data.desti).locations.length>1">
                    <v-textarea :rules="textAreaRule" outlined v-model="drop_location" required label="Address" v-if="dropoff.rate>-1" placeholder="Hotel or Flight Number"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12 align="end">
                    <v-btn color="secondary" text outlined small @click="e6 =1">Back</v-btn>
                    <v-btn color="primary" text outlined small type="submit">Continue</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 4" step="3">
              Summary
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-list dense two-line>
                <v-subheader>Summary</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Service</v-list-item-title>
                    <v-list-item-subtitle>{{data.name}} {{data.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Travel Date & Time</v-list-item-title>
                    <v-list-item-subtitle>{{traveldate}} {{depart_time}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Lead Participant</v-list-item-title>
                    <v-list-item-subtitle>{{fullname}} {{pax}} people</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Rate</v-list-item-title>
                    <v-list-item-subtitle>{{price|toPHP}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pickup</v-list-item-title>
                    <v-list-item-subtitle>{{pickup_location}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pickup Charge</v-list-item-title>
                    <v-list-item-subtitle>{{pickup.name}} ({{pickup.rate|toPHP}})</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Drop Off</v-list-item-title>
                    <v-list-item-subtitle>{{drop_location}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Drop Off Charge</v-list-item-title>
                    <v-list-item-subtitle>{{dropoff.name}} ({{dropoff.rate|toPHP}})</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title color="red"><strong>Total Rate</strong></v-list-item-title>
                    <v-list-item-subtitle><span style="color:red"><strong>{{ price + pickup.rate + dropoff.rate | toPHP}}</strong></span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-flex xs12 sm12 md12 align="end">
                <v-btn color="secondary" text outlined small @click="e6 =2">Back</v-btn>
                <v-btn color="primary" text outlined small :disabled="snackbar" @click="addToCart">Continue</v-btn>
              </v-flex>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>