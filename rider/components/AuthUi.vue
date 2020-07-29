<template>
    <v-stepper v-model="e1">
        <loading :active.sync="isLoading" loader="bars" :is-full-page="true" color="blue" />
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1" :editable="false"> Full Name </v-stepper-step>
            <v-stepper-step :complete="e1 > 2" step="2" :editable="false"> Contact Number </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
            <v-stepper-content step="1">
                <v-card class="mb-12" flat>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex xs12 md12 sm12>
                                <v-text-field v-model="fullname" right dense solo label="Fullname" outlined placeholder="Fullname" /> </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" :disabled="fullname.length < 5" @click=";(e1 = 2), loadAuth()"> Continue </v-btn>
                    </v-card-actions>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
                <div id="firebaseui-auth-container" /> </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>
<script>
import '../node_modules/firebaseui/dist/firebaseui.css'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    GeoCollectionReference
} from 'geofirestore'
export default {
    components: {
        Loading
    },
    data() {
        return {
            fullname: '',
            e1: 1,
            isLoading: false
        }
    },
    methods: {
        updateUser(authUser) {
            this.isLoading = true
            const token = this.$store.getters['auth/getFCMToken']
            const firestore = this.$fireStoreObj()
            const ref = new GeoCollectionReference(firestore.collection('users'))
            firestore.collection('users').doc(authUser.uid).get().then((d) => {
                if (!d.exists) {
                    ref.doc(authUser.uid).set({
                        coordinates: new this.$fireStoreObj.GeoPoint(0, 0),
                        tokens: this.$fireStoreObj.FieldValue.arrayUnion(token),
                        displayName: authUser.displayName,
                        phoneNumber: authUser.phoneNumber
                    }).then(() => {
                        this.$fireAuth.currentUser.updateProfile({
                            displayName: self.fullname
                        }).then(() => {
                            this.isLoading = false
                        })
                    })
                } else {
                    firestore.collection('users').doc(authUser.uid).update({
                        'd.displayName': authUser.displayName,
                        'd.phoneNumber': authUser.phoneNumber,
                        'd.tokens': this.$fireStoreObj.FieldValue.arrayUnion(token)
                    }).then(() => {
                        this.$fireAuth.currentUser.updateProfile({
                            displayName: self.fullname
                        }).then(() => {
                            this.isLoading = false
                        })
                    })
                }
            })
        },
        loadAuth() {
            if (process.browser) {
                const auth = this.$fireAuthObj()
                const self = this
                const firebaseui = require('firebaseui')
                const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
                ui.start('#firebaseui-auth-container', {
                    autoUpgradeAnonymousUsers: true,
                    signInOptions: [
                    {
                        provider: this.$fireAuthObj.PhoneAuthProvider.PROVIDER_ID,
                        defaultCountry: 'PH'
                    }],
                    callbacks: {
                        signInFailure(error) {
                            if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
                                return Promise.resolve()
                            }
                            const cred = error.credential
                            return auth.signInWithCredential(cred)
                        },
                        signInSuccessWithAuthResult(authResult, redirectUrl) {
                           self.updateUser(authResult.user)
                           return false
                        }
                    }
                })
            }
        }
    }
};
</script>
