<template>
  <v-layout column align-center>
    <v-flex xs12 md6 sm6>
      <v-container>
        <v-card>
          <v-form ref="form"  :lazy-validation="true">
            <v-layout wrap outlined mx-5 my-2 justify-space-around>
              <v-select required v-model="origin" :items="locations" item-value="code" item-text="name" label="Origin"></v-select>
              <v-select required v-model="desti" :items="locations" item-value="code" item-text="name" label="Destination"></v-select>
            </v-layout>
            <v-layout wrap mx-5>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="name" label="Name"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap mx-5>
              <v-flex xs6 sm6 md6>
                <v-text-field v-model="code" label="Code"></v-text-field>
              </v-flex>
              <v-flex xs3 md3 sm3>
                <v-text-field name="name" type="number" required step="1" v-model="min" label="Min"></v-text-field>
              </v-flex>
              <v-flex xs3 md3 sm3>
                <v-text-field name="name" type="number" required step="1" v-model="max" label="Max"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap mx-5>
              <v-flex xs12 sm4 md4>

                <v-list tile>
                     <v-subheader>Schedule</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field v-model="time" label="Time" type="time"></v-text-field>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="schedule.push(time)">far fa-plus-square</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(i,index) in schedule" :key="`sched`+index">
                    <v-list-item-content>{{i}}</v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="schedule.splice(i,1)">fas fa-trash-alt</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-flex>
              <v-flex xs12 s4 md4>
                <v-list tile>
                  <v-subheader>Pickup Charges</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-layout wrap>
                        <v-flex xs9>
                          <v-text-field v-model="area" label="Area"></v-text-field>
                        </v-flex>
                        <v-flex xs3>
                          <v-text-field v-model="rate" label="Rate" type="number"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="charges.pickup.push({area:area, rate:rate})">far fa-plus-square</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(i,index) in charges.pickup" :key="`cp`+index">
                    <v-list-item-content>
                      <v-layout wrap>
                        <v-flex xs9>
                          {{i.area}}
                        </v-flex>
                        <v-flex xs3>
                          {{i.rate|toPHP}}
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="charges.pickup.splice(i,1)">fas fa-trash-alt</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-flex>

                      <v-flex xs12 sm4 md4>
                <v-list tile>
                  <v-subheader>Drop Off Charges</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-layout wrap>
                        <v-flex xs9>
                          <v-text-field v-model="area" label="Area"></v-text-field>
                        </v-flex>
                        <v-flex xs3>
                          <v-text-field v-model="rate" label="Rate" type="number"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="charges.dropoff.push({area:area, rate:rate})">far fa-plus-square</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(i,index) in charges.dropoff" :key="`cd`+index">
                    <v-list-item-content>
                      <v-layout wrap>
                        <v-flex xs9>
                          {{i.area}}
                        </v-flex>
                        <v-flex xs3>
                          {{i.rate|toPHP}}
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click="charges.dropoff.splice(i,1)">fas fa-trash-alt</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-flex>

            </v-layout>
            <v-layout>
              <v-col align="end">
                <v-btn class="ma-2 text-right" tile outlined color="success" @click="fnEncode">
                  <v-icon left>far fa-search</v-icon>Encode
                </v-btn>
              </v-col>
            </v-layout>
          </v-form>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import {listing} from '../firebase'
export default {
  name: "ListingEncoder",
  data() {
    return {
      origin: "PPS",
      desti: "ELN",
      min: 1,
      max: 12,
      code: "",
      name: "",
      time: "",
      area: '',
      rate: 0,
      type:[{
        name:'Transfer',
        code:'trans'
      }],
      schedule: [],
      charges: {
        pickup:[],
        dropoff:[]
      },
      traveldate: new Date().toISOString().substr(0, 10),
      locations: [{
        code: "PPS",
        name: "Puerto Princesa"
      }, {
        code: "ELN",
        name: "El Nido"
      }, {
        code: "PBT",
        name: "Port Barton"
      }, {
        code: "SVC",
        name: "San Vicente"
      }, {
        code: "SAB",
        name: "Sabang"
      }, {
        code: "AST",
        name: "Astoria Palawan"
      }]
    };
  },
  methods: {
    fnEncode() {
      var payload= {
        name: this.name,
        code:this.code,
        origin:this.origin,
        desti: this.desti,
        schedule: this.schedule,
        charges: this.charges,
        min: this.min, 
        max: this.max
      }
      listing.add(payload).then(snap=>{
        console.log(snap.id, 'generated')
      }).catch(e=>{
        console.log(e)
      })
      //console.log(payload)
    }
  }
};
</script>
