<template>
  <v-card min-height="100%">
    <small>Abandoned Cart</small>
    <v-divider></v-divider>
    <v-data-iterator :page="page" class="mb-10" :items="items" single-expand :items-per-page.sync="itemsPerPage" hide-default-footer>
      <template v-slot:default="{ items, isExpanded, expand }">
        <v-row>
          <v-col v-for="item in items" :key="item.cartid" cols="12" sm="6" md="6" lg="6" xs="12">
            <v-card class="pa-1">
              <span class="approved transtype"><small>{{item.lastmodified}}</small></span>
              <v-list-item @click="isexpand = !isExpanded(item), expand(item, isexpand) ">
                <v-list-item-content>
              
                  <v-list-item-title> <strong>{{item.participants[0].name}}</strong></v-list-item-title>
                  <v-list-item-subtitle>{{item.traveldate}} {{item.time}} {{item.pax}} pax</v-list-item-subtitle>
                  <v-list-item-subtitle>{{item.service}}</v-list-item-subtitle>
                  <v-list-item-subtitle><small>{{item.type}}</small></v-list-item-subtitle>
             
                
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
                  <v-simple-table dense width="100%" v-if="Object.keys(item.contact).length >0 && item.contact.constructor === Object">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td style="font-size:10px;">Email : </td>
                          <td style="font-size:10px;"><a target="_blank" :href="`mailto:` + item.contact.email">{{item.contact.email}}</a></td>
                        </tr>
                        <tr>
                          <td style="font-size:10px;">Phone :</td>
                          <td style="font-size:10px;"><a target="_blank" :href="`tel:` + item.contact.phone">{{item.contact.phone}}</a></td>
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
                      <v-icon dense text color="green" class="white--text mx-1" @click="setStatus(item,'APPROVED')">far fa-thumbs-up</v-icon>
                    </v-btn>
                    <v-btn small icon>
                      <v-icon dense text color="red" class="white--text mx-1" @click="deleteCart(item.cartid)">fas fa-window-close</v-icon>
                    </v-btn>
                  </v-layout>
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
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AbandonedCart',
  data: () => {
    return {

      expand: false,
      isexpand: false,
      itemrecord: {},
      snackbar: false,
      itemsPerPage: 6,
      page: 1,
      itemsPerPageArray: [12, 24, 30],
      search: '',
      items: []
    }
  },

  computed: {
    ...mapGetters(['getBookings', 'getPartners']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchBookings()
  },

  methods: {

    deleteCart(id) {
      fetch('https://api.diskubrepalawan.com/index_dev.php/delete-cart/' + id).then(() => {
        this.fetchBookings();
      })
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

    fetchBookings() {

      this.items = []
      fetch('https://api.diskubrepalawan.com/index_dev.php/get-carts').then((data) => {
        return data.json()
      }).then((data) => {

        data.forEach(d => {

          d.data.forEach(e => {
            e.cartid = d.id
            e.lastmodified = d.lastmodified
            e.contact = d.contact
            this.items.push(e)
          })


        })




      }).catch(() => {
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
