<template>
  <v-container fluid>
  
    <v-layout wrap>
      <v-flex xs6 md3 lg3 sm3>
        <v-text-field v-model="search" class="white--text" label="Search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-data-iterator :page="page" class="mb-10" :items="items" :search="search" single-expand :items-per-page.sync="itemsPerPage" hide-default-footer>
      <template v-slot:default="{ items, isExpanded, expand }">
        <v-row>
          <v-col v-for="item in items" :key="item.id" cols="12" sm="4" md="3" lg="3" xs="3">
            <v-card class="pa-1">
              <v-list-item @click="isexpand = !isExpanded(item), expand(item, isexpand) ">
                <v-list-item-content>
                  <small>{{item.id}}</small>
                 <strong>{{item.business_name}}</strong>
                  <span><small style="font-size:10px;"> {{item.address}} {{item.country}} {{item.zip}}</small></span>
                </v-list-item-content>
              </v-list-item>
              <v-list v-if="isExpanded(item)" @click="isexpand = !isExpanded(item)" dense>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Contact Info</v-list-item-title>
                    <v-simple-table dense width="100%">
                      <template v-slot:default>
                        <tbody>
                          <tr v-for="i in item.email">
                            <td style="font-size:10px;">Email : </td>
                            <td style="font-size:10px;"><a target="_blank" :href="`mailto:` + i">{{i}}</a></td>
                          </tr>
                          <tr v-for="i in item.phone">
                            <td style="font-size:10px;">Phone :</td>
                            <td style="font-size:10px;"><a target="_blank" :href="`tel:` + i">{{i}}</a></td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-list-item-content>
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
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Partners',
  data() {
    return {
      items: [],
      loading: false,
      search: '',
      unpaid: 0,
      page: 1,
      itemsPerPage: 15,
      itemsPerPageArray: [15, 30, 50],
    }
  },
  computed: {
    ...mapGetters(['getPartners']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },

  mounted() {
    this.items = this.getPartners
    console.log(this.items)
  },
  methods: {
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


.paid {
  background-color: #4caf50;
}

.overdue {
  background-color: #f44336
}

.unpaid {
  background-color: #2196f3
}

.bottom {
  position: absolute;
  width: 100%;
  display: block;
  bottom: 0;
  right: 0;
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

.v-data-footer {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
