<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs3 sm3 md3>
            <v-text-field name="name" v-model="filejs.TA_Ds" label="TA_Ds" id="id"></v-text-field>
          </v-flex>
          <v-flex xs3 sm3 md3>
            <v-text-field name="name" v-model="filejs.TA_PV" label="TA_Pv" id="id"></v-text-field>
          </v-flex>
          <v-flex xs3 sm3 md3>
            <v-switch label="cardMode" v-model="filejs.cardMode"></v-switch>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" dense background-color="deep-purple accent-4" class="elevation-2 white--text" light :centered="true">
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#transfers">Transfers</v-tab>
          <v-tab href="#tours">Tours</v-tab>
          <v-tab-item value="transfers">
            <v-card width="100%">
              <v-simple-table dense class="mb-5" width="100%">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left;">Type</th>
                      <th class="text-left;">Name</th>
                      <th class="text-left">Base</th>
                      <th class="text-left">Ceil</th>
                      <th class="text-left">Price</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="font-size:10px;" v-for="(i, index) in filejs.transfers" :key="`trans`+ index">
                      <td style="font-size:10px;">
                        <input required text-center v-model="i.code">
                      </td>
                      <td style="font-size:10px;">
                        <input size="30" required text-center v-model="i.type">
                      </td>
                      <td style="font-size:10px;">
                        <input size="50" required text-center v-model="i.name">
                      </td>
                      <td style="font-size:10px;">
                        <input size="5" required text-center v-model="i.base">
                      </td>
                      <td style="font-size:10px;">
                        <input size="2" required text-center v-model="i.ceil">
                      </td>
                      <td style="font-size:10px;">
                        <input size="3" required text-center v-model="i.price">
                      </td>
                      <td style="font-size:10px;">
                        <v-icon small color="blue" @click="itemrecord = i, scheddialog = true">fas fa-clock</v-icon>
                        <v-icon small color="indigo" @click="itemrecord = i, docopy('transfers')">fas fa-copy</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tours">
            <v-card width="100%">
              <v-simple-table dense class="mb-5" width="100%">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left;">Code</th>
                      <th class="text-left;">Type</th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Origin</th>
                      <th class="text-left">Destu</th>
                      <th class="text-left">Base</th>
                      <th class="text-left">Ceil</th>
                      <th class="text-left">Price</th>
                      <th class="text-left">Max</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="font-size:10px;" v-for="(i, index) in filejs.tours" :key="`trans`+ index">
                      <td style="font-size:10px;">
                        <input size="10" required text-center v-model="i.code">
                      </td>
                      <td style="font-size:10px;">
                        <input size="20" required text-center v-model="i.type">
                      </td>
                      <td style="font-size:10px;">
                        <input size="30" required text-center v-model="i.name">
                      </td>
                      <td style="font-size:10px;">
                        <input size="3" required text-center v-model="i.origin">
                      </td>
                      <td style="font-size:10px;">
                        <input size="3" required text-center v-model="i.desti">
                      </td>
                      <td style="font-size:10px;">
                        <input size="5" required text-center v-model="i.base">
                      </td>
                      <td style="font-size:10px;">
                        <input size="2" required text-center v-model="i.ceil">
                      </td>
                      <td style="font-size:10px;">
                        <input size="3" required text-center v-model="i.price">
                      </td>
                      <td style="font-size:10px;">
                        <input size="2" required text-center v-model="i.max">
                      </td>
                      <td style="font-size:10px;">
                        <v-icon small @click="itemrecord = i, scheddialog = true">fas fa-clock</v-icon>
                        <v-icon small color="indigo" @click="itemrecord = i, docopy('tours')">fas fa-copy</v-icon>
                        <v-menu bottom left>
                          <template v-slot:activator="{ on }">
                            <v-btn small icon v-on="on">
                              <v-icon color="indigo">fas fa-ellipsis-v</v-icon>
                            </v-btn>
                          </template>
                          <v-list dense>
                            <v-subheader>{{i.code}}</v-subheader>
                            <v-list-item>
                              <v-list-item-title>Edit Description</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit Destinations</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit Thumb</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit Notation</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit Cancellation</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="itemrecord = i, inc_diag = true">
                              <v-list-item-title>Edit Inclusions</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="itemrecord = i, exc_diag = true">
                              <v-list-item-title>Edit Exclusions</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit Fees</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="itemrecord = i, iti_diag = true">
                              <v-list-item-title>Edit Itinerary</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-toolbar small dense text class="mt-2 shopresponsive" align="center" justify="center">
        <v-row>
          <v-btn dense small text color="green" @click="getFileJS">
            <v-icon small dense>fas fa-sync-alt</v-icon>
          </v-btn>
          <v-btn dense small text v-if="filejs.transfers.length>0" color="blue" @click="saveDb">
            <v-icon small dense>far fa-save</v-icon>
          </v-btn>
        </v-row>
      </v-toolbar>
    </v-card>
    <v-dialog persistent v-model="scheddialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Schedule
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs3 sm3 md3>
              <v-text-field flat v-model="schedtime" type="time" label="time"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-btn small @click="addSched(itemrecord)" icon dense>
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-list dense subheader>
            <v-list-item demse v-for="(item,i) in itemrecord.schedule" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{item}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="itemrecord.schedule.splice(itemrecord.schedule.indexOf(item),1)">fas fa-window-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="scheddialog = false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="iti_diag" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Itinerary - {{itemrecord.code}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs9 sm9 md9>
              <v-text-field flat v-model="iti_text" label="Itinerary"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-btn small @click="itemrecord.itinerary.push(iti_text)" icon dense>
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-list two-line dense subheader>
            <v-list-item v-for="(item,i) in itemrecord.itinerary" :key="`iti_`+i">
              <input size="30" required text-center v-model="itemrecord.itinerary[i]">
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="itemrecord.itinerary.splice(i,1)">fas fa-window-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="iti_diag=false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <v-dialog persistent v-model="inc_diag" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Inclusions - {{itemrecord.code}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs9 sm9 md9>
              <v-text-field flat v-model="iti_text" label="Inclusions"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-btn small @click="itemrecord.inclusions.push(iti_text)" icon dense>
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-list two-line dense subheader>
            <v-list-item v-for="(item,i) in itemrecord.inclusions" :key="`iti_`+i">
              <input size="30" required text-center v-model="itemrecord.inclusions[i]">
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="itemrecord.inclusions.splice(i,1)">fas fa-window-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="inc_diag=false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="exc_diag" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Exclusions - {{itemrecord.code}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs9 sm9 md9>
              <v-text-field flat v-model="iti_text" label="Exclusions"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <v-btn small @click="itemrecord.exclusions.push(iti_text)" icon dense>
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-list two-line dense subheader>
            <v-list-item v-for="(item,i) in itemrecord.exclusions" :key="`iti_`+i">
              <input size="30" required text-center v-model="itemrecord.exclusions[i]">
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="itemrecord.exclusions.splice(i,1)">fas fa-window-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="exc_diag=false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  name: 'MasterFileEditor',
  data() {
    return {
      tab: 'transfers',
      filejs: { transfers: [], tours: [] },
      filejs_copy: {},
      schedtime: '',
      scheddialog: false,
      iti_diag: false,
      inc_diag:false,
      exc_diag:false,
      iti_text: '',
      itemrecord: {
        itinerary: [],
        fees:[],
        inclusions:[],
        exclusions:[],
        notation:[]
      }
    }
  },
  mounted() {

    this.getFileJS()
  },

  methods: {
    saveDb() {
      var payload = {
        updated: this.filejs
      }
      fetch('https://www.diskubrepalawan.com/index_dev.php/update-master-file', {

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
        this.getFileJS()

      }).catch(() =>
        alert('error')
      ).finally(() => alert('success'))

    },
    addSched(item) {
      this.itemrecord = item

      this.itemrecord.schedule.push(this.to24hr(this.schedtime))

      this.itemrecord.schedule = this.itemrecord.schedule.sort(function(a, b) {
        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
      });



    },
    docopy(type) {
      var c = {}
      if (type === 'transfers')
        c = this.filejs.transfers
      else
        c = this.filejs.tours

      var copy = Object.assign({}, this.itemrecord)
      copy.name = copy.name + '(Duplicate)'

      c.push(copy)


    },
    to24hr(time) {
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(''); // return adjusted time or original string
    },
    objSort: (a, b) => {
      const bandA = a.type.toUpperCase();
      const bandB = b.type.toUpperCase();

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;


    },
    getFileJS() {
      this.filejs = Object.assign({}, { transfers: [], tours: [] })
      fetch('https://www.diskubrepalawan.com/get-master-file', { method: 'GET', mode: 'cors' }).then((response) => {
        this.loading = false
        return response.json();
      }).then((data) => {

        this.filejs = {
          transfers: data.transfers.sort(this.objSort),
          tours: data.tours.sort(this.objSort),
          cardMode: data.cardMode,
          TA_Ds: data.TA_Ds,
          TA_PV: data.TA_PV

        }
        this.filejs_copy = Object.assign({}, this.filejs)
      })
    }
  }
}
</script>

<style scoped>
.shopresponsive {
  position: fixed;
  width: 100%;
  display: block;
  bottom: 0;
  right: 0;
}
</style>
