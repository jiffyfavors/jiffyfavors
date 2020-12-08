<template>
  <v-flex xs12 md6 sm6 lg6 class="pa-1 ma-1">
    <v-card class="mx-auto" width="500" max-width="100%" outlined>
      <v-list-item three-line dense>
        <v-list-item-avatar tile size="100">
          <v-img :src="data.rateinfo.thumb"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <div class="overline">{{data.type}} - {{data.pax}} people</div>
          <div>{{data.service}}</div>
          <v-list-item-subtitle>{{data.traveldate}} {{data.time}}</v-list-item-subtitle>
          <div class="overline">Pickup Area: {{data.rates.extra.pickup.area}}</div>
          <div class="overline">Drop Off Area: {{data.rates.extra.dropoff.area}}</div>
        </v-list-item-content>
      </v-list-item>
      <v-layout align-center>
        <v-flex xs6 md6 sm6 lg6 class="mx-auto">
          <v-chip small align="end" class="ma-2 white--text" color="blue">
            {{price|toPHP}}
          </v-chip>
        </v-flex>
        <v-flex xs6 md6 sm6 lg6 class="mx-auto">
          <v-btn tile small outlined @click="sheet=true" :color="color">
            {{statusText}}
          </v-btn>
        </v-flex>
        <v-col align="end">
          <v-icon small @click="removeCartItem" color="red">far fa-trash-alt</v-icon>
        </v-col>
      </v-layout>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="sheet" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-layout align="center" class="fill-height">
          <v-card class="mx-auto" width="500">
            <v-form ref="bookForm" lazy-validation @submit="bookingSubmit">
              <v-toolbar flat dense dark color="primary">
                <v-btn icon dark type="submit" @click="sheet = false">
                  <v-icon>fas fa-arrow-left</v-icon>
                </v-btn>
                <v-toolbar-title>Information Required</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="green" type="submit" tile>
                  Save
                </v-btn>
              </v-toolbar>
              <v-list two-line subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{data.type}}</v-list-item-title>
                    <v-list-item-subtitle>{{data.service}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Participants</v-list-item-title>
                    <v-layout v-if="!data.type.includes('Tour')" wrap>
                      <v-flex xs12 md12 sm12>
                        <v-text-field required v-model="data.participants[0].name" :rules="textAreaRule" label="Lead Passenger" placeholder="Lead Passenger" :value="data.participants[0].name"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="data.type.includes('Tour')" wrap>
                      <v-layout wrap v-for="item in data.participants" :key="`guest_data_`+ item.id">
                        <v-divider></v-divider>
                        <v-flex xs12 md12 sm12>
                          <v-text-field required v-model="data.participants[getIndex(item)].name" :rules="textAreaRule" :label="'Guest Name '+parseInt(getIndex(item)+1)" placeholder="Fullname" :value="data.participants[getIndex(item)].name"></v-text-field>
                        </v-flex>
                        <v-flex xs4 md4 sm4>
                          <v-select flat dense label="Gender" name="gender[]" required v-model="data.participants[getIndex(item)].gender" :items="gender" :value="data.participants[getIndex(item)].gender" item-text="name" item-value="value">
                          </v-select>
                        </v-flex>
                        <v-flex xs2 md2 sm2>
                          <v-text-field name="age[]" type="number" text-center required step=1 min=1 max=90 v-model="data.participants[getIndex(item)].age" :value="data.participants[getIndex(item)].age" label="Age"></v-text-field>
                        </v-flex>
                        <v-flex xs6 md6 sm6>
                          <v-select flat dense label="Nationality" name="nationality[]" required v-model="data.participants[getIndex(item)].nationality" :value="data.participants[getIndex(item)].nationality" :items="getNationality">
                          </v-select>
                        </v-flex>
                        <v-divider></v-divider>
                      </v-layout>
                    </v-layout>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-layout wrap>
                    <v-flex xs12 md12 sm12>
                      <v-text-field :disabled="data.rates.extra.pickup.location.includes('Barton') && data.type.includes('Shared')" required v-model="data.rates.extra.pickup.location" :rules="textAreaRule" :label="data.rates.extra.pickup.area.includes('Airport') ? 'Flight No.' : 'Pickup Location in ' + data.rates.extra.pickup.area" :placeholder="data.rates.extra.pickup.area.includes('Airport') ? 'Flight No.' : 'Pickup Location in ' + data.rates.extra.pickup.area" :value="data.rates.extra.pickup.location"></v-text-field>
                    </v-flex>
                    <v-alert v-if="data.rates.extra.pickup.location.includes('Barton') && data.type.includes('Shared')" dense text type="warning">
                      All Pickup on Shared Transfer is set to <strong>Port Barton Common Terminal</strong>
                    </v-alert>
                  </v-layout>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-layout wrap>
                    <v-flex xs12 md12 sm12>
                      <v-text-field :disabled="data.rates.extra.dropoff.location.includes('Barton') && data.type.includes('Shared')" required v-model="data.rates.extra.dropoff.location" :rules="textAreaRule" :label="data.rates.extra.dropoff.area.includes('Airport') ? 'Flight No.' : 'Drop Off Location in ' + data.rates.extra.dropoff.area" :placeholder="data.rates.extra.dropoff.area.includes('Airport') ? 'Flight No.' : 'Drop Off Location in ' + data.rates.extra.dropoff.area" :value="data.rates.extra.dropoff.location"></v-text-field>
                    </v-flex>
                    <v-alert v-if="data.rates.extra.dropoff.location.includes('Barton') && data.type.includes('Shared')" dense text type="warning">
                      All DropOff on Shared Transfer is set to <strong>Port Barton Common Terminal</strong>
                    </v-alert>
                  </v-layout>
                </v-list-item>
                <v-list-item>
                  <v-layout wrap>
                    <v-flex xs12 md12 sm12>
                      <v-textarea outlined name="instruction" persistent-hint hint="This is subject for approval" v-model="data.request" label="Special Request / Instruction"></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-list-item>
              </v-list>
            </v-form>
          </v-card>
        </v-layout>
      </v-dialog>
    </v-row>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'CartItem',
  props: {
    data: Object,
    index: Number
  },
  computed: {
    ...mapGetters(["getNationality"])
  },
  data() {
    return {
      sheet: false,
      statusText: 'More Info Required',
      price: 0,
      color: "blue",
      isRequiredInfo: true,
      gender: [{ name: 'Male', value: 'M' }, { name: 'Female', value: 'F' }],
      textAreaRule: [
        v => !!v || 'This information is required',
        v => (v && v.length >= 3) || 'Field must be more than 3 characters',
      ],
    }
  },

  mounted() {



    this.setColor()


    this.price = this.data.pax < this.data.rateinfo.ceil ? parseFloat((this.data.rateinfo.base)) : (parseFloat(this.data.rateinfo.base) + ((parseInt(this.data.pax) - parseInt(this.data.rateinfo.ceil)) * parseFloat(this.data.rateinfo.price)))

    this.price = this.price + parseFloat(this.data.rates.extra.pickup.rate) + parseFloat(this.data.rates.extra.dropoff.rate)


  },

  methods: {
    setColor() {

      var haveBlank = false
      this.data.participants.forEach((a) => {

        if (a.name.length < 3)
          haveBlank = true


      })
  


      if (haveBlank === true || this.data.rates.extra.pickup.location === "" || this.data.rates.extra.dropoff.location === "") {
        this.color = "orange"
        this.statusText = "Info Required"
        this.isRequiredInfo = true
      } else {
        this.color = "blue"
        this.statusText = "Edit Info"
        this.isRequiredInfo = false
      }

      var newData = cloneDeep(this.data);
      newData.requiredInfo = this.isRequiredInfo
      
    

      var data = {
        oldData: this.data,
        newData: newData
      }
        this.$store.commit('updateCartItem', data)

    },
    removeCartItem() {
      this.$store.commit('removeCartItem', this.data)
    },
    getIndex(item) {
      return this.data.participants.findIndex((e) => e.id == item.id)
    },
    bookingSubmit: function(e) {
      this.setColor()


      if (this.$refs.bookForm.validate()) {



    

        this.sheet = false

      }
      e.preventDefault()
      return false
    },
  }
}
</script>
