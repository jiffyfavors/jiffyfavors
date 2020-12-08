<template>
  <v-layout fill-height pa-1 wrap>
    <v-flex xs9 md3 sm3 lg3>
      <v-autocomplete autocomplete="off" v-model="driver" :items="items" :loading="isLoading" :search-input.sync="search" item-text="nickname" item-value="id" label="Select Driver" placeholder="Start typing to Search" prepend-icon="fas fa-search" return-object></v-autocomplete>
    </v-flex>
    <v-flex xs3 md3 sm3 lg3>
      <v-btn icon>
        <v-icon small dense @click="driver=driver_default,driverdiag = true">fas fa-plus</v-icon>
      </v-btn>
       <v-btn icon>
        <v-icon small dense @click="driverdiag = true">fas fa-edit</v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs12 sm12 md12 pa-2>
    </v-flex>
    <v-dialog persistent v-model="driverdiag" width="500">
      <v-card>
      		<form autocomplete="off">
        <v-card-title class="headline grey lighten-2" primary-title>
          Drivers Info
        </v-card-title>
        <v-card-text>
          <v-layout wrap>

            <v-flex xs8 sm8 md8>
              <v-text-field flat v-model="driver.fullname" label="Drivers Name"></v-text-field>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <v-text-field flat v-model="driver.nickname" label="Nickname"></v-text-field>
            </v-flex>
            <v-flex xs8 sm8 md8>
              <v-text-field flat v-model="driver.email" type="email" label="Email"></v-text-field>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <v-text-field flat v-model="driver.platenumber" label="Plate Number"></v-text-field>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <v-text-field flat v-model="driver.phone.phone1" label="Phone 1"></v-text-field>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <v-text-field flat v-model="driver.phone.phone2" label="Phone 2"></v-text-field>
            </v-flex>
            <v-flex xs4 sm4 md4>
              <v-text-field flat v-model="driver.auth_code" label="Auth Code"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
         <v-btn color="secondary" @click="driverdiag=false" text>
           Cancel
          </v-btn>
          <v-btn color="primary" @click="uploadInfo" text>
            Done
          </v-btn>
        </v-card-actions>
    </form>
      </v-card>
    </v-dialog>


  </v-layout>
</template>

<script>
export default {
  name: 'Drivers',
  data() {
    return {
      driverdiag: false,
      search: '',
      driver_default:{
        fullname: '',
        phone:{
        	phone1:'',
        	phone2:'',
        },
        email: '',
        auth_code: '',
        nickname: '',
        platenumber: ''
      },
      driver: {
        fullname: '',
        phone:{
        	phone1:'',
        	phone2:'',
        },
        email: '',
        auth_code: '',
        nickname: '',
        platenumber: ''
      },
      items: [],
      isLoading: false,

    }
  },
  mounted() {
  	this.driver_default = this.driver
    this.fetchDriver({})
  },

 
  methods: {
    uploadInfo() {
      
      this.fetchDriver(this.driver)
    },
    fetchDriver(payload) {
    	this.driverdiag = false
      fetch('https://api.diskubrepalawan.com/index_dev.php/driver-info', {

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
      }).then((data) => {

        this.items = data

        
      })
    }
  }
}
</script>
