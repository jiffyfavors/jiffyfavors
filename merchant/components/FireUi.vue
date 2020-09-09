<template>
    <div id="firebaseui-auth-container" /> </template>
<script>
import '../node_modules/firebaseui/dist/firebaseui.css'
import {
    GeoCollectionReference
} from 'geofirestore'
export default {

    mounted() {
        if (process.browser) {
            const auth = this.$fireAuthObj()
            const firebaseui = require('firebaseui')
            var self = this
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
            ui.start('#firebaseui-auth-container', {
                signInOptions: [{
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
                        return false
                    }
                }
            })
        }
    },
    methods:{
    }
};
</script>

