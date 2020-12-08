<template>
    <v-app id="e3">
        <nuxt />
        <v-bottom-navigation grow color="teal" app fixed v-show="$route.name!='menu-id'">
            <v-btn to="/location"> <span>Location</span>
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn to="/orders"> <span>Orders</span>
                <v-icon>mdi-food</v-icon>
            </v-btn>
            <v-btn to="/"> <span>Riders</span>
                <v-icon>mdi-motorbike</v-icon>
            </v-btn>
            <v-btn to="/merchants"> <span>Merchants</span>
                <v-icon>mdi-store</v-icon>
            </v-btn>
            <v-btn to="/billers"> <span>Billers</span>
                <v-icon>mdi-store</v-icon>
            </v-btn>

            <v-btn to="/areas"> <span>Areas</span>
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
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
    }
}
</script>
