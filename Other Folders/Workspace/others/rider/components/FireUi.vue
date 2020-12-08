<template>
    <div id="firebaseui-auth-container" /> </template>
<script>
export default {
    props: {
        mode: String,
        payload: Object
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
                    signInSuccess(success) {
                  
                        return self.$fireStoreObj().collection('riders').doc(success.uid).get().then(doc => {
                            if (!doc.exists && self.mode === 'register') {
                                self.$fireStoreObj().collection('riders').doc(success.uid).set(self.payload).then(() => {
                                    self.$fireAuth.currentUser.updateProfile({
                                        displayName: self.payload.firstname + ' ' + self.payload.lastname
                                    })
                                })
                                return true
                            } else if (doc.exists && self.mode === 'login') {
                                return true
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
}
</script>
<style src="../node_modules/firebaseui/dist/firebaseui.css"></style>
