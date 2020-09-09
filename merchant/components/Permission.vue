<template>
    <v-card class="mx-auto" max-width="500" v-if="isShow">
        <v-card-title>Request Permission</v-card-title>
        <v-list shaped>
            <v-list-item-group v-if="isNotifShow">
                <v-list-item dense active-class="deep-purple--text text--accent-4" @click.stop="notification = !notification">
                    <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                            <v-checkbox :input-value="active" :true-value="true" :false-value="false" color="deep-purple accent-4" @click="toggle"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Allow Notification</v-list-item-title>
                            <v-list-item-subtitle>Received Notifaction or Order Event</v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>
<script>
import {
    GeoCollectionReference
} from 'geofirestore'
export default {
    data() {
            return {
                isNotifShow: false,
                isLocShow: false,
                locations: false,
                notification: false
            }
        },
        computed: {
            getCurrentBusiness() {
                return this.$store.getters['auth/getDefaultBusiness']
            },
            lastUpdate() {
                try {
                    return this.$store.getters['auth/lastUpdate']
                } catch (e) {
                    return new Date().getTime() - 119000
                }
            },
            isShow() {
                return this.isLocShow || this.isNotifShow
            },
            fcmToken() {
                return this.$store.getters['auth/getFCMToken']
            },
            df() {
                return this.$store.getters['admin/getFare']
            },
            user() {
                return this.$store.getters['auth/getUser']
            },
        },
        watch: {
            notification() {
                if (this.notification) {
                    this.getToken('Line 78')
                }
            }
        },
        mounted() {
                let now = new Date().getTime()
              if (now - this.lastUpdate > 60 * 1000 * 30) {
                 this.checkNotification()
              }
           
        },
        methods: {
            checkNotification() {
                if (("Notification" in window)) {
                    if (Notification.permission === "granted") {
                        this.isNotifShow = false
                        this.$fireMess.onMessage((payload) => {
                            this.displayNotification(payload)
                        }, (error) => {
                            console.log('FCM Error:', error)
                        }, (completed) => {
                            console.log('FCM Sucess', completed)
                        })
                        let now = new Date().getTime()
                        if (now - this.lastUpdate > 60 * 1000 * 30 || !this.fcmToken) {
                            this.getToken('Line 163')
                            this.onTokenChange()
                        }
                    } else if (Notification.permission !== "denied") {
                        this.isNotifShow = true
                    } else {
                        this.isNotifShow = false
                    }
                } else {
                    this.isNotifShow = false
                }
            },
            displayNotification(payload) {
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
            },
            async getToken(line) {
                let permission = await Notification.requestPermission()
                if (permission === "granted") {
                    this.isNotifShow = false
                    let currentToken
                    try {
                        currentToken = await this.$fireMess.getToken()
                    } catch (e) {
                        console.log('An error occurred while retrieving token. ', e)
                    }
                    if (currentToken) {
                        this.updateToken(currentToken)
                    }
                    if (currentToken && this.fcmToken && currentToken !== this.fcmToken) {
                        this.updateToken(currentToken)
                    } else {
                        console.info('No Instance ID token available. Request permission to generate one.')
                    }
                } else {
                    this.isNotifShow = false
                }
            },
            topicSubscription(tokens, topics, fn) {
                this.$fireFunc.httpsCallable(fn)({
                    tokens: tokens,
                    topics: topics
                })
            },
            updateToken(token) {
                if (this.fcmToken != token) {
                    this.$fireStoreObj().collection('food_merchants').doc(this.getCurrentBusiness.id).update({
                        tokens: this.$fireStoreObj.FieldValue.arrayUnion(token)
                    }).then(() => {
                        if (!this.fcmToken) {
                            this.$fireStoreObj().collection('food_merchants').doc(this.getCurrentBusiness.id).update({
                                tokens: this.$fireStoreObj.FieldValue.arrayRemove(this.fcmToken)
                            })
                        }
                        this.$store.commit('auth/setFCMToken', token)
                    })
                }
            },
            onTokenChange() {
                try {
                    this.$fireMess.onTokenRefresh(async() => {
                        try {
                            const refreshedToken = await this.$fireMess.getToken()
                            this.updateToken(refreshedToken)
                        } catch (e) {
                            console.log('Unable to retrieve refreshed token ', e)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            },
        }
};
</script>
