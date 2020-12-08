<template>
  <v-layout wrap>
    <v-dialog v-model="opensheet" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="opensheet = false">
          <v-icon>fas fa-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>Editor</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm6 md6 lg6>
              <v-card>
                <v-layout wrap>
                  <v-flex xs12 md12 sm12>
                    <v-text-field v-model="currentItem.name" label="Title"></v-text-field>
                  </v-flex>
                  <v-flex xs4 md4 sm4>
                    <v-text-field v-model="currentItem.days" type="number" label="Days"></v-text-field>
                  </v-flex>
                  <v-flex xs4 md4 sm4>
                    <v-text-field v-model="currentItem.code" label="Code"></v-text-field>
                  </v-flex>
                  <v-flex xs4 md4 sm4>
                    <v-chip class="ma-1 pa-1" label text @click="currentItem.status='Draft'" :color="currentItem.status==='Draft' ? 'green' : 'secondary'" text-color="white">Draft</v-chip>
                    <v-chip class="ma-1 pa-1" label text @click="currentItem.status='Publish'" :color="currentItem.status==='Publish' ? 'green' : 'secondary'" text-color="white">Publish</v-chip>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-col cols="12" sm="12">
                      <v-select v-model="currentItem.tours" small-chips :items="items" label="Select" multiple chips hint="What Tours?" persistent-hint item-text="name" item-value="code">
                        <template v-slot:selection="data">
                          <!-- HTML that describe how select should render selected items -->
                          <v-chip small>{{ data.item.code }}</v-chip>
                        </template>
                        <template v-slot:item="data">
                          <!-- HTML that describe how select should render items when the select is open -->
                          {{ data.item.type }} - {{ data.item.name }}
                        </template>
                      </v-select>
                    </v-col>
                  </v-flex>
                  <v-flex xs3 md3 sm3>
                    <v-checkbox label="PPS" v-model="currentItem.locations" value="PPS"></v-checkbox>
                  </v-flex>
                  <v-flex xs3 md3 sm3>
                    <v-checkbox label="El Nido" v-model="currentItem.locations" value="ELN"></v-checkbox>
                  </v-flex>
                  <v-flex xs3 m3 sm3>
                    <v-checkbox label="Coron" v-model="currentItem.locations" value="CRN"></v-checkbox>
                  </v-flex>
                  <v-flex xs3 m3 sm3>
                    <v-checkbox label="Barton" v-model="currentItem.locations" value="Barton"></v-checkbox>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-simple-table dense width="100%">
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <th>
                              B
                            </th>
                            <td>
                              <input size="2" type="number" v-model="currentItem.meals.breakfast">
                            </td>
                            <th>
                              L
                            </th>
                            <td>
                              <input size="2" type="number" v-model="currentItem.meals.lunch">
                            </td>
                          </tr>
                          <tr>
                            <th>
                              S
                            </th>
                            <td>
                              <input size="2" type="number" v-model="currentItem.meals.snacks">
                            </td>
                            <th>
                              D
                            </th>
                            <td>
                              <input size="2" type="number" v-model="currentItem.meals.dinner">
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left;">Adult</th>
                            <th class="text-left;">Child</th>
                            <th class="text-left">Infant</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input size="2" style="width:50px;" type="number" v-model="currentItem.rates.adult">
                            </td>
                            <td>
                              <input size="2" style="width:50px;" type="number" v-model="currentItem.rates.child">
                            </td>
                            <td>
                              <input size="2" style="width:50px;" type="number" v-model="currentItem.rates.infant">
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6 md6 lg6>
              <v-expansion-panels inset>
                <v-expansion-panel>
                  <v-expansion-panel-header>Inclusions</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12>
                            <v-simple-table dense width="100%">
                              <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input type="text" size="50" v-model="inc_text" placeholder="Inclusion">
                                    </td>
                                    <td>
                                      <v-icon small @click="currentItem.inclusions.push(inc_text), inc_text=''">fas fa-save</v-icon>
                                    </td>
                                  </tr>
                                  <tr v-for="(item,i) in currentItem.inclusions" :key="`inc_`+i">
                                    <td><input type="text" size="50" v-model="currentItem.inclusions[i]" placeholder="Inclusion"></td>
                                    <td>
                                      <v-icon small @click="swapItem(currentItem.inclusions,currentItem.inclusions.indexOf(item),currentItem.inclusions.indexOf(item)-1)"> fas fa-arrow-up</v-icon>
                                      <v-icon small @click="swapItem(currentItem.inclusions,currentItem.inclusions.indexOf(item),currentItem.inclusions.indexOf(item)+1)">fas fa-arrow-down</v-icon>
                                      <v-icon small color="red" @click="currentItem.inclusions.splice(currentItem.inclusions.indexOf(item),1)">fas fa-window-close</v-icon>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Exclusions</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12>
                            <v-simple-table dense width="100%">
                              <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input type="text" size="50" v-model="exc_text" placeholder="Exclusion">
                                    </td>
                                    <td>
                                      <v-icon small @click="currentItem.exclusions.push(exc_text), exc_text=''">fas fa-save</v-icon>
                                    </td>
                                  </tr>
                                  <tr v-for="(item,i) in currentItem.exclusions" :key="`exc_`+i">
                                    <td><input type="text" size="50" v-model="currentItem.exclusions[i]" placeholder="Inclusion"></td>
                                    <td>
                                      <v-icon small @click="swapItem(currentItem.exclusions,currentItem.exclusions.indexOf(item),currentItem.exclusions.indexOf(item)-1)"> fas fa-arrow-up</v-icon>
                                      <v-icon small @click="swapItem(currentItem.exclusions,currentItem.exclusions.indexOf(item),currentItem.exclusions.indexOf(item)+1)">fas fa-arrow-down</v-icon>
                                      <v-icon small color="red" @click="currentItem.exclusions.splice(currentItem.exclusions.indexOf(item),1)">fas fa-window-close</v-icon>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Itinerary</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12>
                            <v-simple-table dense width="100%">
                              <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input type="text" size="50" v-model="iti_text" placeholder="Itinerary">
                                    </td>
                                    <td>
                                      <v-icon small @click="currentItem.itinerary.push(iti_text), iti_text=''">fas fa-save</v-icon>
                                    </td>
                                  </tr>
                                  <tr v-for="(item,i) in currentItem.itinerary" :key="`iti_`+i">
                                    <td><input type="text" size="50" v-model="currentItem.itinerary[i]" placeholder="Inclusion"></td>
                                    <td>
                                      <v-icon small @click="swapItem(currentItem.itinerary,currentItem.itinerary.indexOf(item),currentItem.itinerary.indexOf(item)-1)"> fas fa-arrow-up</v-icon>
                                      <v-icon small @click="swapItem(currentItem.itinerary,currentItem.itinerary.indexOf(item),currentItem.itinerary.indexOf(item)+1)">fas fa-arrow-down</v-icon>
                                      <v-icon small color="red" @click="currentItem.itinerary.splice(currentItem.itinerary.indexOf(item),1)">fas fa-window-close</v-icon>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Best For</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12>
                            <v-simple-table dense width="100%">
                              <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input type="text" size="50" v-model="best_for_text" placeholder="Best For">
                                    </td>
                                    <td>
                                      <v-icon small @click="currentItem.bestfor.push(best_for_text), best_for_text=''">fas fa-save</v-icon>
                                    </td>
                                  </tr>
                                  <tr v-for="(item,i) in currentItem.bestfor" :key="`best_for_`+i">
                                     <td><input type="text" size="50" v-model="currentItem.bestfor[i]" placeholder="Inclusion"></td>
                                    <td>
                                      <v-icon small @click="swapItem(currentItem.bestfor,currentItem.bestfor.indexOf(item),currentItem.bestfor.indexOf(item)-1)"> fas fa-arrow-up</v-icon>
                                      <v-icon small @click="swapItem(currentItem.bestfor,currentItem.bestfor.indexOf(item),currentItem.bestfor.indexOf(item)+1)">fas fa-arrow-down</v-icon>
                                      <v-icon small color="red" @click="currentItem.bestfor.splice(currentItem.bestfor.indexOf(item),1)">fas fa-window-close</v-icon>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Departure Dates</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12>
                            <v-simple-table dense width="100%">
                              <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input type="date" v-model="d_date" placeholder="Itinerary">
                                    </td>
                                    <td>
                                      <v-icon small @click="currentItem.dates.push(d_date), sortDate()">fas fa-save</v-icon>
                                    </td>
                                  </tr>
                                  <tr v-for="(item,i) in currentItem.dates" :key="`date_`+i">
                                    <td><small>{{item}}</small></td>
                                    <td>
                                      <v-icon small color="red" @click="currentItem.dates.splice(currentItem.dates.indexOf(item),1)">fas fa-window-close</v-icon>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dense v-if="isNew" small text color="blue" @click="packages.push(currentItem), opensheet = false, saveDb()">
            <v-icon small dense>far fa-save</v-icon>
          </v-btn>
          <v-btn dense v-if="!isNew" small text color="blue" @click=" opensheet = false, saveDb()">
            <v-icon small dense>far fa-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row>
      <v-flex xs12 sm12 md12>
        <v-data-table width="100%" min-height="100%" :loading="loading" hide-default-footer loading-text="Getting packages from server..." dense :headers="headers" :items="packages" item-key="code" class="elevation-1">

           <template v-slot:item.code="{ item }">
          <input type="text" size="15" v-model="item.code" placeholder="Code">
          </template>

           <template v-slot:item.name="{ item }">
          <input type="text" size="30" v-model="item.name" placeholder="Name">
          </template>

          <template v-slot:item.days="{ item }">
            <small>{{parseInt(item.days)}}D{{parseInt(item.days)-1}}N</small>
          </template>
          <template v-slot:item.tours="{ item }">
            <v-chip small outlined label v-for="(i,index) in item.tours" color="red" text :key="item.code + '_tours_' + index">{{i}}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small color="green" class="mx-1" @click="currentItem = item, isNew = false, opensheet = true">
              fas fa-edit
            </v-icon>
            <v-icon small class="mx-1" color="indigo" @click="dubThis(item)">fas fa-copy</v-icon>
            <v-icon small class="mx-1" color="red" @click="packages.splice(items.indexOf(item),1), saveDb()">fas fa-window-close</v-icon>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-toolbar small dense text class="mt-2 bottom shopresponsive" align="center" justify="center">
      <v-row>
        <v-spacer></v-spacer>
        <small class="mr-4
            grey--text">
           
          </small>
        <v-btn dense small text color="green" @click="currentItem = defaultItem, isNew=true, opensheet=true">
          <v-icon small dense>fas fa-sync-alt</v-icon>
        </v-btn>
        <v-btn dense small text color="blue" @click="saveDb()">
          <v-icon small dense>far fa-save</v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
  </v-layout>
</template>

<script>
export default {
  name: 'PackageEditor',
  data() {
    return {
      isNew:false,
      loading: false,
      packages: [],
      opensheet: false,
      items: [],
      inc_text: '',
      exc_text: '',
      iti_text: '',
      best_for_text: '',
      currentItem: {
        name: '',
        code: '',
        days: 0,
        locations: [],
        tours: [],
        itinerary: [],
        bestfor: [],
        inclusions: [],
        status: 'Draft',
        exclusions: [],
        dates: [],
        meals: {
          breakfast: 0,
          lunch: 0,
          snacks: 0,
          dinner: 0,
          description: '',
        },
        rates: {
          adult: 0,
          child: 0,
          infant: 0
        },
        notations: [],
        cancellation: []


      },
      defaultItem: {},
      d_date: '',
    }
  },

  computed: {
    headers() {
      return [{
          text: 'Code',
          value: 'code'
        }, {
          text: 'Name',
          value: 'name'
        }, {
          text: 'Duration',
          value: 'days'
        },

        {
          text: 'Tours',
          value: 'tours'
        }, {
          text: 'Status',
          value: 'status'
        },
        { text: 'Actions', value: 'action', sortable: false }
      ]
    }
  },

  mounted() {


    this.defaultItem = Object.assign({}, this.currentItem)
    this.getPackages()
    this.getServices()
  },
  methods: {
dubThis(item){
  var dupitem  = Object.assign({}, item);
  dupitem.code= item.code +'(dup)';
  this.packages.push(dupitem)
  this.saveDb()
},
    saveDb() {
      var payload = {
        updated: this.packages
      }
      fetch('https://www.diskubrepalawan.com/index_dev.php/update-tourpackage-file', {

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
        this.getPackages()

      }).catch((e) =>
        alert('error')
      ).finally(() => alert('success'))

    },

    swapItem(arr, a, b) {
      if (b > arr.length)
        b = arr.length - 1
      if (b < 0)
        b = 0
      arr[a] = arr.splice(b, 1, arr[a])[0]
      console.log(arr)



    },

    sortDate() {
      alert('sort')
      this.dates.sort(this.objSort)
    },

    objSort: (a, b) => {
      const bandA = a.toUpperCase();
      const bandB = b.toUpperCase();

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;


    },
    getPackages() {

      this.loading = true
      fetch('https://www.diskubrepalawan.com/get-tourpackage-file', { method: 'GET', mode: 'cors' }).then((response) => {

        return response.json();
      }).then((data) => {
        this.packages = data
        this.loading = false
          // data.tours.forEach(a => {
          //   a.name = a.type + ' ' + a.name
          //   this.items.push(a)
          // })
      })
    },
    getServices() {
      this.items = []
      fetch('https://www.diskubrepalawan.com/get-master-file', { method: 'GET', mode: 'cors' }).then((response) => {
        this.loading = false
        return response.json();
      }).then((data) => {
        this.items = data.tours
          // data.tours.forEach(a => {
          //   a.name = a.type + ' ' + a.name
          //   this.items.push(a)
          // })
      })
    }
  },
  watch: {
    tours(val) {
      console.log(val)
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
