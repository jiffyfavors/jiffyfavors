<template>
    <client-only>
        <v-bottom-sheet v-model="isShow">
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
                                    <v-list-item-subtitle>Receivelatest promos of your favorite merchant.</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item-group v-if="isLocShow">
                        <v-list-item dense active-class="deep-purple--text text--accent-4" @click.stop="locations=!locations">
                            <template v-slot:default="{ active, toggle }">
                                <v-list-item-action>
                                    <v-checkbox :input-value="active" :true-value="true" :false-value="false" color="deep-purple accent-4" @click="toggle"></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Allow Location</v-list-item-title>
                                    <v-list-item-subtitle>To show you nearby merchants, billers and stores.</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-bottom-sheet>
    </client-only>
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
            locations() {
                if (this.locations) {
                    this.getLocation()
                }
            },
            notification() {
                if (this.notification) {
                    this.getToken('Line 78')
                }
            }
        },
        mounted() {
            this.checkNotification()
            navigator.permissions.query({
                name: 'geolocation'
            }).then((result) => {
                if (result.state === 'granted') {
                    this.isLocShow = false
                    let now = new Date().getTime()
                    if (now - this.lastUpdate > 60 * 1000 * 30) {
                        this.getLocation()
                        if (Notification.permission === "granted") {
                            this.getToken('Line 93')
                        }
                    }
                } else if (result.state !== 'denied') {
                    this.isLocShow = true
                } else {
                    this.isLocShow = false
                }
            })
        },
        methods: {
            getLocation() {
                var geoOptions = {
                    maximumAge: 5 * 60 * 1000,
                    enableHighAccuracy: true
                }
                this.isLocShow = false
                navigator.geolocation.getCurrentPosition((pos) => {
                    let coord = pos.coords
                    if (this.user && this.fcmToken) {
                        const firestore = this.$fireStoreObj()
                        const user = new GeoCollectionReference(firestore.collection('users'))
                        let payload = {
                            coordinates: new this.$fireStoreObj.GeoPoint(coord.latitude, coord.longitude)
                        }
                        payload.tokens = this.$fireStoreObj.FieldValue.arrayUnion(this.fcmToken)
                        user.doc(this.user.id).update(payload)
                    }
                    if (coord.accuracy < 500) {
                        this.$store.dispatch('admin/getArea', {
                            lat: coord.latitude,
                            lng: coord.longitude
                        }).then(() => {
                            let path = this.user ? 'registered' : 'unregistered'
                            if (Notification.permission === "granted" && this.fcmToken)
                            {
                                const firestore = this.$fireStoreObj()
                                let area_name = this.df.name.replace(/ /g, '_').toLowerCase()
                                const area = new GeoCollectionReference(firestore.collection('areas').doc(this.df.id).collection('tokens'))
                                if (this.user) {
                                    area.doc('registered').update({
                                        tokens: this.$fireStoreObj.FieldValue.arrayUnion(this.fcmToken)
                                    })
                                    area.doc('unregistered').update({
                                        tokens: this.$fireStoreObj.FieldValue.arrayRemove(this.fcmToken)
                                    })
                                    this.topicSubscription([this.fcmToken], ['registered', 'registered' + '_' + area_name, 'registered' + '_' + this.df.country.code], 'subscribeToTopic')
                                    this.topicSubscription([this.fcmToken], ['unregistered', 'unregistered' + '_' + area_name, 'unregistered' + '_' + this.df.country.code], 'unsubscribeFromTopic')
                                } else {
                                    area.doc('registered').update({
                                        tokens: this.$fireStoreObj.FieldValue.arrayRemove(this.fcmToken)
                                    })
                                    area.doc('unregistered').update({
                                        tokens: this.$fireStoreObj.FieldValue.arrayUnion(this.fcmToken)
                                    })
                                    this.topicSubscription([this.fcmToken], ['registered', 'registered' + '_' + area_name, 'registered' + '_' + this.df.country.code], 'unsubscribeFromTopic')
                                    this.topicSubscription([this.fcmToken], ['unregistered', 'unregistered' + '_' + area_name, 'unregistered' + '_' + this.df.country.code], 'subscribeToTopic')
                                }
                            }
                        })
                    }
                    this.isLocShow = false
                }, (error) => {
                    console.log('error')
                    this.isLocShow = false
                }, geoOptions);
            },
            checkLocation() {
                if (navigator.geolocation) {
                    this.isLocShow = true
                } else {
                    this.isLocShow = false
                }
            },
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
                console.log('Token Called', line)
                let permission = await Notification.requestPermission()
                if (permission === "granted") {
                    this.isNotifShow = false
                    let currentToken
                    try {
                        currentToken = await this.$fireMess.getToken()
                    } catch (e) {
                        console.log('An error occurred while retrieving token. ', e)
                    }
                    if (currentToken && !this.fcmToken) {
                        this.$store.commit('auth/setFCMToken', currentToken)
                    }
                    if (currentToken && this.fcmToken && currentToken !== this.fcmToken) {
                        this.$store.commit('auth/setFCMToken', currentToken)
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
            onTokenChange() {
                try {
                    this.$fireMess.onTokenRefresh(async() => {
                        try {
                            const refreshedToken = await this.$fireMess.getToken()
                            let path = this.user ? 'registered' : 'unregistered'
                            let area_name = this.df.name.replace(/ /g, '_').toLowerCase()
                            if (this.user) {
                                const firestore = this.$fireStoreObj()
                                const user = new GeoCollectionReference(firestore.collection('users'))
                                payload.tokens = this.$fireStoreObj.FieldValue.arrayUnion(refreshedToken)
                                await user.doc(this.user.id).update(payload)
                                payload.tokens = this.$fireStoreObj.FieldValue.arrayRemove(this.fcmToken)
                                await user.doc(this.user.id).update(payload)
                            }
                            this.topicSubscription([this.fcmToken], [path, path + '_' + area_name, path + '_' + this.df.country.code], 'unsubscribeFromTopic')
                            this.topicSubscription([refreshedToken], [path, path + '_' + area_name, path + '_' + this.df.country.code], 'subscribeToTopic')
                            this.$store.commit('auth/setFCMToken', refreshedToken)
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
