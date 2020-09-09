<template>
    <v-layout>
        <loading :active.sync="loading" loader="bars" :is-full-page="true" color="blue" />
        <v-app-bar color="blue" class="white--text text-center" dense app fixed>
            <v-toolbar-title>Jiffy Favors Partners</v-toolbar-title>
        </v-app-bar>
        <v-content>
            <v-container>
                <v-layout wrap justify-center align-center text-left>
                    <v-flex xs12 md6 sm6 lg6 v-if="activeBtn ==1">
                        <v-card>
                            <v-card-title class="headline green--text">Food Merchant Partner Signup</v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field dense v-model="preSignUp.business_name" :rules="nameRules" required placeholder="Business Name" outlined></v-text-field>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field dense v-model="preSignUp.contact.person" :rules="nameRules" placeholder="Contact Person" outlined></v-text-field>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-select dense outlined v-model="preSignUp.contact.position" :items="['Owner','Operation\'s Manager','Marketing','Operator']" :rules="[v => !!v || 'Position is required']" placeholder="Position"></v-select>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field dense v-model="preSignUp.contact.phone" prefix="+63" :rules="phonRules" placeholder="Mobile Phone" outlined></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-select dense :items="cities" :rules="[v => !!v || 'City is required']" v-model="preSignUp.city" label="City of Operation" outlined item-text="data.name" item-value="id"></v-select>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-subheader class="subtitle-2 green--text">Create Login Account</v-subheader>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field dense v-model="preSignUp.contact.email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field dense v-model="pass1" type="password" placeholder="Password" :rules="[  v => !!v || 'Password is required', (pass1 === pass2) || 'Password must match' ]" outlined></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field dense v-model="pass2" type="password" placeholder="Confirm Password" :rules="[  v => !!v || 'Password is required', (pass1 === pass2) || 'Password must match' ]" outlined></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="info" @click.stop="preRegister()">Register</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                    <v-flex v-if="activeBtn==0" xs12 md6 sm6 lg6>
                        <v-container class="text-xs-center mx-auto">
                            <v-card flat max-width="100%" class="mx-auto">
                                <v-layout flat wrap justify-center align-center text-left>
                                    <v-flex xs12 md8 sm8 lg8 class="text-center" v-if="!isAdmin&&!isAuth">
                                        <v-avatar size="150" tile>
                                            <v-img src="/icon.png"></v-img>
                                        </v-avatar>
                                        <blockquote class="blockquote">
                                            <h4>Food Merchant System Access</h4> </blockquote>
                                        <v-card>
                                            <v-card-title class="headline green--text">Login</v-card-title>
                                            <v-card-text>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                        <v-text-field dense v-model="preSignUp.contact.email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-text-field dense v-model="pass1" type="password" placeholder="Password" outlined></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="info" block @click.stop="Login()">Login</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-container>
                    </v-flex>
                </v-layout>
                <v-bottom-navigation fixed :value="activeBtn" grow color="teal">
                    <v-btn @click.stop="activeBtn=0">
                        <span>Login</span>
                        <v-icon>mdi-login</v-icon>
                    </v-btn>
                    <v-btn @click.stop="activeBtn=1">
                        <span>Register</span>
                        <v-icon>mdi-store</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </v-container>
        </v-content>
        <v-snackbar v-model="snackbar" :color="color" :timeout="timeout"> {{text}} </v-snackbar>
    </v-layout>
</template>
<script>
import FireUi from '~/components/FireUi.vue'
export default {
    layout: 'menu',
    middleware({
        store,
        redirect
    }) {
        if (store.getters['auth/isAuth'] && store.getters['auth/getUser'].admin) {
            return redirect('/')
        }
    },
    data() {
        return {
            cities: [],
            valid: true,
            activeBtn: 0,
            loading: false,
            pass1: '',
            pass2: '',
            preSignUp: {
                business_name: '',
                contact: {
                    position: 'Owner',
                    person: '',
                    email: '',
                    phone: ''
                },
                city: 'Puerto Princesa City'
            },
            loginDialog: false,
            login: true,
            snackbar: false,
            text: '',
            color: '',
            timeout: 3500,
            nameRules: [
                v => !!v || 'This  is required'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required'
            ],
            phonRules: [
                v => !!v || 'Phone number is required',
                v => (v && v.length == 10) || 'Name must be 10 characters',
            ],
        }
    },
    components: {
        FireUi
    },
    watch: {
        isAuth() {
              if(this.isAuth)
            this.attemptLogin()
        },
        activeBtn(val) {
            if (val === 1) this.getCities()
        }
    },
    mounted() {
        this.attemptLogin()
    },
    computed: {
        isMatchPWD() {
            return (this.pass1 != this.pass2) || 'Password mismatch'
        },
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
        isAdmin() {
            return this.$store.getters['auth/isAuth']
        },
    },
    methods: {
        Login(){
               this.$fireAuth.signInWithEmailAndPassword(this.preSignUp.contact.email, this.pass1).catch(error=>{
                  this.snackbar = true
                    this.color = 'error'
                    this.text = 'Account Not Exist'
               })
        },
        attemptLogin() {
            this.$fireAuth.currentUser.getIdTokenResult().then((idTokenResult) => {
                this.$store.commit('auth/setIsMerchant', idTokenResult.claims.merchant)
                if (idTokenResult.claims.merchant) {
                    this.snackbar = true
                    this.color = 'success'
                    this.text = 'Login Successful'
                    this.$fireStoreObj().collection('food_merchants').where('users', 'array-contains', this.$fireAuth.currentUser.uid).get().then((snap) => {
                        let business = []
                        snap.docs.forEach(biz => {
                            business.push({
                                id: biz.id,
                                data: biz.data()
                            })
                        })
                        this.$store.commit('auth/setBusinesses', business)
                        this.$store.commit('auth/setDefaultBusiness', business[0])
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 1000)
                    })
                } else {
                    this.snackbar = true
                    this.color = 'error'
                    this.text = 'Unauthorized Access'
                    setTimeout(() => {
                        this.$fireAuth.signOut()
                    }, 1000)
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        getCities() {
            this.$fireStoreObj().collection('areas').get().then((snap) => {
                snap.docs.forEach(area => {
                    this.cities.push({
                        id: area.id,
                        data: area.data().d
                    })
                })
                this.cities.sort((a, b) => (a.data.name > b.data.name ? 1 : b.data.name > a.data.name ? -1 : 0))
            })
        },
        preRegister() {
            if (this.$refs.form.validate()) {
                this.loading = true
                this.preSignUp.pass1 = this.pass1
                this.$fireFunc.httpsCallable('createMerchantAccount')(this.preSignUp).then((msg) => {
                    this.loading = false
                    if (msg.data.success) {
                        this.color = 'success'
                        this.text = 'Merchant Account Registered'
                        this.$fireAuth.signInWithEmailAndPassword(this.preSignUp.contact.email, this.pass1)
                        this.$refs.form.reset()
                    } else {
                        this.text = msg.data.message.errorInfo.message
                        this.color = 'error'
                    }
                    this.snackbar = true
                }).catch((e) => {
                    console.log(e)
                })
            } else {
                alert('Invalid Form')
            }
        }
    },
    mounted() {
        localStorage.removeItem('vuex')
        this.$store.commit('auth/setLastUpdate', 0)
        this.$store.commit('auth/setIsMerchant', true)
    }
};
</script>
