<template>
    <v-layout>
        <v-flex>
            <v-card>
                <v-card-title primary-title> My Account </v-card-title>
                <v-card-text v-if="user===null">
                    <v-layout>
                        <v-flex class="text-center">
                            <v-icon class="mb-5" color="blue" size="200">mdi-account-circle</v-icon>
                            <blockquote class="blockquote"> &#8220;
                                <strong>Please Login to view your account.</strong>&#8221;
                                <footer>
                                    <v-btn tile outlined v-if="user===null" color="blue" @click="loginSheet = true"> Login </v-btn>
                                </footer>
                            </blockquote>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-text v-if="user!==null">
                    <v-list dense>
                        <v-list-item id="contact">
                            <v-list-item-avatar>
                                <v-icon color="blue"> mdi-account </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{fullname}}</v-list-item-title>
                                <v-list-item-subtitle>Fullname</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click.stop="fullnameSheet = true">
                                    <v-icon color="pink"> mdi-chevron-right </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="contact">
                            <v-list-item-avatar>
                                <v-icon color="red"> mdi-phone </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{number}}</v-list-item-title>
                                <v-list-item-subtitle>Contact</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click.stop="phoneAuthSheet = true">
                                    <v-icon color="pink"> mdi-chevron-right </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item id="contact">
                            <v-list-item-avatar>
                                <v-icon color="red"> mdi-motorbike </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>0 Vehicle Registered</v-list-item-title>
                                <v-list-item-subtitle>Vehicle</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click.stop="">
                                    <v-icon color="blue"> mdi-plus </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
            <v-card class="ma-2">
                <v-card-title primary-title>Please comply the following</v-card-title>
                <v-card-text>
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="red">mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Driver's License</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="red">mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>NBI Clearance</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="red">mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Tax Identification Number(TIN)</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                           <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="red">mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Atleast 1 Approved Vehicle</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-bottom-sheet v-model="loginSheet">
            <v-card tile>
                <v-card-title primary-title> Login </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <fire-ui /> </v-layout>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="fullnameSheet">
            <v-card tile>
                <v-card-title primary-title> Contact Information </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 md12>
                            <v-text-field v-model="fullname" dense label="Fullname" outlined placeholder="Fullname" /> </v-flex>
                        <!-- <v-flex xs12 md12>
              <v-text-field v-model="number" dense label="Your number" outlined placeholder="Your number" />
            </v-flex> --></v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile outlined color="red" @click="updateDisplayName()"> Apply Changes </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="phoneAuthSheet">
            <v-card tile>
                <v-card-title primary-title> Update Phone </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 md12>
                            <v-text-field v-model="number" dense label="Your number" outlined placeholder="Your number" /> </v-flex>
                        <v-flex xs12 md12>
                            <div id="recaptcha-container"></div>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile outlined color="red" @click="phoneNumberLinker()"> Apply Changes </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-layout>
</template>
<script>
import FireUi from '~/components/FireUi'
export default {
    components: {
        FireUi
    },
    computed: {
        user() {
            return this.$store.getters['auth/getUser']
        }
    },
    data() {
        return {
            loginSheet: false,
            fullnameSheet: false,
            phoneAuthSheet: false,
            fullname: '',
            number: '',
        }
    },
    watch: {
        user(val) {
            console.log(val)
            if (val !== null) {
                this.fullname = val.displayName
                this.number = val.phoneNumber
            }
        }
    },
    methods: {
        phoneNumberLinker() {
            if (this.number === null || this.number === '') {
                var provider = new this.$fireAuthObj.PhoneAuthProvider()
                var auth = this.$fireAuth.currentUser
                var appVerifier = new this.$fireAuthObj.RecaptchaVerifier('recaptcha-container', {
                    size: 'invisible'
                });
                auth.linkWithPhoneNumber(this.number, appVerifier).then(result => {
                    var code = window.prompt('Provide your SMS code');
                    // Complete sign-in.
                    self.phoneAuthSheet = false
                    return result.confirm(code);
                })
            } else {
                this.updatePhoneNumber()
            }
        },
        logOut() {
            this.$fireAuth.signOut()
        },
        updatePhoneNumber() {
            var self = this
            var applicationVerifier = new this.$fireAuthObj.RecaptchaVerifier('recaptcha-container');
            let fbo = this.$fireAuthObj.PhoneAuthProvider
            let fu = this.$fireAuth
            var provider = new this.$fireAuthObj.PhoneAuthProvider();
            provider.verifyPhoneNumber(this.number, applicationVerifier).then(function(verificationId) {
                var verificationCode = window.prompt('Please enter the verification ' + 'code that was sent to your mobile device.');
                return fbo.credential(verificationId, verificationCode);
            }).then(function(phoneCredential) {
                return fu.currentUser.updatePhoneNumber(phoneCredential).then(function() {
                    self.phoneAuthSheet = false
                    return fu.currentUser.reauthenticateWithCredential(phoneCredential)
                })
            });
        },
        showUser() {
            setTimeout(() => {
                console.log(this.$fireAuth.currentUser)
            }, 3000)
        },
        updateDisplayName() {
            this.$fireAuth.currentUser.updateProfile({
                displayName: this.fullname
            }).then(() => {
                this.fullnameSheet = false
            })
        }
    },
    mounted() {
        if (this.user != null) {
            this.fullname = this.user.displayName
            this.number = this.user.phoneNumber
        }
    }
};
</script>
