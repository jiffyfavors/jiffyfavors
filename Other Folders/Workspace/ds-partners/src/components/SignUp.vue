<template>
  <v-layout align-center>
    <v-flex xs12 sm6 md6 offset-sm-3 offset-md-3 align-center>
      <v-tabs grow>
        <v-tab key="login">
          Login
        </v-tab>
        <v-tab key="signup">
          Sign Up
        </v-tab>
        <v-tab-item key="login">
          <form @submit.prevent="loginForm">
            <v-card class="mx-auto" max-width="500">
              <v-card-title class="title font-weight-regular justify-space-between">
                <span class="headline">Agent Partners Login</span>
              </v-card-title>
              <v-card-text>
                <v-flex xs12 sm12 class="pa-2">
                  <v-text-field label="Username" placeholder="Username" v-model="username" type="text" hint="Username" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 class="pa-2">
                  <v-text-field label="Password" placeholder="Password" v-model="password" type="password" hint="Password" required></v-text-field>
                </v-flex>
                <v-card-actions>
                  <v-flex xs12 sm6 offset-sm6>
                    <v-btn color="success" block type="submit">Login</v-btn>
                  </v-flex>
                </v-card-actions>
                <v-alert :value="alert" :type="notif" transition="scale-transition">
                  {{errorMsg}}
                </v-alert>
              </v-card-text>
            </v-card>
          </form>
        </v-tab-item>
        <v-tab-item key="signup">
          <form ref="registerForm" @submit.prevent="registerForm">
            <v-card class="mx-auto" max-width="500">
              <v-card-title class="title font-weight-regular justify-space-between">
                <span>{{ currentTitle }}</span>
                <v-avatar color="primary lighten-2" class="subheading white--text" size="24" v-text="step"></v-avatar>
              </v-card-title>
              <v-window v-model="step" mandatory>
                <v-window-item :value="1">
                  <v-card-text>
                    <v-select label="Business Category" v-model="type" :items="agent_type" return-object item-text="name" item-value="code"></v-select>
                    <v-text-field v-model="business_name" label="Company or Personal Name" required></v-text-field>
                    <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
                    <span class="caption grey--text text--darken-1">
            This is the email you will use to login to your account with us.
          </span>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="2">
                  <v-card-text>
                    <v-text-field v-model="pass1" label="Password" required type="password"></v-text-field>
                    <v-text-field v-model="pass2" label="Confirm Password" type="password"></v-text-field>
                    <span class="caption grey--text text--darken-1">
            Please enter a password for your account
          </span>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="3">
                  <v-card-text>
                    <v-textarea name="address" v-model="address" required label="Addess" hint="Your address"></v-textarea>
                    <v-layout>
                      <v-flex xs6>
                        <v-select v-model="country" :hint="`${country.name}, ${country.code}`" :items="items" item-text="name" item-value="cde" label="Country" persistent-hint return-object single-line></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field v-model="zip" label="Zip Code" type="number" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="4">
                  <v-card-text>
                    <v-text-field v-model="mobile1" label="Mobile 1" required></v-text-field>
                    <v-text-field v-model="mobile2" label="Mobile 2"></v-text-field>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="5">
                  <div class="pa-3 text-xs-center">
                    <v-img class="mb-3" contain height="128" src="../assets/shop-icon-128.png"></v-img>
                    <v-alert :value="true" type="success">
                      {{response.msg}}
                    </v-alert>
                  </div>
                </v-window-item>
              </v-window>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn :disabled="step === 1" @click="step--">
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="step === 5" color="primary" type="submit" depressed @click="validateStep(step)">
                  Next
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-tab-item>
      </v-tabs>
      <v-dialog v-model="loadingdiag" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            {{progressText}}
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Status</v-card-title>
          <v-card-text>
            <v-alert :type="resData.code!= 200 ? 'error':'success'">
              {{resData.msg}}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',

  data: () => {
    return {
      loadingdiag: false,
      type: 'TA',
      username: 'reservations@diskubre.com',
      dialog: false,
      resData: {
        code: 404,
        msg: '',
      },
      progressText: '',
      password: '1234',
      isLoading: false,
      alert: false,
      notif: 'success',
      errorMsg: '',
      step: 1,
      business_name: '',
      email: '',
      pass1: '',
      pass2: '',
      address: '',
      country: { name: 'Philippines', code: 'PH' },
      zip: '',
      mobile1: '',
      mobile2: '',
      items: [],
      response: {},
    }
  },
  computed: {
    agent_type() {
      return [{
        code: 'TA',
        name: 'Travel Agency'
      }, {
        code: 'AC',
        name: 'Accomodation'
      }, {
        code: 'TC',
        name: 'Tour Coordinator'
      }, {
        code: 'AG',
        name: 'Individual Agent'
      }, {
        code: 'TR',
        name: 'Transport Company'
      }, {
        code: 'OT',
        name: 'Online Travel Agency(OTA)'
      }]
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Sign-up'
        case 2:
          return 'Create a password'
        case 3:
          return 'Address Information'
        case 4:
          return 'Contact Information'
        default:
          return 'Registration Status'
      }
    },
    ...mapGetters(['getCountries', 'getCurrentUser', 'isAuth'])
  },
  mounted: function() {
    if (this.isAuth) {
      this.$router.push({ path: '/', redirect: '/' })


    }

    this.items = this.getCountries

    //this.$router.push({name:'Home'})

  },
  methods: {
    validateStep: function(step) {


      if (step === 1 && this.business_name !== '' && this.email !== '') {
        this.step++
      } else if (step === 2 && this.pass1 !== '' && this.pass2 !== '' && this.pass2 == this.pass1) {
        this.step++
      } else if (step === 3 && this.address !== '' && this.country !== '' && this.zip !== '') {
        this.step++
      } else if (step === 4 && this.mobile1 !== '') {
        this.step++
          if (this.step === 5)
            this.registerNow()
      }


    },
    // generateRef(lng) {
    //   let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';


    //   var result = ''
    //   for (var i = lng; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    //   return result

    // },
    registerNow: function() {

      this.loadingdiag = true
      this.progressText = 'Creating your account...'
      this.step = 4;
      var zips = [5302, 5320, 5311, 5307, 5306, 5305, 5317, 5321, 5316, 5315, 5318, 5310, 5313, 5301, 5322, 5314, 5319, 5303, 5300, 5304, 5308, 5309, 5312]
      var allow = zips.indexOf(parseInt(this.zip)) < 0

      var ref = this.type + '-' + this.country.code + '-' + this.generateRef(5)
      var business = {
        id: ref,
        entity_name: this.business_name,
        email: [this.email],
        type: this.type.code,
        address: this.address,
        country: this.country.code,
        zipcode: parseInt(this.zip),
        allowtour: allow.toString(),
        phone: [this.mobile1, this.mobile2],
        status: 1
      }
      var user = {
        partner_id: ref,
        username: this.email,
        password: this.pass1,
        fullname: this.business_name,
        status: '1'
      }

      this.postData(['auth', 'new-partner'], { business: business, user: user })
        .then((data) => {
          this.resData = data
          this.dialog = true
          this.loadingdiag = false
        });



    },
    registerForm: function(e) {

      e.preventDefault()

      return false
    },
    loginForm: function(e) {
      this.isLoading = true
      var auth = { username: this.username, password: this.password }
      this.loadingdiag = true
      this.progressText = 'Logging you in....'
      this.postData(['auth', 'login'], { auth: auth })
        .then((data) => {
          this.resData = data
          this.$store.commit('addData', data.data)
          this.dialog = true
          this.loadingdiag = false
          if (this.resData.code ===200) {
            this.isLoading = false
            this.$store.commit('setAuth', true)
             this.$router.push({ path: '/'})


          }
        })
    }
  }
};
</script>
