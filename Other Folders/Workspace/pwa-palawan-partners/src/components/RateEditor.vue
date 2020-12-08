<template>
  <v-container fluid>
    <div v-if="isLoading" class="loading"></div>
    <v-layout wrap>
      <v-flex xs6 md3 lg3 sm3>
        <v-text-field v-model="search" class="white--text" label="Search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-data-iterator :page="page" class="mb-10" :items="items" :search="search" single-expand :custom-filter="customFilter" :items-per-page.sync="itemsPerPage" hide-default-footer>
      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="item in items" :key="item.ref" cols="12" sm="4" md="3" lg="3" xs="3">
            <v-card class="pa-1" @click="editItem(item)">
              <span :class="item.status.toLowerCase() + ` transtype`"><small>{{item.status}}</small></span>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle><strong>{{getItemInfo(item).name}}</strong></v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{getItemInfo(item).type}}</small></v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{item.srv_code}}</small></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
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
    <v-row justify="center" v-if="Object.keys(itemBeingEdit).length > 0 && itemBeingEdit.constructor === Object">
      <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="sheet = false">
              <v-icon>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Rate Information</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="editorForm" lazy-validation @submit="FormEditSubmit">
            <v-layout align="center" column wrap>
              <v-card class="mx-auto" width="500" min-height="100%" max-width="100%">
                <v-list two-line subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{getItemInfo(itemBeingEdit).name}}</v-list-item-title>
                      <v-list-item-subtitle>{{getItemInfo(itemBeingEdit).type}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Rate Breakdown</v-list-item-title>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left" style="width:70%"></th>
                              <th class="text-left">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style="font-size:10px;">Base Rate</td>
                              <td style="font-size:10px;">
                                {{parseFloat(itemBeingEdit.rates.base)|toPHP}}
                              </td>
                            </tr>
                            <tr v-if="parseInt(itemBeingEdit.rates.ceil)>0">
                              <td style="font-size:10px;">Up to</td>
                              <td style="font-size:10px;">
                                {{parseInt(itemBeingEdit.rates.ceil)}} pax
                              </td>
                            </tr>
                            <tr v-if="parseInt(itemBeingEdit.rates.ceil)>0">
                              <td style="font-size:10px;">Extra Pax</td>
                              <td style="font-size:10px;">
                                {{parseFloat(itemBeingEdit.rates.rate)}}/pax
                              </td>
                            </tr>
                            <tr v-if="parseInt(itemBeingEdit.rates.ceil)==0">
                              <td style="font-size:10px;">Charge per person</td>
                              <td style="font-size:10px;">
                                {{parseFloat(itemBeingEdit.rates.rate)}}/pax
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Pickup Location Rates</v-list-item-title>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left" style="width:70%">Area</th>
                              <th class="text-left">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="r in itemBeingEdit.pickup" :key="r.name">
                              <td style="font-size:10px;">{{ r.name }}</td>
                              <td style="font-size:10px;" v-if="parseFloat(r.rate)>-1">
                                {{parseFloat(r.rate)|toPHP}}
                              </td>
                              <td style="font-size:10px;" v-if="parseFloat(r.rate)<0">
                                Pickup Not Possible
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="mb-10">
                    <v-list-item-content>
                      <v-list-item-title>Drop Off Location Rates</v-list-item-title>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left" style="width:70%">Area</th>
                              <th class="text-left">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="r in itemBeingEdit.dropoff" :key="r.name">
                              <td style="font-size:10px;">{{ r.name }}</td>
                              <td style="font-size:10px;" v-if="parseFloat(r.rate)>-1">
                                {{parseFloat(r.rate)|toPHP}}
                              </td>
                              <td style="font-size:10px;" v-if="parseFloat(r.rate)<0">
                                Drop Off Not Possible
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-layout>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RateEditor',
  data: () => {
    return {
      sheet: false,
      snackbar: false,
      itemsPerPage: 12,
      isLoading: false,
      page: 1,
      itemsPerPageArray: [12, 24, 30],
      search: '',
      items: [],
      itemBeingEdit: {}
    }
  },

  computed: {
    ...mapGetters(['getServices', 'getCurrentUser','getTourResult']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.items = this.getBookings
    this.fetchRecords()
  },

  methods: {

    rateupdate(val) {
      this.isLoading = true
      delete val.business_name
      fetch('https://api.diskubrepalawan.com/index_dev.php/rate-update', {

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
        body: JSON.stringify({ payload: val })
      }).then((data) => {

        return data.json()
      }).then(() => {
        this.fetchRecords()

      }).catch(() =>
        this.isLoading = false
      ).finally(() => this.isLoading = false)


    },

    FormEditSubmit: function(e) {
      if (this.$refs.editorForm.validate()) {
        this.sheet = false
        this.rateupdate(this.itemBeingEdit)

      }
      e.preventDefault()
      return false
    },
    editItem(item) {
      this.itemBeingEdit = item
      if(item.status.toLowerCase()==='approved')
      this.sheet = true
    },
    getItemInfo(item) {
      var c = this.getServices.find(x => x.code == item.srv_code)
      if(typeof c === 'undefined')
        c = this.getTourResult.find(x=>x.code == item.srv_code)
      return c

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
    fetchRecords() {
      this.isLoading = true
      fetch('https://api.diskubrepalawan.com/index_dev.php/get-agent-rates?agent_id=' + this.getCurrentUser.entity.id).then((data) => {
        return data.json()
      }).then((data) => {
        this.items = data
        this.isLoading = false


      }).catch(() => this.isLoading = false)
    }
  },

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

td {
  padding: 0px !important;
}

.v-list-item {
  padding: 0 5px;
}

.approved {
  background-color: #4caf50;
}

.drafted {
  background-color: #9E9E9E
}

.requested {
  background-color: #f44336
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
