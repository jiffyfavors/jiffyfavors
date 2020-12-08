<template>
  <div id="firebaseui-auth-container" />
</template>

<script>
export default {
  mounted () {
	  if (process.browser) {
      const auth = this.$fireAuthObj()
      const firebaseui = require('firebaseui')
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
        }],
        callbacks: {
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
          signInFailure (error) {
         
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
              return Promise.resolve()
            }
            // The credential the user tried to sign in with.
            const cred = error.credential
            
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            return auth.signInWithCredential(cred)
          },

          signInSuccess (success) {
        	console.log(success)
        	return false
          }
        }

      })
    }
  }
}
</script>
<style src="../node_modules/firebaseui/dist/firebaseui.css"></style>
