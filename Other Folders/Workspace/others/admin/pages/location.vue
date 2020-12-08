<template>
    <v-card width="100%">
        <v-card-text height="100vh">
            <v-list two-line v-for="(loc,i) in locations" :key="i">
                <v-list-item-group>
                    <div class="overline">{{loc.time}}</div>
                    <v-list-item dense>
                        <v-list-item-content>
                            <v-list-item-title>{{loc.lat}},{{loc.lng}}</v-list-item-title>
                            <v-list-item-subtitle class="red--text">{{loc.speed}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-list-item-action-text>{{loc.heading}}</v-list-item-action-text>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-btn block class="shopresponsive white--text" text @click.stop="StartTest" outlined color="red">Start Test</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    layout: 'empty',
    data() {
        return {
            ids: []
        }
    },
    computed: {
        locations() {
            return this.$store.getters['map/getTestLocation']
        }
    },
    methods: {
        formatAMPM(date) {
            let hours = date.getHours()
            let minutes = Math.ceil(date.getMinutes() / 5) * 5
            if (minutes === 60) {
                hours = hours + 1
                minutes = 0
            }
            let secs = Math.ceil(date.getMinutes() / 5) * 5
            if (secs === 60) {
                minutes = minutes + 1
                secs = 0
            }
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            hours = hours || 12 // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes
            secs = secs < 10 ? '0' + secs : secs
            const strTime = hours + ':' + minutes + ':' + secs + ' ' + ampm
            return strTime
        },
        StartTest() {
            this.$store.commit('map/clearLocation', [])
            var c = window.navigator.geolocation.watchPosition(position => {
                var coordinates = {
                    time: this.formatAMPM(new Date(position.timestamp)),
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    accuracy: position.coords.accuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed
                }
                console.log(coordinates)
                this.$store.commit('map/addNewLocation', coordinates)
                console.log('test added')
            }, error => {
                console.log(error)
            }, {
                enableHighAccuracy: true,
                timeout: Infinity
            })
            if (c > 1) {
                for (var i = 1; i < c; i++) {
                    console.log('Clearing ', i)
                    this.$clearLocationWatch(i)
                }
            }
            console.log(c)
        }
    }
};
</script>
