<template>
    <v-app id="e3">
        <nuxt /> </v-app>
</template>
<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
export default {
    mounted() {
        let GMapSettings = {
            apiKey: this.$GMaps.apiKey,
            language: this.language
        }
        GoogleMapsApiLoader(GMapSettings)
        this.$fireMess.onMessage((payload) => {
            if (Notification.permission == 'granted') {
                navigator.serviceWorker.getRegistration().then(function(reg) {
                    var options = {
                        body: payload.notification.body,
                        icon: '/icon-96px.png',
                        badge: '/badge.png',
                        vibrate: [100, 50, 100],
                        data: payload.notification.data
                    }
                    reg.showNotification(payload.notification.title, options)
                })
            }
        }, (error) => {
            console.log('FCM Error:', error)
        }, (completed) => {
            console.log('FCM Sucess', completed)
        })
    }
};
</script>
