<template>
  <v-card min-height="100%">
    <v-divider></v-divider>
    <v-data-table min-height="100%" :loading="loading" :items-per-page="itemsPerPage" hide-default-footer loading-text="Getting data from server..." dense :headers="headers" :items="items" item-key="ref" class="elevation-1" :search="search">
      <template v-slot:top>
        <v-flex xs6 md3 lg3 sm3>
          <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
        </v-flex>
      </template>
      <template v-slot:item.ref="{ item }">
        <a :href="`/view-soa/`+item.ref" target="_blank"><small>{{item.ref}}</small></a>
      </template>
     
       <template v-slot:item.d_date="{ item }">
        <small>{{item.d_date}}</small>
      </template>
      <template v-slot:item.period="{ item }">
        <small>{{item.period}}</small>
      </template>
      <template v-slot:item.amount_due="{ item }">
        <small>{{parseFloat(item.amount_due)|toPHP}}</small>
      </template>
      <template v-slot:item.payments="{ item }">
      <small>  {{parseFloat(item.payments)|toPHP}}</small>
      </template>
      <template v-slot:item.balance="{ item }">
     <small>   {{parseFloat(item.balance)|toPHP}} </small>
      </template>
      <template v-slot:item.duedate="{ item }">
        <v-chip small dense :color="getColor(getStatus(item))">{{getStatus(item)}}</v-chip>
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
            <v-btn dense small text color="green" @click="fetchSoa">
              <v-icon small dense>fas fa-sync-alt</v-icon>
            </v-btn>
             <span class="mr-4
            grey--text">
            {{unpaid|toPHP}}
          </span>
            <v-spacer></v-spacer>
            <span class="mr-4
            grey--text">
             {{ page }}/{{ numberOfPages }}
          </span>
            <v-btn dense small text color="primary" @click="formerPage">
              <v-icon small dense>fas fa-arrow-left</v-icon>
            </v-btn>
            <v-btn small dense color="primary" text @click="nextPage">
              <v-icon small dense>fas fa-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
      </template>
    </v-data-table>
   
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Billing',
  data() {
    return {
      items: [],
      loading: false,
      search: '',
      unpaid: 0,
      page: 1,
      itemsPerPage: 12,
      itemsPerPageArray: [12, 24, 30],
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser']),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    headers() {
      return [{
        text: 'Ref',
        value: 'ref'
      }, {
        text: 'Period',
        value: 'period'
      }, {
        text: 'Due Date',
        value: 'd_date'
      }, {
        text: 'Amount Due',
        value: 'amount_due'
      }, {
        text: 'Payments',
        value: 'payments'
      }, {
        text: 'Balance',
        value: 'balance'
      }, {
        text: 'Status',
        value: 'duedate'
      }]
    }
  },
  mounted() {
    this.fetchSoa()
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
    },

    getStatus(i) {
     
      var due_date = new Date(i.duedate)
      var today = new Date()

      if (parseFloat(i.balance) > 0 && today < due_date) {
        return 'Unpaid'
      } else if (parseFloat(i.balance) > 0 && today > due_date) {
        return 'Overdue'
      } else {
        return 'Paid'
      }
    },
    getColor(i) {
      if (i === 'Unpaid')
        return 'warning'
      else if (i === 'Overdue')
        return 'error'
      else
        return 'success'
    },
    fetchSoa() {
      this.loading = true
      this.items = []
      fetch('https://api.diskubrepalawan.com/index_dev.php/get-my-bill/'+this.getCurrentUser.entity.id).then((data) => {
        return data.json()
      }).then((data) => {

        this.items = data

      }).finally(() => this.loading = false)
    }
  },
  watch: {
    items(val) {
      if (val.length > 0) {
        this.unpaid = 0
        val.forEach(a => {
          this.unpaid = this.unpaid + parseFloat(a.balance)
        })



      }
    }
  }

}
</script>

<style scoped>
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
