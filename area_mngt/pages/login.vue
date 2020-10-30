<template>
    <v-layout>
        <loading :active.sync="loading" loader="bars" :is-full-page="true" color="blue" />
        <v-app-bar color="blue" class="white--text text-center" dense app fixed>
            <v-toolbar-title>Area Management</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click.stop="applyModal = !applyModal"> Apply Now </v-btn>
        </v-app-bar>
        <v-content>
            <v-container>
                <v-layout wrap justify-center align-center text-left>
                    <v-flex xs12 md6 sm6 lg6>
                        <v-container class="text-xs-center mx-auto">
                            <v-card flat max-width="100%" class="mx-auto">
                                <v-layout flat wrap justify-center align-center text-left>
                                    <v-flex xs12 md8 sm8 lg8 class="text-center">
                                        <v-avatar size="150" tile>
                                            <v-img src="/icon.png"></v-img>
                                        </v-avatar>
                                        <blockquote class="blockquote">
                                            <h4>Jiffy Area Manager</h4> </blockquote>
                                        <v-card>
                                            <v-card-title class="headline green--text">Login</v-card-title>
                                            <v-card-text>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                        <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-text-field dense v-model="password" type="password" placeholder="Password" outlined></v-text-field>
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
                <v-dialog width="500" v-model="applyModal">
                    <v-card>
                        <v-card-title>Area Manager Application</v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-select dense :items="cities" :rules="[v => !!v || 'City is required']" v-model="city" label="Where are you located?" item-text="data.name" item-value="id"></v-select>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="Fullname" :rules="[v => !!v || 'Fullname is required']" required name="Fullname" label="Fullname"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field dense v-model="phoneNumber" type="number" prefix="+63" placeholder="Phone Number" :rules="phonRules" ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
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
        if (store.getters['auth/isAuth'] && store.getters['auth/getUser'].areaMgr) {
            return redirect('/')
        }
    },
    data() {
        return {
            applyModal: false,
            loading: false,
            loginDialog: false,
            login: true,
            valid: true,
            email: '',
            password: '',
            email: '',
            phoneNumber: '',
            snackbar: false,
            text: '',
            cities: [],
            color: '',
            timeout: 3500,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
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
            if (this.isAuth) this.attemptLogin()
        },
        applyModal(val) {
            if (val) {
                this.getCities()
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
        isAdmin() {
            return this.$store.getters['auth/isAuth']
        },
    },
    mounted() {
        this.$store.commit('auth/setLastUpdate', 0)
        this.$store.commit('auth/setIsManager', true)
        if (this.isAuth) {
            this.attemptLogin()
        }
    },
    methods: {
        getCities() {
            this.cities = []
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
        Login() {
            this.$fireAuth.signInWithEmailAndPassword(this.email, this.password).catch(error => {
                this.snackbar = true
                this.color = 'error'
                this.text = 'Account Not Exist'
            })
        },
        getAreas() {
            this.$fireStoreObj().collection('areas').where('d.area_managers', 'array-contains', this.$fireAuth.currentUser.uid).get().then((snap) => {
                let business = []
                snap.docs.forEach(biz => {
                    business.push({
                        id: biz.id,
                        data: biz.data().d
                    })
                })
                this.$store.commit('auth/setAreas', business)
                this.$store.commit('auth/setDefaultArea', business[0])
            })
        },
        attemptLogin() {
            this.$fireAuth.currentUser.getIdTokenResult().then((idTokenResult) => {
                console.log(idTokenResult)
                this.$store.commit('auth/setIsManager', idTokenResult.claims.areaMgr)
                if (idTokenResult.claims.areaMgr) {
                    this.snackbar = true
                    this.color = 'success'
                    this.text = 'Login Successful'
                    this.getAreas()
                    setTimeout(() => {
                        this.$router.push('/')
                    }, 1000)
                } else {
                    this.snackbar = true
                    this.color = 'error'
                    this.text = 'Unauthorized Access'
                    setTimeout(() => {
                        this.$fireAuth.signOut()
                    }, 1000)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
};
</script>
