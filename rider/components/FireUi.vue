<template>
    <div id="firebaseui-auth-container" /> </template>
<script>
import '../node_modules/firebaseui/dist/firebaseui.css'
import {
    GeoCollectionReference
} from 'geofirestore'
export default {
    props: {
        mode: String,
        payload: Object
    },
    methods: {
        async RegisterRider(uid) {
            let rider = new GeoCollectionReference(this.$fireStoreObj().collection('riders'))
            let profile = Object.assign({}, this.payload)
            profile.coordinates = new this.$fireStoreObj.GeoPoint(0, 0)
            profile.balance = 0
            profile.contact =  this.$fireAuth.currentUser.phoneNumber
            profile.status = {
                job: 'NA',
                profile: 'PRE-REG'
            }
            await rider.doc(uid).set(profile).then(() => {
                return this.$fireAuth.currentUser.updateProfile({
                    displayName: profile.profile.firstname + ' ' + profile.profile.lastname
                })
            })
            return false
        },
    },
    mounted() {
        if (process.browser) {
            const auth = this.$fireAuthObj()
            const firebaseui = require('firebaseui')
            var self = this
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
            ui.start('#firebaseui-auth-container', {
                autoUpgradeAnonymousUsers: true,
                signInOptions: [{
                    provider: this.$fireAuthObj.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: 'image', // 'audio'
                        size: 'invisible', // 'invisible' or 'compact'
                        badge: 'inline' // ' bottomright' or 'inline' applies to invisible.
                    },
                    defaultCountry: 'PH'
                }, {
                    provider: this.$fireAuthObj.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true
                }],
                callbacks: {
                    // signInFailure callback must be provided to handle merge conflicts which
                    // occur when an existing credential is linked to an anonymous user.
                    signInFailure(error) {
                        console.log(error)
                            // For merge conflicts, the error.code will be
                            // 'firebaseui/anonymous-upgrade-merge-conflict'.
                        if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                            return Promise.resolve()
                        }
                        // The credential the user tried to sign in with.
                        const cred = error.credential
                        return false
                            // Copy data from anonymous user to permanent user and delete anonymous
                            // user.
                            // ...
                            // Finish sign-in after data is copied.
                            // return auth.signInWithCredential(cred)
                    },
                   signInSuccessWithAuthResult(authResult, redirectUrl) {
                        return self.$fireStoreObj().collection('riders').doc(authResult.user.uid).get().then(doc => {
                            if (!doc.exists && self.mode === 'register') {
                               return self.RegisterRider(authResult.user.uid)
                             
                            } else if (doc.exists && self.mode === 'login') {
                                return false
                            } else {
                                return false
                                self.$fireAuth.signOut()
                            }
                        })
                    }
                }
            })
        }
    }
};
</script>

