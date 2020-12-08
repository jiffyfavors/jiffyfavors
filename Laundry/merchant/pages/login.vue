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
                        <v-container class="text-xs-center mx-auto">
                            <v-card flat max-width="100%" class="mx-auto">
                                <v-layout flat wrap justify-center align-center text-left>
                                    <v-flex xs12 md8 sm8 lg8 class="text-center">
                                        <v-avatar size="150" tile>
                                            <v-img src="/icon.png"></v-img>
                                        </v-avatar>
                                        <v-card>
                                            <v-form ref="form" v-model="valid" lazy-validation>
                                                <v-card-title class="headline green--text">Create Account</v-card-title>
                                                <v-card-text>
                                                    <v-layout wrap>
                                                        <v-flex xs12>
                                                            <v-text-field dense v-model="fullname" placeholder="Fullname" :rules="nameRules" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                            <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                            <v-text-field dense v-model="pass1" type="password" placeholder="Password" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                           <v-text-field dense v-model="pass2" type="password" placeholder="Confirm Password" :rules="[  v => !!v || 'Password is required', (pass1 === pass2) || 'Password must match' ]" outlined></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="info" block @click.stop="Register()">Register</v-btn>
                                                </v-card-actions>
                                            </v-form>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-container>
                    </v-flex>
                    <v-flex v-if="activeBtn==0" xs12 md6 sm6 lg6>
                        <v-container class="text-xs-center mx-auto">
                            <v-card flat max-width="100%" class="mx-auto">
                                <v-layout flat wrap justify-center align-center text-left>
                                    <v-flex xs12 md8 sm8 lg8 class="text-center">
                                        <v-avatar size="150" tile>
                                            <v-img src="/icon.png"></v-img>
                                        </v-avatar>
                                        <v-card>
                                            <v-card-title class="headline green--text">Login</v-card-title>
                                            <v-card-text>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                        <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
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
                        <span>Signup</span>
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
        if (store.getters['auth/isLoggedIn']) {
            return redirect('/')
        }
    },
    data() {
        return {
            valid:true,
            text: '',
            snackbar: false,
            activeBtn: 0,
            pass1: '',
            pass2: '',
            email: '',
            fullname: '',
            loading: false,
            timeout: 10000,
            color: 'blue',
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
        Register() {
            if (this.$refs.form.validate()) {
                this.loading = true
                this.$fire.auth.createUserWithEmailAndPassword(this.email, this.pass1).then((user) => {
                    console.log(user)
                    this.snackbar = true
                    this.color = "green"
                    this.text = "Signup successful!"

                    let payload = {
                            token: 0,
                            uids:[user.user.uid],
                            users: [{
                                name: this.fullname,
                                type: 'admin',
                                uid: user.user.uid,
                                access:[]
                            }]
                        }
                    this.$fire.firestore.collection('users').add(payload);
                      
                }).catch((error) => {
                    this.snackbar = true
                    this.color = 'error'
                    this.text = error.message
                });
            }
        },
        Login() {
            this.$fire.auth.signInWithEmailAndPassword(this.email, this.pass1).catch(error => {
                this.snackbar = true
                this.color = 'error'
                this.text = 'Account Not Exist'
            })
        },
    },
    mounted() {
        localStorage.removeItem('vuex')
    }
};
</script>
